// Importamos el cliente de PostgreSQL.
// Esta librería permite conectarnos a la base de datos.
import postgres from 'postgres';

// Importamos tipos TypeScript que describen la forma de los datos.
// No ejecutan nada, solo ayudan al editor a saber qué estructura tienen los datos.
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';

// Función utilitaria para formatear dinero (por ejemplo: $120.00)
import { formatCurrency } from './utils';

// Conexión a la base de datos PostgreSQL.
// process.env.POSTGRES_URL → obtiene la URL desde variables de entorno.
// ssl: 'require' → obliga a usar conexión segura.
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/* =====================================================================
   🔹 1. fetchRevenue()
   Obtiene TODA la tabla "revenue".
   Aquí además agregamos una espera artificial de 3 segundos
   para simular una consulta lenta.
===================================================================== */
export async function fetchRevenue() {
  try {
    console.log('Fetching revenue data...');

    // ⏳ Espera artificial de 3 segundos (solo para pruebas)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Consulta SQL: selecciona todas las filas de la tabla revenue
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

/* =====================================================================
   🔹 2. fetchLatestInvoices()
   Obtiene las 5 facturas más recientes, junto con sus clientes.
===================================================================== */
export async function fetchLatestInvoices() {
  try {
    // Consulta con JOIN entre invoices y customers
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    // Formatea el monto en dinero legible
    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

/* =====================================================================
   🔹 3. fetchCardData()
   Obtiene datos para las tarjetas del Dashboard:
   - número de clientes
   - número de facturas
   - total pagado
   - total pendiente
   * Importante: corre varias consultas en paralelo con Promise.all()
===================================================================== */
export async function fetchCardData() {
  try {
    // 3 consultas en paralelo (promesas)
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;

    // Suma montos pagados y pendientes
    const invoiceStatusPromise = sql`
         SELECT
           SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
           SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    // Espera a que TODAS las promesas terminen
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    // Convertimos valores a números y textos formateados
    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

/* =====================================================================
   🔹 4. fetchFilteredInvoices()
   Obtiene facturas filtradas por nombre, correo, estado o monto.
   También agrega paginación (6 items por página).
===================================================================== */
const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  // Calcula desde qué fila empezar (paginación)
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

/* =====================================================================
   🔹 5. fetchInvoicesPages()
   Calcula cuántas páginas totales hay basándose en los filtros.
===================================================================== */
export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`
    SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
    `;

    // Total de páginas = total items / items por página
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

/* =====================================================================
   🔹 6. fetchInvoiceById()
   Obtiene una sola factura dada su ID.
===================================================================== */
export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    // Convierte el monto de centavos → dólares
    const invoice = data.map((invoice) => ({
      ...invoice,
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

/* =====================================================================
   🔹 7. fetchCustomers()
   Obtiene todos los clientes ordenados por nombre.
===================================================================== */
export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

/* =====================================================================
   🔹 8. fetchFilteredCustomers()
   Obtiene clientes junto con:
   - total de facturas
   - total pagado
   - total pendiente
   Filtra por nombre o correo.
===================================================================== */
export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    `;

    // Formateamos dinero
    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
