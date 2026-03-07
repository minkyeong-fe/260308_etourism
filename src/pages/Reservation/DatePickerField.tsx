import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

/** YYYY-MM-DD → "YYYY년 M월 D일" */
function formatDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${y}년 ${m}월 ${d}일`
}

/** Date → 로컬 기준 YYYY-MM-DD (toISOString은 UTC라 타임존 오차 방지) */
function dateToISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

interface DatePickerFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  /** 체크아웃일 선택 시 체크인 이전 날짜 비활성화용 */
  disabledBefore?: string
}

export function DatePickerField({
  value,
  onChange,
  placeholder = '날짜 선택',
  id,
  disabledBefore,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)

  const date = value ? new Date(value + 'T12:00:00') : undefined
  const disabled = disabledBefore
    ? (() => {
        const d = new Date(disabledBefore + 'T12:00:00')
        d.setDate(d.getDate() + 1)
        return { before: d }
      })()
    : undefined

  return (
    <div className="flex flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal h-8',
                !value && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {value ? formatDisplay(value) : placeholder}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                const iso = dateToISO(d)
                onChange(iso)
                queueMicrotask(() => setOpen(false))
              }
            }}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
