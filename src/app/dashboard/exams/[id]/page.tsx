import { getExamById, getCandidatesForExam } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ExamOverview({ params }: { params: { id: string } }) {
	const exam = getExamById(params.id);
	if (!exam) return notFound();
	const list = getCandidatesForExam(exam.id);
	return (
		<Card>
			<CardHeader>
				<CardTitle>{exam.title} — {exam.date}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">{exam.description ?? 'No description provided.'}</p>
				<div className="border rounded-lg">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Suspicion</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{list.map(c => (
								<TableRow key={c.id}>
									<TableCell>{c.name}</TableCell>
									<TableCell>{c.email}</TableCell>
									<TableCell>{c.status}</TableCell>
									<TableCell>{c.suspicionScore}%</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}


