import Link from 'next/link';
import { Building2 } from 'lucide-react'; // Using a generic building icon

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-primary hover:text-primary/80 transition-colors">
          <Building2 className="h-8 w-8" />
          <span>WoodCraft Explorer</span>
        </Link>
        <nav>
          {/* Future navigation links can go here */}
        </nav>
      </div>
    </header>
  );
}
