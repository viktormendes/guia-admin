"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AddStudentModal from "./AddStudentModal"

export default function StudentsClientActions() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button className="bg-green-700 hover:bg-green-800 text-white font-medium flex gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Estudante
      </Button>
      <AddStudentModal open={open} onOpenChange={setOpen} />
    </>
  )
} 