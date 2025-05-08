'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Component } from '@/services/component';
import { getComponents, getDistinctFilterValues } from '@/services/component';
import ComponentCard from '@/components/component-card';
import SearchBar from '@/components/search-bar';
import FilterPanel, { type Filters } from '@/components/filter-panel';
import PaginationControls from '@/components/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerCrash } from "lucide-react";

const ITEMS_PER_PAGE = 8;
const initialFilters: Filters = { dynasty: '', type: '', material: '', source: '' };

export default function Home() {
  const [allComponents, setAllComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distinctFilterValues, setDistinctFilterValues] = useState({
    dynasties: [],
    types: [],
    materials: [],
    sources: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [componentsData, filterValuesData] = await Promise.all([
          getComponents(),
          getDistinctFilterValues(),
        ]);
        setAllComponents(componentsData);
        setFilteredComponents(componentsData); // Initially, all components are shown
        setDistinctFilterValues(filterValuesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load component data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = allComponents;

    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (component) =>
          component.name.toLowerCase().includes(lowerSearchTerm) ||
          component.dynasty.toLowerCase().includes(lowerSearchTerm) ||
          component.type.toLowerCase().includes(lowerSearchTerm) ||
          component.material.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply filters
    result = result.filter((component) => {
      return (
        (filters.dynasty ? component.dynasty === filters.dynasty : true) &&
        (filters.type ? component.type === filters.type : true) &&
        (filters.material ? component.material === filters.material : true) &&
        (filters.source ? component.source === filters.source : true)
      );
    });
    
    setFilteredComponents(result);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [searchTerm, filters, allComponents]);

  const totalPages = Math.ceil(filteredComponents.length / ITEMS_PER_PAGE);
  const paginatedComponents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredComponents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredComponents, currentPage]);


  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm(''); // Optionally reset search term as well
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Skeleton className="h-10 w-full md:w-1/3" /> {/* SearchBar placeholder */}
        </div>
        {/* FilterPanel placeholder */}
        <Skeleton className="h-28 w-full" /> 
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

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <ServerCrash className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />
      <FilterPanel 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        distinctValues={distinctFilterValues}
        onResetFilters={handleResetFilters}
      />

      {paginatedComponents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedComponents.map((component) => (
            <ComponentCard key={component.component_id} component={component} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No components found matching your criteria.</p>
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
