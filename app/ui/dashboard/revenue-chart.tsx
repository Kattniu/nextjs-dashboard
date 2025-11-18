import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
import { Revenue } from '@/app/lib/definitions';

/*
  RevenueChart.tsx

  Este componente representa el gráfico de ingresos recientes del dashboard.
  - Hace fetch de los datos de ingresos usando fetchRevenue() directamente dentro del componente.
    Esto permite usar React Suspense y mostrar un skeleton mientras los datos se cargan.
  - generateYAxis(): función que calcula las etiquetas del eje Y y el valor máximo del gráfico
    a partir de los datos de revenue.
  - CalendarIcon y lusitana: elementos visuales de la UI.
  
  El código del gráfico está comentado para que se active en capítulos futuros.
  Esto se hace para ir paso a paso en la construcción del dashboard.
  Los comentarios con "NOTE" y código comentado son recordatorios del tutorial.
*/

export default async function RevenueChart() {
  // Traemos los datos del backend
  const revenue: Revenue[] = await fetchRevenue();

  // Si no hay datos, mostramos un mensaje simple
  if (!revenue || revenue.length === 0) 
    return <p className="mt-4 text-gray-400">No data available.</p>;

  // Calculamos las etiquetas del eje Y y el valor máximo para el gráfico
  const { yAxisLabels, topLabel } = generateYAxis(revenue);


  return (
    <div className="w-full md:col-span-4">
      {/* Título de la sección */}
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      {/* NOTE: Uncomment this code in Chapter 7
          El bloque siguiente es el diseño del gráfico de barras.
          Está comentado porque en el capítulo actual aún no lo implementamos.
          Incluye:
            - Div con columnas para las barras
            - Eje Y con etiquetas
            - Cada barra proporcional al valor de revenue
            - Icono de calendario y nota "Last 12 months"
      */}
      {/* 
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div> 
      */}
    </div>
  );
}

/*
  Resumen:

  - Este componente ahora es async y hace su propio fetch de revenue.
  - Está listo para trabajar con Suspense y un skeleton (RevenueChartSkeleton) mientras se cargan los datos.
  - Los bloques comentados se usarán en capítulos futuros para renderizar el gráfico de barras.
  - Mantener los comentarios ayuda a seguir el tutorial paso a paso y entender qué hace cada sección.
*/
