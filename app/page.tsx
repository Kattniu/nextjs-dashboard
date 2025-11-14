// Importamos el componente del logo de la empresa ficticia "Acme"
import AcmeLogo from '@/app/ui/acme-logo';

// Importamos un archivo CSS con estilos especiales (formas, fondos, etc.)
import styles from '@/app/ui/home.module.css';

// Importamos un ícono (una flecha) desde la librería "heroicons"
// Los íconos se usan como componentes React
import { ArrowRightIcon } from '@heroicons/react/24/outline';

// Importamos "Link" de Next.js para crear enlaces internos entre páginas
// (en lugar de usar <a href="">), lo que permite navegación sin recargar la página
import Link from 'next/link';

// Importamos la fuente "Lusitana" que configuramos en fonts.ts
// La usaremos en el texto principal
import { lusitana } from '@/app/ui/fonts';

// Importamos el componente especial de Next.js para imágenes optimizadas
import Image from 'next/image';

// Definimos el componente principal de la página
// En Next.js, las páginas dentro de /app son componentes React
export default function Page() {
  // Todo lo que se devuelve dentro del "return" es lo que se renderiza (muestra en pantalla)
  return (
    // <main> es la etiqueta HTML principal del contenido de la página
    // Aquí usamos clases de Tailwind CSS para diseño y espaciado
    <main className="flex min-h-screen flex-col p-6">

      {/* ENCABEZADO AZUL */}
      {/* Este div crea una barra superior con fondo azul y contiene el logo */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        {/* Mostramos el logo de la empresa Acme */}
        <AcmeLogo />
      </div>

      {/* SECCIÓN PRINCIPAL */}
      {/* Esta sección contiene dos partes:
          - A la izquierda: texto + botón
          - A la derecha: las imágenes hero */}
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">

        {/* COLUMNA IZQUIERDA (texto y botón) */}
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          
          {/* Este div usa un estilo especial definido en home.module.css */}
          <div className={styles.shape}></div>

          {/* TEXTO PRINCIPAL */}
          {/* Aplicamos la fuente Lusitana para que el texto tenga un estilo diferente */}
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            {/* <strong> pone el texto en negrita */}
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            {/* Enlace hacia el curso oficial de Next.js */}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>

          {/* BOTÓN DE LOGIN */}
          {/* Este enlace lleva al usuario a la página de login */}
          {/* Tiene estilos de botón: color azul, esquinas redondeadas y un ícono */}
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            {/* Texto del botón */}
            <span>Log in</span>

            {/* Ícono de flecha (usando Heroicons) */}
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>

        {/* COLUMNA DERECHA (imágenes hero) */}
        {/* Este contenedor mostrará diferentes imágenes según el tamaño de pantalla */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          
          {/* IMAGEN PARA ESCRITORIO */}
          {/* Solo se muestra en pantallas medianas (md) o más grandes */}
          <Image
            src="/hero-desktop.png" // ruta del archivo de imagen (en la carpeta /public)
            width={1000} // ancho real de la imagen
            height={760} // alto real de la imagen
            className="hidden md:block" // oculta en móviles, muestra en escritorio
            alt="Captura de la versión de escritorio del dashboard"
          />

          {/* IMAGEN PARA MÓVIL */}
          {/* Solo se muestra en pantallas pequeñas */}
          <Image
            src="/hero-mobile.png" // ruta del archivo de imagen (en la carpeta /public)
            width={560} // ancho real de la imagen
            height={620} // alto real de la imagen
            className="block md:hidden" // muestra en móvil, oculta en escritorio
            alt="Captura de la versión móvil del dashboard"
          />
        </div>
      </div>
    </main>
  );
}
