'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
 setQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
 const router = useRouter();
 const pathname = usePathname();
 const locale = pathname.split('/')[1];
 const url = `/${locale}/search?q=${query}`;
 router.push(url);
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
