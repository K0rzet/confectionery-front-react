import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import cakeDecorationsService from '@/services/cake-decorations/cake-decorations.service'
import { format } from 'date-fns'

export function CakeDecorationsPage() {
  const [filter, setFilter] = useState({
    expirationDateStart: '',
    expirationDateEnd: ''
  })

  const [appliedFilter, setAppliedFilter] = useState({
    expirationDateStart: '',
    expirationDateEnd: ''
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cakeDecorations', appliedFilter],
    queryFn: () => cakeDecorationsService.fetchAll(appliedFilter)
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilter(prev => ({ ...prev, [name]: value }))
  }

  const handleApplyFilters = () => {
    setAppliedFilter(filter)
    refetch()
  }

  const handleResetFilters = () => {
    setFilter({
      expirationDateStart: '',
      expirationDateEnd: ''
    })
    setAppliedFilter({
      expirationDateStart: '',
      expirationDateEnd: ''
    })
    refetch()
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div>
      <h1>Cake Decorations</h1>
      <div className="mb-4">
        <label className="mr-2">
          Expiration Date Start:
          <input
            type="date"
            name="expirationDateStart"
            value={filter.expirationDateStart}
            onChange={handleFilterChange}
            className="ml-2 p-1 border rounded text-black"
          />
        </label>
        <label className="mr-2">
          Expiration Date End:
          <input
            type="date"
            name="expirationDateEnd"
            value={filter.expirationDateEnd}
            onChange={handleFilterChange}
            className="ml-2 p-1 border rounded text-black"
          />
        </label>
        <button
          onClick={handleApplyFilters}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset Filters
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Purchase Price</th>
            <th className="py-2 px-4 border-b">Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.decorations.map((decoration: any) => (
            <tr key={decoration.id}>
              <td>{decoration.name}</td>
              <td>{decoration.quantity}</td>
              <td>{decoration.purchasePrice}</td>
              <td>{new Date(decoration.expirationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>Total Count: {data?.data.totalCount}</p>
        <p>Total Quantity: {data?.data.totalQuantity}</p>
        <p>Total Purchase Price: {data?.data.totalPurchasePrice}</p>
      </div>
    </div>
  )
}
