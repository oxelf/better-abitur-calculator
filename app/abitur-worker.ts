// abiturWorker.ts - Web Worker for Abitur Calculation
export default function createAbiturWorker() {
  const workerCode = () => {
    self.onmessage = (event: MessageEvent<{ subjects: Subject[] }>) => {
      const { subjects } = event.data;
      const messages: string[] = [];

      let examSubjectsCount = 0;
      let gkSubjectsCount = 0;
      let lkSubjectsCount = 0;
      let totalPoints = 0;
      let lkPoints = 0;
      let examPoints = 0;
      let totalCourses = 0;

      let writtenExams = 0;
      let oralExams = 0;

      for (const subject of subjects) {
        if (!subject.selected) continue; // Skip unselected subjects

        // Process grades
        for (const grade of Object.values(subject.grades)) {
          if (grade !== null) {
            if (subject.type === "LK") {
              lkPoints += grade;
            } else {
              gkSubjectsCount++;
              totalPoints += grade;
            }
          }
        }

        if (subject.type === "LK") lkSubjectsCount++;

        if (subject.examType !== "None") {
          if (subject.examGrade !== null) {
            examPoints += subject.examGrade;
            examSubjectsCount++;

            if (subject.examType === "Written") writtenExams++;
            if (subject.examType === "Oral") oralExams++;
          } else {
            messages.push(`Bitte gib eine Prüfungsnote für ${subject.name} ein.`);
          }
        }
      }

      // Validate course selections
      if (lkSubjectsCount !== 2) messages.push("Du musst genau 2 Leistungskurse wählen.");
      if (gkSubjectsCount !== 24) messages.push(`Du musst genau 24 Grundkurse einbringen. Aktuell: ${gkSubjectsCount}`);
      if (examSubjectsCount !== 5) messages.push("Du musst genau 5 Prüfungsfächer wählen (3 schriftlich, 2 mündlich).");
      if (writtenExams !== 3) messages.push("Du musst genau 3 schriftliche Prüfungsfächer wählen.");
      if (oralExams !== 2) messages.push("Du musst genau 2 mündliche Prüfungsfächer wählen.");

      // Compute final points
      lkPoints *= 2;
      examPoints *= 4;
      let gkPoints = totalPoints;
      totalPoints = totalPoints + lkPoints + examPoints;

      let averageGrade: number | string = "-";
      if (messages.length === 0 && gkSubjectsCount === 24) {
        const avgPoints = totalPoints / gkSubjectsCount;
        if (avgPoints >= 13.5) averageGrade = 1.0;
        else if (avgPoints >= 12.5) averageGrade = 1.3;
        else if (avgPoints >= 11.5) averageGrade = 1.7;
        else if (avgPoints >= 10.5) averageGrade = 2.0;
        else if (avgPoints >= 9.5) averageGrade = 2.3;
        else if (avgPoints >= 8.5) averageGrade = 2.7;
        else if (avgPoints >= 7.5) averageGrade = 3.0;
        else if (avgPoints >= 6.5) averageGrade = 3.3;
        else if (avgPoints >= 5.5) averageGrade = 3.7;
        else if (avgPoints >= 4.5) averageGrade = 4.0;
        else averageGrade = 5.0;
      }

      self.postMessage({
        totalPoints,
        averageGrade,
        validSelection: messages.length === 0,
        baseCoursesCount: gkSubjectsCount,
        advancedCoursesCount: lkSubjectsCount,
        examSubjectsCount,
        lkPoints,
        gkPoints,
        examPoints,
        messages,
      });
    };
  };

  const blob = new Blob([`(${workerCode})()`], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
}

