"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type LogEntry = {
  id: string
  action: string
  timestamp: number
}

export function InteractionLog() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    // Load logs from localStorage
    const saved = localStorage.getItem("interaction-logs")
    if (saved) {
      setLogs(JSON.parse(saved))
    }
  }, [])

  const addLog = (action: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).slice(2),
      action,
      timestamp: Date.now(),
    }
    const updated = [newLog, ...logs].slice(0, 20) // Keep last 20
    setLogs(updated)
    localStorage.setItem("interaction-logs", JSON.stringify(updated))
  }

  const clearLogs = () => {
    setLogs([])
    localStorage.removeItem("interaction-logs")
  }

  // Expose addLog globally for product card interactions
  useEffect(() => {
    ;(window as any).__addInteractionLog = addLog
  }, [logs])

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Interaction Log</CardTitle>
          {logs.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearLogs} className="text-xs">
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No interactions yet.</p>
        ) : (
          <ScrollArea className="h-64 pr-4">
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="text-sm p-2 rounded bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(log.timestamp)}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
