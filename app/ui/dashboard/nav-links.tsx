'use client';
/*
Qué hace: Indica que este archivo es un Client Component, es decir, que se ejecuta en el navegador (cliente), no en el servidor.
Por qué: Vamos a usar usePathname() (un hook que solo funciona en el cliente) y necesitamos que el componente pueda ejecutar código en el navegador.
Nota: Si quitas esta línea, Next.js tratará el archivo como Server Component y usePathname() dará error.
*/

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
/*Que hace? Importa tres iconos desde la libreria @heroicons/react*/



import Link from 'next/link'; //importa el componente Link de next.js para crear enlaces internos
import { usePathname } from 'next/navigation'; // Importa el hook usePathname() que devuelve la ruta actual (por ejem: /dasboard/invoices)
import clsx from 'clsx'; //Importa una pequena libreria para manejar clases CSS condicionales en React
/*Ejemplo simple:clsx('a','b', { 'c': true }) → 'a b c'. */


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];
/*Que hace? Declara un array llamado links con elementos que pareceran en la barra lateral */



export default function NavLinks() {
  const pathname = usePathname(); // <-- saber en qué página estamos
  /*Llama al Hook usePathname() y guarda la ruta actual en la variable pathname 
  ejemplo de valor: /dashboard/invoices*/

  return (
    <>
    {/*<> ..</> Es un fragmento que permite devolver varios elementos sin anadir un div extra */}
      {links.map((link) => { 
        const LinkIcon = link.icon;
        {/* Recorre el array links con .map() y para cada link crea un enlace 
          const LinkIcon = link.icon; toma el componente del icono y lo guarda en una variable para usarlo como <LinkIcon /
          
          map : es el patron esytandar para renderizar lista en REACT*/}


        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href, // <-- marcar link activo | Si el pathname actual es igual al href del link se aplican clases azules,
              }//Osea te dice exactamente en que URL estas 
            )}>
              {/*Devuelve un componente <Link> para cada link
              
            Detalle clsx:
            Primer argumento: cadena con clases que siempre aplican (diseño, paddings, hover).
            Segundo argumento: objeto con { 'clase-activa': condición }.
            Si pathname === link.href → se añaden las clases "bg-sky-100 text-blue-600", que hacen que el link se vea activo (fondo claro y texto azul).
            Por qué key: React usa key para identificar cada elemento de la lista y así actualizar solo lo necesario.
            Por qué comparar pathname === link.href: para saber si el link apunta a la ruta actual y resaltarlo.
              
              
              */}

            <LinkIcon className="w-6" /> 
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
 

/*
Qué es client-side navigation? (explicación definitiva)
Imagina que tu aplicación es una casa.
Moverte entre habitaciones sin salir de la casa = client-side navigation.
- La app sigue abierta
- Solo cambia el contenido dentro de ella
- No se recarga todo
El navegador NO hace una petición completa al servidor.
Esto es lo que hace <Link>.
*/

/*
¿Qué es clsx? (explicación más fácil)
Imagina que tienes dos estilos:
-Estilo normal
-Estilo cuando está activo
clsx te deja hacer esto:
-Pon estos estilos siempre
Y estos estilos solo cuando una condición sea verdadera
Ejemplo:
clsx(
  "clases normales",
  {
    "clases activas": pathname === link.href
  }
)
Te permite decir:
“Si estoy en esta página, pinta el link azul”.
*/