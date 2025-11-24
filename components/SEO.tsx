'use client';

import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, structuredData }) => {
  useEffect(() => {
    // In Next.js App Router, metadata is handled via generateMetadata or metadata export
    // This component only handles structured data injection
    if (structuredData) {
      const scriptId = 'structured-data';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      script.text = JSON.stringify(structuredData);
    }
  }, [structuredData]);

  return null;
};

export default SEO;