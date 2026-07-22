"use client";
import Link from "next/link";
import { useState } from "react";
import { ShieldAlert, Users, Globe, AlertCircle } from "lucide-react";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Awareness", href: "/#awareness" },
    { name: "Report Crime", href: "/#report" },
    { name: "Track Complaint", href: "/#track" },
    { name: "Citizen Login", href: "/login?role=citizen" },
    { name: "Officer Login", href: "/login?role=officer" },
    { name: "Admin Login", href: "/login?role=admin" },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-xl border-b border-border/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              SurakshaNet AI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-md text-muted-foreground hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {mobileMenuOpen ? (
                <AlertCircle className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Users className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/90 backdrop-blur-xl border-t border-border/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
