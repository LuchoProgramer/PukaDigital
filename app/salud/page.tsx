'use client';

import React, { useState, useEffect } from 'react';
import {
    Stethoscope,
    Search,
    CalendarCheck,
    Activity,
    ShieldCheck,
    ArrowRight,
    TrendingUp,
    CheckCircle2,
    Play,
    AlertCircle,
    Users,
    Clock,
    Award
} from 'lucide-react';
import * as ga from '@/lib/analytics';
import LeadForm from '@/components/LeadForm';

const OptimizedSaludPage = () => {
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 47, seconds: 30 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleWhatsAppClick = (location: string, message?: string) => {
        ga.trackWhatsAppDirectoClick(`salud_${location}`);
        const phoneNumber = '593964065880';
        const text = message || 'Hola, me interesa llenar mi agenda médica.';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const features = [
        { icon: ShieldCheck, text: "100% Cumplimiento Legal Médico" },
        { icon: Users, text: "53 Consultorios Activos" },
        { icon: Award, text: "Certificados Google Partner" }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* BARRA DE URGENCIA SUPERIOR */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 text-center text-sm font-semibold animate-pulse">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Solo quedan 3 cupos este mes • Auditoría expira en: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </div>

            {/* HEADER MEJORADO */}
            <header className="fixed top-8 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center h-16">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Stethoscope className="text-white" size={20} />
                            </div>
                            <span className="font-bold text-gray-900 tracking-tight">PUKA<span className="text-blue-600">SALUD</span></span>
                        </div>
                        <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                            {features.map((f, i) => {
                                const IconComponent = f.icon;
                                return (
                                    <div key={i} className="flex items-center gap-1 px-2">
                                        <IconComponent size={12} className="text-blue-600" />
                                        <span>{f.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button
                        onClick={() => handleWhatsAppClick('header_cta', 'Doctor(a), me interesa llenar mi agenda.')}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105"
                    >
                        Agendar Auditoría Gratis
                    </button>
                </div>
            </header>

            {/* HERO ULTRA-OPTIMIZADO */}
            <section className="pt-36 pb-16 md:pt-44 md:pb-20 px-4 relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
                    {/* LEFT: Copy */}
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-6 border border-green-200">
                            <CheckCircle2 size={14} /> Casos Reales • Resultados Medibles
                        </div>

                        <h1 className="font-black text-4xl md:text-6xl leading-tight mb-6 text-gray-900">
                            Llena Tu Agenda con <span className="text-blue-600">Pacientes Reales</span> en 30 Días
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                            Sin contratos de permanencia. Sin likes inútiles. Solo <strong className="text-gray-900">citas agendadas de pacientes</strong> que buscan tu especialidad en Google ahora mismo.
                        </p>

                        {/* Social Proof Badges */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="text-2xl font-black text-blue-600">+330%</div>
                                <div className="text-xs text-gray-500">ROI Promedio</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="text-2xl font-black text-blue-600">53</div>
                                <div className="text-xs text-gray-500">Consultorios</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="text-2xl font-black text-blue-600">24/7</div>
                                <div className="text-xs text-gray-500">Auto-Agenda</div>
                            </div>
                        </div>

                        {/* CTA Principal */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => handleWhatsAppClick('hero_main', 'Hola, soy médico y quiero más pacientes.')}
                                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 hover:scale-105"
                            >
                                <CalendarCheck size={24} />
                                Solicitar Auditoría Gratuita
                            </button>
                            <a
                                href="#caso-exito"
                                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                            >
                                Ver Caso Real
                            </a>
                        </div>

                        <p className="text-xs text-gray-400 mt-4">
                            ✓ Sin compromiso • ✓ Análisis personalizado en 48h • ✓ Solo 3 cupos/mes por ciudad
                        </p>
                    </div>

                    {/* RIGHT: Trust Indicators */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-6">
                            <p className="text-blue-900 font-semibold text-lg mb-2">
                                "Pasé de 3 a 53 pacientes mensuales sin contratar más personal."
                            </p>
                            <p className="text-blue-700 text-sm">— Dra. Cristina Muñoz, Podoclinic</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                "Pacientes que ya buscan tu especialidad",
                                "Landing page ética y profesional incluida",
                                "Reportes en tiempo real de cada clic",
                                "Agendamiento automático 24/7",
                                "Optimización continua por expertos"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-blue-100 to-transparent"></div>
            </section>

            {/* PROBLEMA - CHECKLIST VISUAL */}
            <section className="py-20 bg-gradient-to-b from-red-50 to-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <AlertCircle className="inline-block text-red-600 mb-4" size={48} />
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                            ¿Te suena familiar?
                        </h2>
                        <p className="text-xl text-gray-600">El 73% de los médicos sufren estos problemas:</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { problem: "Agenda vacía sin control", stat: "87% de consultorios" },
                            { problem: "Depender del boca a boca incierto", stat: "6 meses promedio sin crecer" },
                            { problem: "Redes sociales sin resultados", stat: "$500/mes desperdiciados" },
                            { problem: "Agencias que venden likes inútiles", stat: "92% abandona antes de 1 año" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-600 font-bold">✗</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">{item.problem}</h3>
                                        <p className="text-sm text-red-600 font-semibold">{item.stat}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-2xl text-gray-700 font-semibold">
                            Mientras lees esto, <span className="text-red-600">tus competidores están agendando pacientes en Google.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* VIDEO TESTIMONIAL CON PREVIEW */}
            <section id="caso-exito" className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest block mb-2">CASO DE ESTUDIO REAL</span>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                            De 3 a 53 Pacientes en 90 Días
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Descubre cómo Podoclinic automatizó su captación sin contratar más personal ni aumentar su presupuesto.
                        </p>
                    </div>

                    {/* Video Preview con Quote */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-2xl">
                            <p className="text-2xl font-semibold mb-4">
                                "Antes dependíamos del boca a boca. Ahora los pacientes nos encuentran solos mientras dormimos."
                            </p>
                            <p className="text-blue-200">— Dra. Cristina Muñoz, Especialista en Podología</p>
                        </div>

                        <div className="shadow-2xl rounded-b-2xl overflow-hidden">
                            {!videoPlaying ? (
                                <button
                                    onClick={() => setVideoPlaying(true)}
                                    className="relative w-full overflow-hidden bg-black aspect-video group cursor-pointer"
                                >
                                    <img
                                        src="https://img.youtube.com/vi/bSge9e1Se4w/maxresdefault.jpg"
                                        alt="Video testimonial"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                                            <Play size={40} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                        ▶ Ver caso completo (3:47)
                                    </div>
                                </button>
                            ) : (
                                <div className="relative w-full overflow-hidden bg-black aspect-video">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src="https://www.youtube.com/embed/bSge9e1Se4w?rel=0&autoplay=1"
                                        title="Testimonio Dra. Cristina Muñoz"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { metric: "+1,667%", label: "Crecimiento en Pacientes", icon: TrendingUp },
                            { metric: "$3.2", label: "Costo por Cita Agendada", icon: Activity },
                            { metric: "24/7", label: "Disponibilidad Automática", icon: Clock },
                            { metric: "0", label: "Personal Adicional", icon: Users }
                        ].map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={i} className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <IconComponent className="inline-block text-blue-600 mb-2" size={32} />
                                    <div className="text-3xl font-black text-blue-600 mb-1">{item.metric}</div>
                                    <div className="text-sm text-gray-600 font-medium">{item.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA POST-VIDEO */}
                    <div className="mt-12 text-center bg-blue-50 p-8 rounded-2xl border border-blue-100">
                        <p className="text-xl text-gray-700 mb-6">
                            ¿Quieres resultados similares para tu consultorio?
                        </p>
                        <button
                            onClick={() => handleWhatsAppClick('video_cta', 'Vi el caso de Podoclinic. Quiero una auditoria.')}
                            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:scale-105"
                        >
                            Solicitar Mi Auditoría Gratuita <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* MÉTODO MEJORADO */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                            El Protocolo Médico de Marketing
                        </h2>
                        <p className="text-xl text-gray-600">Tratamos tu crecimiento con el mismo rigor que tú tratas pacientes.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                icon: Search,
                                title: "Diagnóstico Digital",
                                desc: "Análisis profundo de qué buscan los pacientes en tu zona. No adivinamos, medimos.",
                                deliverable: "Reporte de palabras clave + análisis competencia"
                            },
                            {
                                step: "02",
                                icon: ShieldCheck,
                                title: "Receta de Relevancia",
                                desc: "Landing page ética, rápida y profesional. Cumplimiento legal garantizado.",
                                deliverable: "Página lista en 7 días + certificado SSL"
                            },
                            {
                                step: "03",
                                icon: TrendingUp,
                                title: "Tratamiento de Tráfico",
                                desc: "Campañas Google Ads optimizadas para conversiones. Solo pagas por clics reales.",
                                deliverable: "Dashboard en vivo + optimización semanal"
                            }
                        ].map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-t-4 border-blue-600 group">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="text-6xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">
                                            {item.step}
                                        </div>
                                        <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <IconComponent size={28} strokeWidth={2} />
                                        </div>
                                    </div>
                                    <h3 className="font-black text-2xl mb-3 text-gray-900">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">{item.desc}</p>
                                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                                        <p className="text-sm font-semibold text-blue-900">Incluye: {item.deliverable}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA INVERSIÓN */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-bold text-sm mb-6 shadow-lg">
                            Cupos limitados por ciudad y especialidad
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                            &iquest;Listo para llenar tu agenda?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hablamos, analizamos tu situaci&oacute;n y te presentamos una propuesta personalizada. Sin compromisos.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-8 md:p-12 shadow-2xl text-center">
                        <ul className="space-y-3 mb-8 text-left max-w-md mx-auto">
                            {[
                                "Landing page premium en Next.js",
                                "Google Ads + Google Business Profile",
                                "Tracking y Analytics completo",
                                "Optimizaci\u00f3n semanal + soporte WhatsApp",
                                "Garant\u00eda: 12 citas en 60 d\u00edas o mes 3 gratis"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-blue-200 text-sm mb-8">
                            El presupuesto publicitario (Google Ads) se paga directo a Google con tu tarjeta &mdash; t&uacute; recibes las facturas a tu nombre.
                        </p>
                        <button
                            onClick={() => handleWhatsAppClick('pricing_cta', 'Hola, me interesa el servicio de marketing m\u00e9dico de PukaSalud. \u00bfPodemos hablar?')}
                            className="inline-flex items-center gap-3 bg-white text-blue-700 px-10 py-5 rounded-xl font-black text-xl hover:bg-blue-50 transition-all shadow-xl cursor-pointer"
                        >
                            Solicitar propuesta personalizada
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA FINAL URGENTE */}
            <section className="py-24 bg-gradient-to-b from-blue-900 to-blue-950 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-blue-100 to-transparent"></div>
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">
                        Solo Quedan 3 Cupos Este Mes
                    </h2>
                    <p className="text-blue-200 text-xl mb-8 max-w-2xl mx-auto">
                        Protegemos tu territorio. Solo trabajamos con un consultorio por especialidad y zona geográfica.
                    </p>

                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8 inline-block">
                        <div className="flex items-center justify-center gap-8 text-center">
                            <div>
                                <div className="text-5xl font-black mb-2">{timeLeft.hours}</div>
                                <div className="text-sm text-blue-200">Horas</div>
                            </div>
                            <div className="text-4xl">:</div>
                            <div>
                                <div className="text-5xl font-black mb-2">{timeLeft.minutes}</div>
                                <div className="text-sm text-blue-200">Minutos</div>
                            </div>
                            <div className="text-4xl">:</div>
                            <div>
                                <div className="text-5xl font-black mb-2">{timeLeft.seconds}</div>
                                <div className="text-sm text-blue-200">Segundos</div>
                            </div>
                        </div>
                        <p className="text-sm text-blue-300 mt-4">Tu auditoría gratuita expira pronto</p>
                    </div>

                    {/* FORMULARIO FINAL */}
                    <div className="max-w-xl mx-auto bg-white rounded-lg text-gray-900 text-left">
                        <LeadForm className="shadow-2xl border-t-8 border-yellow-400" title="Reserva tu Auditoría Ahora" />
                    </div>

                    <p className="mt-8 text-sm text-blue-300">
                        ✓ Sin compromiso • ✓ Respuesta en 24h • ✓ Análisis personalizado incluido
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-blue-950 py-12 text-center text-blue-200/50 text-sm border-t border-blue-900">
                <div className="container mx-auto px-4">
                    <p className="mb-4">© 2025 PukaSalud. División de PukaDigital.</p>
                    <p className="text-xs">Cumplimiento Legal Médico Garantizado</p>
                </div>
            </footer>
        </div>
    );
};

export default OptimizedSaludPage;