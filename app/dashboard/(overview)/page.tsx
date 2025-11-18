import { Suspense } from 'react';
import { lusitana } from '@/app/ui/fonts';
import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { CardsSkeleton, RevenueChartSkeleton, LatestInvoicesSkeleton } from '@/app/ui/skeletons';

/*
  Este es el archivo principal de la página del dashboard.
  Contiene la estructura de la página: título, cards, gráfico y últimas facturas.
  Cada sección que necesita datos asíncronos está envuelta en <Suspense> para mostrar un skeleton mientras carga.
*/

export default async function Page() {
  return (
    <main className="p-6">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>

      {/* Cards agrupados en Suspense */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      {/* RevenueChart y LatestInvoices con Suspense */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
