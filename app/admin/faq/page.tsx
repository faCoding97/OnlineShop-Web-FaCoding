// app/admin/faq/page.tsx
import AdminGate from "@/components/admin/AdminGate";
import { createServerSupabaseAdminClient } from "@/lib/supabase";
import { FAQForm, NewFAQForm } from "./FaqForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function FAQAdminPage() {
  const supabase = createServerSupabaseAdminClient();

  const { data: items, error } = await supabase
    .from("site_faq")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("FAQ fetch error:", error.message);
  }

  return (
    <AdminGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">FAQ</h1>
          <p className="text-sm text-slate-600">
            Edit common questions and answers shown on the website.
          </p>
        </div>

        {/* فرم افزودن پرسش جدید */}
        <NewFAQForm />

        {/* فرم‌های ویرایش/حذف برای آیتم‌های موجود */}
        <div className="grid gap-4 md:grid-cols-2">
          {items?.map((item) => <FAQForm key={item.id} item={item} />)}
        </div>
      </div>
    </AdminGate>
  );
}
