// src/app/api/tenants/[tenantId]/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBlogs } from '@/lib/firebase';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const { tenantId } = params;

    // Validar tenant
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Obtener blogs
    const blogs = await getBlogs(tenantId, limit);

    // Headers CORS para permitir acceso desde otros dominios
    const responseHeaders = {
      'Access-Control-Allow-Origin': '*', // En producción, especifica dominios específicos
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    return NextResponse.json(
      { 
        success: true,
        blogs,
        count: blogs.length,
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
        error: 'Failed to fetch blogs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Manejar preflight OPTIONS para CORS
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