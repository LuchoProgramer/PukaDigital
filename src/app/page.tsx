import Image from 'next/image'
import { Linkedin, Instagram, Twitter, Facebook } from 'lucide-react'

export default function Home() {
  return (
    <main className="bg-puka-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <Image
              src="/logo-pegaso.svg"
              alt="PukaDigital"
              width={120}
              height={120}
              className="apple-transition hover:scale-105"
              priority
            />
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-puka-black mb-6">
            Algo increíble
            <br />
            <span className="text-gradient">viene pronto</span>
          </h1>
          <p className="text-xl md:text-2xl text-puka-gray-medium max-w-2xl mx-auto leading-relaxed">
            Estamos creando experiencias digitales que transformarán la manera 
            en que tu marca conecta con el mundo.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-8 bg-puka-gray-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-puka-black mb-6">
              Nuestra filosofía
            </h2>
            <p className="text-xl text-puka-gray-medium max-w-3xl mx-auto">
              Creemos en el poder de la simplificación, la elegancia del diseño 
              y la fuerza de las ideas bien ejecutadas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="bg-puka-white p-8 rounded-3xl apple-shadow apple-transition apple-hover">
              <div className="w-16 h-16 bg-puka-red-soft rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-puka-red rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-puka-black mb-4">Misión</h3>
              <p className="text-puka-gray-medium leading-relaxed">
                Transformamos ideas en experiencias digitales excepcionales que 
                impulsan el crecimiento de nuestros clientes.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-puka-white p-8 rounded-3xl apple-shadow apple-transition apple-hover">
              <div className="w-16 h-16 bg-puka-red-soft rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-puka-red rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-puka-black mb-4">Visión</h3>
              <p className="text-puka-gray-medium leading-relaxed">
                Ser la agencia de referencia en transformación digital, 
                reconocida por crear soluciones que inspiran.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-puka-white p-8 rounded-3xl apple-shadow apple-transition apple-hover">
              <div className="w-16 h-16 bg-puka-red-soft rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-puka-red rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-puka-black mb-4">Valores</h3>
              <p className="text-puka-gray-medium leading-relaxed">
                Excelencia en cada detalle, colaboración genuina, innovación 
                constante y compromiso inquebrantable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-8 bg-puka-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-puka-black mb-8">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-puka-gray-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Mientras preparamos nuestro lanzamiento oficial, estamos aquí para 
            escuchar tu proyecto y explorar cómo podemos ayudarte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="apple-button apple-button-primary">
              Hablemos
            </button>
            <button className="apple-button apple-button-secondary">
              Ver portafolio
            </button>
          </div>
          
          {/* Redes Sociales */}
          <div className="flex justify-center space-x-4">
            <a href="#" className="social-button" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="social-button" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="social-button" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-button" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 bg-puka-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo-pegaso.svg"
                alt="PukaDigital"
                width={40}
                height={40}
                className="apple-transition hover:scale-105"
              />
              <span className="text-2xl font-bold text-puka-black">PukaDigital</span>
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