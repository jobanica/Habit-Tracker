import Link from "next/link";
import { config } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-10 text-center text-sm text-slate-500">
        <p>
          Questions? Email us at{" "}
          <a href={`mailto:${config.supportEmail}`} className="font-medium text-slate-700 hover:text-slate-900">
            {config.supportEmail}
          </a>
        </p>
        <nav className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-slate-900">
            Terms
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy" className="hover:text-slate-900">
            Privacy
          </Link>
        </nav>
        <p className="text-xs text-slate-400">
          Secure payments powered by Xendit
        </p>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {config.companyName}
        </p>
      </div>
    </footer>
  );
}
