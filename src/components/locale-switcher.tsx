"use client";
import { useRouter } from 'next/navigation';
import { locales } from '../app/i18n/settings';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>Language</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => {
              router.push(pathname.replace(/\/[^\/]+/, `/${locale}`));
            }}
          >
            {locale}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}