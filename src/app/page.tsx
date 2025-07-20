"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { AdvocatesTable } from "@/components/AdvocatesTable";
import type { Advocate } from "@/components/AdvocatesTable";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/advocates")
      .then((response) => {
        response.json()
      .then((jsonResponse) => {
        jsonResponse.data.forEach((advocate: any) => {
          console.log(
            `ID: ${advocate.id} | ${advocate.firstName} ${advocate.lastName} | ${advocate.specialties.length} specialties`
          );
        });
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("error fetching advocates:", err);
        setLoading(false);
      })
    });
  }, []);

  //debounce effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 200)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    const userInput = debouncedTerm.toLowerCase().trim()
  
    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(userInput) ||
        advocate.lastName.toLowerCase().includes(userInput) ||
        advocate.city.toLowerCase().includes(userInput) ||
        advocate.degree.toLowerCase().includes(userInput) ||
        advocate.specialties.some((s) =>
          s.toLowerCase().includes(userInput)
        ) ||
        advocate.yearsOfExperience.toString().includes(userInput) ||
        advocate.phoneNumber.toString().includes(userInput)
      )
    })
  
    setFilteredAdvocates(filtered)
  }, [debouncedTerm, advocates])

  return (
    <main className="m-9">
      <h1 className="text-[#265b4e] font-bold text-2xl my-2">Find Solace Advocates</h1>
      <p className="text-lg py-4">Find an advocate who will help untangle your healthcare by phone or video—no matter what you need—covered by Medicare.</p>
      <SearchBar 
        searchTerm={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        onReset={() => setSearchTerm('')} 
      />
      <br />
      {loading ? (
        <p>Loading advocates that match your search term</p>
      ) : filteredAdvocates.length > 0 ? (
        <AdvocatesTable 
          advocates={filteredAdvocates} 
          searchTerm={searchTerm}
        />
      ) : (
        <p>No advocates found.</p>
      )}
    </main>
  );
}
