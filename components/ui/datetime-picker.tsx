"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
}

export function DateTimePicker({ date, setDate, disabled }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    if (date) setSelectedDateTime(date)
  }, [date])

  const handleSelect = (day: Date | undefined) => {
    if (!day) {
      setSelectedDateTime(undefined)
      setDate(undefined)
      return
    }
    
    const newDate = new Date(day)
    if (selectedDateTime) {
      newDate.setHours(selectedDateTime.getHours())
      newDate.setMinutes(selectedDateTime.getMinutes())
    } else {
        newDate.setHours(9)
        newDate.setMinutes(0)
    }
    
    setSelectedDateTime(newDate)
    setDate(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeVal = e.target.value
    if (!timeVal || !selectedDateTime) return

    const [hours, minutes] = timeVal.split(':').map(Number)
    const newDate = new Date(selectedDateTime)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    
    setSelectedDateTime(newDate)
    setDate(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-8 text-sm", 
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy HH:mm") : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hora:</span>
          <Input
            type="time"
            className="h-8 w-32"
            value={selectedDateTime ? format(selectedDateTime, "HH:mm") : ""}
            onChange={handleTimeChange}
            disabled={!selectedDateTime}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}