"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function HelpSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Wie funktioniert der Abitur Rechner?</h3>
        <p>Mit diesem Rechner kannst du deine voraussichtliche Abiturnote berechnen. Folge diesen Schritten:</p>
        <ol className="list-decimal pl-5 mt-2 space-y-2">
          <li>Wähle deine Fächer aus dem Dropdown-Menü aus und füge sie hinzu</li>
          <li>Bestimme für jedes Fach, ob es ein Leistungskurs (LK) oder Grundkurs (GK) ist</li>
          <li>Wähle deine Prüfungsfächer (3 schriftlich, 2 mündlich)</li>
          <li>Trage deine Noten (0-15 Punkte) für jedes Quartal (Q1-Q4) ein</li>
          <li>Gib deine Prüfungsnoten für die Abiturprüfungen ein</li>
          <li>Überprüfe deine Ergebnisse im "Ergebnisse"-Tab</li>
        </ol>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Anforderungen für das Abitur</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Du musst genau 2 Leistungskurse wählen</li>
          <li>Du musst genau 5 Prüfungsfächer haben (3 schriftlich, 2 mündlich)</li>
          <li>Du musst genau 24 Grundkurse einbringen</li>
          <li>Alle Noten werden in Punkten von 0 bis 15 angegeben</li>
          <li>Für jedes Prüfungsfach muss eine Prüfungsnote eingetragen werden</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Punktesystem</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Punkte</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Beschreibung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>15-13</TableCell>
              <TableCell>1</TableCell>
              <TableCell>Sehr gut</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>12-10</TableCell>
              <TableCell>2</TableCell>
              <TableCell>Gut</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>9-7</TableCell>
              <TableCell>3</TableCell>
              <TableCell>Befriedigend</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>6-4</TableCell>
              <TableCell>4</TableCell>
              <TableCell>Ausreichend</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3-1</TableCell>
              <TableCell>5</TableCell>
              <TableCell>Mangelhaft</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>0</TableCell>
              <TableCell>6</TableCell>
              <TableCell>Ungenügend</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

