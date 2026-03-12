"use client";

import { useMemo, useRef } from "react";
import { MANGA_LAYOUT } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────────────────

export interface LayoutItem {
  id: string;
  aspectRatio: number;
}

export interface LayoutResult {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
}

// ─── Bin-Packing Algorithm ──────────────────────────────────────────────
//
// Strategy: justified row layout (like Flickr/Google Photos)
//   1. Accumulate items into a row until the summed aspect ratios
//      would make items shorter than targetRowHeight.
//   2. When a row "overflows", scale all items in that row so they
//      stretch edge-to-edge at exactly containerWidth.
//   3. Panoramas (AR > threshold) get their own full-width row.
//
// The result is a perfectly gapless, edge-to-edge grid where every row
// is the same width but heights vary naturally per row.
// ────────────────────────────────────────────────────────────────────────

function computeLayout(
  items: LayoutItem[],
  containerWidth: number,
  targetRowHeight: number,
  gap: number,
  panoramaThreshold: number
): LayoutResult[] {
  if (containerWidth <= 0 || items.length === 0) return [];

  const results: LayoutResult[] = [];
  let currentRow: LayoutItem[] = [];
  let currentRowAR = 0;
  let yOffset = 0;
  let rowIndex = 0;

  const flushRow = (row: LayoutItem[], isLastRow: boolean) => {
    if (row.length === 0) return;

    const totalGap = gap * (row.length - 1);
    const availableWidth = containerWidth - totalGap;
    const sumAR = row.reduce((sum, item) => sum + item.aspectRatio, 0);

    let rowHeight = availableWidth / sumAR;

    if (isLastRow && rowHeight > targetRowHeight * 1.5) {
      rowHeight = targetRowHeight;
    }

    let xOffset = 0;

    row.forEach((item, i) => {
      const itemWidth = item.aspectRatio * rowHeight;

      const finalWidth =
        i === row.length - 1 && !isLastRow
          ? containerWidth - xOffset
          : itemWidth;

      results.push({
        id: item.id,
        x: xOffset,
        y: yOffset,
        width: Math.max(finalWidth, 0),
        height: rowHeight,
        row: rowIndex,
      });

      xOffset += itemWidth + gap;
    });

    yOffset += rowHeight + gap;
    rowIndex++;
  };

  for (const item of items) {
    if (item.aspectRatio >= panoramaThreshold) {
      if (currentRow.length > 0) {
        flushRow(currentRow, false);
        currentRow = [];
        currentRowAR = 0;
      }
      flushRow([item], false);
      continue;
    }

    const candidateAR = currentRowAR + item.aspectRatio;
    const totalGap = gap * currentRow.length;
    const candidateHeight = (containerWidth - totalGap) / candidateAR;

    if (candidateHeight < targetRowHeight && currentRow.length >= MANGA_LAYOUT.minRowItems) {
      flushRow(currentRow, false);
      currentRow = [item];
      currentRowAR = item.aspectRatio;
    } else {
      currentRow.push(item);
      currentRowAR = candidateAR;
    }

    if (currentRow.length >= MANGA_LAYOUT.maxRowItems) {
      flushRow(currentRow, false);
      currentRow = [];
      currentRowAR = 0;
    }
  }

  if (currentRow.length > 0) {
    flushRow(currentRow, true);
  }

  return results;
}

// ─── Hook ───────────────────────────────────────────────────────────────

export function useMangaLayout(
  items: LayoutItem[],
  containerWidth: number
): { layout: LayoutResult[]; totalHeight: number } {
  // Stabilize the items array reference: only recompute when
  // the serialized items actually change
  const itemsKey = JSON.stringify(items);
  const prevKeyRef = useRef(itemsKey);
  const prevItemsRef = useRef(items);

  if (prevKeyRef.current !== itemsKey) {
    prevKeyRef.current = itemsKey;
    prevItemsRef.current = items;
  }

  const stableItems = prevItemsRef.current;

  return useMemo(() => {
    const targetHeight = containerWidth < 768 ? 180 : MANGA_LAYOUT.targetRowHeight;
    const layout = computeLayout(
      stableItems,
      containerWidth,
      targetHeight,
      MANGA_LAYOUT.gap,
      MANGA_LAYOUT.panoramaThreshold
    );

    const totalHeight =
      layout.length > 0
        ? Math.max(...layout.map((r) => r.y + r.height))
        : 0;

    return { layout, totalHeight };
  }, [stableItems, containerWidth]);
}
