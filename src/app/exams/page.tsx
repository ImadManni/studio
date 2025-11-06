import { exams } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PublicExamsPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Available Exams</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="grid gap-3 sm:grid-cols-2">
					{exams.map(e => (
						<li key={e.id} className="border rounded-lg p-4">
							<div className="font-medium">{e.title}</div>
							<div className="text-sm text-muted-foreground">{e.date}</div>
							{e.description ? <div className="text-sm mt-1">{e.description}</div> : null}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}


