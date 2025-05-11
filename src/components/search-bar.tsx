// @ts-nocheck
'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void; // Added for in-page search
}

export default function SearchBar({ initialQuery = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      const locale = pathname.split('/')[1] || 'zh'; // Fallback to 'zh' if locale is not in path
      const url = `/${locale}/search?q=${query}`;
      router.push(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="按名称、朝代、类型、材质搜索..."
        className="flex-grow"
      />
      <Button type="submit" aria-label="搜索">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
}
