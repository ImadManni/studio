"use client";
import { SignInButtons } from '@/components/signin-buttons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { FadeIn } from '@/components/motion';

export default function SignUpPage() {
	return (
		<div className="container mx-auto max-w-md py-16">
			<FadeIn>
				<Card>
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<ShieldCheck className="h-12 w-12 text-primary" />
						</div>
						<CardTitle className="text-2xl">Create your account</CardTitle>
						<CardDescription>Sign up with Google to access the dashboard and start proctoring</CardDescription>
					</CardHeader>
					<CardContent>
						<SignInButtons />
						<p className="mt-6 text-sm text-center text-muted-foreground">
							Already have an account? <a className="underline hover:text-foreground" href="/signin">Sign in</a>
						</p>
					</CardContent>
				</Card>
			</FadeIn>
		</div>
	);
}


