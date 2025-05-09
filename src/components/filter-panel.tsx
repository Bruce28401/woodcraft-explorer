'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { usePathname } from "next/navigation";

export interface Filters {
  dynasty: string;
  type: string;
  material: string;
  source: string; 
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  distinctValues: {
    dynasties: string[];
    types: string[];
    materials: string[];
    sources: string[]; 
  };
  onResetFilters: () => void;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  distinctValues,
  onResetFilters
}: FilterPanelProps) {
  const handleSelectChange = (filterName: keyof Filters, value: string) => {
    const pathname = usePathname();
    const locale = pathname.split('/')[1];
    const queryString = new URLSearchParams({...filters, [filterName]: value === 'all' ? '' : value}).toString();
    onFilterChange({ ...filters, [filterName]: value === 'all' ? '' : value });
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <Label htmlFor="dynasty-filter">Dynasty</Label>
          <Select
            value={filters.dynasty || 'all'}
            onValueChange={(value) => handleSelectChange('dynasty', value)}
          >
            <SelectTrigger id="dynasty-filter">
              <SelectValue placeholder="选择朝代" />
            </SelectTrigger>
            <SelectContent className="z-[999]">
              <SelectItem value="all">所有朝代</SelectItem>
              {distinctValues.dynasties.map((dynasty) => (
                <SelectItem key={dynasty} value={dynasty}>
                  {dynasty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type-filter">Component Type</Label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent className="z-[999]">
              <SelectItem value="all">所有类型</SelectItem>
              {distinctValues.types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="material-filter">材质</Label>
          <Select
            value={filters.material || 'all'}
            onValueChange={(value) => handleSelectChange('material', value)}
          >
            <SelectTrigger id="material-filter">
              <SelectValue placeholder="选择材质" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有材质</SelectItem>
              {distinctValues.materials.map((material) => (
                <SelectItem key={material} value={material}>
                  {material}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="source-filter">地区/来源</Label>
          <Select
            value={filters.source || 'all'}
            onValueChange={(value) => handleSelectChange('source', value)}
          >
            <SelectTrigger id="source-filter">
              <SelectValue placeholder="选择地区/来源" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有地区/来源</SelectItem>
              {distinctValues.sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onResetFilters} variant="outline" className="w-full lg:w-auto">
          <FilterX className="mr-2 h-4 w-4" /> 重置筛选
        </Button>
      </div>
    </div>
  );
}
