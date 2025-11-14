// /app/layout.tsx
// Este archivo es OBLIGATORIO en toda ap de Next.js, es como el "esqueleto de tu aplicacion"
import '@/app/ui/global.css';
// Importo mis estilos globales (tailwind + css personalizado)

import { inter } from '@/app/ui/fonts';
/* Importo la fuente Inter desde fonts.ts 
que comnfugure en el cap 3 se guardo emn /app/ui/fonts.ts
En ese archivo decías:
import { Inter } from 'next/font/google';
export const inter = Inter({ subsets: ['latin'] });
Eso significa que estás descargando la fuente Inter desde Google Fonts,
y Next.js la optimiza para que cargue rápido.
*/

export default function RootLayout({ 
  children,
}: { 
  children: React.ReactNode
 }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/*Aqui estamos aplicando la fuente inter a toda la pagina
        entonces todas las paginas del sitio usan la misma fuente*/}

        {children}
        {/*Aqui se mostrara todo el contenido de la app*/}
      </body>
    </html>
  );
}
//Que significa app/layout.tsx?
/*Es el archivo principal que envuelve toda la aplicacion de Next.js*/
/*Define la estructura basica de la app (html, body)*/
/*Aplica estilos globales y fuentes a toda la app
Este archivo (root layout) afecta a toda la app*/

/*app/dashboard/layout.tsx solo afecta a las paginas dentro de la carpeta /dashboard*/

/*esto aplica mis estilos globales (tailwind + css )a toda la aplicacion  */
/*antialiased suaviza las letras (detalle estetico)*/ 