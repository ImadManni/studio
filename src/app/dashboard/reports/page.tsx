import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getExamById, getCandidatesForExam, exams } from '@/lib/data';
import { ReportDialog } from '@/components/report-dialog';
import ReportUploader from '../../../components/report-uploader';

export default function ReportsPage() {
  // server-side data load: list of exams
  const allExams = exams;

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Exam Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate AI-driven integrity reports for any candidate's exam. You can also upload or download
          report files (PDF / DOC).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/export">
                <Button variant="outline">Go to Export Page</Button>
              </Link>
              <ReportUploader />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {allExams.map(exam => (
            <Card key={exam.id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{exam.title}</span>
                  <span className="text-sm text-muted-foreground">{exam.id}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{exam.description}</p>

                <div className="space-y-3">
                  {getCandidatesForExam(exam.id).map(candidate => (
                    <div
                      key={candidate.id}
                      className="p-3 rounded-md border border-border flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.email}</div>
                      </div>
                      <div className="space-x-2">
                        {/* ReportDialog is a client component that will call the server action to generate the report */}
                        <ReportDialog candidate={candidate} alerts={[]} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
