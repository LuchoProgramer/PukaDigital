import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/genai';

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
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
