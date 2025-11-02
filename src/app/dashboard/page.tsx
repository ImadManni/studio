import { candidates } from '@/lib/data';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { CandidateStatus } from '@/lib/types';

const statusColors: Record<CandidateStatus, string> = {
  Clear: 'bg-green-500/20 text-green-400 border-green-500/30',
  Warn: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Alert: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function DashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidates Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Suspicion Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id} className="cursor-pointer hover:bg-card/60">
                <TableCell>
                  <Link href={`/dashboard/candidate/${candidate.id}`} tabIndex={-1}>
                    <Avatar>
                      <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="person portrait" />
                      <AvatarFallback>
                        {candidate.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/candidate/${candidate.id}`} className="block h-full w-full">
                    <div className="font-medium">{candidate.name}</div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/candidate/${candidate.id}`} className="block h-full w-full">
                    <div className="text-muted-foreground">{candidate.email}</div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/candidate/${candidate.id}`} className="block h-full w-full">
                    <Badge variant="outline" className={statusColors[candidate.status]}>
                      {candidate.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/candidate/${candidate.id}`} className="block h-full w-full">
                    {candidate.suspicionScore}%
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
