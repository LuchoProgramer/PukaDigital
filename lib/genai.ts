import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeneratedPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imagePrompt: string;
}

export async function generateBlogPost(topic: string): Promise<GeneratedPostData> {
  const model = "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model: model,
    contents: `Actúa como un experto redactor de contenido para PukaDigital, una agencia que busca la independencia tecnológica de las PYMES.
    
    Escribe un artículo de blog sobre: "${topic}".
    
    Reglas de Estilo:
    1. Tono: "Revolucionario Tranquilo". Profesional, directo, empático, pero firme contra los abusos de agencias tradicionales.
    2. Audiencia: Dueños de pequeños negocios frustrados con la tecnología.
    3. Formato: Markdown (usa h2, h3, bold, listas).
    4. Longitud: Aproximadamente 400-600 palabras.
    
    Devuelve un JSON estricto con la estructura solicitada. Para 'imagePrompt', crea un prompt en inglés para generar una imagen minimalista y abstracta relacionada con el tema. Para 'slug', genera un slug SEO-friendly basado en el título.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          slug: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          content: { type: Type.STRING },
          category: { type: Type.STRING },
          imagePrompt: { type: Type.STRING }
        },
        required: ["title", "slug", "excerpt", "content", "category", "imagePrompt"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No content generated");
  }

  return JSON.parse(response.text);
}