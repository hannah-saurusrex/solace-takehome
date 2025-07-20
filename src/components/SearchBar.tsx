'use client'

type Props = {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export function SearchBar({ searchTerm, onChange, onReset }: Props) {
  return (
    <div>
      <label htmlFor="search" className="block text-md font-medium text-gray-700 mb-1">
        Searching for: <span>{searchTerm}</span>
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={onChange}
        placeholder="e.g. Pediatrics, New York, MSW"
        className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3f937c] focus:border-[#3f937c]"
      />
        <button 
          onClick={onReset} 
          className="bg-[#285e50] hover:bg-[#1D4339] text-white py-3 px-4 my-2 md:my-0 md:mx-2 rounded-xl w-full md:w-auto"
        >
          Clear Search
        </button>
    </div>
  )
}