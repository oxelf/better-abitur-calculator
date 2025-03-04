"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Subject, SubjectType, ExamType } from "@/app/types"

interface SubjectTableProps {
  subjects: Subject[]
  onToggleSelection: (id: string) => void
  onUpdateSubjectType: (id: string, type: SubjectType) => void
  onUpdateExamType: (id: string, type: ExamType) => void
  onUpdateGrade: (id: string, quarter: keyof Subject["grades"], value: number | null) => void
  onUpdateExamGrade: (id: string, value: number | null) => void
  onRemoveSubject: (id: string) => void
}

export function SubjectTable({
  subjects,
  onToggleSelection,
  onUpdateSubjectType,
  onUpdateExamType,
  onUpdateGrade,
  onUpdateExamGrade,
  onRemoveSubject,
}: SubjectTableProps) {
  // Generate points options for select
  const pointsOptions = Array.from({ length: 16 }, (_, i) => i)

  if (subjects.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">Keine Fächer vorhanden. Bitte füge Fächer über das Dropdown-Menü hinzu.</p>
      </div>
    )
  }

  // Desktop view (table)
  const DesktopTable = () => (
    <div className="overflow-x-auto hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Auswahl</TableHead>
            <TableHead>Fach</TableHead>
            <TableHead>Kursart</TableHead>
            <TableHead>Prüfungsart</TableHead>
            <TableHead>Q1</TableHead>
            <TableHead>Q2</TableHead>
            <TableHead>Q3</TableHead>
            <TableHead>Q4</TableHead>
            <TableHead>Prüfungsnote</TableHead>
            <TableHead>Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>
                <Checkbox
                  checked={subject.selected}
                  onCheckedChange={() => onToggleSelection(subject.id)}
                  id={`select-${subject.id}`}
                />
              </TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>
                <Select
                  value={subject.type}
                  onValueChange={(value: SubjectType) => onUpdateSubjectType(subject.id, value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Kursart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LK">LK</SelectItem>
                    <SelectItem value="GK">GK</SelectItem>
                    <SelectItem value="None">Keine</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={subject.examType}
                  onValueChange={(value: ExamType) => onUpdateExamType(subject.id, value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Prüfungsart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Written">Schriftlich</SelectItem>
                    <SelectItem value="Oral">Mündlich</SelectItem>
                    <SelectItem value="None">Keine</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              {(["Q1", "Q2", "Q3", "Q4"] as const).map((quarter) => (
                <TableCell key={`${subject.id}-${quarter}`}>
                  <Select
                    value={subject.grades[quarter]?.toString() || "0"}
                    onValueChange={(value) =>
                      onUpdateGrade(subject.id, quarter, value === "0" ? null : Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Punkte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0"> - </SelectItem>
                      {pointsOptions.map((points) => (
                        <SelectItem key={points} value={points.toString()}>
                          {points}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              ))}
              <TableCell>
                {subject.examType !== "None" ? (
                  <Select
                    value={subject.examGrade?.toString() || "0"}
                    onValueChange={(value) =>
                      onUpdateExamGrade(subject.id, value === "0" ? null : Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Punkte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0"> - </SelectItem>
                      {pointsOptions.map((points) => (
                        <SelectItem key={points} value={points.toString()}>
                          {points}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => onRemoveSubject(subject.id)}
                >
                  Entfernen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Mobile view (cards)
  const MobileCards = () => (
    <div className="space-y-4 md:hidden">
      {subjects.map((subject) => (
        <Card key={subject.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Checkbox
                  checked={subject.selected}
                  onCheckedChange={() => onToggleSelection(subject.id)}
                  id={`mobile-select-${subject.id}`}
                />
                {subject.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/80"
                onClick={() => onRemoveSubject(subject.id)}
              >
                Entfernen
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Kursart</label>
                <Select
                  value={subject.type}
                  onValueChange={async (value: SubjectType) => onUpdateSubjectType(subject.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kursart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LK">LK</SelectItem>
                    <SelectItem value="GK">GK</SelectItem>
                    <SelectItem value="None">Keine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Prüfungsart</label>
                <Select
                  value={subject.examType}
                  onValueChange={(value: ExamType) => onUpdateExamType(subject.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Prüfungsart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Written">Schriftlich</SelectItem>
                    <SelectItem value="Oral">Mündlich</SelectItem>
                    <SelectItem value="None">Keine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Noten</label>
              <div className="grid grid-cols-4 gap-2">
                {(["Q1", "Q2", "Q3", "Q4"] as const).map((quarter) => (
                  <div key={`mobile-${subject.id}-${quarter}`}>
                    <div className="text-xs text-center mb-1">{quarter}</div>
                    <Select
                      value={subject.grades[quarter]?.toString() || "0"}
                      onValueChange={async (value) =>
                        onUpdateGrade(subject.id, quarter, value === "0" ? null : Number.parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Punkte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0"> - </SelectItem>
                        {pointsOptions.map((points) => (
                          <SelectItem key={points} value={points.toString()}>
                            {points}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {subject.examType !== "None" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Prüfungsnote</label>
                <Select
                  value={subject.examGrade?.toString() || "0"}
                  onValueChange={(value) =>
                    onUpdateExamGrade(subject.id, value === "0" ? null : Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Punkte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0"> - </SelectItem>
                    {pointsOptions.map((points) => (
                      <SelectItem key={points} value={points.toString()}>
                        {points}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <>
      <DesktopTable />
      <MobileCards />
    </>
  )
}

