"use client";
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function SignInButtons() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');
	
	return (
		<div className="flex flex-col gap-3">
			{error === 'Configuration' && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						There is a problem with the server configuration. Please contact support.
					</AlertDescription>
				</Alert>
			)}
			<Button
				className="w-full"
				onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
			>
				Continue with Google
			</Button>
		</div>
	);
}


