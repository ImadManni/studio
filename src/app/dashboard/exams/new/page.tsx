import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewExamPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Create New Exam</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="grid gap-4 max-w-xl">
					<div>
						<label className="text-sm" htmlFor="title">Title</label>
						<Input id="title" placeholder="e.g. Physics 101 - Midterm" />
					</div>
					<div>
						<label className="text-sm" htmlFor="date">Date</label>
						<Input id="date" type="date" />
					</div>
					<div>
						<label className="text-sm" htmlFor="notes">Notes</label>
						<Textarea id="notes" placeholder="Optional instructions" />
					</div>
					<div className="flex gap-2">
						<Button type="submit">Save</Button>
						<Button asChild variant="outline">
							<Link href="/dashboard">Cancel</Link>
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}


