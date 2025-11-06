"use client";
import { FadeIn } from "@/components/motion";

export default function Stats() {
	const stats = [
		{ label: "Exams Proctored", value: "12,540" },
		{ label: "Flagged Events", value: "8,213" },
		{ label: "Avg Confidence", value: "92%" },
		{ label: "Avg Latency", value: "142ms" },
	];
	return (
		<section className="mt-10">
			<FadeIn>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{stats.map((s) => (
						<div key={s.label} className="border rounded-lg p-4 text-center">
							<div className="text-xl font-semibold">{s.value}</div>
							<div className="text-xs text-muted-foreground mt-1">{s.label}</div>
						</div>
					))}
				</div>
			</FadeIn>
		</section>
	);
}
