import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <Image
              src="/pegaso-rojo.svg"
              alt="PukaDigital"
              width={120}
              height={120}
              className="apple-transition hover:scale-105"
              priority
            />
          </div>

          {/* Título Principal */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black">
              Algo increíble
              <br />
              <span className="text-gradient">viene pronto</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-puka-gray-medium max-w-2xl mx-auto leading-relaxed">
              Estamos creando experiencias digitales que transformarán la manera 
              en que tu marca conecta con el mundo.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button className="bg-puka-red text-white px-12 py-4 rounded-full text-lg font-medium apple-transition apple-hover apple-shadow">
              Saber más
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-16 bg-puka-gray-light"></div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6 bg-puka-gray-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Nuestra filosofía
            </h2>
            <p className="text-xl text-puka-gray-medium max-w-3xl mx-auto">
              Creemos en el poder de la simplificación, la elegancia del diseño 
              y la fuerza de las ideas bien ejecutadas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="bg-white p-8 rounded-3xl apple-shadow apple-transition apple-hover">
              <div className="w-16 h-16 bg-puka-red-soft rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-puka-red rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Misión</h3>
              <p className="text-puka-gray-medium leading-relaxed">
                Transformamos ideas en experiencias digitales excepcionales que 
                impulsan el crecimiento de nuestros clientes a través de la 
                innovación y el diseño centrado en el usuario.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white p-8 rounded-3xl apple-shadow apple-transition apple-hover">
              <div className="w-16 h-16 bg-puka-red-soft rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-puka-red rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Visión</h3>
              <p className="text-puka-gray-medium leading-relaxed">
                Ser la agencia de referencia en transformación digital, 
                reconocida por crear soluciones que no solo resuelven problemas, 
                sino que inspiran y generan valor real.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white p-8 rounded-3xl apple-shadow apple-transition apple-hover">
              <div className="w-16 h-16 bg-puka-red-soft rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-puka-red rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Valores</h3>
              <p className="text-puka-gray-medium leading-relaxed">
                Excelencia en cada detalle, colaboración genuina, innovación 
                constante y compromiso inquebrantable con el éxito de 
                nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-puka-gray-medium mb-12 max-w-2xl mx-auto">
            Mientras preparamos nuestro lanzamiento oficial, estamos aquí para 
            escuchar tu proyecto y explorar cómo podemos ayudarte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-puka-red text-white px-8 py-4 rounded-full text-lg font-medium apple-transition apple-hover">
              Hablemos
            </button>
            <button className="bg-white text-puka-red border-2 border-puka-red px-8 py-4 rounded-full text-lg font-medium apple-transition hover:bg-puka-red hover:text-white">
              Ver portafolio
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-puka-gray-light border-t apple-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Image
                src="/pegaso-rojo.svg"
                alt="PukaDigital"
                width={40}
                height={40}
              />
              <span className="text-2xl font-bold text-black">PukaDigital</span>
            </div>
            
            <div className="text-puka-gray-medium text-center md:text-right">
              <p>© 2024 PukaDigital. Algo increíble viene pronto.</p>
              <p className="text-sm mt-2">Diseñado y desarrollado con ❤️</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}