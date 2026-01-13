// components/admin/AdminGate.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type User = { id: string; email?: string | null };

export default function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;

      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
      } else {
        setUser(null);
        // ❗ اگه لاگین نیست → بفرستش صفحه‌ی لاگین
        router.push("/admin/login");
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  // هنوز redirect نشده ولی user هم نداریم → یعنی در حال رفتن به /admin/login هست
  if (!user) {
    return (
      <div className="flex justify-center py-20 text-sm text-slate-500">
        Redirecting to admin login...
      </div>
    );
  }

  // ✅ اینجا یعنی لاگین شده
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-900">Admin dashboard</p>
          <p className="text-xs text-slate-500">Signed in as {user.email}</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
            router.push("/admin/login");
          }}
          className="text-xs font-medium text-slate-600 hover:text-red-600">
          Sign out
        </button>
      </div>

      {children}
    </div>
  );
}
