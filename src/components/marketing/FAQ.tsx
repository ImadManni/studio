"use client";
import { FadeIn } from "@/components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
	{ q: "Is webcam/audio data stored?", a: "You control retention; defaults minimize storage and use client-side processing where possible." },
	{ q: "Can I export reports?", a: "Yes, summary reports can be exported and attached to exam records." },
	{ q: "What about SSO?", a: "OAuth via Google is built-in; more enterprise providers can be added." },
];

export default function FAQ() {
	return (
		<section className="mt-16 max-w-3xl mx-auto">
			<FadeIn>
				<h2 className="text-2xl font-semibold text-center">Frequently asked questions</h2>
				<Accordion type="single" collapsible className="mt-6">
					{items.map((it, idx) => (
						<AccordionItem key={idx} value={`item-${idx}`}>
							<AccordionTrigger>{it.q}</AccordionTrigger>
							<AccordionContent>{it.a}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</FadeIn>
		</section>
	);
}
