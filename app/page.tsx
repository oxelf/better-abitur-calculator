"use client"

import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { SubjectForm } from "./components/subject-form"
import { SubjectTable } from "./components/subject-table"
import { ResultsOverview } from "./components/results-overview"
import { HelpSection } from "./components/help-section"
import type { Subject, SubjectType, ExamType, CalculationResults, AvailableSubject } from "./types"
import createAbiturWorker from "./abitur-worker";

// Available subjects
const availableSubjects: AvailableSubject[] = [
  { id: "phy", name: "Phy" },
  { id: "pi", name: "PI" },
  { id: "deu", name: "Deu" },
  { id: "eng", name: "Eng" },
  { id: "reli", name: "Reli" },
  { id: "mat", name: "Mat" },
  { id: "ge", name: "Ge" },
  { id: "powi", name: "PoWi" },
  { id: "tl", name: "TL" },
  { id: "tw-er", name: "TW-Er" },
  { id: "sport", name: "Sport" },
  { id: "d-lit", name: "D. Lit" },
]

export default function AbiturRechner() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [results, setResults] = useState<CalculationResults>({
    totalPoints: 0,
    averageGrade: "-",
    validSelection: false,
    baseCoursesCount: 0,
    advancedCoursesCount: 0,
    examSubjectsCount: 0,
    lkPoints: 0,
    gkPoints: 0,
    examPoints: 0,
    messages: [],
  })
  const [darkMode, setDarkMode] = useState(false)
  const [isPending, startTransition] = useTransition()
  const worker = createAbiturWorker();
  worker.onmessage = (event: MessageEvent<Results>) => {
      setResults(event.data);
      console.log("got results");
    };

  // Add a subject from the dropdown
  const addSubject = (subjectId: string) => {
    const subjectToAdd = availableSubjects.find((s) => s.id === subjectId)
    if (!subjectToAdd) return

    // Check if subject already exists
    if (subjects.some((s) => s.id === subjectToAdd.id)) {
      return // Subject already added
    }

    const newSubject: Subject = {
      id: subjectToAdd.id,
      name: subjectToAdd.name,
      type: "GK",
      examType: "None",
      grades: { Q1: null, Q2: null, Q3: null, Q4: null },
      examGrade: null,
      selected: true,
    }

    setSubjects((prevSubjects) => [...prevSubjects, newSubject])
  }

  const calculate = async () => {
  //worker.postMessage({ subjects });
    console.log("started worker");
    calculateAbitur();
  }

  // Update subject type (LK or GK)
  const updateSubjectType = (id: string, type: SubjectType) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, type } : subject)))
  }

  // Update exam type
  const updateExamType = (id: string, examType: ExamType) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, examType } : subject)))
  }

  // Update grade for a specific quarter
  const updateGrade = async (id: string, quarter: keyof Subject["grades"], value: number | null) => {

    setSubjects(
      subjects.map((subject) =>
        subject.id === id
          ? {
              ...subject,
              grades: { ...subject.grades, [quarter]: value },
            }
          : subject,
      ),
    )

  }

  // Update exam grade
  const updateExamGrade = (id: string, value: number | null) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, examGrade: value } : subject)))

  }

  // Toggle subject selection
  const toggleSubjectSelection = (id: string) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, selected: !subject.selected } : subject)));

  }

  // Remove a subject
  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id))

  }

  // Calculate Abitur grade
