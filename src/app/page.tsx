"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { AdvocatesTable } from "@/components/AdvocatesTable";
import { SpecialtyFilter } from "@/components/SpecialtyFilter";
import type { Advocate } from "@/components/AdvocatesTable";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    setLoading(true);

    // query string
    const specialtyQuery = selectedSpecialties.map((s) => `specialty=${encodeURIComponent(s)}`).join('&')

    const url = `/api/advocates?limit=${pageSize}&offset=${page * pageSize}${specialtyQuery ? `&${specialtyQuery}` : ''}`
    
    fetch(url)
      .then((response) => {
        response.json()
        .then((jsonResponse) => {
          setAdvocates(jsonResponse.data);
          setFilteredAdvocates(jsonResponse.data);
          setLoading(false);
          const uniqueSpecialties = new Set<string>();
            jsonResponse.data.forEach((advocate: any) => {
              advocate.specialties.forEach((spec: string) => uniqueSpecialties.add(spec));
            });
          setAllSpecialties(Array.from(uniqueSpecialties));
        })
        .catch((err) => {
          console.error("error fetching advocates:", err);
          setLoading(false);
        })
      });
  }, [page, pageSize, selectedSpecialties]);

  //debounce effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 200)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    const userInput = debouncedTerm.toLowerCase().trim();
  
    const filtered = advocates.filter((advocate) => {
      const matchesText =
        advocate.firstName.toLowerCase().includes(userInput) ||
        advocate.lastName.toLowerCase().includes(userInput) ||
        advocate.city.toLowerCase().includes(userInput) ||
        advocate.degree.toLowerCase().includes(userInput) ||
        advocate.specialties.some((s) =>
          s.toLowerCase().includes(userInput)
        ) ||
        advocate.yearsOfExperience.toString().includes(userInput) ||
        advocate.phoneNumber.toString().includes(userInput);
  
      const matchesSpecialty =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.some((spec) =>
          advocate.specialties.includes(spec)
        );
  
      return matchesText && matchesSpecialty;
    });
  
    setFilteredAdvocates(filtered);
  }, [debouncedTerm, advocates, selectedSpecialties]);
  

  return (
    <main className="m-9">
      <h1 className="text-[#265b4e] font-bold text-2xl my-2">Find Solace Advocates</h1>
      <p className="text-lg py-4">Find an advocate who will help untangle your healthcare by phone or video—no matter what you need—covered by Medicare.</p>
      <SpecialtyFilter
        specialties={allSpecialties}
        selectedSpecialties={selectedSpecialties}
        onChange={setSelectedSpecialties}
      />
      <SearchBar 
        searchTerm={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        onReset={() => setSearchTerm('')} 
      />
      <br />
      {loading ? (
        <p>Loading advocates that match your search term</p>
      ) : filteredAdvocates.length > 0 ? (
        <>
          <AdvocatesTable 
            advocates={filteredAdvocates} 
            searchTerm={searchTerm}
            selectedSpecialties={selectedSpecialties}
          />
          <div className="flex justify-center mt-6 gap-4">
            <button
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className="bg-gray-200 hover:bg-[#265b4e]/50 px-4 py-2 rounded-xl disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-[#265b4e] hover:bg-[#1D4339] text-white px-4 py-2 rounded-xl"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No advocates found.</p>
      )}
    </main>
  );
}
