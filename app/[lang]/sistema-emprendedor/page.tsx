import { getTiendaOnlineSchema } from '@/lib/schema';
import Link from 'next/link'; // Re-adding Link as anchor since I messed up the imports
import { useRouter } from 'next/navigation';
import {
    CheckCircle,
    XCircle,
    Clock,
    Package,
    Zap,
    ShieldCheck,
    Smartphone,
    MessageCircle,
    ArrowRight,
    TrendingUp,
    CreditCard,
    Rocket,
    Plus,
    Play
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';
import LiveDemoSim from '@/components/LiveDemoSim';

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

const SistemaEmprendedorPage = () => {
    const WHATSAPP_NUMBER = '593964065880';
    const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
    const router = useRouter();
    const { language } = useTranslation();
    const lang = language || 'es';

    const handleWhatsAppClick = (location: string, customMessage?: string) => {
        ga.trackWhatsAppDirectoClick(`sistema_emprendedor_${location}`);

        // Mensaje por defecto o personalizado según el botón
        const defaultMessage = "Hola Puka, vi la oferta del Sistema Emprendedor. Quiero ver una demo real y saber si aún hay cupos disponibles.";
        const message = customMessage || defaultMessage;

        const finalLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(finalLink, '_blank');
        // No redirigimos a gracias para mantener al usuario en el contexto si regresa
    };

    const scrollToPricing = () => {
        const el = document.getElementById('precios');
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col bg-white overflow-hidden selection:bg-puka-red/20 selection:text-puka-red">
            {/* Top Urgency Banner */}
            <div className="bg-puka-red text-white py-2 px-4 text-center text-xs md:text-sm font-bold animate-pulse">
                🔥 OFERTA DE LANZAMIENTO: Setup de Google Ads <span className="line-through opacity-80">($150)</span> <span className="font-black">GRATIS</span> + $100 de saldo. <b>Solo 2 cupos disponibles para Enero.</b>
            </div>
            <SEO
                title="Tienda Online Profesional | Sin Pagos Mensuales | Puka Digital"
                description="Tu Tienda Online + Control de Inventario por un Pago Único. Sin comisiones y sin rentas mensuales. Tecnología Next.js para tu negocio en Ecuador."
                structuredData={getTiendaOnlineSchema()}
            />

            {/* Decorative Mesh Gradient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-puka-red/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-[-10%] w-[40%] h-[40%] bg-puka-beige/20 blur-[120px] rounded-full"></div>
            </div>

            {/* 1. HERO SECTION */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-36">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-3/5 text-left order-1 lg:order-1">
                            <div className="inline-flex items-center gap-2 py-1.5 px-3 bg-puka-red/10 text-puka-red font-bold text-[10px] md:text-xs tracking-widest uppercase mb-6 rounded-full border border-puka-red/20 animate-fade-in">
                                <span className="w-1.5 h-1.5 rounded-full bg-puka-red animate-pulse"></span>
                                SISTEMA DE VENTAS PARA EMPRENDEDORES EN ECUADOR
                            </div>
                            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-puka-black mb-6">
                                Tu Tienda Online <br />
                                <span className="relative">
                                    <span className="relative z-10 text-puka-red">Sin Rentas Mensuales</span>
                                    <span className="absolute bottom-2 left-0 w-full h-3 bg-puka-beige -z-10 transform -rotate-1"></span>
                                </span> <br />
                                Pago Único.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                                Vende por internet con tecnología de élite (Next.js). Incluye inventario, pedidos a WhatsApp y <b>$100 de regalo en Google Ads.</b> <br className="hidden md:block" />
                                <span className="text-sm mt-4 block text-gray-400 font-medium italic">* Pago único de implementación. Renovación técnica desde el 2º año: $80 (Hosting + Dominio).</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 mb-10">
                                <button
                                    onClick={scrollToPricing}
                                    className="bg-puka-red text-white px-12 py-5 rounded-sm font-black text-xl hover:bg-puka-black transition-all shadow-2xl shadow-puka-red/20 flex items-center justify-center gap-3 group transform hover:-translate-y-1"
                                >
                                    SOLICITAR MI TIENDA (2 CUPOS)
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                                </button>
                                <button
                                    onClick={() => handleWhatsAppClick('hero_secondary', 'Hola Puka, quiero apartar uno de los cupos de Enero para la Tienda Online.')}
                                    className="bg-white border-2 border-puka-black text-puka-black px-12 py-5 rounded-sm font-black text-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
                                >
                                    <WhatsAppIcon size={28} />
                                    APARTAR CUPO WHATSAPP
                                </button>
                            </div>

                            <div className="flex items-center gap-4 text-gray-500 font-bold">
                                <div className="flex items-center gap-2 text-sm">
                                    <Zap className="text-amber-500" size={20} fill="currentColor" />
                                    <span>Tecnología Next.js 16</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="flex items-center gap-2 text-sm">
                                    <ShieldCheck className="text-green-500" size={20} />
                                    <span>Hospedaje Premium</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/5 relative order-2 lg:order-2">
                            <div className="relative z-10 animate-float-slow">
                                <div className="bg-gradient-to-tr from-puka-beige/40 to-white p-6 rounded-[3rem] border border-puka-beige shadow-2xl backdrop-blur-sm">
                                    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 aspect-[9/19] max-w-[320px] mx-auto relative group">
                                        {/* Phone Status Bar */}
                                        <div className="h-10 bg-white flex justify-between items-center px-6 pt-2">
                                            <span className="text-[10px] font-bold">9:41</span>
                                            <div className="flex gap-1.5 items-center">
                                                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                                <div className="w-5 h-2.5 bg-gray-200 rounded-full"></div>
                                            </div>
                                        </div>
                                        {/* App Header */}
                                        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-50">
                                            <div className="w-8 h-8 rounded-full bg-puka-black flex items-center justify-center">
                                                <span className="text-white text-[10px] font-black italic">PK</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full border-2 border-puka-red"></div>
                                            </div>
                                        </div>
                                        {/* App Content */}
                                        <div className="p-6 space-y-6">
                                            <div className="aspect-[4/5] bg-gray-50 rounded-2xl flex items-center justify-center relative overflow-hidden ring-1 ring-gray-100 shadow-inner">
                                                <div className="absolute top-3 left-3 bg-puka-black text-white text-[9px] font-black px-2 py-1 rounded-sm tracking-tighter z-10">PREMIUM</div>
                                                <img
                                                    src="/trending-sneaker.png"
                                                    alt="Product Example"
                                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-5 bg-gray-100 w-4/5 rounded-full flex items-center px-3">
                                                    <span className="text-[10px] font-bold text-gray-800">Runner Pro Max V1</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 bg-puka-beige/40 w-1/4 rounded-lg flex items-center justify-center font-black text-xs text-puka-black">$300</div>
                                                    <div className="h-4 bg-gray-50 w-1/3 rounded-full italic text-[10px] flex items-center px-2">Stock: 12</div>
                                                </div>
                                            </div>
                                            <button className="h-14 bg-[#25D366] w-full rounded-xl flex items-center justify-center text-white text-xs font-black gap-2 mt-8 shadow-xl shadow-green-500/20 active:scale-95 transition-transform">
                                                <WhatsAppIcon size={20} /> PEDIR POR WHATSAPP
                                            </button>
                                        </div>
                                        {/* Floating Real-time Badge */}
                                        <div className="absolute top-[40%] -left-10 bg-puka-black text-white p-4 rounded-2xl shadow-2xl border border-white/10 animate-pulse">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black leading-none mb-1">VENTA NUEVA</span>
                                                    <span className="text-[8px] text-gray-400 leading-none">Hace 2 min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Circle */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-puka-red/10 rounded-full -z-10 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VIDEO DEMO SECTION (Interactive Simulation) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
                    <div className="mb-16">
                        <span className="text-puka-red font-black text-xs uppercase tracking-widest bg-puka-red/5 px-4 py-2 rounded-full border border-puka-red/10 mb-6 inline-block">EXPERIENCIA PUKA</span>
                        <h2 className="font-display font-bold text-4xl md:text-6xl text-puka-black mb-6">Mira la magia en tiempo real</h2>
                        <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">De un click en tu catálogo a una venta cerrada en tu WhatsApp. Así de fácil es para ti y para tus clientes.</p>
                    </div>

                    <div className="bg-gray-50/50 rounded-[2rem] md:rounded-[4rem] border border-gray-100 p-0 shadow-inner overflow-hidden max-w-full">
                        <LiveDemoSim />
                    </div>

                    {/* Features summary for the demo */}
                    <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Cero Fricción', value: 'Browsing fluido' },
                            { label: 'Instantáneo', value: 'WhatsApp Directo' },
                            { label: 'Automático', value: 'Control de Stock' },
                            { label: 'Sin Errores', value: 'Pedidos Listos' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-puka-red tracking-widest mb-1">{stat.label}</span>
                                <span className="text-xl font-bold text-puka-black">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Decorative mask */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-puka-beige/20 -z-10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
            </section>

            {/* 2. EL PROBLEMA (Agitación) */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto mb-16">
                        <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-puka-black leading-tight">
                            ¿Te suena familiar esto? <br />
                            <span className="text-gray-400 text-3xl">(Tu negocio merece algo mejor)</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <MessageCircle size={32} />,
                                title: '"¿Precio? ¿Precio?"',
                                desc: 'Pierdes horas respondiendo lo mismo a 50 personas todos los días.'
                            },
                            {
                                icon: <Package size={32} />,
                                title: '"Ya no me queda"',
                                desc: 'Vendes productos que ya se te acabaron por no tener inventario automático.'
                            },
                            {
                                icon: <Smartphone size={32} />,
                                title: 'Fotos Borrosas',
                                desc: 'Tus clientes se cansan de esperar a que les pases el catálogo foto por foto.'
                            },
                            {
                                icon: <TrendingUp size={32} />,
                                title: 'Comisiones Abusivas',
                                desc: 'Las apps de delivery o marketplaces se llevan gran parte de tu ganancia.'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl border border-gray-100 hover:border-puka-red/20 hover:bg-puka-beige/5 transition-all duration-300 text-left">
                                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl text-puka-red group-hover:bg-puka-red group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-xl mb-4 group-hover:text-puka-red transition-colors flex items-center gap-2">
                                    <XCircle className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. LA SOLUCIÓN (Sistema SaaS) */}
            <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 text-puka-red font-black text-sm uppercase tracking-tighter mb-4">
                                <span className="w-8 h-px bg-puka-red"></span> LA SOLUCIÓN DEFINITIVA
                            </div>
                            <h2 className="font-display font-bold text-4xl md:text-5xl mb-8 text-puka-black leading-tight">
                                Automatiza tu negocio con nuestro <br />
                                <span className="text-puka-red italic underline decoration-puka-beige decoration-8 underline-offset-4">Sistema Todo-en-Uno</span>
                            </h2>

                            <div className="space-y-8">
                                {[
                                    {
                                        title: 'Catálogo Digital Profesional',
                                        desc: 'Tus clientes ven fotos, precios y descripciones. Llenan el carrito y te envían el pedido listo por WhatsApp.'
                                    },
                                    {
                                        title: 'Control de Inventario Real',
                                        desc: 'El sistema descuenta el stock automáticamente. Si se acaba, avisa. ¡Cero confusiones y cero devoluciones!'
                                    },
                                    {
                                        title: 'Velocidad Extrema (Next.js)',
                                        desc: 'Usamos la misma tecnología que Netflix. Tu tienda carga en milisegundos. Google ama esto y tus clientes más.'
                                    },
                                    {
                                        title: 'Facturación Flexible (SRI)',
                                        desc: '¿No facturas aún? Úsalo solo para ventas. ¿Ya facturas? Sube tu firma y emite facturas SRI automáticamente.'
                                    }
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-black group-hover:bg-puka-black group-hover:text-white transition-all duration-300">
                                            0{i + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl mb-2 text-puka-black group-hover:translate-x-1 transition-transform">{feature.title}</h3>
                                            <p className="text-gray-600 leading-relaxed max-w-lg">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="bg-puka-black rounded-[3rem] p-4 lg:p-8 relative transform rotate-1 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                                {/* Dashboard Mockup Layer */}
                                <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-inner min-h-[500px] overflow-hidden relative">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-puka-red"></div>
                                            <div className="w-3 h-3 rounded-full bg-puka-beige"></div>
                                            <div className="w-3 h-3 rounded-full bg-puka-black"></div>
                                        </div>
                                        <div className="h-2 bg-gray-100 w-32 rounded-full"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="h-32 bg-puka-beige/20 rounded-2xl flex flex-col p-4 border border-puka-beige/30">
                                            <span className="text-[10px] font-bold text-gray-400 mb-1 tracking-widest uppercase">Ventas Hoy</span>
                                            <span className="text-2xl font-black text-puka-black">$1,240</span>
                                        </div>
                                        <div className="h-32 bg-puka-red/5 rounded-2xl flex flex-col p-4 border border-puka-red/10">
                                            <span className="text-[10px] font-bold text-gray-400 mb-1 tracking-widest uppercase">Stock Bajo</span>
                                            <span className="text-2xl font-black text-puka-red">3 ITEMS</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-10 bg-gray-50 rounded-lg flex items-center px-4 justify-between group/item hover:bg-puka-beige/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <img src="/trending-sneaker.png" alt="Thumb" className="w-7 h-7 rounded object-cover shadow-sm bg-white" />
                                                <div className="h-1.5 bg-gray-200 w-24 rounded-full"></div>
                                            </div>
                                            <div className="h-4 bg-puka-red rounded w-16"></div>
                                        </div>
                                        <div className="h-10 bg-gray-50 rounded-lg flex items-center px-4 justify-between group/item hover:bg-puka-beige/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <img src="/puka-watch.png" alt="Thumb" className="w-7 h-7 rounded object-cover shadow-sm bg-white" />
                                                <div className="h-1.5 bg-gray-200 w-32 rounded-full"></div>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                                        </div>
                                        <div className="h-10 bg-gray-50 rounded-lg flex items-center px-4 justify-between group/item hover:bg-puka-beige/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <img src="/puka-headphones.png" alt="Thumb" className="w-7 h-7 rounded object-cover shadow-sm bg-white" />
                                                <div className="h-1.5 bg-gray-200 w-20 rounded-full"></div>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    </div>
                                    {/* Floating notification */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 bg-white shadow-2xl rounded-2xl border border-gray-100 flex items-center p-4 gap-4 animate-bounce">
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                                            <WhatsAppIcon size={24} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black">NUEVO PEDIDO</span>
                                            <span className="text-[10px] text-gray-400 italic">"Hola, quiero el stock #42..."</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-puka-red/20 blur-[100px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. OFERTA IRRESISTIBLE (Tabla de Precios) */}
            <section id="precios" className="py-24 bg-white relative">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-black text-4xl md:text-6xl mb-6 text-puka-black underline decoration-puka-red decoration-4 transition-all">
                            Invierte una vez, véndelo todo.
                        </h2>
                        <p className="text-gray-500 text-xl font-medium">Transparencia total. Sin letras pequeñas ni comisiones ocultas.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch max-w-5xl mx-auto">
                        {/* Plan A: Emprendedor */}
                        <div className="bg-white border-2 border-gray-100 p-10 lg:p-14 rounded-[2rem] flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="mb-10 text-center lg:text-left">
                                <span className="inline-block py-1 px-4 bg-gray-100 text-gray-500 font-black text-[10px] tracking-widest uppercase mb-4 rounded-full">PLAN EMPRENDEDOR</span>
                                <h3 className="font-bold text-3xl text-puka-black group-hover:text-puka-red transition-colors">Organízate</h3>
                                <div className="mt-8 flex items-baseline justify-center lg:justify-start">
                                    <span className="text-6xl font-black text-puka-black">$200</span>
                                    <span className="ml-2 text-gray-400 font-bold text-xl">USD</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-4 uppercase font-black tracking-widest">Pago Único - No hay rentas</p>
                                <p className="text-[10px] text-gray-400 mt-1 italic leading-tight">Mantenimiento desde 2º año: $80/año (Opcional)</p>
                            </div>

                            <div className="space-y-5 mb-12 flex-1">
                                {[
                                    { text: 'Tienda Online + Carrito', active: true },
                                    { text: 'Sistema de Inventario', active: true },
                                    { text: 'Pedidos a WhatsApp', active: true },
                                    { text: 'Módulo SRI (Opcional)', active: true },
                                    { text: 'Hosting + Dominio (1 año)', active: true },
                                    { text: 'Carga en Google Ads', active: false },
                                    { text: 'Configuración Campaña PRO', active: false }
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-4 ${item.active ? 'text-gray-700' : 'text-gray-300'}`}>
                                        {item.active ? (
                                            <CheckCircle className="text-puka-red shrink-0" size={20} />
                                        ) : (
                                            <XCircle className="text-gray-200 shrink-0" size={20} />
                                        )}
                                        <span className="font-bold text-sm tracking-tight">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl mb-10 text-[11px] font-bold text-gray-500 text-center uppercase tracking-widest">
                                Ideal para: Quien ya tiene clientes y quiere orden.
                            </div>

                            <button
                                onClick={() => handleWhatsAppClick('plan_emprendedor', 'Hola Puka, me interesa el Plan Emprendedor de $200. ¿Cómo empezamos?')}
                                className="w-full bg-puka-black text-white py-5 rounded-2xl font-black text-lg hover:bg-puka-red transition-all transform group-hover:scale-[1.02] active:scale-95 shadow-xl"
                            >
                                ELEGIR ESTE PLAN
                            </button>
                        </div>

                        {/* Plan B: Despegue (PRINCIPAL) */}
                        <div className="bg-white border-4 border-puka-red p-10 lg:p-14 rounded-[2.5rem] flex flex-col shadow-2xl relative transform lg:scale-110 z-10 transition-all hover:translate-y-[-5px]">
                            <div className="absolute top-0 right-10 translate-y-[-50%] bg-puka-red text-white py-2 px-6 text-xs font-black tracking-widest uppercase rounded-full shadow-2xl">
                                MÁS VENDIDO ⭐
                            </div>

                            <div className="mb-10 text-center lg:text-left">
                                <span className="inline-flex items-center gap-2 py-1 px-4 bg-puka-red text-white font-black text-[10px] tracking-widest uppercase mb-4 rounded-full shadow-lg shadow-puka-red/20">
                                    <Rocket size={14} /> PLAN DESPEGUE
                                </span>
                                <h3 className="font-bold text-3xl text-puka-black">Vende YA</h3>
                                <div className="mt-8 flex items-baseline justify-center lg:justify-start">
                                    <span className="text-7xl font-black text-puka-black">$300</span>
                                    <span className="ml-2 text-puka-red font-black text-2xl animate-pulse italic">USD</span>
                                </div>
                                <p className="text-xs text-puka-red mt-4 uppercase font-black tracking-widest">Inversión Inteligente - Tu activo digital</p>
                            </div>

                            <div className="space-y-5 mb-12 flex-1">
                                {[
                                    { text: 'Tienda Online + Carrito', active: true, strong: true },
                                    { text: 'Sistema de Inventario', active: true, strong: true },
                                    { text: 'Pedidos a WhatsApp', active: true, strong: true },
                                    { text: 'Módulo SRI (Opcional)', active: true },
                                    { text: 'Hosting + Dominio (1 año)', active: true },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-puka-black">
                                        <CheckCircle className="text-[#25D366] shrink-0" size={24} />
                                        <span className={`text-sm tracking-tight ${item.strong ? 'font-black uppercase' : 'font-bold'}`}>{item.text}</span>
                                    </div>
                                ))}

                                <div className="p-6 bg-puka-red/5 rounded-3xl border-2 border-puka-red/20 border-dashed relative overflow-hidden group/bonus">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-puka-red/10 -mr-12 -mt-12 rounded-full blur-2xl"></div>
                                    <div className="flex flex-col gap-3 relative z-10 text-center lg:text-left">
                                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                                            <div className="w-10 h-10 bg-puka-red rounded-full flex items-center justify-center text-white shadow-lg">
                                                <TrendingUp size={20} />
                                            </div>
                                            <span className="font-black text-puka-black text-base">$100 EN ADS INCLUIDOS</span>
                                        </div>
                                        <p className="text-[10px] text-puka-red/80 font-black uppercase tracking-widest pl-0 lg:pl-12">
                                            Cargamos saldo real para tu primer mes en Google.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-puka-black py-2">
                                    <CheckCircle className="text-[#25D366] shrink-0" size={24} />
                                    <span className="text-sm font-black uppercase">
                                        Configuración Campaña PRO <span className="line-through text-gray-400">($150)</span> <span className="text-green-600">GRATIS</span>
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-puka-beige/30 rounded-2xl mb-12 text-[11px] font-black text-puka-black text-center uppercase tracking-widest ring-1 ring-puka-beige">
                                Renovación técnica desde 2º año: $80 (Hosting + Dominio)
                            </div>

                            <button
                                onClick={() => handleWhatsAppClick('plan_despegue', 'Hola Puka, quiero el Plan Despegue de $300 con el bono de Google Ads. \u00A1Vamos con todo! \uD83D\uDE80')}
                                className="w-full bg-puka-red text-white py-6 rounded-2xl font-black text-2xl hover:bg-puka-black transition-all shadow-2xl shadow-puka-red/40 transform hover:scale-[1.04] active:scale-95 flex items-center justify-center gap-3"
                            >
                                QUIERO VENDER MÁS 🚀
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. DETALLES TÉCNICOS (Autoridad) */}
            <section className="py-24 bg-puka-black relative overflow-hidden">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="mb-20">
                        <h3 className="font-display font-bold text-3xl md:text-5xl mb-6 text-white leading-tight">
                            Eslabones de una <span className="text-puka-red">Tecnología de Élite</span>
                        </h3>
                        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            No construimos sitios baratos. Creamos activos digitales de alto rendimiento utilizando los mismos estándares que las grandes startups de Silicon Valley.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
                        {[
                            {
                                icon: <ShieldCheck size={32} />,
                                title: 'SSL Certificado',
                                desc: 'Tu sitio es 100% seguro. Los datos de tus clientes están protegidos y Google premiará tu seguridad en los resultados de búsqueda.'
                            },
                            {
                                icon: <Zap size={32} />,
                                title: 'Hospedaje de Vanguardia',
                                desc: 'Servidores rápidos que garantizan que tu tienda esté "siempre viva". Olvida el hosting económico que se cae en plena oferta.'
                            },
                            {
                                icon: <Smartphone size={32} />,
                                title: 'Diseño Mobile-First',
                                desc: 'Tus clientes compran desde el sofá, el bus o la oficina. Tu tienda se verá perfecta y fluida en cualquier dispositivo móvil.'
                            }
                        ].map((detail, idx) => (
                            <div key={idx} className="group p-8 border-l border-white/10 hover:border-puka-red transition-all">
                                <div className="mb-8 p-4 bg-white/5 rounded-2xl inline-block text-puka-red group-hover:scale-110 group-hover:bg-puka-red group-hover:text-white transition-all">
                                    {detail.icon}
                                </div>
                                <h4 className="font-bold text-2xl text-white mb-4 tracking-tight uppercase tracking-widest">{detail.title}</h4>
                                <p className="text-gray-400 leading-relaxed font-medium">
                                    {detail.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 p-10 lg:p-14 border border-white/10 rounded-[3rem] bg-gradient-to-r from-puka-red/10 to-transparent backdrop-blur-md max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="text-left space-y-4">
                            <h5 className="text-puka-red font-black text-xl uppercase tracking-tighter">MANTENIMIENTO ANUAL ECONÓMICO</h5>
                            <p className="text-white text-3xl md:text-4xl font-black">
                                El primer año es <span className="underline decoration-puka-red decoration-6 underline-offset-4">GRATIS</span>.
                            </p>
                            <p className="text-gray-400 font-bold">
                                Después de 12 meses, solo <span className="text-white">$80/año</span> para mantener todo en línea. <br />
                                (Menos de lo que cuesta una salida a comer al mes).
                            </p>
                        </div>
                        <div className="w-px h-24 bg-white/10 hidden md:block"></div>
                        <div className="flex flex-col items-center">
                            <Rocket className="text-white mb-4 animate-bounce" size={48} />
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Listo para crecer</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ (Romper Objeciones) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="text-puka-red font-black text-xs uppercase tracking-widest bg-puka-red/5 px-4 py-2 rounded-full border border-puka-red/10 mb-6 inline-block">¿Aún con dudas?</span>
                        <h2 className="font-display font-black text-4xl md:text-5xl text-puka-black">Hablemos Claro</h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                q: '¿Tengo que pagar mensualidades?',
                                a: 'En resumen: No. El pago de $200 o $300 es un pago único por el desarrollo e implementación. A partir del SEGUNDO año, pagas $80/año por el mantenimiento del servidor (hosting) y dominio. Eso es todo. Sin sorpresas.'
                            },
                            {
                                q: '¿Necesito tener RUC o firma electrónica?',
                                a: 'Para empezar a vender, NO. El sistema funciona perfectamente para organizar envíos y ventas manuales. Si en el futuro formalizas tu negocio y quieres facturar electrónicamente, el sistema ya incluye el módulo SRI listo para activarse.'
                            },
                            {
                                q: '¿Cómo cobro a mis clientes?',
                                a: 'A diferencia de Shopify o Amazon, nosotros NO cobramos comisión por tus ventas. El pedido llega a tu WhatsApp y tú cobras vía Transferencia, Efectivo, DeUna o como prefieras. El control de tu dinero es 100% tuyo.'
                            },
                            {
                                q: '¿Siempre incluyen la campaña de publicidad gratis?',
                                a: 'No. La configuración profesional de campaña y el bono de $100 son un beneficio exclusivo de lanzamiento para nuestros primeros 5 clientes. Normalmente, este servicio de configuración tiene un costo adicional de $150. Aprovecha la promoción actual antes de que termine.'
                            }
                        ].map((item, i) => (
                            <details key={i} className="group bg-gray-50 p-8 rounded-3xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-xl hover:border-puka-red/10 transition-all duration-300">
                                <summary className="font-black text-lg md:text-xl list-none flex justify-between items-center group-open:text-puka-red transition-all">
                                    {item.q}
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-open:rotate-45 transition-transform text-puka-red border border-gray-100">
                                        <Plus size={20} />
                                    </div>
                                </summary>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                        {item.a}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FOOTER (Cierre con urgencia) */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-puka-black rounded-[3rem] p-12 lg:p-24 shadow-2xl relative overflow-hidden text-center group">
                        {/* Background Accents */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-puka-red/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-puka-beige/10 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="font-display font-black text-4xl md:text-7xl mb-10 text-white leading-[1.1]">
                                ¿Listo para tomar el <br />
                                <span className="text-puka-red">control absoluto?</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-12 font-medium">
                                Empieza hoy tu camino a la independencia digital. Sin agencias estorbando, sin rentas eternas. Solo tú y tus ventas.
                            </p>

                            <button
                                onClick={() => handleWhatsAppClick('final_cta', 'Hola, estoy listo para tomar el control de mi negocio. Necesito asesoría final.')}
                                className="inline-flex items-center gap-5 bg-white text-puka-black px-12 py-6 rounded-2xl font-black text-xl md:text-3xl hover:bg-puka-red hover:text-white transition-all shadow-2xl transform hover:scale-[1.05] active:scale-95 group-hover:shadow-puka-red/20"
                            >
                                <WhatsAppIcon size={36} />
                                HABLAR CON UN ASESOR
                            </button>

                            <div className="mt-12 flex flex-col items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`w-12 h-12 rounded-full border-4 border-puka-black bg-puka-beige overflow-hidden flex items-center justify-center text-[10px] font-black`}>
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-black text-puka-red uppercase tracking-widest">Cupos Limitados de Implementación Mensual</p>
                            </div>

                            <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <a href={`/${lang}/legal/politica-de-privacidad`} className="hover:text-white transition-colors">Política de Privacidad</a>
                                <span>•</span>
                                <a href={`/${lang}/legal/terminos`} className="hover:text-white transition-colors">Términos y Condiciones</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Styles for Animation */}
            <style jsx>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px) rotate(1deg); }
          50% { transform: translateY(-25px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(1deg); }
        }
        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default SistemaEmprendedorPage;
