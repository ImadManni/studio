"use client";
import { SignInButtons } from '@/components/signin-buttons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated' && session) {
			// Optionally redirect after a short delay, or let user choose
			// router.push('/dashboard');
		}
	}, [status, session, router]);

	return (
		<div className="container mx-auto max-w-md py-16">
			<FadeIn>
				<Card>
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<ShieldCheck className="h-12 w-12 text-primary" />
						</div>
						<CardTitle className="text-2xl">Welcome back</CardTitle>
						<CardDescription>Sign in to continue to your dashboard</CardDescription>
					</CardHeader>
					<CardContent>
						{session ? (
							<div className="space-y-4">
								<p className="text-sm text-center text-muted-foreground">
									You're signed in as {session.user?.email}
								</p>
								<Button asChild className="w-full">
									<Link href="/dashboard">Go to Dashboard</Link>
								</Button>
								<p className="text-xs text-center text-muted-foreground">
									Want to sign in with a different account? Sign out first from the dashboard.
								</p>
							</div>
						) : (
							<>
								<SignInButtons />
								<p className="mt-6 text-sm text-center text-muted-foreground">
									New here? <a className="underline hover:text-foreground" href="/signup">Create your account</a>
								</p>
							</>
						)}
					</CardContent>
				</Card>
			</FadeIn>
		</div>
	);
}


