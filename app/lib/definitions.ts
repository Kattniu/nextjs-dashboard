// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
// TYPES FOR USERS
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// TYPES FOR CUSTOMERS
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

// TYPES FOR INVOICES
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;   // stored in cents
  date: string;     // "YYYY-MM-DD"
  status: 'pending' | 'paid';
};

// Type used to edit an invoice in the form
export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number; // in cents
  status: 'pending' | 'paid';
};

// TYPES FOR TABLES & DASHBOARD
export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

// TYPES FOR REVENUE & LATEST INVOICES
export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};
