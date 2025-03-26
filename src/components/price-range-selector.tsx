"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";

type PriceRangeSelectorProps = {
  min: number;
  max: number;
  value: [number, number];
  defaultValue?: [number, number];
  step?: number;
  onRangeChange: (range: [number, number]) => void;
};

export default function PriceRangeSelector({
  min = 0,
  max = 1000000000,
  defaultValue = [0, 1000000000],
  step = 1,
  onRangeChange,
}: PriceRangeSelectorProps) {
  const [range, setRange] = React.useState<[number, number]>(defaultValue);

  const handleRangeChange = (newRange: number[]) => {
    const [start, end] = newRange as [number, number];
    setRange([start, end]);
    onRangeChange?.([start, end]);
  };

  const handleInputChange = (value: string, index: 0 | 1) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const newRange = [...range] as [number, number];
    newRange[index] = numValue;

    // Ensure min value doesn't exceed max value and vice versa
    if (index === 0 && numValue > range[1]) {
      newRange[0] = range[1];
    } else if (index === 1 && numValue < range[0]) {
      newRange[1] = range[0];
    }

    setRange(newRange);
    onRangeChange?.(newRange);
  };

  return (
    <div className="w-full max-w-sm space-y-4" dir="rtl">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="number"
            value={range[1]}
            onChange={(e) => handleInputChange(e.target.value, 1)}
            min={min}
            max={max}
            step={step}
            className="text-right w-36"
            placeholder="السعر الى"
          />
        </div>
        <div className="flex-1">
          <Input
            type="number"
            value={range[0]}
            onChange={(e) => handleInputChange(e.target.value, 0)}
            min={min}
            max={max}
            step={step}
            className="text-right w-32"
            placeholder="السعر من"
          />
        </div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={range}
        onValueChange={handleRangeChange}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track className="bg-neutral-200 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-red-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-red-500 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Minimum price"
        />
        <Slider.Thumb
          className="block w-4 h-4 bg-red-500 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Maximum price"
        />
      </Slider.Root>
    </div>
  );
}