const calculateAbitur = async () => {
    const selectedSubjects = subjects.filter((s) => s.selected)
    const messages: string[] = []

    // Count LKs and GKs
    const lkSubjects = selectedSubjects.filter((s) => s.type === "LK")
    const gkSubjects = selectedSubjects.filter((s) => s.type === "GK")
    const examSubjects = selectedSubjects.filter((s) => s.examType !== "None")

    // Check if we have exactly 2 LKs
    if (lkSubjects.length !== 2) {
      messages.push("Du musst genau 2 Leistungskurse wählen.")
    }

    // Check if we have exactly 5 exam subjects (3 written, 2 oral)
    if (examSubjects.length !== 5) {
      messages.push("Du musst genau 5 Prüfungsfächer wählen (3 schriftlich, 2 mündlich).")
    } else {
      const writtenExams = examSubjects.filter((s) => s.examType === "Written")
      const oralExams = examSubjects.filter((s) => s.examType === "Oral")

      if (writtenExams.length !== 3) {
        messages.push("Du musst genau 3 schriftliche Prüfungsfächer wählen.")
      }

      if (oralExams.length !== 2) {
        messages.push("Du musst genau 2 mündliche Prüfungsfächer wählen.")
      }
    }

    // Check if all exam subjects have an exam grade
    examSubjects.forEach((subject) => {
      if (subject.examGrade === null) {
        messages.push(`Bitte gib eine Prüfungsnote für ${subject.name} ein.`)
      }
    })

    // Check if we have enough courses with grades
    let totalCourses = 0
    let totalPoints = 0
    let lkPoints = 0
    let examPoints = 0

    selectedSubjects.forEach((subject) => {
      Object.values(subject.grades).forEach((grade) => {
        if (grade !== null) {
          // Add to LK points if this is a Leistungskurs
          if (subject.type === "LK") {
            lkPoints += grade
          }else {
          totalCourses++
          totalPoints += grade
          }

          
        }
      })

      // Add exam grade to exam points
      if (subject.examType !== "None" && subject.examGrade !== null) {
        examPoints += subject.examGrade
      }
    })

    // We need exactly 24 base courses (Grundkurse)
    if (totalCourses !== 24) {
      messages.push(`Du musst genau 24 Grundkurse einbringen. Aktuell: ${totalCourses}`)
    }

    console.log("total gk points: " + totalPoints);
    lkPoints *= 2
    examPoints *= 4
    let gkPoints = totalPoints
    totalPoints = totalPoints + lkPoints + examPoints
    // Calculate average grade if valid
    let averageGrade: number | string = "-"
    if (messages.length === 0 && totalCourses === 24) {
     if (totalPoints < 300) averageGrade = -1;
else if (totalPoints <= 318) averageGrade = 3.9;
else if (totalPoints <= 336) averageGrade = 3.8;
else if (totalPoints <= 354) averageGrade = 3.7;
else if (totalPoints <= 372) averageGrade = 3.6;
else if (totalPoints <= 390) averageGrade = 3.5;
else if (totalPoints <= 408) averageGrade = 3.4;
else if (totalPoints <= 426) averageGrade = 3.3;
else if (totalPoints <= 444) averageGrade = 3.2;
else if (totalPoints <= 462) averageGrade = 3.1;
else if (totalPoints <= 480) averageGrade = 3.0;
else if (totalPoints <= 498) averageGrade = 2.9;
else if (totalPoints <= 516) averageGrade = 2.8;
else if (totalPoints <= 534) averageGrade = 2.7;
else if (totalPoints <= 552) averageGrade = 2.6;
else if (totalPoints <= 570) averageGrade = 2.5;
else if (totalPoints <= 588) averageGrade = 2.4;
else if (totalPoints <= 606) averageGrade = 2.3;
else if (totalPoints <= 624) averageGrade = 2.2;
else if (totalPoints <= 642) averageGrade = 2.1;
else if (totalPoints <= 660) averageGrade = 2.0;
else if (totalPoints <= 678) averageGrade = 1.9;
else if (totalPoints <= 696) averageGrade = 1.8;
else if (totalPoints <= 714) averageGrade = 1.7;
else if (totalPoints <= 732) averageGrade = 1.6;
else if (totalPoints <= 750) averageGrade = 1.5;
else if (totalPoints <= 768) averageGrade = 1.4;
else if (totalPoints <= 786) averageGrade = 1.3;
else if (totalPoints <= 804) averageGrade = 1.2;
else if (totalPoints <= 822) averageGrade = 1.1;
else if (totalPoints <= 900) averageGrade = 1.0;
      else averageGrade = 1.0;
    }

 
    setResults({
      totalPoints,
      averageGrade,
      validSelection: messages.length === 0,
      baseCoursesCount: totalCourses,
      advancedCoursesCount: lkSubjects.length,
      examSubjectsCount: examSubjects.length,
      lkPoints,
      gkPoints,
      examPoints,
      messages,
    })
  }

  
  // Calculate on any change to subjects
  useEffect(() => {
  calculate();
  }, [subjects]);

  // Initialize dark mode based on user preference
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Set initial dark mode state
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }


  const exportData = () => {
    const dataStr = JSON.stringify(subjects, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `abitur-daten-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Import data from JSON file
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedSubjects = JSON.parse(content) as Subject[]
        setSubjects(importedSubjects)
      } catch (error) {
        alert("Fehler beim Importieren der Daten. Bitte überprüfe die Datei.")
        console.error("Import error:", error)
      }
    }
    reader.readAsText(file)

    // Reset the input value so the same file can be imported again if needed
    event.target.value = ""
    
  }

  // Reset all data
  const resetData = () => {
    if (
      window.confirm("Möchtest du wirklich alle Daten zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.")
    ) {
      setSubjects([])
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Abitur Rechner</CardTitle>
              <CardDescription className="text-primary-foreground/90">
                Berechne deine voraussichtliche Abiturnote
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <img src="https://www.max-eyth-schule.de/theme/img/logo.svg" alt="MES Logo" className="h-10" />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle dark mode</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="subjects">
            <TabsList className="mb-4">
              <TabsTrigger value="subjects">Fächer & Noten</TabsTrigger>
              <TabsTrigger value="results">Ergebnisse</TabsTrigger>
              <TabsTrigger value="help">Hilfe</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportData} title="Daten exportieren">
                Exportieren
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("import-file").click()}
                title="Daten importieren"
              >
                Importieren
              </Button>
              <input type="file" id="import-file" className="hidden" accept=".json" onChange={importData} />
              <Button
                variant="outline"
                size="sm"
                onClick={resetData}
                className="text-destructive hover:text-destructive"
                title="Alle Daten zurücksetzen"
              >
                Zurücksetzen
              </Button>
            </div>

            <TabsContent value="subjects">
              <div className="space-y-6">
                <SubjectForm
                  availableSubjects={availableSubjects}
                  addedSubjectIds={subjects.map((s) => s.id)}
                  onAddSubject={addSubject}
                />

                <SubjectTable
                  subjects={subjects}
                  onToggleSelection={toggleSubjectSelection}
                  onUpdateSubjectType={updateSubjectType}
                  onUpdateExamType={updateExamType}
                  onUpdateGrade={updateGrade}
                  onUpdateExamGrade={updateExamGrade}
                  onRemoveSubject={removeSubject}
                />
              </div>
            </TabsContent>

            <TabsContent value="results">
              <ResultsOverview results={results} />
            </TabsContent>

            <TabsContent value="help">
              <HelpSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Abitur Rechner für die Max-Eyth-Schule Kassel</p>
        <p>Hinweis: Diese Berechnung dient nur zur Orientierung. Die offizielle Abiturnote kann abweichen.</p>
        <a href="https://de.wikipedia.org/wiki/Abitur_in_Hessen">Abitur Hessen</a>
      </div>
    </div>
  )
}

