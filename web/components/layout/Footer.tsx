import Link from "next/link";
import { AtSign, Users, Code2, FileVideo } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Container from "@/components/ui/Container";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "AI Employees", href: "/#solutions" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],

  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: AtSign,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: Users,
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: Code2,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: FileVideo,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background pt-16 pb-8">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Atlas AI helps businesses automate sales, support, customer
              service, and operations using intelligent AI Employees that work
              24/7.
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-white/20 hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white">
                {title}
              </h3>

              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Atlas AI. All rights reserved.
          </p>

          <p className="text-sm text-muted">
            Built with ❤️ for modern businesses.
          </p>
        </div>
      </Container>
    </footer>
  );
}