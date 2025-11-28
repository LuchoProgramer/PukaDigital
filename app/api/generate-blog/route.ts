import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/genai';

// IndexNow configuration
const INDEXNOW_KEY = "f6cfe5524c17476c948aec9f6a9700d4";
const DOMAIN = "pukadigital.com";

async function notifyIndexNow(slug: string): Promise<void> {
  try {
    // Notify all language versions of the new post
    const urls = [
      `https://${DOMAIN}/es/blog/${slug}`,
      `https://${DOMAIN}/en/blog/${slug}`,
      `https://${DOMAIN}/pt/blog/${slug}`,
    ];

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: DOMAIN,
        key: INDEXNOW_KEY,
        keyLocation: `https://${DOMAIN}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    
    console.log(`✅ IndexNow notified for: ${slug}`);
  } catch (error) {
    console.warn('⚠️ IndexNow notification failed:', error);
    // Don't throw - IndexNow failure shouldn't break blog generation
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();
    
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    const post = await generateBlogPost(topic);
    
    // Notify IndexNow about the new post (non-blocking)
    if (post.slug) {
      notifyIndexNow(post.slug).catch(() => {});
    }
    
    return NextResponse.json({
      ...post,
      indexNowNotified: true,
    });
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
