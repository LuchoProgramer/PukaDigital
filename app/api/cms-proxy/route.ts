export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') || '10';
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');

        // Configuración usando variables de entorno - PukaPress CMS
        // Tenant ID por defecto para PukaDigital
        const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://pukapresscms.vercel.app';
        const TENANT_ID = process.env.NEXT_PUBLIC_CMS_TENANT_ID || 'pukadigital';

        // Construir URL según parámetros
        let url = `${CMS_URL}/api/blogs?tenant=${TENANT_ID}`;

        if (id) {
            url += `&id=${id}`;
        } else if (slug) {
            url += `&slug=${slug}`;
        } else {
            url += `&limit=${limit}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'PukaDigitalProxy/1.0'
            },
            next: { revalidate: 300 } // Cachear por 5 minutos
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `CMS API Error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Error connecting to CMS',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
