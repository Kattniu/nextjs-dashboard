'use client'; 
// Esto indica que este archivo es un "Client Component".
// Es decir: se ejecuta en el navegador (no en el servidor).

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// Importa el ícono de lupa.

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// Hooks especiales de Next.js para manejar:
// - los parámetros de la URL (useSearchParams)
// - la ruta actual (usePathname)
// - cambiar la URL sin recargar la página (useRouter)

import { useDebouncedCallback } from 'use-debounce';
// Importa la función que aplica "debounce".
// Espera a que el usuario deje de escribir (300 ms) antes de ejecutar algo.

// ---------------------------------------------

export default function Search({ placeholder }: { placeholder: string }) {
// Componente Search: recibe un texto que aparecerá dentro del input.

  const searchParams = useSearchParams();
  // Lee los parámetros actuales de la URL (ejemplo: ?query=lee&page=1)

  const pathname = usePathname();
  // Obtiene la ruta actual, por ejemplo: "/dashboard/invoices"

  const { replace } = useRouter();
  // Sirve para cambiar la URL sin recargar la página.

// ---------------------------------------------
// Función principal de búsqueda con "debounce"
  const handleSearch = useDebouncedCallback((term: string) => {
  // Esta función se ejecuta solo cuando el usuario deja de escribir por 300 ms

    console.log(`Searching... ${term}`);
    // Muestra en consola lo que el usuario busca.

    const params = new URLSearchParams(searchParams);
    // Clona los parámetros actuales de la URL para poder modificarlos.

    if (term) {
      params.set('query', term);
      // Si hay texto -> agrega/actualiza el parámetro ?query=texto
    } else {
      params.delete('query');
      // Si el input queda vacío -> elimina ?query de la URL
    }

    replace(`${pathname}?${params.toString()}`);
    // Cambia la URL sin recargar la página.
    // Esto hace que se actualice la tabla de facturas automáticamente.

  }, 300); // <-- tiempo de debounce: 300 ms

// ---------------------------------------------

  return (
    <div className="relative flex flex-1 shrink-0">
    {/* Contenedor del input de búsqueda */}

      <label htmlFor="search" className="sr-only">
        Search
      </label>
      {/* Etiqueta accesible solo para lectores de pantalla */}

      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // Muestra el texto "Buscar facturas..."

        onChange={(e) => handleSearch(e.target.value)}
        // Cada vez que escribes, se ejecuta handleSearch con lo que escribiste.
        // Gracias al debounce, no se dispara el servidor en cada letra.

        defaultValue={searchParams.get('query')?.toString() ?? ''}
        // Si la URL ya tiene ?query=algo, esto rellena el input con ese valor.
      />

      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      {/* Ícono de lupa dentro del input */}
    </div>
  );
}
