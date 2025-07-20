'use client'

import React, { useState, useRef, useEffect } from 'react';

type Props = {
  specialties: string[];
  selectedSpecialties: string[];
  onChange: (selected: string[]) => void;
}

export const SpecialtyFilter: React.FC<Props> = ({
  specialties,
  selectedSpecialties,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (specialty: string) => {
    const updated = selectedSpecialties.includes(specialty) ? 
      selectedSpecialties.filter((s) => s !== specialty) 
      : [...selectedSpecialties, specialty];
    onChange(updated)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4 w-full max-w-md" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full border border-gray-300 rounded-md p-2 text-left bg-white"
      >
        {selectedSpecialties.length > 0
          ? selectedSpecialties.join(', ')
          : 'Filter by Specialty'}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto border border-gray-300 bg-white rounded-md shadow-md">
          {specialties.map((specialty) => (
            <label
              key={specialty}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => handleCheckboxChange(specialty)}
              />
              <span>{specialty}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}