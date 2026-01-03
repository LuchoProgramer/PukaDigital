import React from 'react';
import { Flag } from 'lucide-react';

const ManifestoSection = () => {
    return (
        <div className="bg-black text-white relative overflow-hidden py-24 border-t border-gray-900">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-puka-red/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                <div className="inline-flex items-center gap-2 mb-10 px-4 py-1 border border-puka-red/30 rounded-full bg-puka-red/5">
                    <Flag className="text-puka-red" size={16} />
                    <span className="text-puka-red font-bold text-xs uppercase tracking-[0.2em]">Manifiesto Anti-Agencia</span>
                </div>

                <div className="space-y-8 font-display">
                    <h3 className="text-3xl md:text-5xl font-bold leading-tight">
                        "Creemos que el conocimiento digital es un <span className="text-puka-red underline decoration-puka-red/30 decoration-4">derecho</span>, no un secreto."
                    </h3>

                    <p className="text-2xl md:text-3xl font-medium text-gray-400 italic">
                        Por eso no queremos clientes eternos.<br />
                        <span className="text-white not-italic font-black">Queremos graduados independientes.</span>
                    </p>
                </div>

                <div className="mt-16 flex justify-center">
                    <div className="text-left border-l-4 border-puka-red pl-6 py-2">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Misión</p>
                        <p className="text-xl font-bold text-white">— PUKA DIGITAL</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManifestoSection;
