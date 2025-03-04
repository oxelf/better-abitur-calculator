"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { CalculationResults } from "@/app/types"

interface ResultsOverviewProps {
  results: CalculationResults
}

export function ResultsOverview({ results }: ResultsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Gesamtpunktzahl</CardTitle>
          </CardHeader>
          <CardContent>
           <div className="flex row items-end">
            <p className="text-3xl font-bold">{results.totalPoints}</p>
            <p className="text-xl font-bold">/900</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Abiturdurchschnitt</CardTitle>
          </CardHeader>
          <CardContent>
            {(results.averageGrade > 0)?<p className="text-4xl font-bold">{results.averageGrade}</p>: <p className="text-2xl font-bold text-red-600">Nicht Bestanden</p>}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {results.validSelection ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
              <p className="text-lg font-medium">{results.validSelection ? "Gültige Auswahl" : "Ungültige Auswahl"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Leistungskurse</CardTitle>
            <CardDescription>Punkte aus den Leistungskursen</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="flex row items-end">
            <p className="text-3xl font-bold">{results.lkPoints}</p>
            <p className="text-xl font-bold">/240</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Prüfungen</CardTitle>
            <CardDescription>Punkte aus den Abiturprüfungen</CardDescription>
          </CardHeader>
          <CardContent>
           <div className="flex row items-end">
            <p className="text-3xl font-bold">{results.examPoints}</p>
            <p className="text-xl font-bold">/300</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <h3 className="font-medium mb-2">Grundkurse</h3>
          <p className="text-2xl font-bold">{results.baseCoursesCount} / 24</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Leistungskurse</h3>
          <p className="text-2xl font-bold">{results.advancedCoursesCount} / 2</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Prüfungsfächer</h3>
          <p className="text-2xl font-bold">{results.examSubjectsCount} / 5</p>
        </div>
      </div>

      {results.messages.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler in der Auswahl</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {results.messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

