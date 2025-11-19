import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
/*
A- 🫡Form → es el componente que contiene el formulario para crear la factura.
Breadcrumbs → es la línea de navegación tipo:
Invoices > Create Invoice
fetchCustomers → función para obtener clientes desde la base de datos.
*/ 


//🧩 B. El componente de la página es un Server Component
export default async function Page() {
/*
Es async porque va a hacer una llamada al servidor (fetchCustomers).
Esto significa que se ejecuta en el servidor, no en el navegador.
*/
/*
ASYNC: Indica que la función es asíncrona y puede usar AWAIT dentro de ella.
 "Voy a hacer una llamada al servidor y necesito esperar su respuesta antes de continuar."
AWAIT: "ESPERA" a que la promesa de fetchCustomers se resuelva antes de continuar.
*/

//🧩 C. Llamada a la función para obtener clientes
  const customers = await fetchCustomers(); 
  //Necesitas una lista de clientes para mostrarlos en el formulario y escoger a quién pertenece la factura.

//🧩 D. Renderizado del componente de la página
//       Estructura visual de la página
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
/*
¿Qué hace esto?
1️⃣ Muestra los breadcrumbs:

“Invoices” → link a /dashboard/invoices

“Create Invoice” → estás aquí

Es solo para orientación del usuario.

2️⃣ Muestra el formulario:
<Form customers={customers} />


Le está pasando los clientes al formulario.
Esto significa que dentro del formulario habrá algo como:

<select name="customer">
  {customers.map(c => (
    <option value={c.id}>{c.name}</option>
  ))}
</select>
*/