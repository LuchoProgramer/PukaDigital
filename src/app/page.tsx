import Image from 'next/image';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-puka-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-puka-red blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-puka-orange blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        
        {/* Logo */}
        <div className="mb-16 animate-fade-in">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl overflow-hidden p-4 animate-glow">
            <Image 
              src="/logo.svg" 
              alt="PukaDigital Logo" 
              width={160}
              height={160}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="font-poppins font-bold text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight mb-6">
            <span className="gradient-text text-shadow-glow">
              ALGO DISRUPTIVO
            </span>
            <br />
            <span className="text-puka-white">
              ESTÁ POR LLEGAR
            </span>
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-puka-red to-puka-orange mx-auto rounded-full mb-8"></div>
          
          <p className="text-puka-gray text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto font-inter font-medium leading-relaxed">
            Transformamos negocios con <span className="text-puka-red font-semibold">marketing</span>, 
            <span className="text-puka-orange font-semibold"> IA</span> y 
            <span className="text-puka-red font-semibold"> software</span> para un crecimiento imparable.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="text-center mb-12 animate-slide-up max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            
            {/* Autenticidad */}
            <div className="bg-puka-gray bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-puka-gray border-opacity-20 hover:border-puka-red hover:border-opacity-50 transition-all duration-300">
              <div className="w-12 h-12 bg-puka-red rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">✨</span>
              </div>
              <h3 className="font-poppins font-bold text-xl text-puka-white mb-3">Autenticidad</h3>
              <p className="text-puka-gray text-sm leading-relaxed">
                Estrategias genuinas que reflejan tu esencia.
              </p>
            </div>

            {/* Innovación */}
            <div className="bg-puka-gray bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-puka-gray border-opacity-20 hover:border-puka-orange hover:border-opacity-50 transition-all duration-300">
              <div className="w-12 h-12 bg-puka-orange rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">🚀</span>
              </div>
              <h3 className="font-poppins font-bold text-xl text-puka-white mb-3">Innovación</h3>
              <p className="text-puka-gray text-sm leading-relaxed">
                Rompemos barreras con tecnología de vanguardia.
              </p>
            </div>

            {/* Éxito Compartido */}
            <div className="bg-puka-gray bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-puka-gray border-opacity-20 hover:border-puka-red hover:border-opacity-50 transition-all duration-300">
              <div className="w-12 h-12 bg-puka-red rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">🤝</span>
              </div>
              <h3 className="font-poppins font-bold text-xl text-puka-white mb-3">Éxito Compartido</h3>
              <p className="text-puka-gray text-sm leading-relaxed">
                Tu triunfo es nuestro compromiso.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-puka-red to-puka-orange px-8 py-4 rounded-full text-white font-poppins font-bold text-lg animate-pulse-slow">
            <span>PRÓXIMAMENTE</span>
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
          
          <p className="text-puka-gray text-sm mt-6">
            Innovación sin límites, impulsando el crecimiento de negocios en la región.
          </p>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-puka-gray text-xs text-center">
            © 2024 PukaDigital. Preparando algo revolucionario.
          </p>
        </div>
      </div>
    </div>
  );
}