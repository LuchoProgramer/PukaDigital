'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Send, MoreVertical, Search, Phone, ArrowLeft, Check, CheckCheck, Paperclip, Smile, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';

// Configuración del API de Agentes IA
const AGENTES_IA_API = 'https://messages-uq7ypdzlda-uc.a.run.app';
const DEMO_BOT_ID = 'demo-bot';
const DEMO_CODE = 'PUKA2024'; // Código de demo para Puka Digital

const Demos: React.FC = () => {
  const { t, language } = useTranslation();
  
  const data = [
    { name: '1 May', ventas: 4000, leads: 24 },
    { name: '5 May', ventas: 3000, leads: 18 },
    { name: '10 May', ventas: 5000, leads: 35 },
    { name: '15 May', ventas: 2780, leads: 20 },
    { name: '20 May', ventas: 6890, leads: 45 },
    { name: '25 May', ventas: 4390, leads: 30 },
    { name: '30 May', ventas: 7490, leads: 52 },
  ];

  // Chat Demo State
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, time: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `puka_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Reset messages when language changes
  useEffect(() => {
    setMessages([
      { role: 'bot', text: t('demos.chat_welcome'), time: '10:00 AM' }
    ]);
  }, [language, t]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const sendMessageToAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(AGENTES_IA_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: DEMO_BOT_ID,
          message: userMessage,
          demoCode: DEMO_CODE,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          return errorData.message || 'Has alcanzado el límite de mensajes de la demo. ¡Contáctanos para más información!';
        }
        throw new Error(errorData.error || 'Error en el servidor');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.';
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    const time = getCurrentTime();
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time }]);
    setInput('');
    setIsLoading(true);
    
    try {
      const botResponse = await sendMessageToAPI(userMsg);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: botResponse, 
        time: getCurrentTime()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Lo siento, hubo un error. Por favor intenta de nuevo.', 
        time: getCurrentTime()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-12 transition-colors">
      <SEO 
        title="Demos Interactivas | Prueba tu Futuro Digital"
        description="Experimenta el poder de un Chatbot con IA real y visualiza tus métricas en nuestro Dashboard. Tecnología corporativa simplificada para tu negocio."
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-puka-red font-bold tracking-wider uppercase text-sm mb-2 block">{t('demos.badge')}</span>
          <h1 className="font-display font-bold text-4xl mb-4 text-puka-black dark:text-white">{t('demos.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('demos.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* DEMO 1: WHATSAPP STYLE CHATBOT */}
          <div className="flex flex-col h-[600px] bg-[#E5DDD5] rounded-lg shadow-2xl overflow-hidden relative border border-gray-200 dark:border-gray-800">
             {/* WhatsApp Header */}
             <div className="bg-[#008069] text-white p-3 flex items-center justify-between shadow-md z-10">
               <div className="flex items-center gap-3">
                 <ArrowLeft size={24} />
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Puka+Bot&background=c7171e&color=fff" alt="Bot Profile" />
                 </div>
                 <div className="flex flex-col">
                   <span className="font-bold text-base leading-tight">{t('demos.chat_header_business')}</span>
                   <span className="text-xs text-gray-200">{t('demos.chat_header_acct')}</span>
                 </div>
               </div>
               <div className="flex gap-4 pr-2">
                 <Phone size={20} />
                 <Paperclip size={20} className="rotate-45" />
                 <MoreVertical size={20} />
               </div>
             </div>

             {/* Background Pattern Hint */}
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]"></div>

             {/* Messages Area */}
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative z-0">
               {/* Encryption Notice */}
               <div className="flex justify-center mb-4">
                 <div className="bg-[#FFF5C4] text-[#5E5E5E] text-[10px] px-3 py-1.5 rounded-lg shadow-sm text-center max-w-[80%]">
                   {t('demos.chat_encryption')}
                 </div>
               </div>

               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`
                     max-w-[80%] px-3 py-1.5 rounded-lg shadow-sm text-sm relative
                     ${msg.role === 'user' ? 'bg-[#E7FFDB] rounded-tr-none' : 'bg-white rounded-tl-none'}
                   `}>
                     <p className="text-[#111B21] leading-relaxed pb-2">{msg.text}</p>
                     <div className="flex justify-end items-center gap-1 absolute bottom-1 right-2">
                       <span className="text-[10px] text-gray-500">{msg.time}</span>
                       {msg.role === 'user' && <CheckCheck size={14} className="text-[#53BDEB]" />}
                     </div>
                   </div>
                 </div>
               ))}
               {/* Indicador de escritura */}
               {isLoading && (
                 <div className="flex justify-start">
                   <div className="bg-white rounded-lg rounded-tl-none px-4 py-2 shadow-sm">
                     <div className="flex items-center gap-1">
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                     </div>
                   </div>
                 </div>
               )}
             </div>

             {/* Input Area */}
             <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 z-10">
               <div className="p-2 text-gray-500 cursor-pointer hover:bg-gray-200 rounded-full">
                 <Smile size={24} />
               </div>
               <div className="flex-1 bg-white rounded-lg px-4 py-2 shadow-sm border border-white focus-within:border-white">
                 <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('demos.chat_placeholder')}
                    className="w-full bg-transparent focus:outline-none text-[#111B21] text-sm"
                 />
               </div>
               <button 
                onClick={handleSend}
                className="bg-[#008069] text-white p-3 rounded-full shadow-md hover:bg-[#006e5a] transition-colors flex items-center justify-center"
               >
                 <Send size={18} />
               </button>
             </div>
          </div>

          {/* DEMO 2: ANALYTICS DASHBOARD */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-xl border border-gray-100 dark:border-gray-800 h-full transition-colors">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="font-bold text-2xl text-puka-black dark:text-white">{t('demos.chart_title')}</h3>
                   <p className="text-gray-500 text-sm">{t('demos.chart_subtitle')}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-sm text-xs font-bold border border-green-200 dark:border-green-800">
                   +24%
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E30613" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#E30613" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                      itemStyle={{color: '#E30613', fontWeight: 'bold'}}
                      cursor={{stroke: '#E30613', strokeWidth: 1, strokeDasharray: '4 4'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#E30613" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorVentas)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                 <div className="text-center">
                    <span className="block text-gray-400 text-xs uppercase tracking-wide mb-1">{t('demos.stat_sales')}</span>
                    <span className="block font-bold text-xl text-puka-black dark:text-white">$33,950</span>
                 </div>
                 <div className="text-center border-l border-gray-100 dark:border-gray-800">
                    <span className="block text-gray-400 text-xs uppercase tracking-wide mb-1">{t('demos.stat_leads')}</span>
                    <span className="block font-bold text-xl text-puka-black dark:text-white">224</span>
                 </div>
                 <div className="text-center border-l border-gray-100 dark:border-gray-800">
                    <span className="block text-gray-400 text-xs uppercase tracking-wide mb-1">{t('demos.stat_conv')}</span>
                    <span className="block font-bold text-xl text-green-600">4.8%</span>
                 </div>
              </div>
            </div>

            <div className="bg-puka-black dark:bg-gray-800 text-white p-6 rounded-sm shadow-lg flex items-center justify-between">
               <div>
                  <h4 className="font-bold mb-1">{t('demos.cta_card_title')}</h4>
                  <p className="text-gray-400 text-sm">{t('demos.cta_card_desc')}</p>
               </div>
               <a href="#contacto" className="bg-white text-puka-black px-4 py-2 rounded-sm font-bold text-sm hover:bg-gray-100 transition-colors">
                  {t('demos.cta_btn')}
               </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Demos;