'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ProfileEditor({ initialName, initialBio }: { initialName: string; initialBio: string }) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const { toast } = useToast();

  const handleSave = () => {
    // For demo: persist to localStorage
    localStorage.setItem('profile_name', name);
    localStorage.setItem('profile_bio', bio);
    toast({ title: 'Profile saved', description: 'Changes saved locally.' });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Full name</label>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium">Bio</label>
        <textarea className="w-full p-2 border rounded" value={bio} onChange={e => setBio(e.target.value)} />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
