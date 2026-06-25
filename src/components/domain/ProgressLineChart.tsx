import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type ChartPoint = { label: string; score: number }

export function ProgressLineChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
        >
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#EEF2F7" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#94A3B8"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            dy={6}
          />
          <YAxis
            stroke="#94A3B8"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            domain={[40, 100]}
            ticks={[40, 60, 80, 100]}
          />
          <Tooltip
            cursor={{ stroke: '#C7D2FE', strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
              fontSize: 12,
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#64748B', fontWeight: 500 }}
            formatter={(value: number) => [`${value}점`, '점수']}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#4F46E5"
            strokeWidth={2.5}
            fill="url(#lineFill)"
            dot={{
              r: 4,
              fill: '#fff',
              stroke: '#4F46E5',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: '#4F46E5',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
