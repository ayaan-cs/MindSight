import React from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceArea,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { BANDS } from '../eeg/signal';

const BandChart = ({
    data,
    height = 320,
    showLegend = true,
    highlightRange = null,
    className = ''
}) => (
    <div className={`band-chart ${className}`.trim()} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                    dataKey="time"
                    stroke="#a5b4fc"
                    tick={{ fill: '#a5b4fc', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
                    tickLine={{ stroke: '#475569' }}
                    axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                    stroke="#a5b4fc"
                    tick={{ fill: '#a5b4fc', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
                    tickLine={{ stroke: '#475569' }}
                    axisLine={{ stroke: '#475569' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: 2,
                        color: '#f8fafc',
                        fontFamily: 'IBM Plex Sans, sans-serif'
                    }}
                    labelStyle={{ color: '#a5b4fc', fontFamily: 'IBM Plex Mono, monospace' }}
                    itemStyle={{ color: '#e0e7ff' }}
                    formatter={(value, name) => [Number(value).toFixed(2), name]}
                    labelFormatter={(label) => `t = ${label}`}
                />
                {showLegend && (
                    <Legend
                        wrapperStyle={{ color: '#e0e7ff', fontSize: 12, fontFamily: 'IBM Plex Sans, sans-serif' }}
                    />
                )}
                {highlightRange && (
                    <ReferenceArea
                        x1={highlightRange.start}
                        x2={highlightRange.end}
                        fill="#6366f1"
                        fillOpacity={0.16}
                        stroke="#6366f1"
                        strokeOpacity={0.55}
                    />
                )}
                {BANDS.map((band) => (
                    <Line
                        key={band.key}
                        type="monotone"
                        dataKey={band.key}
                        name={band.name}
                        stroke={band.color}
                        dot={false}
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export default BandChart;
