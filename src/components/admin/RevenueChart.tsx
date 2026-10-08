"use client";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";

const COLORS = ["#2f6b4f", "#1b6e8c", "#d6a84a", "#4f9a73"];

export function RevenueChart({ data, kind = "bar" }: { data: { label: string; value: number }[]; kind?: "bar" | "line" }) {
  const Chart = kind === "bar" ? BarChart : LineChart;
  return (
    <div className="h-64 w-full" role="img" aria-label="Chart">
      <ResponsiveContainer>
        <Chart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e2d3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
          <Tooltip />
          {kind === "bar" ? <Bar dataKey="value" fill="#2f6b4f" radius={[6, 6, 0, 0]} /> : <Line dataKey="value" stroke="#1b6e8c" strokeWidth={3} dot={false} type="monotone" />}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}

export function PopularityChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart><Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={3}>{data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
      </ResponsiveContainer>
    </div>
  );
}