import Pagination from '@/app/ui/invoices/pagination';
// Componente que muestra los botones de páginas (<< < 1 2 3 > >>)

import Search from '@/app/ui/search';
// Nuestro componente de búsqueda (el que comentamos arriba)

import Table from '@/app/ui/invoices/table';
// Muestra la tabla de facturas (depende de la búsqueda y página)

import { CreateInvoice } from '@/app/ui/invoices/buttons';
// Botón para crear una factura nueva

import { lusitana } from '@/app/ui/fonts';
// Fuente personalizada

import { Suspense } from 'react';
// Suspense permite mostrar un cargando mientras llega la data del servidor

import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
// Diseño que se muestra como "loading skeleton" mientras carga la tabla

import { fetchInvoicesPages } from '@/app/lib/data';
// Función que obtiene cuántas páginas existen según la búsqueda actual

// ---------------------------------------------

export default async function Page(props: {searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
// Esta página recibe los parámetros de búsqueda directamente del servidor.

  const searchParams = await props.searchParams;
  // Esperamos los parámetros de la URL:
  // - query=palabraBuscada
  // - page=numeroDePagina

  const query = searchParams?.query || '';
  // Si existe ?query=, usamos eso. Sino, dejamos cadena vacía.

  const currentPage = Number(searchParams?.page) || 1;
  // Si existe ?page=, lo convertimos a número.

  const totalPages = await fetchInvoicesPages(query);
  // Calcula cuántas páginas hay según lo buscado

// ---------------------------------------------

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Facturas</h1>
        {/* Título principal */}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar facturas..." />
        {/* Barra de búsqueda */}
        
        <CreateInvoice />
        {/* Botón: Crear factura */}
      </div>

      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        {/* Suspense recarga la tabla cuando cambie la búsqueda o la página */}

        <Table query={query} currentPage={currentPage} />
        {/* Llama a la tabla y le envía:
            - qué palabra estás buscando
            - en qué página estás
        */}
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
        {/* Muestra los botones de paginación según cuántas páginas existen */}
      </div>
    </div>
  );
}
