"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import type { AvailableSubject } from "@/app/types"

interface SubjectFormProps {
  availableSubjects: AvailableSubject[]
  addedSubjectIds: string[]
  onAddSubject: (subjectId: string) => void
}

export function SubjectForm({ availableSubjects, addedSubjectIds, onAddSubject }: SubjectFormProps) {
  const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState<string>("")

  const handleAddSubject = () => {
    if (!selectedSubjectToAdd) return
    onAddSubject(selectedSubjectToAdd)
    setSelectedSubjectToAdd("")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-4">
      <div className="w-full sm:w-auto">
        <Label htmlFor="add-subject" className="mb-2 block">
          Fach hinzufügen
        </Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedSubjectToAdd} onValueChange={setSelectedSubjectToAdd}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Fach auswählen" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects
                .filter((subject) => !addedSubjectIds.includes(subject.id))
                .map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddSubject} disabled={!selectedSubjectToAdd} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Hinzufügen
          </Button>
        </div>
      </div>
    </div>
  )
}

