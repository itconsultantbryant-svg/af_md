import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-lg">
        <p className="font-mono text-[11px] tracking-[0.2em] text-brand-gold uppercase mb-4">
          404 — Page Not Found
        </p>
        <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-4">
          Lost in the{" "}
          <span className="gold-gradient-text">Data Stream</span>
        </h1>
        <p className="text-brand-muted text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" href="/">
            Back to Home
          </Button>
          <Button variant="secondary" href="/contact">
            Contact Us
          </Button>
        </div>
      </div>
    </main>
  );
}
