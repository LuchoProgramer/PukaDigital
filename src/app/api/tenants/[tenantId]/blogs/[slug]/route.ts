// src/app/api/tenants/[tenantId]/blogs/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string; slug: string } }
) {
  try {
    const { tenantId, slug } = params;

    if (!tenantId || !slug) {
      return NextResponse.json(
        { error: 'Tenant ID and slug are required' },
        { status: 400 }
      );
    }

    // Buscar blog por slug
    const blogsRef = collection(db, `tenants/${tenantId}/blogs`);
    const q = query(blogsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const blogDoc = querySnapshot.docs[0];
    const blog = {
      id: blogDoc.id,
      ...blogDoc.data(),
      createdAt: blogDoc.data().createdAt?.toDate().toISOString(),
      updatedAt: blogDoc.data().updatedAt?.toDate().toISOString()
    };

    const responseHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    return NextResponse.json(
      { 
        success: true,
        blog,
        tenantId 
      },
      { 
        status: 200,
        headers: responseHeaders
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch blog',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}