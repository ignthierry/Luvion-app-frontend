import { redirect } from "next/navigation";

// Halaman print dashboard → redirect ke versi publik (tanpa navbar, print-ready).
// URL publik: /invoices/[id] — dibuka bebas tanpa login, ideal untuk kirim ke customer.
export default async function DashboardInvoicePrintPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/invoices/${params.id}`);
}