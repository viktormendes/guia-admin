"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, Check, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export function VersionManager() {
  const [version, setVersion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    fetchVersion()
  }, [])

  const fetchVersion = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/version')
      // const data = await response.json()

      // Simulating API response
      const data = { version: "2025.009" }

      setVersion(data.version)
    } catch (error) {
      console.error("Failed to fetch version:", error)
      toast({
        title: "Error",
        description: "Failed to fetch current version",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const incrementVersion = async () => {
    if (!version) return

    setIsUpdating(true)
    try {
      // Parse the current version
      const [year, num] = version.split(".")
      const numPadded = num.padStart(3, "0")
      const nextNum = (Number.parseInt(numPadded) + 1).toString().padStart(3, "0")
      const newVersion = `${year}.${nextNum}`

      // In a real app, this would be an actual API call
      // const response = await fetch('/api/version', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ version: newVersion })
      // })
      // const data = await response.json()

      // Simulating API response
      const data = { version: newVersion }

      setVersion(data.version)
      setUpdateSuccess(true)

      toast({
        title: "Success",
        description: `Version updated to ${data.version}`,
        variant: "default",
      })

      // Reset success state after 2 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to update version:", error)
      toast({
        title: "Error",
        description: "Failed to update version",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Badge variant="outline" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading...
        </Badge>
      ) : (
        <Badge variant="outline">v{version}</Badge>
      )}

      <Button
        size="sm"
        variant="outline"
        className="gap-1 h-8"
        onClick={incrementVersion}
        disabled={isUpdating || isLoading}
      >
        {isUpdating ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : updateSuccess ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <ArrowUp className="h-3 w-3" />
        )}
        Upgrade
      </Button>
    </div>
  )
}

