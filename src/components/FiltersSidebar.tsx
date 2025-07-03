import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X, Filter, Settings } from 'lucide-react';
import { amenitiesList, roomTypes } from '@/data/rooms';

export interface FilterState {
  priceMin: string;
  priceMax: string;
  amenities: string[];
  roomType: string;
}

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FiltersSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onApplyFilters,
  onClearFilters 
}: FiltersSidebarProps) => {
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked 
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    
    onFiltersChange({
      ...filters,
      amenities: newAmenities
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-80 lg:w-72 bg-card/95 backdrop-blur-md border-r border-border
        transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-orbitron font-bold text-primary glow-text-red">
                Jedi Controls
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden hover:text-primary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-exo font-semibold text-foreground">
                Price Range (Credits/Night)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="priceMin" className="text-xs text-muted-foreground font-exo">
                    Min
                  </Label>
                  <Input
                    id="priceMin"
                    type="number"
                    placeholder="0"
                    value={filters.priceMin}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      priceMin: e.target.value
                    })}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="priceMax" className="text-xs text-muted-foreground font-exo">
                    Max
                  </Label>
                  <Input
                    id="priceMax"
                    type="number"
                    placeholder="1000"
                    value={filters.priceMax}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      priceMax: e.target.value
                    })}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Room Type */}
            <div className="space-y-3">
              <Label className="text-sm font-exo font-semibold text-foreground">
                Accommodation Type
              </Label>
              <Select 
                value={filters.roomType} 
                onValueChange={(value) => onFiltersChange({
                  ...filters,
                  roomType: value
                })}
              >
                <SelectTrigger className="bg-input border-border focus:border-primary">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border" />

            {/* Amenities */}
            <div className="space-y-3">
              <Label className="text-sm font-exo font-semibold text-foreground">
                Force Amenities
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => 
                        handleAmenityChange(amenity, checked as boolean)
                      }
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label 
                      htmlFor={amenity} 
                      className="text-sm font-exo text-foreground cursor-pointer hover:text-primary transition-colors"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={onApplyFilters}
                className="w-full lightsaber-button bg-primary hover:bg-primary/90 text-primary-foreground font-exo font-semibold"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button 
                onClick={onClearFilters}
                variant="outline"
                className="w-full border-border hover:border-accent hover:text-accent font-exo"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersSidebar;