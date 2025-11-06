"use client";
import Link from 'next/link';
import { FadeIn, SlideUp, Stagger } from '@/components/motion';
import dynamic from 'next/dynamic';
import Stats from '@/components/marketing/Stats';
import Features from '@/components/marketing/Features';
import Testimonial from '@/components/marketing/Testimonial';
import FAQ from '@/components/marketing/FAQ';
import CTA from '@/components/marketing/CTA';
import { Button } from '@/components/ui/button';

const BackgroundScene = dynamic(() => import('@/components/three/BackgroundScene'), { 
	ssr: false,
	loading: () => null 
});

export default function HomePage() {
	return (
		<>
			<BackgroundScene />
			<div className="container py-16 relative z-10">
				<FadeIn as="section">
					<div className="text-center max-w-2xl mx-auto">
						<h1 className="text-3xl font-semibold tracking-tight">AI Proctor Sentinel</h1>
						<p className="mt-4 text-muted-foreground">
							Secure, real-time proctoring with webcam monitoring, audio analysis, and detailed reports.
						</p>
						<Stagger>
							<SlideUp>
								<div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
									<Button asChild variant="outline">
										<Link href="/signin">Sign in</Link>
									</Button>
									<Button asChild variant="default">
										<Link href="/signup">Create account</Link>
									</Button>
									<Button asChild variant="outline">
										<Link href="/dashboard">Go to dashboard</Link>
									</Button>
								</div>
							</SlideUp>
						</Stagger>
					</div>
				</FadeIn>
			</div>
			<Stats />
			<Features />
			<Testimonial />
			<FAQ />
			<CTA />
		</>
	);
}
