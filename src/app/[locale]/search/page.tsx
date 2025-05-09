"use client";
import ComponentCard from '@/components/component-card';
import { getComponents } from '@/services/component'; // Changed from getAllComponents
import { useSearchParams } from 'next/navigation';
import { locales } from '../../i18n/settings';
import { useMemo, useEffect, useState } from 'react';
import type { Component } from '@/services/component';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const allComponents = await getComponents(); // Changed from getAllComponents
      const filteredComponents = allComponents.filter((component) => {
        return (
          component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          component.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setComponents(filteredComponents);
      setIsLoading(false);
    };

    fetchData();
  }, [searchQuery]);

  return (
    <main className='max-w-screen-2xl mx-auto'>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
        {isLoading ? (
          <p>正在加载...</p>
        ) : components.length > 0 ? (
          components.map((component) => (
            <ComponentCard key={component.component_id} component={component} />
          ))
        ) : (
          <p>未找到结果。</p>
        )}
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
