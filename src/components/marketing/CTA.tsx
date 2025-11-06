"use client";
import { SlideUp } from "@/components/motion";
import Link from "next/link";

export default function CTA() {
	return (
		<section className="mt-16">
			<SlideUp>
				<div className="border rounded-lg p-6 text-center max-w-3xl mx-auto">
					<h3 className="text-xl font-semibold">Ready to secure your next exam?</h3>
					<p className="text-muted-foreground mt-2">Start with Google sign-in or browse the dashboard.</p>
					<div className="mt-6 flex items-center justify-center gap-3">
						<Link href="/signin" className="px-4 py-2 rounded-md border">Sign in</Link>
						<Link href="/signup" className="px-4 py-2 rounded-md border">Create account</Link>
						<Link href="/dashboard" className="px-4 py-2 rounded-md border">Open dashboard</Link>
					</div>
				</div>
			</SlideUp>
		</section>
	);
}


