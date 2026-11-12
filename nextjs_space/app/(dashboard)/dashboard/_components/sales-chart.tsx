'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function SalesChart({ data }: { data: any[] }) {
  const chartData = (data ?? []).length > 0 ? data : [
    { day: 'Mon', stockIn: 120, stockOut: 80 },
    { day: 'Tue', stockIn: 90, stockOut: 110 },
    { day: 'Wed', stockIn: 150, stockOut: 95 },
    { day: 'Thu', stockIn: 80, stockOut: 130 },
    { day: 'Fri', stockIn: 200, stockOut: 160 },
    { day: 'Sat', stockIn: 170, stockOut: 190 },
    { day: 'Sun', stockIn: 60, stockOut: 45 },
  ]
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 10 }} />
          <YAxis tickLine={false} tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="stockIn" name="Stock In" fill="#3da063" radius={[4,4,0,0]} />
          <Bar dataKey="stockOut" name="Stock Out" fill="#1a6bb5" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
