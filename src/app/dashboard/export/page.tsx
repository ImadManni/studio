import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExportControls from '@/components/export-controls';
import StudentExport from '@/components/student-export';

export default function ExportPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Export Reports</h1>
					<p className="text-sm text-muted-foreground">Export candidate activity, summaries and suspicious flags. Choose a format (CSV, PDF or JSON) and optionally upload the export for archival.</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Export Options</CardTitle>
				</CardHeader>
				<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h3 className="text-sm font-semibold mb-2">Bulk Exports</h3>
									<ExportControls />
								</div>
								<div>
									<h3 className="text-sm font-semibold mb-2">Export Individual Student</h3>
									<StudentExport />
								</div>
							</div>
				</CardContent>
			</Card>
		</div>
	);
}


