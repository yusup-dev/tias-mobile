import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';

export type SpiderPoint = { label: string; value: number; target?: number };

/**
 * Spider (radar) chart dengan react-native-svg. Skala 0–max (default 100). Garis biru = capaian,
 * garis abu putus-putus = target. Minimal 3 sumbu; kurang dari itu ditampilkan sebagai batang sederhana
 * oleh pemanggil.
 */
export default function SpiderChart({ data, size = 300, max = 100 }: { data: SpiderPoint[]; size?: number; max?: number }) {
  const n = data.length;
  if (n < 3) return null;
  const c = size / 2;
  const r = c - 38; // ruang untuk label
  const ang = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const pt = (i: number, v: number) => {
    const k = Math.max(0, Math.min(v, max)) / max;
    return [c + r * k * Math.cos(ang(i)), c + r * k * Math.sin(ang(i))];
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];
  const hasTarget = data.some(d => (d.target ?? 0) > 0);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {rings.map(k => (
          <Polygon key={k} points={data.map((_, i) => [c + r * k * Math.cos(ang(i)), c + r * k * Math.sin(ang(i))].join(',')).join(' ')} fill="none" stroke="#D1D5DB" strokeWidth={1} />
        ))}
        {data.map((_, i) => (
          <Line key={i} x1={c} y1={c} x2={c + r * Math.cos(ang(i))} y2={c + r * Math.sin(ang(i))} stroke="#E5E7EB" strokeWidth={1} />
        ))}
        {rings.map(k => (
          <SvgText key={`t${k}`} x={c + 3} y={c - r * k + 10} fontSize={8} fill="#9CA3AF">
            {Math.round(max * k)}
          </SvgText>
        ))}
        {hasTarget && (
          <Polygon points={poly(data.map(d => d.target ?? 0))} fill="none" stroke="#6B7280" strokeWidth={1.5} strokeDasharray="5,4" />
        )}
        <Polygon points={poly(data.map(d => d.value))} fill="rgba(37,99,235,0.25)" stroke="#2563EB" strokeWidth={2} />
        {data.map((d, i) => {
          const [x, y] = pt(i, d.value);
          return <Circle key={`p${i}`} cx={x} cy={y} r={3.5} fill="#2563EB" />;
        })}
        {data.map((d, i) => {
          const lx = c + (r + 20) * Math.cos(ang(i));
          const ly = c + (r + 20) * Math.sin(ang(i));
          return (
            <G key={`l${i}`}>
              <SvgText x={lx} y={ly - 2} fontSize={10} fontWeight="bold" fill="#111827" textAnchor="middle">
                {d.label}
              </SvgText>
              <SvgText x={lx} y={ly + 10} fontSize={9} fill="#2563EB" textAnchor="middle">
                {Math.round(d.value * 10) / 10}
              </SvgText>
            </G>
          );
        })}
      </Svg>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <View style={{ width: 14, height: 3, backgroundColor: '#2563EB', marginRight: 6 }} />
          <SvgLegend text="Capaian" />
        </View>
        {hasTarget && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 14, height: 0, borderTopWidth: 2, borderStyle: 'dashed', borderColor: '#6B7280', marginRight: 6 }} />
            <SvgLegend text="Target" />
          </View>
        )}
      </View>
    </View>
  );
}

const SvgLegend = ({ text }: { text: string }) => <Text style={{ fontSize: 11, color: '#374151' }}>{text}</Text>;
