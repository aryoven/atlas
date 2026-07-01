import Link from "next/link";
import { AtSign, Users, Code2, FileVideo } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Container from "@/components/ui/Container";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "AI Employees", href: "#solutions" },
    { label: "Pricing", href: "#pricing" },
    { label: "Demo", href: "#demo" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "FAQ", href: "#faq" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

const socialLinks = [
  { label: "Twitter", href: "#", icon: AtSign },
  { label: "LinkedIn", href: "#", icon: Users },
  { label: "GitHub", href: "#", icon: Code2 },
  { label: "YouTube", href: "#", icon: FileVideo },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background pt-16 pb-8">
      <Container>
        <div className="grid gap-12 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Increase business revenue using AI Employees. Deploy AI Sales,
              Support, Receptionists, and Voice Agents in minutes.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:border-white/20 hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Atlas AI. All rights reserved.
          </p>
          <p className="text-sm text-muted">
            Built for businesses that want to grow with AI.
          </p>
        </div>
      </Container>
    </footer>
  );
}
