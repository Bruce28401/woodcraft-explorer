'use client';

import { useState, useEffect, useMemo } from 'react';
import ComponentCard from '@/components/component-card';
import SearchBar from '@/components/search-bar';
import FilterPanel, { type Filters } from '@/components/filter-panel';
import PaginationControls from '@/components/pagination-controls';
import { getComponents, getDistinctFilterValues, type Component } from '@/services/component';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 8;

export default function HomePageContent() {
  const [allComponents, setAllComponents] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({
    dynasty: '',
    type: '',
    material: '',
    source: '',
  });
  const [distinctValues, setDistinctValues] = useState<{
    dynasties: string[];
    types: string[];
    materials: string[];
    sources: string[];
  }>({ dynasties: [], types: [], materials: [], sources: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [componentsData, distinctFilterData] = await Promise.all([
          getComponents(),
          getDistinctFilterValues(),
        ]);
        setAllComponents(componentsData);
        setDistinctValues(distinctFilterData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error state if necessary
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilters({ dynasty: '', type: '', material: '', source: '' });
    setCurrentPage(1);
  };

  const filteredAndSearchedComponents = useMemo(() => {
    return allComponents.filter((component) => {
      const matchesSearch =
        searchQuery === '' ||
        component.name.toLowerCase().includes(searchQuery) ||
        component.dynasty.toLowerCase().includes(searchQuery) ||
        component.type.toLowerCase().includes(searchQuery) ||
        component.material.toLowerCase().includes(searchQuery) ||
        component.source.toLowerCase().includes(searchQuery);

      const matchesFilters =
        (activeFilters.dynasty === '' || component.dynasty === activeFilters.dynasty) &&
        (activeFilters.type === '' || component.type === activeFilters.type) &&
        (activeFilters.material === '' || component.material === activeFilters.material) &&
        (activeFilters.source === '' || component.source === activeFilters.source);
      
      return matchesSearch && matchesFilters;
    });
  }, [allComponents, searchQuery, activeFilters]);

  const totalPages = Math.ceil(filteredAndSearchedComponents.length / ITEMS_PER_PAGE);

  const paginatedComponents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSearchedComponents.slice(startIndex, endIndex);
  }, [filteredAndSearchedComponents, currentPage]);

  if (isLoading) {
    return (
      <div className="space-y-8 p-4">
        <Skeleton className="h-12 w-full" /> 
        <Skeleton className="h-24 w-full" /> 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <Skeleton className="h-40 w-full rounded-t-lg" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className='max-w-screen-2xl mx-auto'>
      <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      <FilterPanel
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        distinctValues={distinctValues}
        onResetFilters={handleResetFilters}
      />
      {paginatedComponents.length > 0 ? (
        <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
          {paginatedComponents.map((component) => (
            <ComponentCard key={component.component_id} component={component} />
          ))}
        </section>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">未找到符合条件的构件。</p>
        </div>
      )}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
}
