import { Metadata } from 'next';
// Importo el tipo Metadata de Next.js para definir metadatos de la página


// ---------------------------------------------
// Defino los metadatos específicos de esta página
export const metadata: Metadata = {
  title: 'Customers',
  description: 'Customers page of the Acme Dashboard',
};

export default function Page() {
  return <p>Customers Page</p>;
}
