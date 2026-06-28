"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { SiteImage } from "@/components/ui/SiteImage";
import { articles, blogCategories } from "@/lib/data/blog";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  const [category, setCategory] = useState("All");
  const featured = articles.find((a) => a.featured)!;
  const filtered =
    category === "All"
      ? articles.filter((a) => !a.featured)
      : articles.filter((a) => a.category === category && !a.featured);

  return (
    <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Insights from Africa's AI Frontier"
          subtitle="Thought leadership on AI adoption, technology, and innovation across the continent."
        />

        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          <div>
            <Link
              href={`/blog/${featured.slug}`}
              className="block glass-card overflow-hidden mb-12 cursor-hover group"
            >
              <div className="relative aspect-[21/9] border-b border-white/5">
                <SiteImage
                  alt={featured.title}
                  title={featured.title}
                  variant="blog"
                  subtitle={featured.category}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <div className="p-8">
                <Badge className="mb-3">{featured.category}</Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-brand-gold transition-colors mb-3">
                  {featured.title}
                </h2>
                <p className="text-brand-muted mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-brand-muted">
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime} read</span>
                </div>
                <span className="inline-block mt-4 text-brand-gold text-sm">
                  Read Article →
                </span>
              </div>
            </Link>

            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="glass-card overflow-hidden cursor-hover group hover:-translate-y-1 transition-transform"
                >
                  <div className="relative aspect-video border-b border-white/5">
                    <SiteImage
                      alt={article.title}
                      title={article.title}
                      variant="blog"
                      subtitle={article.category}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5">
                    <Badge className="mb-2">{article.category}</Badge>
                    <h3 className="font-display text-lg font-semibold text-white group-hover:text-brand-gold transition-colors mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-brand-muted text-sm line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-brand-muted">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-white mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {blogCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "text-sm transition-colors cursor-hover",
                        category === cat
                          ? "text-brand-gold"
                          : "text-brand-muted hover:text-white"
                      )}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-white mb-4">
                Popular Posts
              </h3>
              <ul className="space-y-3">
                {articles.slice(0, 4).map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="text-sm text-brand-muted hover:text-brand-gold transition-colors cursor-hover line-clamp-2"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-white mb-3">
                Newsletter
              </h3>
              <p className="text-brand-muted text-sm mb-4">
                Get AI insights delivered to your inbox.
              </p>
              <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-gold/50"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium hover:bg-brand-gold-light transition-colors cursor-hover"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
