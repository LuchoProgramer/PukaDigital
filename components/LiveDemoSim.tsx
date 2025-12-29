'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, MousePointer2, MessageSquare, Check, ShoppingCart, Zap } from 'lucide-react';

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const LiveDemoSim = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 5);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const products = [
        { name: 'Runner Pro Max V1', price: '$300', img: '/trending-sneaker.png' },
        { name: 'Smart Watch Z', price: '$85', img: '/puka-watch.png' },
        { name: 'Air Buds Pro', price: '$120', img: '/puka-headphones.png' },
    ];

    return (
        <div className="relative w-full max-w-[800px] mx-auto min-h-[500px] flex items-center justify-center py-10">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-puka-red/5 to-puka-beige/20 blur-3xl -z-10 rounded-full"></div>

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 w-full justify-center">

                {/* 1. THE PHONE (CLIENT SIDE) */}
                <div className="relative group perspective-1000">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-puka-black text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase z-20">
                        CLIENTE
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-3 shadow-2xl border border-gray-100 relative w-[280px] aspect-[9/18.5] transition-all duration-700 overflow-hidden ring-4 ring-gray-50">
                        {/* Status bar */}
                        <div className="h-6 flex justify-between items-center px-4 pt-1 mb-2">
                            <span className="text-[10px] font-bold">12:30</span>
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2 bg-gray-200 rounded-sm"></div>
                                <div className="w-4 h-2 bg-gray-200 rounded-sm"></div>
                            </div>
                        </div>

                        {/* Store Header */}
                        <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-puka-red"></div>
                                <div className="h-2 bg-gray-100 w-16 rounded-full"></div>
                            </div>
                            <ShoppingCart size={16} className="text-gray-400" />
                        </div>

                        {/* Store Body - Scrolling Simulation */}
                        <div className="px-4 space-y-4">
                            <div className={`transition-all duration-1000 transform ${step === 0 ? 'translate-y-0 opacity-100' : 'translate-y-[-20%] opacity-90'}`}>
                                {products.map((p, i) => (
                                    <div key={i} className={`p-3 rounded-xl border mb-3 transition-all ${step === 1 && i === 0 ? 'border-puka-red bg-puka-red/5 scale-[1.02]' : 'border-gray-50 bg-white'}`}>
                                        <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                                            {p.img ? (
                                                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded-full opacity-20"></div>
                                            )}
                                        </div>
                                        <div className="h-2.5 bg-gray-100 w-3/4 rounded-full mb-2"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black">{p.price}</span>
                                            <div className="w-14 h-6 bg-puka-black rounded-md"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CURSOR ANIMATION */}
                        <div className={`absolute z-30 pointer-events-none transition-all duration-1000 ease-in-out text-puka-red drop-shadow-lg
                            ${step === 0 ? 'top-[40%] left-[60%] scale-100 rotate-0' : ''}
                            ${step === 1 ? 'top-[50%] left-[50%] scale-90 -rotate-12' : ''}
                            ${step === 2 ? 'top-[85%] left-[50%] scale-110' : ''}
                            ${step >= 3 ? 'opacity-0 scale-50' : 'opacity-100'}
                        `}>
                            <MousePointer2 fill="currentColor" size={32} />
                        </div>

                        {/* ADD TO CART OVERLAY */}
                        <div className={`absolute bottom-6 left-6 right-6 bg-[#25D366] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs shadow-xl transition-all duration-500 transform
                            ${step >= 2 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-90'}
                        `}>
                            <WhatsAppIcon size={18} /> PEDIR POR WHATSAPP
                        </div>
                    </div>
                </div>

                {/* THE BRIDGE (MAGIC) */}
                <div className="hidden lg:flex flex-col items-center gap-4 text-gray-300">
                    <div className={`transition-all duration-500 ${step === 2 ? 'text-puka-red scale-125' : ''}`}>
                        <Zap fill={step === 2 ? 'currentColor' : 'none'} />
                    </div>
                    <div className="h-20 w-px border-l-2 border-dashed border-gray-200"></div>
                    <div className={`transition-all duration-500 ${step >= 3 ? 'text-[#25D366] scale-125' : ''}`}>
                        <MessageSquare fill={step >= 3 ? 'currentColor' : 'none'} size={32} />
                    </div>
                </div>

                {/* 2. THE RECEIVER (ADMIN SIDE) */}
                <div className="relative group perspective-1000">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-puka-red text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase z-20">
                        EMPRENDEDOR
                    </div>

                    <div className="bg-puka-black rounded-[2.5rem] p-3 shadow-2xl border border-white/10 relative w-[280px] aspect-[9/18.5] transition-all duration-700 overflow-hidden">
                        {/* Status bar */}
                        <div className="h-6 flex justify-between items-center px-4 pt-1 mb-6">
                            <span className="text-[10px] font-bold text-white/40">12:30</span>
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2 bg-white/10 rounded-sm"></div>
                                <div className="w-4 h-2 bg-white/10 rounded-sm"></div>
                            </div>
                        </div>

                        {/* WhatsApp Notification Chat */}
                        <div className="px-4 space-y-4">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                                    <WhatsAppIcon size={20} />
                                </div>
                                <div>
                                    <div className="h-2 bg-white/20 w-20 rounded-full mb-1"></div>
                                    <div className="h-1.5 bg-white/10 w-12 rounded-full"></div>
                                </div>
                            </div>

                            {/* Bubble simulation */}
                            <div className={`bg-white/10 p-4 rounded-2xl rounded-tl-none border-l-4 border-[#25D366] transition-all duration-700 transform
                                ${step >= 3 ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-90'}
                            `}>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] text-[#25D366] font-black tracking-widest uppercase">NUEVO PEDIDO</span>
                                    <span className="text-[8px] text-white/30">Justo ahora</span>
                                </div>
                                <p className="text-[11px] text-white font-medium italic mb-4 leading-relaxed tracking-tight">
                                    "Hola Luis! Quiero comprar el <span className="text-[#25d366] font-bold">Runner Pro Max V1</span>. Mi dirección es..."
                                </p>
                                <div className="flex gap-2">
                                    <div className="h-6 bg-[#25D366] flex-1 rounded-lg flex items-center justify-center font-black text-[9px] text-white">ACEPTAR</div>
                                    <div className="h-6 bg-white/10 px-3 rounded-lg flex items-center justify-center font-black text-[9px] text-white/50 underline">VER STOCK</div>
                                </div>
                            </div>

                            {/* Stock Update Simulation */}
                            <div className={`bg-puka-red/10 p-4 rounded-2xl border border-puka-red/20 transition-all duration-700 transform delay-300
                                ${step >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                            `}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-puka-red/20 flex items-center justify-center text-puka-red">
                                        <Check size={16} strokeWidth={4} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white font-black">STOCK ACTUALIZADO</span>
                                        <span className="text-[9px] text-white/40">Item #402: 12 → 11 unidades</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation Steps Progress */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-puka-red' : 'w-2 bg-gray-200'}`}></div>
                ))}
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
};

export default LiveDemoSim;
