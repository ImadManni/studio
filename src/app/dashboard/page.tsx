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
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Download } from 'lucide-react';
import { FadeIn } from '@/components/motion';

const statusColors: Record<CandidateStatus, string> = {
  Clear: 'bg-green-500/20 text-green-400 border-green-500/30',
  Warn: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Alert: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function DashboardPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Candidates Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/dashboard/export"><Download className="h-4 w-4 mr-2"/>Export</Link></Button>
            <Button asChild size="sm"><Link href="/dashboard/exams/new"><Plus className="h-4 w-4 mr-2"/>New Exam</Link></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FadeIn>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Suspicion Score</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="person portrait" />
                      <AvatarFallback>
                        {candidate.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{candidate.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground">{candidate.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("whitespace-nowrap", statusColors[candidate.status])}>
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{candidate.suspicionScore}%</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/candidate/${candidate.id}`}>
                            View
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </FadeIn>
      </CardContent>
    </Card>
  );
}
