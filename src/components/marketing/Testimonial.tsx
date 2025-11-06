"use client";
import { FadeIn } from "@/components/motion";

export default function Testimonial() {
	return (
		<section className="mt-16">
			<FadeIn>
				<div className="border rounded-lg p-6 max-w-3xl mx-auto text-center">
					<p className="text-lg italic">“AI Proctor Sentinel helped us scale remote exams confidently while keeping reviews efficient.”</p>
					<div className="mt-4 text-sm text-muted-foreground">— Director of Assessment, Global EduTech</div>
				</div>
			</FadeIn>
		</section>
	);
}
