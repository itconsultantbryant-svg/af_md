import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/data/blog";
import { Badge } from "@/components/ui/Badge";
import { SiteImage } from "@/components/ui/SiteImage";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 2);

  return (
    <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <Badge className="mb-4">{article.category}</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-brand-muted mb-8">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime} read</span>
        </div>

        <div className="relative aspect-video rounded-2xl border border-white/10 mb-10 overflow-hidden">
          <SiteImage
            alt={article.title}
            title={article.title}
            variant="blog"
            subtitle={article.category}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <div className="space-y-5 text-brand-muted leading-relaxed text-lg">
          {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="font-display text-lg font-semibold text-white mb-4">
              Related Articles
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="glass-card p-4 hover:border-brand-gold/30 transition-colors cursor-hover block"
                >
                  <p className="text-white font-medium text-sm line-clamp-2">
                    {r.title}
                  </p>
                  <p className="text-brand-muted text-xs mt-1">{r.date}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
          <Button variant="primary" href="/contact">
            Work With Us
          </Button>
          <Button variant="secondary" href="/blog">
            ← Back to Blog
          </Button>
        </div>
      </article>
    </main>
  );
}
