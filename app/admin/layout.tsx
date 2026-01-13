import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* هدر ادمین */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <Container>
          <AdminNav />
        </Container>
      </header>

      {/* محتوای اصلی ادمین */}
      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
