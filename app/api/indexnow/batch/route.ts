// app/api/indexnow/batch/route.ts
// Batch submit all blog posts to IndexNow
import { NextResponse } from "next/server";
import { HybridCMSService } from "@/lib/cms";

const INDEXNOW_KEY = "f6cfe5524c17476c948aec9f6a9700d4";
const DOMAIN = "pukadigital.com";
const KEY_LOCATION = `https://${DOMAIN}/${INDEXNOW_KEY}.txt`;

export async function POST() {
  try {
    // Get all blog posts
    const { posts } = await HybridCMSService.getAllPosts();
    
    // Generate URLs for all posts in all languages
    const locales = ['es', 'en', 'pt'];
    const blogUrls: string[] = [];
    
    for (const post of posts) {
      for (const locale of locales) {
        blogUrls.push(`https://${DOMAIN}/${locale}/blog/${post.slug}`);
      }
    }

    // Add main pages too
    const mainPages = [
      '', '/productos', '/blog', '/demos', '/contacto', 
      '/nosotros', '/preguntas-frecuentes',
      '/chatbot-ia-whatsapp', '/desarrollo-web-pymes', '/sistema-erp-cloud'
    ];
    
    const mainUrls: string[] = [];
    for (const locale of locales) {
      for (const page of mainPages) {
        mainUrls.push(`https://${DOMAIN}/${locale}${page}`);
      }
    }

    const allUrls = [...mainUrls, ...blogUrls];

    // IndexNow has a limit of 10,000 URLs per request
    // Split into batches if needed
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < allUrls.length; i += batchSize) {
      batches.push(allUrls.slice(i, i + batchSize));
    }

    let totalSubmitted = 0;
    const results = [];

    for (const batch of batches) {
      const response = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: DOMAIN,
          key: INDEXNOW_KEY,
          keyLocation: KEY_LOCATION,
          urlList: batch,
        }),
      });

      results.push({
        status: response.status,
        count: batch.length,
      });
      
      totalSubmitted += batch.length;
    }

    return NextResponse.json({
      ok: true,
      message: "Batch IndexNow submission complete",
      totalUrls: allUrls.length,
      totalSubmitted,
      blogPosts: posts.length,
      batches: results,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Error in batch IndexNow submission", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Preview what would be submitted
  const { posts } = await HybridCMSService.getAllPosts();
  
  return NextResponse.json({
    message: "Use POST to submit all URLs to IndexNow",
    blogPostsCount: posts.length,
    estimatedUrls: posts.length * 3 + 30, // 3 locales per post + ~30 main pages
  });
}
