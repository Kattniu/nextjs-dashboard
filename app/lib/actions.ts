// app/lib/actions.ts
'use server'; // Esto marca que todas las funciones exportadas en este archivo son Server Actions

import { z } from 'zod'; // Librería para validar y convertir tipos de datos
import { revalidatePath } from 'next/cache'; // Función para revalidar caché en Next.js
import { redirect } from 'next/navigation'; // Función para redirigir a otra página
import postgres from 'postgres'; // Librería para conectarse a PostgreSQL


/*--------------------------------------
📌 Conexión a la base de datos
---------------------------------------*/
// Aquí se crea la conexión a PostgreSQL usando la URL de tu entorno
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
/*
¿Qué significa esto?
process.env.POSTGRES_URL
Esa es la URL de conexión que te da Vercel o Supabase.
{ ssl: 'require' }
SSL = conexión segura.
const sql = postgres(...)
Crea un “cliente” que puedes usar para ejecutar SQL.
Ahora puedes hacer cosas como:
sql`SELECT * FROM invoices`
Esto es una Plantilla SQL de postgres.js.
*/


/*--------------------------------------
  1️⃣ Definir el esquema de la factura
---------------------------------------*/
const FormSchema = z.object({
  id: z.string(), // id → string, será generado por la base de datos
  customerId: z.string(), // Viene del <select name="customerId"> del formulario
  amount: z.coerce.number(), // Convierte strings a números y valida
  status: z.enum(['pending', 'paid']), // Solo permite 'pending' o 'paid'
  date: z.string(), // Fecha en formato "YYYY-MM-DD"
});


/*--------------------------------------
  2️⃣ Crear un esquema solo para crear factura
---------------------------------------*/
// Cuando creamos una nueva factura:
// - No tenemos id (lo crea la DB)
// - No tenemos date (lo vamos a generar)
const CreateInvoice = FormSchema.omit({ id: true, date: true });


/*--------------------------------------
  3️⃣ Server Action para crear factura
---------------------------------------*/
export async function createInvoice(formData: FormData) {

  /*----------------------------
    3.1 Validar y convertir datos
  ------------------------------*/
  /*
  Zod hace 3 cosas:
  Toma los datos crudos del formulario
  Los convierte a los tipos correctos
  Te devuelve datos LIMPIOS Y SEGUROS
  */
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'), // Obtiene valor del select
    amount: formData.get('amount'),         // Obtiene valor del input number (string)
    status: formData.get('status'),         // Obtiene valor del radio button
  });

  /*¿Qué hace .parse()?
      ✔ Valida que los datos sean correctos según el esquema
      ✔ Convierte amount de string → number
      ✔ Si algo está mal, lanza un error automático
      ✔ Devuelve los datos en el tipo correcto*/

  //Convertir monto a centavos
  const amountInCents = amount * 100;
  // Guardar dinero en centavos evita errores con decimales en JavaScript

  // Crear fecha de la factura
  const date = new Date().toISOString().split('T')[0];
  // Formato "YYYY-MM-DD"

  //📌 AÑADE esto dentro de la función, al final:
  //¿Por qué usamos template SQL con acentos invertidos? 
  /*Porque postgres.js:
    evita inyecciones SQL automáticamente
    limpia los valores por ti
    maneja errores mejor
    es más seguro que concatenar strings*/
  await sql` 
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  /*Explicación:
    - `sql` es nuestra conexión a PostgreSQL
    - Usamos template literals con backticks ` para crear la query
    - ${variable} → Next.js/Postgres la inyecta de forma segura (evita SQL injection)
    - Estamos insertando: customer_id, amount, status, date*/


  /*🌟 Next.js guarda páginas en caché en el navegador
    Esto significa:
    Cuando visitas /dashboard/invoices, Next.js guarda esa página.
    Si vuelves a la misma ruta, intenta mostrar la versión guardada lo más rápido posible.
    👉 Esto hace que tu app sea muy rápida.
    👉 Pero tiene un problema:
    ❗ Si agregas una factura nueva…
    la página guardada todavía no sabe que existe esa nueva factura.
    Por eso hay que decirle a Next.js:
    “Oye, limpia tu memoria de esa página y tráela de nuevo del servidor.”*/
  revalidatePath('/dashboard/invoices');

  /*
    ✔ ¿Qué hace esto?
    Termina la ejecución de la acción
    Manda al usuario a /dashboard/invoices
    La página ya está revalidada, así que carga con la factura nueva*/
  redirect('/dashboard/invoices');

  /*
  🌈 Metáfora para que lo entiendas PERFECTAMENTE
  Imagina que /dashboard/invoices es una pizarra donde están las facturas.
  revalidatePath = borrar la pizarra para escribirla de nuevo
  redirect = llevar al usuario otra vez frente a la pizarra
  */

  console.log("Factura creada:", { customerId, amountInCents, status, date });

} // ← ESTA LLAVE ESTABA MAL EN TU CÓDIGO


/*Este console.log NO aparece en el navegador;
aparece en la terminal del servidor de Next.js.
Sirve para verificar que:
✔ El formulario se está enviando
✔ La Server Action funciona
✔ Los datos están correctos*/



/*--------------------------------------
  4️⃣ Server Action para actualizar factura
---------------------------------------*/
export async function updateInvoice(id: string, formData: FormData) {

  // Validar igual que en createInvoice
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId},
        amount = ${amountInCents},
        status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  console.log("Factura actualizada:", { id, customerId, amountInCents, status });
}
