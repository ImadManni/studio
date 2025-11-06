import { exams, getCandidatesForExam } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default function ExamsAdminPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Exams</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border rounded-lg">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead>Title</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Candidates</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{exams.map((e) => {
								const count = getCandidatesForExam(e.id).length;
								return (
									<TableRow key={e.id}>
										<TableCell>
											<div className="font-medium">{e.title}</div>
										</TableCell>
										<TableCell>{e.date}</TableCell>
										<TableCell>{count}</TableCell>
										<TableCell className="text-right">
											<Link className="underline" href={`/dashboard/exams/${e.id}`}>Overview</Link>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}


