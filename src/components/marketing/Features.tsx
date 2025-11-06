"use client";
import { FadeIn, SlideUp, Stagger } from "@/components/motion";
import { ShieldCheck, Camera, Mic2, FileText, Gauge, Cog } from "lucide-react";

const items = [
	{ icon: ShieldCheck, title: "Secure by design", desc: "JWT sessions, middleware guards, and OAuth for single-click access." },
	{ icon: Camera, title: "AI Webcam Monitoring", desc: "Detects absence, multiple faces, and suspicious movement patterns." },
	{ icon: Mic2, title: "Audio Analysis", desc: "Flags risky keywords and conversations in realtime." },
	{ icon: FileText, title: "Actionable Reports", desc: "Clear summaries, timelines and exportable artifacts for audits." },
	{ icon: Gauge, title: "Performance", desc: "Built on Next.js App Router with Turbopack for fast DX." },
	{ icon: Cog, title: "Configurable", desc: "Tune sensitivity and thresholds per exam policy." },
];

export default function Features() {
	return (
		<section className="mt-16">
			<FadeIn>
				<h2 className="text-center text-2xl font-semibold">Everything you need for proctoring</h2>
				<p className="text-center text-muted-foreground mt-2">Professional, privacy-aware tooling that scales with your org.</p>
			</FadeIn>
			<Stagger>
				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((f, i) => (
						<SlideUp key={i}>
							<div className="border rounded-lg p-5 h-full">
								<f.icon className="h-6 w-6 text-primary" />
								<h3 className="mt-3 font-medium">{f.title}</h3>
								<p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
							</div>
						</SlideUp>
					))}
				</div>
			</Stagger>
		</section>
	);
}
