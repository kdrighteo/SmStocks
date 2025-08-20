'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';

export function DateRangePicker({
  className,
  initialDateFrom,
  initialDateTo,
  onUpdate,
  align = 'start',
  showCompare = true,
}: {
  className?: string;
  initialDateFrom: Date | undefined;
  initialDateTo: Date | undefined;
  onUpdate: (range: { range: DateRange }) => void;
  align?: 'start' | 'center' | 'end';
  showCompare?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: initialDateFrom,
    to: initialDateTo,
  });
  const [compare, setCompare] = React.useState(false);

  React.useEffect(() => {
    setRange({
      from: initialDateFrom,
      to: initialDateTo,
    });
  }, [initialDateFrom, initialDateTo]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div>
            <Button
              variant="outline"
              className={cn(
                'w-[300px] justify-start text-left font-normal',
                !range && 'text-gray-500'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {range?.from ? (
                range.to ? (
                  <>
                    {format(range.from, 'LLL dd, y')} -{' '}
                    {format(range.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(range.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={(newRange: DateRange | undefined) => {
              setRange(newRange);
              if (newRange?.from && newRange?.to) {
                onUpdate({ range: newRange });
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
          />
          {showCompare && (
            <div className="border-t p-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="compare"
                  checked={compare}
                  onChange={(e) => setCompare(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="compare"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Compare to previous period
                </label>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setRange({
                  from: today,
                  to: today,
                });
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setRange({
                  from: new Date(today.getFullYear(), today.getMonth(), 1),
                  to: today,
                });
              }}
            >
              This Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setRange({
                  from: addDays(today, -7),
                  to: today,
                });
              }}
            >
              Last 7 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setRange({
                  from: addDays(today, -30),
                  to: today,
                });
              }}
            >
              Last 30 Days
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
