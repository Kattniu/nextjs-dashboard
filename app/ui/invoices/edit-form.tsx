'use client';
// Esto indica que este archivo es un "Client Component".
// Necesita esto porque usa interactividad del navegador.

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
// Importamos los tipos de datos que describen la forma de una Factura y un Cliente.

import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
// Iconos usados en el formulario (solo visual).

import Link from 'next/link';
// Componente Link para navegar entre páginas sin recargar.

import { Button } from '@/app/ui/button';
// Un botón personalizado ya hecho por el tutorial.

import { updateInvoice } from '@/app/lib/actions';
// Importamos la Server Action que actualiza la factura en la base de datos.


// Este es el componente del formulario para editar una factura.
export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;        // Datos de la factura que se está editando
  customers: CustomerField[];  // Lista de clientes
}) {

  // Aquí conectamos el ID de la factura con la Server Action.
  // bind() permite “inyectar” el id como primer argumento.
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return (
    // Aquí indicamos que el formulario, al enviarse, ejecutará updateInvoiceWithId
    <form action={updateInvoiceWithId}>  
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* --- SECCIÓN: Seleccionar Cliente --- */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>

          <div className="relative">
            <select
              id="customer"
              name="customerId"          // Este nombre lo usa FormData
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.customer_id} // Pre-cargamos el cliente original
            >
              <option value="" disabled>
                Select a customer
              </option>

              {/* Recorremos todos los clientes y creamos opciones */}
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>

            {/* Icono visual */}
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* --- SECCIÓN: Monto de la Factura --- */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>

          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"                       // Permite decimales
                defaultValue={invoice.amount / 100} // Convertimos de centavos a dólares
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />

              {/* Icono del dólar */}
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* --- SECCIÓN: Estado de la Factura --- */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>

          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">

              {/* Opción: PENDING */}
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={invoice.status === 'pending'} 
                  // Si la factura está pendiente → se marca pendiente
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>

              {/* Opción: PAID */}
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  defaultChecked={invoice.status === 'paid'}
                  // Si la factura está pagada → se marca pagada
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>

            </div>
          </div>
        </fieldset>
      </div>

      {/* --- BOTONES --- */}
      <div className="mt-6 flex justify-end gap-4">

        {/* Botón para cancelar y volver */}
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>

        {/* Botón para enviar el formulario */}
        <Button type="submit">
          Edit Invoice
        </Button>
      </div>

    </form>
  );
}
