import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

export type RadarItem = { axis: string; value: number }

export function ScoreRadarChart({ data }: { data: RadarItem[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            dataKey="value"
            stroke="#4F46E5"
            fill="#6366F1"
            fillOpacity={0.28}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
