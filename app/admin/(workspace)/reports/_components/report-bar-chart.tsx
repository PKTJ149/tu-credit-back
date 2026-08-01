"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

/**
 * The one chart form every report screen renders — a horizontal stacked bar,
 * one row per category, one colour per series. Reused by enrollment, revenue,
 * and workload so the three report screens read as a single system instead of
 * three unrelated charts.
 *
 * Horizontal, not vertical columns: category labels here are Thai program and
 * subject names that run long, and a vertical chart would either truncate
 * them or rotate them unreadably. A horizontal bar gives labels the full
 * width of the panel to read normally.
 */

export type ReportChartSeries = {
  key: string;
  label: string;
  /** A CSS custom property reference, e.g. "var(--chart-1)" — never a literal. */
  color: string;
};

export type ReportChartRow = Record<string, string | number> & { categoryLabel: string };

const AXIS_WIDTH = 172;
/** ~7px per Thai glyph at 12px, minus the tick's own padding. */
const MAX_LABEL_CHARS = 23;

/**
 * Recharts clips an over-long category tick instead of shortening it, and
 * because a horizontal chart's left axis anchors its text to the end, the cut
 * lands on the *front* of the string — "หลักสูตรประกาศนียบัตรพื้นฐานปัญญาประดิษฐ์"
 * arrived on screen as "าคนียบัตรพื้นฐานปัญญาประดิษฐ์", which tells the reader
 * nothing about which bar they are looking at. Truncating from the end keeps
 * the distinguishing start of every label, and the full text stays available on
 * hover and in the data table underneath.
 */
function CategoryTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value?: string };
}) {
  const full = payload?.value ?? "";
  const shown = full.length > MAX_LABEL_CHARS ? `${full.slice(0, MAX_LABEL_CHARS - 1)}…` : full;
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fontSize={12}
      fill="var(--ink-muted)"
    >
      <title>{full}</title>
      {shown}
    </text>
  );
}

type ReportBarChartProps = {
  data: ReportChartRow[];
  series: ReportChartSeries[];
  /** Formats a raw series value for the tooltip — money vs. plain counts. */
  valueFormatter?: (value: number) => string;
  height?: number;
};

export function ReportBarChart({ data, series, valueFormatter, height }: ReportBarChartProps) {
  const config: ChartConfig = Object.fromEntries(series.map((s) => [s.key, { label: s.label, color: s.color }]));
  const chartHeight = height ?? Math.max(200, data.length * 44 + 48);

  return (
    <div className="space-y-3">
      <ChartContainer config={config} className="w-full" style={{ height: chartHeight, aspectRatio: "auto" }}>
        <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16, top: 4, bottom: 4 }} barCategoryGap="24%">
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="categoryLabel"
            tickLine={false}
            axisLine={false}
            width={AXIS_WIDTH}
            tick={<CategoryTick />}
            interval={0}
          />
          <ChartTooltip
            cursor={{ fill: "var(--surface-strong)" }}
            content={
              <ChartTooltipContent
                formatter={
                  valueFormatter
                    ? (value, name) => (
                        <span className="flex w-full items-center justify-between gap-3">
                          <span className="text-[var(--ink-muted)]">{name}</span>
                          <span className="font-mono font-medium tabular-nums">
                            {valueFormatter(typeof value === "number" ? value : Number(value))}
                          </span>
                        </span>
                      )
                    : undefined
                }
              />
            }
          />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={`var(--color-${s.key})`}
              stackId="stack"
              stroke="var(--background)"
              strokeWidth={2}
              radius={2}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ChartContainer>

      {/* Hand-built legend, not recharts' <Legend>: recharts silently reverses
          a stacked bar's legend order to read bottom-up with the visual
          stack, which fights the series order each report deliberately
          chose (e.g. confirmed → outstanding → refunded). */}
      {series.length > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: s.color }} aria-hidden />
              <span className="text-[var(--ink-muted)]">{s.label}</span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
