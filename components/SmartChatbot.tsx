'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Phone, Minimize2, Maximize2, ExternalLink, Bot, Paperclip, MoreVertical, Smile, CheckCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';
import { usePathname } from 'next/navigation';

// API Config
const AGENTES_IA_API = 'https://messages-uq7ypdzlda-uc.a.run.app';
const DEMO_BOT_ID = 'demo-bot';
const DEMO_CODE = 'PUKA2024';
const WHATSAPP_NUMBER = '593964065880';

interface Message {
    role: 'user' | 'bot' | 'system';
    text: string;
    time: string;
}

const SmartChatbot: React.FC = () => {
    const { t, language } = useTranslation();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => `puka_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const [showWhatsAppCta, setShowWhatsAppCta] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    role: 'bot',
                    text: 'Hola 👋 Soy Puka IA. Estoy entrenado para responder todas tus dudas sobre nuestros servicios, precios y metodología. ¿En qué puedo ayudarte hoy?',
                    time: getCurrentTime()
                }
            ]);
        }
    }, [language]);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getContextInfo = () => {
        if (!pathname) return '';
        if (pathname.includes('/salud')) return 'Estoy en la página de Salud/Médicos.';
        if (pathname.includes('/inventario')) return 'Estoy en la página de Sistema de Inventario.';
        if (pathname.includes('/chatbot')) return 'Estoy interesado en Chatbots IA.';
        if (pathname.includes('/sistema')) return 'Estoy viendo el Sistema Emprendedor.';
        return 'Estoy en la página principal.';
    };

    const sendMessageToAPI = async (userMessage: string): Promise<string> => {
        try {
            const response = await fetch(AGENTES_IA_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    botId: DEMO_BOT_ID,
                    message: `${userMessage} [Contexto: ${getContextInfo()}]`,
                    demoCode: DEMO_CODE,
                    sessionId: sessionId,
                }),
            });

            if (!response.ok) {
                if (response.status === 429) return 'He alcanzado mi límite de respuestas por hoy. ¿Por qué no hablamos por WhatsApp?';
                throw new Error('Server Error');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('API Error:', error);
            return 'Lo siento, tuve un pequeño error de conexión. ¿Podemos continuar por WhatsApp?';
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        const time = getCurrentTime();

        setMessages(prev => [...prev, { role: 'user', text: userMsg, time }]);
        setInput('');
        setIsLoading(true);

        // Heuristic: Show WhatsApp CTA if user shows high intent or after 3 messages
        if (
            messages.length > 3 ||
            /precio|costo|agendar|cita|hablar|humano|comprar|interesado/i.test(userMsg)
        ) {
            setShowWhatsAppCta(true);
        }

        try {
            const botResponse = await sendMessageToAPI(userMsg);
            setMessages(prev => [...prev, { role: 'bot', text: botResponse, time: getCurrentTime() }]);

            // Also check bot response for cues (optional, but good for safety)
            if (/whatsapp|contactar|llamar/i.test(botResponse)) {
                setShowWhatsAppCta(true);
            }

        } catch (error) {
            // Error handled in sendMessageToAPI return
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenWhatsApp = () => {
        ga.trackWhatsAppDirectoClick('smart_chatbot_conversion');
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, he estado charlando con tu IA y quiero más información.`, '_blank');
    };

    // Logic to hide on specific mobile scenarios if needed, currently mimicking FloatingWhatsApp
    const isConversionPage = pathname?.includes('/salud') || pathname?.includes('/inventario');
    // On mobile conversion pages, maybe we want it hidden to not block sticky CTA, or maybe we want it small.
    // For now, let's keep it visible but respectful.

    if (!isOpen) {
        return (
            <button
                onClick={() => { setIsOpen(true); ga.event({ action: 'open_chatbot', category: 'engagement', label: 'floating_bubble' }); }}
                className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 group flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-puka-red/20 rounded-full animate-ping"></div>
                <div className="relative bg-[#E30613] text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 pr-6 h-14">
                    <div className="bg-white/20 p-2 rounded-full">
                        <Bot size={24} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                        <span className="font-bold text-sm">¿Dudas?</span>
                        <span className="text-[10px] opacity-90">Pregúntale a la IA</span>
                    </div>
                </div>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end animate-in fade-in slide-in-from-bottom-10 duration-300">
            {/* Chat Window */}
            <div className="w-full h-full sm:w-[350px] md:w-[380px] sm:h-[500px] sm:max-h-[80vh] bg-[#E5DDD5] sm:rounded-xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-gray-200 dark:border-gray-800 relative">

                {/* Header */}
                <div className="bg-[#E30613] text-white p-3 flex items-center justify-between shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full"><ArrowLeftIcon /></button>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white/20">
                                <Bot className="text-puka-red" size={24} />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075E54] rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm leading-tight">Puka IA - Asistente</span>
                            <span className="text-[10px] opacity-90">Responde al instante ⚡️</span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]"></div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative z-0 bg-transparent scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="w-full text-center my-2">
                        <span className="bg-[#FFF5C4] text-gray-600 text-[10px] px-2 py-1 rounded shadow-sm">
                            🔒 Los mensajes son procesados por IA segura.
                        </span>
                    </div>

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-lg shadow-sm text-sm relative ${msg.role === 'user' ? 'bg-[#E7FFDB] rounded-tr-none text-gray-800' : 'bg-white rounded-tl-none text-gray-800'
                                }`}>
                                <p className="pb-1 leading-relaxed">{msg.text}</p>
                                <div className="flex justify-end items-center gap-1 opacity-60">
                                    <span className="text-[9px]">{msg.time}</span>
                                    {msg.role === 'user' && <CheckCheck size={12} className="text-blue-500" />}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Sticky WhatsApp CTA (Dynamic) */}
                {showWhatsAppCta && (
                    <div className="p-2 bg-yellow-50 border-t border-yellow-100 flex items-center justify-between animate-in slide-in-from-bottom-5">
                        <span className="text-xs text-yellow-800 font-medium px-2">¿Quieres atención humana?</span>
                        <button
                            onClick={handleOpenWhatsApp}
                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-colors"
                        >
                            <MessageCircle size={14} />
                            Chat en WhatsApp
                        </button>
                    </div>
                )}

                {/* Input Area */}
                <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 z-10 border-t border-gray-200">
                    <div className="flex-1 bg-white rounded-full px-4 py-2 shadow-sm border-none focus-within:ring-1 focus-within:ring-[#E30613]/30 flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe un mensaje..."
                            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`p-3 rounded-full flex items-center justify-center transition-all shadow-md ${input.trim() ? 'bg-[#E30613] text-white hover:bg-[#c20510] rotate-0' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper icon
const ArrowLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);

export default SmartChatbot;
