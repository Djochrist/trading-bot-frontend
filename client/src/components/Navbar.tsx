import { Link } from "wouter";
import { useState } from "react";
import { Menu, X, Bot, TrendingUp, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-tight tracking-tight text-foreground">
                  Trading<span className="text-primary">Bot</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  v2.4.0-stable
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"><TrendingUp className="h-4 w-4" /> Tableau de bord</Link>
            <Link href="/history" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"><History className="h-4 w-4" /> Historique</Link>
            <Link href="/config" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"><Settings className="h-4 w-4" /> Configuration</Link>
            <div className="h-6 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              En Ligne
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-foreground hover:bg-secondary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-border animate-in slide-in-from-top-5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary">
              Tableau de bord
            </Link>
            <Link href="/history" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-secondary">
              Historique
            </Link>
            <Link href="/config" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-secondary">
              Configuration
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
