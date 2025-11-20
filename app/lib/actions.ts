// app/lib/actions.ts
/*Server Actions: crear, actualizar y borrar facturas, 
con try/catch para manejar error
*/

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
  customerId: z.string({
    invalid_type_error: 'pLEASE select a customer',
  }), // Viene del <select name="customerId"> del formulario
  amount: z.coerce.number().gt(0, {
    message: 'Amount must be greater than $0 zero',
  }), // Convierte strings a números y valida
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status',
  }), // Solo permite 'pending' o 'paid'
  date: z.string(), // Fecha en formato "YYYY-MM-DD"
});


/*--------------------------------------
  2️⃣ Crear un esquema solo para crear factura
---------------------------------------*/
// Cuando creamos una nueva factura:
// - No tenemos id (lo crea la DB)
// - No tenemos date (lo vamos a generar)
const CreateInvoice = FormSchema.omit({ id: true, date: true });

/*A continuación, actualiza tu createInvoiceacción
 para que acepte dos parámetros: - prevStatey formData*/
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
/*--------------------------------------
  3️⃣ Server Action para crear factura
---------------------------------------*/
export async function createInvoice(prevState: State, formData: FormData) {
/*----------------------------
    3.1 Validar y convertir datos
  ------------------------------*/
  /*
  Zod hace 3 cosas:
  Toma los datos crudos del formulario
  Los convierte a los tipos correctos
  Te devuelve datos LIMPIOS Y SEGUROS
  */
    const validatedFields = CreateInvoice.safeParse({ 
    customerId: formData.get('customerId'), // Obtiene valor del select
    amount: formData.get('amount'),         // Obtiene valor del input number (string)
    status: formData.get('status'),         // Obtiene valor del radio button
  });
  /*safeParse()Devolverá un objeto que contiene un campo `a` successo ` errorb`. 
  Esto ayudará a gestionar la validación de forma más eficiente sin necesidad de 
  incluir esta lógica dentro del try/catchbloque.*/

    if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // 📌Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
  // Guardar dinero en centavos evita errores con decimales en JavaScript
    const amountInCents = amount * 100;
  // Crear fecha de la factura  Formato "YYYY-MM-DD"
    const date = new Date().toISOString().split('T')[0];


  //📌 AÑADE esto dentro de la función, al final:
            //¿Por qué usamos template SQL con acentos invertidos? 
            /*Porque postgres.js:
              evita inyecciones SQL automáticamente
              limpia los valores por ti
              maneja errores mejor
              es más seguro que concatenar strings*/
  try{
    await sql` 
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    } catch (error) {
      //If a database error occurs, return a more specific error.
        return {
          message: "Hubo un error al crear la factura. Por favor, intenta de nuevo más tarde."
    };
            }/*Explicación:
                  - `sql` es nuestra conexión a PostgreSQL
                  - Usamos template literals con backticks ` para crear la query
                  - ${variable} → Next.js/Postgres la inyecta de forma segura (evita SQL injection)
                  - Estamos insertando: customer_id, amount, status, date*/

  //📌 AÑADE esto dentro de la función, al final:
    // Revalidate the cache for the invoices page and redirect the user.
      revalidatePath('/dashboard/invoices');
      redirect('/dashboard/invoices');

  }/*🌈 Metáfora para que lo entiendas PERFECTAMENTE
  Imagina que /dashboard/invoices es una pizarra donde están las facturas.
  revalidatePath = borrar la pizarra para escribirla de nuevo
  redirect = llevar al usuario otra vez frente a la pizarra*/

//console.log("Factura creada:", { customerId, amountInCents, status, date });
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
try {
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId},
        amount = ${amountInCents},
        status = ${status}
    WHERE id = ${id}
  `;
} catch (error) {
  console.error("Error al actualizar la factura:", error);
  return { message: "Hubo un error al actualizar la factura. Intenta de nuevo." };
}


  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
 
  // Unreachable code block
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

