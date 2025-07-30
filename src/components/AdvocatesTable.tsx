'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'

export type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[]; 
  yearsOfExperience: number;
  phoneNumber: number;
}

type Props = {
  advocates: Advocate[];
  searchTerm: string;
  selectedSpecialties: string[];
}

function highlightMatch(text: string | number, term: string) {
  const stringText = String(text)
  const lowerText = stringText.toLowerCase()
  const lowerTerm = term.toLowerCase()

  if (!term || !lowerText.includes(lowerTerm)) return stringText

  const start = lowerText.indexOf(lowerTerm)
  const end = start + lowerTerm.length

  return (
    <>
      {stringText.slice(0, start)}
      <span className="bg-yellow-200">{stringText.slice(start, end)}</span>
      {stringText.slice(end)}
    </>
  )
}

export function AdvocatesTable({ advocates, searchTerm, selectedSpecialties }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Advocate>[] = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => highlightMatch(row.original.firstName, searchTerm),
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => highlightMatch(row.original.lastName, searchTerm),
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => highlightMatch(row.original.city, searchTerm),
    },
    {
      accessorKey: 'degree',
      header: 'Degree',
      cell: ({ row }) => highlightMatch(row.original.degree, searchTerm),
    },
    {
      accessorKey: 'specialties',
      header: 'Specialties',
      enableSorting: false,
      cell: ({ row }) => (
        <ul>
          {row.original.specialties.map((s, i) => {
            const matchedFilter = selectedSpecialties.length
              ? selectedSpecialties.find((filter) => 
                s.toLowerCase().includes(filter.toLowerCase())
              )
              : null;

            const highlightTerm = matchedFilter || searchTerm
            
            return (
              <li key={i}>{highlightMatch(s, highlightTerm)}</li>
            )
          })}
        </ul>
      ),
    },
    {
      accessorKey: 'yearsOfExperience',
      header: 'Years of Exp.',
      cell: ({ row }) =>
        highlightMatch(row.original.yearsOfExperience, searchTerm),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone',
      enableSorting: false,
      cell: ({ row }) => highlightMatch(row.original.phoneNumber, searchTerm),
    },
  ]

  const table = useReactTable({
    data: advocates,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-x-auto md:border md:border-gray-300 rounded-md">
      <table className="hidden md:table w-full border-collapse">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                return (
                  <th
                    key={header.id}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    className={`px-4 py-2 border border-gray-300 text-left bg-[#285e50] hover:bg-[#1D4339] text-white ${
                      canSort ? 'cursor-pointer select-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {(canSort && {
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted() as string]) ?? null}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-gray-200 hover:bg-[#285e50]/20">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border border-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-4 mt-4">
        {table.getRowModel().rows.map((row) => {
          const data = row.original;
          return (
            <div key={row.id} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
              <p><span className="font-semibold">First Name:</span> {highlightMatch(data.firstName, searchTerm)}</p>
              <p><span className="font-semibold">Last Name:</span> {highlightMatch(data.lastName, searchTerm)}</p>
              <p><span className="font-semibold">City:</span> {highlightMatch(data.city, searchTerm)}</p>
              <p><span className="font-semibold">Degree:</span> {highlightMatch(data.degree, searchTerm)}</p>
              <p><span className="font-semibold">Specialties:</span>
                <ul className="list-disc ml-5">
                  {data.specialties.map((s, i) => (
                    <li key={i}>{highlightMatch(s, searchTerm)}</li>
                  ))}
                </ul>
              </p>
              <p><span className="font-semibold">Years of Exp.:</span> {highlightMatch(data.yearsOfExperience, searchTerm)}</p>
              <p><span className="font-semibold">Phone:</span> {highlightMatch(data.phoneNumber, searchTerm)}</p>
            </div>
          );
        })}
      </div>
    </div>
  )
}
