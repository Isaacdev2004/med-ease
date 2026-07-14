import * as React from "react"
import { Activity, HeartPulse, Thermometer, Droplets, Scale } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusDot } from "@/components/medical/status-dot"
import { cn } from "@/lib/utils"

export type VitalSign = "heartRate" | "bloodPressure" | "temperature" | "bloodOxygen" | "weight" | "respiratoryRate"

interface VitalsCardProps {
  type: VitalSign
  value: string | number
  unit: string
  trend?: "up" | "down" | "stable"
  status?: "normal" | "warning" | "critical"
  timeago?: string
  className?: string
}

const vitalConfig = {
  heartRate: { icon: HeartPulse, label: "Heart Rate", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-500/20" },
  bloodPressure: { icon: Activity, label: "Blood Pressure", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/20" },
  temperature: { icon: Thermometer, label: "Temperature", color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-500/20" },
  bloodOxygen: { icon: Droplets, label: "SpO2", color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-500/20" },
  weight: { icon: Scale, label: "Weight", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/20" },
  respiratoryRate: { icon: Activity, label: "Resp. Rate", color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
}

export function VitalsCard({ type, value, unit, trend, status = "normal", timeago, className }: VitalsCardProps) {
  const config = vitalConfig[type]
  const Icon = config.icon

  return (
    <Card className={cn("overflow-hidden hover-elevate transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {config.label}
        </CardTitle>
        <div className={cn("p-2 rounded-full", config.bg)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold tracking-tight">
            {value}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {unit}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {status === "normal" && <StatusDot status="success" />}
            {status === "warning" && <StatusDot status="warning" animate />}
            {status === "critical" && <StatusDot status="destructive" animate />}
            <span className="text-xs font-medium capitalize text-muted-foreground">{status}</span>
          </div>
          {timeago && (
            <span className="text-xs text-muted-foreground">{timeago}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
