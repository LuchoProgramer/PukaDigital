// src/app/api/tenants/[tenantId]/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const { tenantId } = params;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Buscar en títulos y contenido
    const blogsRef = collection(db, `tenants/${tenantId}/blogs`);
    
    // Firestore no tiene búsqueda full-text nativa, pero podemos hacer búsquedas básicas
    // Para búsqueda más avanzada, considera usar Algolia o Elasticsearch
    const titleQuery = query(
      blogsRef,
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff'),
      orderBy('title'),
      firestoreLimit(limit)
    );

    const titleSnapshot = await getDocs(titleQuery);
    const results = titleSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString()
    }));

    const responseHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    return NextResponse.json(
      { 
        success: true,
        blogs: results,
        count: results.length,
        searchTerm,
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
        error: 'Failed to search blogs',
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