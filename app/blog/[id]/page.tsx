// app/blog/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import Reveal from "@/components/widgets/Reveal.client";
import { createServerSupabaseClient } from "@/lib/supabase";

type Params = {
  params: {
    id: string;
  };
};

type BlogPost = {
  id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  content: string;
  published_at: string | null;
  // توی دیتابیس ستونی به اسم tags نداری؛
  // اگه بعداً با join بیاری، این فیلد پر می‌شه
  tags?: string[] | null;
};

export const revalidate = 60;

// آدرس‌های استاتیک
export async function generateStaticParams() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }

  const supabase = createServerSupabaseClient();

  const { data: posts, error } = await supabase
    .from("site_blog_posts")
    .select("id");

  if (error || !posts) return [];

  return posts.map((post) => ({ id: post.id }));
}

// متادیتا برای هر پست
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const supabase = createServerSupabaseClient();

  const { data: post } = await supabase
    .from("site_blog_posts")
    .select("id, title, excerpt, slug")
    .eq("id", params.id)
    .single();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      title: "Post not found | IVA Blog",
      description: "Rug care tips and buying guides from IVA in Klerksdorp.",
    };
  }

  const baseTitle = `${post.title} | IVA Blog`;
  const description =
    post.excerpt ?? "Rug care tips and buying guides from IVA in Klerksdorp.";

  const slugOrId = post.slug || post.id;

  return {
    title: baseTitle,
    description,
    openGraph: {
      title: baseTitle,
      description,
      url: `https://IVA.co.za/blog/${slugOrId}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: baseTitle,
      description,
    },
  };
}

// صفحه جزئیات پست
export default async function BlogPostPage({ params }: Params) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("site_blog_posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const post = data as BlogPost;

  return (
    <div className="py-16 md:py-20">
      <Container>
        <Reveal>
          <article className="max-w-3xl mx-auto">
            {/* Back button */}
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-[var(--brand)] hover:text-[var(--brand)] hover:shadow-md hover:bg-white transition-all">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs">
                  ←
                </span>
                <span>Back to all articles</span>
              </Link>
            </div>

            <p className="text-sm font-medium tracking-wide text-[var(--brand)] uppercase mb-2">
              Blog
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              {post.title}
            </h1>

            <p className="text-xs text-slate-600 mb-6">
              {post.published_at &&
                new Date(post.published_at).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              {post.tags?.length ? ` • ${post.tags.join(", ")}` : ""}
            </p>

            <div className="prose prose-sm md:prose-base max-w-none text-slate-800">
              {post.content.split("\n\n").map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </article>
        </Reveal>
      </Container>
    </div>
  );
}
