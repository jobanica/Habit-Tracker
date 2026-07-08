import Link from "next/link";
import { config } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center text-sm text-slate-500 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {new Date().getFullYear()} {config.companyName}. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          <a href={`mailto:${config.supportEmail}`} className="hover:text-slate-900">
            Contact
          </a>
          <Link href="/terms" className="hover:text-slate-900">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-slate-900">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
