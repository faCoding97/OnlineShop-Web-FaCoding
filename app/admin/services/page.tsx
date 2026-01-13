// app/admin/services/page.tsx
import AdminGate from "@/components/admin/AdminGate";
import ServicesAdminPanel from "@/components/admin/ServicesAdminPanel";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type ServiceRow = {
  id: string;
  title: string;
  description: string;
  from_price_zar: number | null;
  sort_order: number;
};

export default async function AdminServicesPage() {
  const supabase = createServerSupabaseAdminClient();

  const [servicesRes, bulletsRes] = await Promise.all([
    supabase
      .from("site_services")
      .select("id, title, description, from_price_zar, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("site_service_bullets")
      .select("service_id, bullet")
      .order("id", { ascending: true }),
  ]);

  const rawServices = (servicesRes.data ?? []) as ServiceRow[];
  const rawBullets = (bulletsRes.data ?? []) as {
    service_id: string;
    bullet: string;
  }[];

  const bulletsByService: Record<string, string[]> = {};
  for (const row of rawBullets) {
    if (!bulletsByService[row.service_id]) {
      bulletsByService[row.service_id] = [];
    }
    bulletsByService[row.service_id].push(row.bullet);
  }

  const services = rawServices.map((row) => ({
    ...row,
    bullets: bulletsByService[row.id] ?? [],
  }));

  return (
    <AdminGate>
      <ServicesAdminPanel services={services} />
    </AdminGate>
  );
}
