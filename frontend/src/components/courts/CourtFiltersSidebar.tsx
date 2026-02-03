"use client"

import { CourtFilters } from '@/types/court'
import { Search, SlidersHorizontal, X, MapPin, DollarSign, Star, Zap } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

interface CourtFiltersProps {
  filters: CourtFilters
  onFilterChange: (filters: CourtFilters) => void
  cities: string[]
  isOpen: boolean
  onToggle: () => void
}

export default function CourtFiltersSidebar({ 
  filters, 
  onFilterChange, 
  cities,
  isOpen,
  onToggle 
}: CourtFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CourtFilters>(filters)

  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleCityChange = (value: string) => {
    const newFilters = { ...localFilters, city: value === 'all' ? undefined : value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleTypeChange = (value: string) => {
    const newFilters = { 
      ...localFilters, 
      type: value === 'all' ? undefined : value as 'indoor' | 'outdoor' | 'both'
    }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? Number(value) : undefined
    const newFilters = {
      ...localFilters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue
    }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleRatingChange = (value: string) => {
    const newFilters = { 
      ...localFilters, 
      minRating: value === 'all' ? undefined : Number(value)
    }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleFreeToggle = () => {
    const newFilters = { 
      ...localFilters, 
      isFree: localFilters.isFree ? undefined : true 
    }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: CourtFilters = {}
    setLocalFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const activeFilterCount = Object.keys(localFilters).filter(
    key => localFilters[key as keyof CourtFilters] !== undefined
  ).length

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        onClick={onToggle}
        className="lg:hidden fixed bottom-24 right-3 z-40 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white touch-target"
        size="lg"
      >
        <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
        <span className="text-sm sm:text-base">Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-white text-blue-600 text-[10px] sm:text-xs font-bold rounded-full">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Filters Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-[100dvh] lg:h-auto
        w-[85vw] max-w-[320px] bg-white border-r lg:border-r-0 lg:border border-gray-200 
        rounded-none lg:rounded-xl p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6 overflow-y-auto
        z-50 lg:z-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium touch-target"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg touch-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Search Courts
          </label>
          <Input
            placeholder="Court name, address..."
            value={localFilters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full text-sm sm:text-base"
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Location
          </label>
          <Select value={localFilters.city || 'all'} onValueChange={handleCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Court Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Court Type</label>
          <Select value={localFilters.type || 'all'} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Price Range (₱/hour)
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Free Courts */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">Free Courts Only</label>
          <button
            onClick={handleFreeToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localFilters.isFree ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localFilters.isFree ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Minimum Rating
          </label>
          <Select 
            value={localFilters.minRating?.toString() || 'all'} 
            onValueChange={handleRatingChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="4.5">4.5+ ⭐</SelectItem>
              <SelectItem value="4.0">4.0+ ⭐</SelectItem>
              <SelectItem value="3.5">3.5+ ⭐</SelectItem>
              <SelectItem value="3.0">3.0+ ⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apply Button (Mobile) */}
        <Button
          onClick={onToggle}
          className="lg:hidden w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Show Results
        </Button>
      </aside>
    </>
  )
}
