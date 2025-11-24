'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

const translations = {
  es: {
    nav: {
      method: 'El Método',
      products: 'Productos',
      blog: 'Blog',
      demos: 'Demos',
      contact: 'Contacto',
      cta: 'Iniciar Independencia',
      start: 'Empieza Ahora'
    },
    home: {
      badge: 'Revolución Digital Tranquila',
      hero_title_1: 'No construimos websites.',
      hero_title_2: 'Construimos dignidad.',
      hero_desc: 'Las agencias tradicionales quieren que les pagues para siempre. Nosotros queremos enseñarte a no necesitarnos.',
      hero_formula: '3 meses de educación intensiva = Independencia tecnológica de por vida.',
      cta_primary: 'Quiero mi independencia',
      cta_secondary: 'Ver Demos',
      ads_note: 'Incluye $100/mes en saldo Google Ads',
      
      problem_title: 'La verdad sobre tu dinero digital',
      agency_title: 'Agencia Tradicional',
      agency_item_1: '$2,000+ costo inicial de "Setup"',
      agency_item_2: '$200+/mes mantenimiento (eterno)',
      agency_item_3: 'Te cobran por cada cambio pequeño',
      agency_item_4: 'Tú no eres dueño de nada',
      agency_tag: 'Esclavitud Digital',
      freelancer_title: 'Freelancer / DIY',
      freelancer_item_1: 'Barato al principio',
      freelancer_item_2: 'Sin estrategia real de negocio',
      freelancer_item_3: 'Herramientas limitadas (Wix/Canva)',
      freelancer_item_4: 'Dependes de que te contesten el teléfono',
      freelancer_tag: 'Caos e Incertidumbre',
      puka_title: 'Modelo PukaDigital',
      puka_badge: 'La Opción Digna',
      puka_item_1: '$300/mes (x3 meses)',
      puka_item_1_note: '¡Incluye $100 de saldo Google Ads!',
      puka_item_2: 'Web + Chatbot IA + ERP completo',
      puka_item_3: '3 meses de educación intensiva',
      puka_item_4: 'Cero pagos obligatorios después',
      puka_tag: 'Independencia Real',

      system_title: 'El Sistema de 3 Fases',
      system_subtitle: 'No te damos el pescado. Te enseñamos a pescar con dinamita.',
      phase_1_title: 'Construcción & Setup (Mes 1)',
      phase_1_desc: 'Implementamos tu Web, ERP, Chatbot y perfiles de Google/Bing Maps. Dejamos todo listo mientras tú observas y aprendes.',
      phase_2_title: 'Capacitación Intensiva (Mes 2)',
      phase_2_desc: 'Te enseñamos a editar tu web, leer tus métricas y gestionar tus campañas',
      phase_2_note: '(usando el saldo que ya incluimos)',
      phase_2_desc_end: '. Tomas el control.',
      phase_3_title: 'Independencia (Mes 3)',
      phase_3_desc: 'Lanzas tus propias ofertas. Gestionas tus clientes. Nosotros pasamos a ser soporte opcional, no una carga mensual.',
      
      stack_title: 'Stack Tecnológico Corporativo',
      stack_subtitle: 'Lo mismo que usan los grandes, para ti.',
      stack_web: 'Web Next.js',
      stack_web_desc: 'Ultra rápida, SEO optimizado',
      stack_bot: 'Chatbot IA',
      stack_bot_desc: 'Atención 24/7 automática',
      stack_erp: 'ERP Cloud',
      stack_erp_desc: 'Inventario y Ventas',
      stack_analytics: 'Analytics',
      stack_analytics_desc: 'Datos reales, no intuición',

      proof_title: 'No es teoría. Es realidad.',
      proof_quote: 'Antes pagaba $350 al mes a una agencia que ni me contestaba los correos. Con Puka, en 3 meses aprendí a manejar mi inventario y mi publicidad. Ahora pago $20 por el chatbot y mi tienda vende sola.',
      proof_author_role: 'Dueña, Boutique Luna (+300% crecimiento)',

      faq_title: 'Preguntas Frecuentes',
      faq_1_q: '¿De verdad solo pago $900 y ya?',
      faq_1_a: 'Sí. Son 3 pagos de $300.',
      faq_1_highlight: 'Y lo más importante:',
      faq_1_end: 'dentro de esos $300 mensuales, incluimos $100 de saldo para TU publicidad en Google Ads. Nosotros no nos quedamos con ese dinero, lo invertimos en traerte clientes mientras aprendes.',
      faq_2_q: '¿Necesito saber de tecnología?',
      faq_2_a: 'No. Esa es nuestra misión. "Democratizar" significa hacerlo accesible para ti. Si sabes usar WhatsApp, puedes aprender a manejar tu negocio digital con nuestro método.',
      faq_3_q: '¿Qué pasa si no me funciona?',
      faq_3_a: 'Garantía de dignidad: Si en el primer mes no ves un progreso real y no estás satisfecho con la educación, te devolvemos tu dinero. Sin letras chiquitas.',

      cta_final_title: '¿Vas a seguir rentando tu éxito?',
      cta_final_subtitle: 'El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es hoy.',
      cta_point_1: 'Inversión Recuperable',
      cta_point_1_desc: '$300 invertidos en tus Google Ads durante el programa.',
      cta_point_2: 'Garantía Total',
      cta_point_2_desc: 'Si no aprendes en 30 días, te devolvemos todo.',
    },
    roi: {
      title: 'Calculadora de Dignidad',
      subtitle: 'Mira cuánto dinero estás perdiendo realmente con el modelo tradicional.',
      label_agency_monthly: '¿Cuánto te cobra tu agencia al mes?',
      hint_agency_monthly: 'Promedio mercado: $150 - $300',
      label_agency_setup: 'Costos de Setup / Cambios Extra',
      hint_agency_setup: 'Diseño inicial o rediseños anuales',
      savings_label: 'Ahorro proyectado (2 años)',
      savings_desc: 'Dinero que podrías invertir en tu negocio en lugar de rentar tu web.',
      chart_agency: 'Agencia Tradicional (Gasto)',
      chart_puka: 'Modelo Puka (Inversión)',
      note_title: 'Nota el "Efecto Tijera"',
      note_desc: 'La brecha entre líneas es tu capital de trabajo fugándose mes a mes.'
    },
    products: {
      title: "Herramientas de Libertad",
      subtitle: "Después de tus 3 meses de educación, eres libre. Puedes gestionar todo tú mismo, o usar nuestra infraestructura por un precio justo.",
      web_title: "Módulo 1: CMS, Mapas & SEO",
      web_desc: "Mantén tu web ultra rápida. Incluye optimización completa de Google Business Profile y Bing Places para que aparezcas en los mapas.",
      web_feat_1: "Hosting Next.js + Google Maps Setup",
      web_feat_2: "Editor de Blog Otimizado (SEO)",
      web_feat_3: "Rich Snippets Automáticos",
      erp_title: "Módulo 2: ERP Cloud",
      erp_desc: "El cerebro de tu negocio. Si quieres mantener tus datos seguros en la nube y acceder desde cualquier lugar sin instalaciones.",
      erp_feat_1: "Base de Datos Cloud Segura",
      erp_feat_2: "Gestión de Inventario Multi-local",
      erp_feat_3: "Reportes Financieros Automáticos",
      menu_title: "Menú \"A la Carta\" (Post-Graduación)",
      plan_1_title: "CMS & Hosting",
      plan_1_feat_1: "Blogs SEO-Ready",
      plan_1_feat_2: "Hosting Alta Velocidad",
      plan_1_feat_3: "SSL Certificates",
      plan_1_feat_4: "Soporte Técnico",
      plan_1_cta: "Lo Quiero ($20/mes)",
      plan_2_title: "Chatbot IA (PYME)",
      plan_2_feat_1: "500 Conversaciones",
      plan_2_feat_2: "Ventas Automáticas",
      plan_2_feat_3: "Agenda de Citas",
      plan_2_feat_4: "Soporte WhatsApp",
      plan_2_cta: "Lo Quiero ($20/mes)",
      plan_2_badge: "Esencial",
      plan_3_title: "ERP Gestión",
      plan_3_feat_1: "Control de Stock",
      plan_3_feat_2: "CRM de Clientes",
      plan_3_feat_3: "Facturación",
      plan_3_feat_4: "Backups Diarios",
      plan_3_cta: "Lo Quiero ($20/mes)",
      chatbot_section_title: "Escalabilidad del Chatbot IA",
      chatbot_section_desc: "La IA tiene costos reales (procesamiento y API de WhatsApp). Nuestro precio es transparente: solo sube si tu volumen de ventas sube.",
      chatbot_tier_1: "Nivel PYME",
      chatbot_tier_1_desc: "Ideal para empezar. Cubre la mayoría de negocios locales.",
      chatbot_tier_2: "Nivel Crecimiento",
      chatbot_tier_2_desc: "Para negocios con alto tráfico o campañas activas.",
      chatbot_tier_3: "Corporativo",
      chatbot_tier_3_desc: "Integraciones a medida y volumen masivo.",
      chatbot_metrics: "Ver métricas en vivo en la sección de Demos",
      chatbot_cta: "Ir a Demos",
      ia_badge: "IA Escalable"
    },
    demos: {
      badge: "Pruébalo Tú Mismo",
      title: "La Tecnología no muerde",
      desc: "Hemos diseñado nuestras herramientas para que sean familiares. Si sabes usar WhatsApp, sabes usar nuestro sistema.",
      chat_header_business: "Tu Negocio (Bot)",
      chat_header_acct: "Cuenta de empresa",
      chat_encryption: "🔒 Los mensajes están cifrados de extremo a extremo. Nadie fuera de este chat, ni siquiera WhatsApp, puede leerlos.",
      chat_welcome: "👋 ¡Hola! Bienvenido a PukaDigital. ¿Te gustaría saber el precio de nuestro programa o ver una demo?",
      chat_auto_reply: "¡Entendido! 🤖 Esta respuesta es automática. En la vida real, tu chatbot estará conectado a tu inventario para decir 'Sí, nos quedan 3 en talla M' o agendar citas en tu calendario.",
      chat_placeholder: "Escribe un mensaje",
      chart_title: "Ventas en Tiempo Real",
      chart_subtitle: "Resumen de Mayo",
      stat_sales: "Total Ventas",
      stat_leads: "Leads (Chatbot)",
      stat_conv: "Conversión",
      cta_card_title: "¿Te gusta lo que ves?",
      cta_card_desc: "Estos serán tus números en 3 meses.",
      cta_btn: "Lo quiero"
    },
    blog: {
      badge: "Academia Puka",
      title: "Recursos para tu Libertad",
      status_online: "ONLINE",
      status_fallback: "FALLBACK LOCAL",
      status_source: "Fuente",
      search_placeholder: "Buscar por título, tema o categoría...",
      create_ai: "Crear con IA",
      ai_panel_title: "Redactor IA PukaDigital",
      ai_panel_desc: "Dime un tema y escribiré un artículo educativo completo con el tono de nuestra marca.",
      ai_input: "Ej: Cómo usar WhatsApp para vender más...",
      ai_generating: "Escribiendo...",
      ai_btn: "Generar",
      no_results: "No encontramos resultados",
      no_results_desc: "Intenta con otras palabras clave o...",
      read_article: "Leer Artículo",
      back: "Volver a la Academia",
      read_time: "min de lectura",
      by: "Por",
      share_title: "¿Te sientes identificado?",
      share_desc: "No dejes que tu negocio siga dependiendo de terceros. Toma el control hoy.",
      share_cta: "Independízate Ahora"
    },
    contact: {
      badge: "Hablemos Claro",
      title: "Tu independencia comienza aquí",
      desc: "Sin vendedores agresivos. Sin letras chicas. Solo una conversación honesta sobre si nuestro modelo educativo de 3 meses",
      desc_highlight: "(que incluye tu presupuesto de Ads)",
      desc_end: "es lo que tu negocio necesita.",
      whatsapp_title: "WhatsApp Directo",
      whatsapp_desc: "La forma más rápida de responder tus dudas.",
      whatsapp_link: "Iniciar Chat",
      email_title: "Correo Electrónico",
      privacy: "Al enviar este formulario, aceptas nuestra política de privacidad. Odiamos el spam tanto como tú."
    },
    form: {
      title: 'Aplica al Programa de Independencia',
      scarcity: 'Aceptamos máximo 5 negocios nuevos este mes para garantizar la calidad de la educación personalizada.',
      business_name: 'Nombre de tu Negocio',
      business_placeholder: 'Ej. Restaurante El Sol',
      your_name: 'Tu Nombre',
      name_placeholder: 'Nombre',
      whatsapp: 'WhatsApp',
      whatsapp_placeholder: '+51...',
      challenge: '¿Qué te impide crecer hoy?',
      challenge_opt_1: 'Siento que tiro dinero en publicidad',
      challenge_opt_2: 'Las agencias son muy caras',
      challenge_opt_3: 'No tengo tiempo para gestionar todo',
      challenge_opt_4: 'Tengo web pero no vende nada',
      challenge_opt_5: 'Quiero empezar desde cero bien',
      submit: 'Solicitar Entrevista Gratis',
      no_commitment: 'Sin compromiso',
      secure_data: 'Datos 100% Seguros'
    },
    footer: {
      desc: 'La anti-agencia. No queremos cobrarte mensualmente para siempre. Queremos enseñarte a ser libre.',
      quote: 'No construimos websites. Construimos dignidad.',
      nav_title: 'Navegación',
      legal_title: 'Legal',
      rights: 'Todos los derechos reservados.',
      made_in: 'Hecho con dignidad en Ecuador 🇪🇨'
    }
  },
  en: {
    nav: {
      method: 'The Method',
      products: 'Products',
      blog: 'Blog',
      demos: 'Demos',
      contact: 'Contact',
      cta: 'Start Independence',
      start: 'Start Now'
    },
    home: {
      badge: 'Quiet Digital Revolution',
      hero_title_1: "We don't build websites.",
      hero_title_2: 'We build dignity.',
      hero_desc: 'Traditional agencies want you to pay them forever. We want to teach you not to need us.',
      hero_formula: '3 months of intensive education = Lifelong tech independence.',
      cta_primary: 'I want my independence',
      cta_secondary: 'See Demos',
      ads_note: 'Includes $100/mo in Google Ads credit',

      problem_title: 'The truth about your digital money',
      agency_title: 'Traditional Agency',
      agency_item_1: '$2,000+ initial "Setup" cost',
      agency_item_2: '$200+/mo maintenance (forever)',
      agency_item_3: 'They charge you for every small change',
      agency_item_4: 'You own nothing',
      agency_tag: 'Digital Slavery',
      freelancer_title: 'Freelancer / DIY',
      freelancer_item_1: 'Cheap at first',
      freelancer_item_2: 'No real business strategy',
      freelancer_item_3: 'Limited tools (Wix/Canva)',
      freelancer_item_4: 'You depend on them picking up the phone',
      freelancer_tag: 'Chaos and Uncertainty',
      puka_title: 'PukaDigital Model',
      puka_badge: 'The Dignified Option',
      puka_item_1: '$300/mo (x3 months)',
      puka_item_1_note: 'Includes $100 Google Ads credit!',
      puka_item_2: 'Web + AI Chatbot + Full ERP',
      puka_item_3: '3 months of intensive training',
      puka_item_4: 'Zero mandatory payments afterwards',
      puka_tag: 'Real Independence',

      system_title: 'The 3-Phase System',
      system_subtitle: "We don't give you the fish. We teach you to fish with dynamite.",
      phase_1_title: 'Construction & Setup (Month 1)',
      phase_1_desc: 'We implement your Web, ERP, Chatbot and Google/Bing Maps profiles. We set everything up while you watch and learn.',
      phase_2_title: 'Intensive Training (Month 2)',
      phase_2_desc: 'We teach you to edit your site, read metrics, and manage campaigns',
      phase_2_note: '(using the credit we included)',
      phase_2_desc_end: '. You take control.',
      phase_3_title: 'Independence (Month 3)',
      phase_3_desc: 'You launch your offers. You manage your clients. We become optional support, not a monthly burden.',
      
      stack_title: 'Corporate Tech Stack',
      stack_subtitle: 'The same tech big guys use, for you.',
      stack_web: 'Next.js Web',
      stack_web_desc: 'Ultra fast, SEO optimized',
      stack_bot: 'AI Chatbot',
      stack_bot_desc: '24/7 automatic support',
      stack_erp: 'Cloud ERP',
      stack_erp_desc: 'Inventory and Sales',
      stack_analytics: 'Analytics',
      stack_analytics_desc: 'Real data, not intuition',

      proof_title: "It's not theory. It's reality.",
      proof_quote: 'Before I paid $350/mo to an agency that never replied. With Puka, in 3 months I learned to manage inventory and ads. Now I pay $20 for the chatbot and my store sells itself.',
      proof_author_role: 'Owner, Boutique Luna (+300% growth)',

      faq_title: 'Frequently Asked Questions',
      faq_1_q: 'Do I really only pay $900 total?',
      faq_1_a: 'Yes. It is 3 payments of $300.',
      faq_1_highlight: 'And most importantly:',
      faq_1_end: 'within those $300 monthly, we include $100 credit for YOUR Google Ads. We do not keep that money; we invest it in getting you clients while you learn.',
      faq_2_q: 'Do I need tech skills?',
      faq_2_a: 'No. That is our mission. "Democratizing" means making it accessible. If you can use WhatsApp, you can learn to manage your digital business with our method.',
      faq_3_q: 'What if it doesn\'t work for me?',
      faq_3_a: 'Dignity Guarantee: If in the first month you don\'t see real progress and aren\'t satisfied with the education, we refund your money. No small print.',

      cta_final_title: 'Will you keep renting your success?',
      cta_final_subtitle: 'The best time to plant a tree was 20 years ago. The second best time is today.',
      cta_point_1: 'Recoverable Investment',
      cta_point_1_desc: '$300 invested in your Google Ads during the program.',
      cta_point_2: 'Total Guarantee',
      cta_point_2_desc: 'If you don\'t learn in 30 days, we refund everything.',
    },
    roi: {
      title: 'Dignity Calculator',
      subtitle: 'See how much money you are really losing with the traditional model.',
      label_agency_monthly: 'How much does your agency charge/mo?',
      hint_agency_monthly: 'Market average: $150 - $300',
      label_agency_setup: 'Setup Costs / Extra Changes',
      hint_agency_setup: 'Initial design or yearly redesigns',
      savings_label: 'Projected Savings (2 years)',
      savings_desc: 'Money you could invest in your business instead of renting your web.',
      chart_agency: 'Traditional Agency (Expense)',
      chart_puka: 'Puka Model (Investment)',
      note_title: 'Notice the "Scissor Effect"',
      note_desc: 'The gap between lines is your working capital leaking every month.'
    },
    products: {
      title: "Freedom Tools",
      subtitle: "After your 3 months of education, you are free. You can manage everything yourself, or use our infrastructure for a fair price.",
      web_title: "Module 1: CMS, Maps & SEO",
      web_desc: "Keep your site ultra-fast. Includes full Google Business Profile and Bing Places optimization so you show up on the maps.",
      web_feat_1: "Hosting + Google Maps Setup",
      web_feat_2: "Optimized Blog Editor (SEO)",
      web_feat_3: "Automatic Rich Snippets",
      erp_title: "Module 2: Cloud ERP",
      erp_desc: "The brain of your business. Keep your data secure in the cloud and access from anywhere without installations.",
      erp_feat_1: "Secure Cloud Database",
      erp_feat_2: "Multi-location Inventory Management",
      erp_feat_3: "Automatic Financial Reports",
      menu_title: "\"A la Carte\" Menu (Post-Graduation)",
      plan_1_title: "CMS & Hosting",
      plan_1_feat_1: "SEO-Ready Blogs",
      plan_1_feat_2: "High-speed Hosting",
      plan_1_feat_3: "SSL Certificates",
      plan_1_feat_4: "Tech Support",
      plan_1_cta: "I Want It ($20/mo)",
      plan_2_title: "AI Chatbot (SME)",
      plan_2_feat_1: "500 Conversations",
      plan_2_feat_2: "Automated Sales",
      plan_2_feat_3: "Appointment Scheduling",
      plan_2_feat_4: "WhatsApp Support",
      plan_2_cta: "I Want It ($20/mo)",
      plan_2_badge: "Essential",
      plan_3_title: "ERP Management",
      plan_3_feat_1: "Stock Control",
      plan_3_feat_2: "Client CRM",
      plan_3_feat_3: "Invoicing",
      plan_3_feat_4: "Daily Backups",
      plan_3_cta: "I Want It ($20/mo)",
      chatbot_section_title: "AI Chatbot Scalability",
      chatbot_section_desc: "AI has real costs (processing and WhatsApp API). Our pricing is transparent: it only goes up if your sales volume goes up.",
      chatbot_tier_1: "SME Level",
      chatbot_tier_1_desc: "Ideal for starting out. Covers most local businesses.",
      chatbot_tier_2: "Growth Level",
      chatbot_tier_2_desc: "For businesses with high traffic or active campaigns.",
      chatbot_tier_3: "Corporate",
      chatbot_tier_3_desc: "Custom integrations and massive volume.",
      chatbot_metrics: "See live metrics in Demos section",
      chatbot_cta: "Go to Demos",
      ia_badge: "Scalable AI"
    },
    demos: {
      badge: "Try It Yourself",
      title: "Technology Doesn't Bite",
      desc: "We designed our tools to be familiar. If you know how to use WhatsApp, you know how to use our system.",
      chat_header_business: "Your Business (Bot)",
      chat_header_acct: "Business Account",
      chat_encryption: "🔒 Messages are end-to-end encrypted. No one outside this chat, not even WhatsApp, can read them.",
      chat_welcome: "👋 Hello! Welcome to PukaDigital. Would you like to know our program pricing or see a demo?",
      chat_auto_reply: "Got it! 🤖 This is an automated reply. In real life, your chatbot will connect to your inventory to say 'Yes, we have 3 in size M' or book appointments.",
      chat_placeholder: "Type a message",
      chart_title: "Real-time Sales",
      chart_subtitle: "May Summary",
      stat_sales: "Total Sales",
      stat_leads: "Leads (Chatbot)",
      stat_conv: "Conversion",
      cta_card_title: "Like what you see?",
      cta_card_desc: "These will be your numbers in 3 months.",
      cta_btn: "I want it"
    },
    blog: {
      badge: "Puka Academy",
      title: "Resources for your Freedom",
      status_online: "ONLINE",
      status_fallback: "LOCAL FALLBACK",
      status_source: "Source",
      search_placeholder: "Search by title, topic or category...",
      create_ai: "Create with AI",
      ai_panel_title: "PukaDigital AI Writer",
      ai_panel_desc: "Tell me a topic and I'll write a full educational article with our brand tone.",
      ai_input: "Ex: How to use WhatsApp to sell more...",
      ai_generating: "Writing...",
      ai_btn: "Generate",
      no_results: "No results found",
      no_results_desc: "Try other keywords or...",
      read_article: "Read Article",
      back: "Back to Academy",
      read_time: "min read",
      by: "By",
      share_title: "Feel identified?",
      share_desc: "Don't let your business depend on third parties. Take control today.",
      share_cta: "Become Independent Now"
    },
    contact: {
      badge: "Let's Speak Clearly",
      title: "Your Independence Starts Here",
      desc: "No aggressive salespeople. No small print. Just an honest conversation about whether our 3-month educational model",
      desc_highlight: "(which includes your Ads budget)",
      desc_end: "is what your business needs.",
      whatsapp_title: "Direct WhatsApp",
      whatsapp_desc: "The fastest way to answer your questions.",
      whatsapp_link: "Start Chat",
      email_title: "Email",
      privacy: "By sending this form, you accept our privacy policy. We hate spam as much as you do."
    },
    form: {
      title: 'Apply to the Independence Program',
      scarcity: 'We accept max 5 new businesses this month to guarantee personalized education quality.',
      business_name: 'Business Name',
      business_placeholder: 'Ex. Sun Restaurant',
      your_name: 'Your Name',
      name_placeholder: 'Name',
      whatsapp: 'WhatsApp',
      whatsapp_placeholder: '+51...',
      challenge: 'What is stopping your growth today?',
      challenge_opt_1: 'I feel like I waste money on ads',
      challenge_opt_2: 'Agencies are too expensive',
      challenge_opt_3: 'I don\'t have time to manage everything',
      challenge_opt_4: 'I have a web but it sells nothing',
      challenge_opt_5: 'I want to start fresh correctly',
      submit: 'Request Free Interview',
      no_commitment: 'No commitment',
      secure_data: '100% Secure Data'
    },
    footer: {
      desc: "The anti-agency. We don't want to charge you monthly forever. We want to teach you to be free.",
      quote: "We don't build websites. We build dignity.",
      nav_title: 'Navigation',
      legal_title: 'Legal',
      rights: 'All rights reserved.',
      made_in: 'Made with dignity in Ecuador 🇪🇨'
    }
  },
  pt: {
    nav: {
      method: 'O Método',
      products: 'Produtos',
      blog: 'Blog',
      demos: 'Demos',
      contact: 'Contato',
      cta: 'Iniciar Independência',
      start: 'Começar Agora'
    },
    home: {
      badge: 'Revolução Digital Tranquila',
      hero_title_1: 'Não construímos sites.',
      hero_title_2: 'Construímos dignidade.',
      hero_desc: 'Agências tradicionais querem que você pague para sempre. Nós queremos te ensinar a não precisar de nós.',
      hero_formula: '3 meses de educação intensiva = Independência tecnológica vitalícia.',
      cta_primary: 'Quero minha independência',
      cta_secondary: 'Ver Demos',
      ads_note: 'Inclui $100/mês em saldo Google Ads',

      problem_title: 'A verdade sobre seu dinheiro digital',
      agency_title: 'Agência Tradicional',
      agency_item_1: '$2,000+ custo inicial de "Setup"',
      agency_item_2: '$200+/mês manutenção (eterna)',
      agency_item_3: 'Cobram por cada pequena alteração',
      agency_item_4: 'Você não é dono de nada',
      agency_tag: 'Escravidão Digital',
      freelancer_title: 'Freelancer / DIY',
      freelancer_item_1: 'Barato no início',
      freelancer_item_2: 'Sem estratégia real de negócios',
      freelancer_item_3: 'Ferramentas limitadas (Wix/Canva)',
      freelancer_item_4: 'Você depende deles atenderem o telefone',
      freelancer_tag: 'Caos e Incerteza',
      puka_title: 'Modelo PukaDigital',
      puka_badge: 'A Opção Digna',
      puka_item_1: '$300/mês (x3 meses)',
      puka_item_1_note: 'Inclui $100 de saldo Google Ads!',
      puka_item_2: 'Web + Chatbot IA + ERP completo',
      puka_item_3: '3 meses de treinamento intensivo',
      puka_item_4: 'Zero pagamentos obrigatórios depois',
      puka_tag: 'Independência Real',

      system_title: 'O Sistema de 3 Fases',
      system_subtitle: 'Não te damos o peixe. Ensinamos a pescar com dinamite.',
      phase_1_title: 'Construção & Setup (Mês 1)',
      phase_1_desc: 'Implementamos seu Site, ERP, Chatbot e perfis de Google/Bing Maps. Deixamos tudo pronto enquanto você observa e aprende.',
      phase_2_title: 'Capacitación Intensiva (Mês 2)',
      phase_2_desc: 'Ensinamos a editar seu site, ler métricas e gerenciar campanhas',
      phase_2_note: '(usando o saldo que já incluímos)',
      phase_2_desc_end: '. Você assume o controle.',
      phase_3_title: 'Independência (Mês 3)',
      phase_3_desc: 'Você lança suas ofertas. Gerencia seus clientes. Nós viramos suporte opcional, não um fardo mensal.',
      
      stack_title: 'Stack Tecnológico Corporativo',
      stack_subtitle: 'O mesmo que os grandes usam, para você.',
      stack_web: 'Web Next.js',
      stack_web_desc: 'Ultra rápida, SEO otimizado',
      stack_bot: 'Chatbot IA',
      stack_bot_desc: 'Atendimento 24/7 automático',
      stack_erp: 'ERP Cloud',
      stack_erp_desc: 'Estoque e Vendas',
      stack_analytics: 'Analytics',
      stack_analytics_desc: 'Dados reais, não intuição',

      proof_title: 'Não é teoria. É realidade.',
      proof_quote: 'Antes eu pagava $350/mês para uma agência que nem respondia e-mails. Com a Puka, em 3 meses aprendi a gerenciar estoque e anúncios. Agora pago $20 pelo chatbot e minha loja vende sozinha.',
      proof_author_role: 'Dona, Boutique Luna (+300% crescimento)',

      faq_title: 'Perguntas Frequentes',
      faq_1_q: 'É verdade que só pago $900 no total?',
      faq_1_a: 'Sim. São 3 pagamentos de $300.',
      faq_1_highlight: 'E o mais importante:',
      faq_1_end: 'dentro desses $300 mensais, incluímos $100 de saldo para SEUS anúncios no Google. Não ficamos com esse dinheiro, investimos em trazer clientes enquanto você aprende.',
      faq_2_q: 'Preciso saber de tecnologia?',
      faq_2_a: 'Não. Essa é nossa missão. "Democratizar" significa tornar acessível. Se você sabe usar WhatsApp, pode aprender a gerenciar seu negócio digital com nosso método.',
      faq_3_q: 'E se não funcionar para mim?',
      faq_3_a: 'Garantia de Dignidade: Se no primeiro mês você não vir progresso real e não estiver satisfeito com a educação, devolvemos seu dinheiro. Sem letras miúdas.',

      cta_final_title: 'Vai continuar alugando seu sucesso?',
      cta_final_subtitle: 'O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor momento é hoje.',
      cta_point_1: 'Investimento Recuperável',
      cta_point_1_desc: '$300 investidos em seus Google Ads durante o programa.',
      cta_point_2: 'Garantia Total',
      cta_point_2_desc: 'Se você não aprender em 30 dias, devolvemos tudo.',
    },
    roi: {
      title: 'Calculadora de Dignidade',
      subtitle: 'Veja quanto dinheiro você está perdendo realmente com o modelo tradicional.',
      label_agency_monthly: 'Quanto sua agência cobra/mês?',
      hint_agency_monthly: 'Média de mercado: $150 - $300',
      label_agency_setup: 'Custos de Setup / Mudanças Extras',
      hint_agency_setup: 'Design inicial ou redesenhos anuais',
      savings_label: 'Economia projetada (2 anos)',
      savings_desc: 'Dinheiro que você poderia investir no seu negócio em vez de alugar seu site.',
      chart_agency: 'Agência Tradicional (Despesa)',
      chart_puka: 'Modelo Puka (Investimento)',
      note_title: 'Note o "Efeito Tesoura"',
      note_desc: 'A lacuna entre as linhas é seu capital de giro fugindo mês a mês.'
    },
    products: {
      title: "Ferramentas de Liberdade",
      subtitle: "Após seus 3 meses de treinamento, você é livre. Você pode gerenciar tudo sozinho ou usar nossa infraestrutura por um preço justo.",
      web_title: "Módulo 1: CMS, Mapas & SEO",
      web_desc: "Mantenha seu site ultrarrápido. Inclui otimização completa do Google Business Profile e Bing Places para você aparecer nos mapas.",
      web_feat_1: "Hospedagem + Setup Google Maps",
      web_feat_2: "Editor de Blog Otimizado (SEO)",
      web_feat_3: "Rich Snippets Automáticos",
      erp_title: "Módulo 2: ERP Cloud",
      erp_desc: "O cérebro do seu negócio. Mantenha seus dados seguros na nuvem e acesse de qualquer lugar sem instalações.",
      erp_feat_1: "Banco de Dados Cloud Seguro",
      erp_feat_2: "Gestão de Estoque Multi-local",
      erp_feat_3: "Relatórios Financeiros Automáticos",
      menu_title: "Menu \"À La Carte\" (Pós-Graduação)",
      plan_1_title: "CMS & Hospedagem",
      plan_1_feat_1: "Blogs Prontos para SEO",
      plan_1_feat_2: "Hospedagem Alta Velocidade",
      plan_1_feat_3: "Certificados SSL",
      plan_1_feat_4: "Suporte Técnico",
      plan_1_cta: "Eu Quero ($20/mês)",
      plan_2_title: "Chatbot IA (PME)",
      plan_2_feat_1: "500 Conversas",
      plan_2_feat_2: "Vendas Automáticas",
      plan_2_feat_3: "Agendamento de Consultas",
      plan_2_feat_4: "Suporte WhatsApp",
      plan_2_cta: "Eu Quero ($20/mês)",
      plan_2_badge: "Essencial",
      plan_3_title: "Gestão ERP",
      plan_3_feat_1: "Controle de Estoque",
      plan_3_feat_2: "CRM de Clientes",
      plan_3_feat_3: "Faturamento",
      plan_3_feat_4: "Backups Diários",
      plan_3_cta: "Eu Quero ($20/mês)",
      chatbot_section_title: "Escalabilidade do Chatbot IA",
      chatbot_section_desc: "A IA tem custos reais (processamento e API do WhatsApp). Nosso preço é transparente: só sobe se o volume de vendas subir.",
      chatbot_tier_1: "Nível PME",
      chatbot_tier_1_desc: "Ideal para começar. Cobre a maioria das empresas locais.",
      chatbot_tier_2: "Nível Crescimento",
      chatbot_tier_2_desc: "Para empresas com alto tráfego ou campanhas ativas.",
      chatbot_tier_3: "Corporativo",
      chatbot_tier_3_desc: "Integrações personalizadas e volume massivo.",
      chatbot_metrics: "Ver métricas ao vivo na seção Demos",
      chatbot_cta: "Ir para Demos",
      ia_badge: "IA Escalável"
    },
    demos: {
      badge: "Teste Você Mesmo",
      title: "A Tecnologia Não Morde",
      desc: "Projetamos nossas ferramentas para serem familiares. Se você sabe usar o WhatsApp, sabe usar nosso sistema.",
      chat_header_business: "Seu Negocio (Bot)",
      chat_header_acct: "Conta Comercial",
      chat_encryption: "🔒 As mensagens são criptografadas de ponta a ponta. Ninguém fora deste chat, ni sequer o WhatsApp, pode lê-las.",
      chat_welcome: "👋 Olá! Bem-vindo à PukaDigital. Gostaria de saber o preço do nosso programa ou ver uma demonstração?",
      chat_auto_reply: "Entendido! 🤖 Esta resposta é automática. Na vida real, seu chatbot se conectará ao seu estoque para dizer 'Sim, temos 3 no tamanho M'.",
      chat_placeholder: "Digite uma mensagem",
      chart_title: "Vendas em Tempo Real",
      chart_subtitle: "Resumo de Maio",
      stat_sales: "Vendas Totais",
      stat_leads: "Leads (Chatbot)",
      stat_conv: "Conversão",
      cta_card_title: "Gostou do que viu?",
      cta_card_desc: "Estes serão seus números em 3 meses.",
      cta_btn: "Eu quero"
    },
    blog: {
      badge: "Academia Puka",
      title: "Recursos para sua Liberdade",
      status_online: "ONLINE",
      status_fallback: "FALLBACK LOCAL",
      status_source: "Fonte",
      search_placeholder: "Buscar por título, tema o categoria...",
      create_ai: "Criar com IA",
      ai_panel_title: "Redactor IA PukaDigital",
      ai_panel_desc: "Diga um tópico e escreverei um artigo educativo completo com o tom da nossa marca.",
      ai_input: "Ex: Como usar WhatsApp para vender mais...",
      ai_generating: "Escrevendo...",
      ai_btn: "Gerar",
      no_results: "Nenhum resultado encontrado",
      no_results_desc: "Tente outras palavras-chave ou...",
      read_article: "Ler Artigo",
      back: "Voltar para Academia",
      read_time: "min de leitura",
      by: "Por",
      share_title: "Se sente identificado?",
      share_desc: "Não deixe seu negócio depender de terceiros. Assuma o controle hoje.",
      share_cta: "Independência Agora"
    },
    contact: {
      badge: "Vamos Falar Claro",
      title: "Sua Independência Começa Aqui",
      desc: "Sem vendedores agressivos. Sem letras miúdas. Apenas uma conversa honesta sobre se nosso modelo educativo de 3 meses",
      desc_highlight: "(que inclui seu orçamento de Ads)",
      desc_end: "é o que seu negócio precisa.",
      whatsapp_title: "WhatsApp Direto",
      whatsapp_desc: "A maneira mais rápida de tirar suas dúvidas.",
      whatsapp_link: "Iniciar Chat",
      email_title: "E-mail",
      privacy: "Ao enviar este formulário, você aceita nossa política de privacidade. Odiamos spam tanto quanto você."
    },
    form: {
      title: 'Aplique para o Programa de Independência',
      scarcity: 'Aceitamos no máximo 5 novos negócios este mês para garantir a qualidade da educação personalizada.',
      business_name: 'Nome do Negócio',
      business_placeholder: 'Ex. Restaurante O Sol',
      your_name: 'Seu Nome',
      name_placeholder: 'Nome',
      whatsapp: 'WhatsApp',
      whatsapp_placeholder: '+55...',
      challenge: 'O que te impede de crescer hoje?',
      challenge_opt_1: 'Sinto que jogo dinheiro fora em anúncios',
      challenge_opt_2: 'Agências são muito caras',
      challenge_opt_3: 'Não tenho tempo para gerenciar tudo',
      challenge_opt_4: 'Tenho site mas não vende nada',
      challenge_opt_5: 'Quero começar do zero corretamente',
      submit: 'Solicitar Entrevista Grátis',
      no_commitment: 'Sem compromisso',
      secure_data: 'Dados 100% Seguros'
    },
    footer: {
      desc: 'A anti-agência. Não queremos cobrar mensalmente para sempre. Queremos te ensinar a ser livre.',
      quote: 'Não construímos sites. Construímos dignidade.',
      nav_title: 'Navegação',
      legal_title: 'Legal',
      rights: 'Todos os direitos reservados.',
      made_in: 'Feito com dignidade no Equador 🇪🇨'
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage || 'es');

  useEffect(() => {
    // Si hay initialLanguage (desde la URL), usarlo
    if (initialLanguage) {
      setLanguageState(initialLanguage);
      localStorage.setItem('language', initialLanguage);
      return;
    }

    // 1. Check Local Storage
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['es', 'en', 'pt'].includes(storedLang)) {
      setLanguageState(storedLang);
      return;
    }

    // 2. Check Browser Language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt') setLanguageState('pt');
    else if (browserLang === 'en') setLanguageState('en');
    else setLanguageState('es'); // Default fallback
  }, [initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Redirigir a la nueva URL con el idioma cambiado
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(/^\/(es|en|pt)/, '');
      window.location.href = `/${lang}${pathWithoutLang}`;
    }
  };

  // Helper to get nested properties safely (e.g., 'home.hero_title')
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to Spanish if translation missing
        let fallback: any = translations['es'];
        for (const fbK of keys) {
          if (fallback && fallback[fbK]) fallback = fallback[fbK];
          else return key; // Return key if absolutely nothing found
        }
        return fallback || key;
      }
    }
    return value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};