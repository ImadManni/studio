import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import SignOutButton from '@/components/signout-button';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions as any) as any;

  const user = session?.user ?? null;

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        {user?.image ? (
          <Image src={user.image} alt={user.name ?? 'Avatar'} width={80} height={80} className="rounded-full" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">No Image</div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{user?.name ?? 'User'}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground mt-1">{user?.role ? `Role: ${user.role}` : 'Role: User'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <section className="mb-6">
            <h2 className="text-lg font-medium mb-2">Account Details</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div><strong>Full name:</strong> {user?.name ?? '—'}</div>
              <div><strong>Email:</strong> {user?.email ?? '—'}</div>
              <div><strong>Provider:</strong> Google</div>
            </div>
          </section>
        </div>

        <div className="flex items-start">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}