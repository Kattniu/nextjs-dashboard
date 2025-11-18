import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

/*
  Este archivo contiene los componentes de las "Cards" del dashboard.
  Cada Card muestra información resumida (total de facturas, clientes, pendientes, etc.)
  Se usa un icono diferente para cada tipo de Card.
  
  CardWrapper: componente que obtiene los datos de todas las cards desde fetchCardData()
               y renderiza cada Card.
  Card: componente individual que recibe props (title, value, type) y muestra la UI.
  
  Se hace async porque fetchCardData() es una función asíncrona que trae los datos del servidor.
  Esto permite que cada componente se pueda cargar con Suspense y mostrar un skeleton mientras carga.
*/

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  // Traemos los datos de las cards del backend
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      {/* Renderizamos cada Card con su título, valor y tipo */}
      <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card title="Total Customers" value={numberOfCustomers} type="customers"/> 
    </>
  );
}

// Componente individual de cada Card
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type]; // Obtenemos el icono correspondiente al tipo

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}>
        {value}
      </p>
    </div>
  );
}
