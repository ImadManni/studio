import { getCandidateById, getAlertsByCandidateId } from '@/lib/data';
import type { Candidate, Alert } from '@/lib/types';
import { notFound } from 'next/navigation';
import { WebcamFeed } from './webcam-feed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { BarChart as BarChartIcon, Clock, Eye, Mic, Phone, ShieldAlert, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';
import { AudioAnalyzer } from './audio-analyzer';
import { ReportDialog } from './report-dialog';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

interface ProctoringViewProps {
  candidateId: string;
}

const alertIcons: Record<Alert['type'], React.ReactNode> = {
  face: <Users className="h-4 w-4" />,
  eye: <Eye className="h-4 w-4" />,
  object: <Phone className="h-4 w-4" />,
  audio: <Mic className="h-4 w-4" />,
};

const chartData = [
  { metric: 'Gaze Deviation', value: 78, fill: 'var(--color-gaze)' },
  { metric: 'Talk Time', value: 25, fill: 'var(--color-talk)' },
  { metric: 'Head Movement', value: 45, fill: 'var(--color-head)' },
];

const chartConfig = {
  value: {
    label: 'Value',
  },
  gaze: {
    label: 'Gaze Deviation',
    color: 'hsl(var(--chart-1))',
  },
  talk: {
    label: 'Talk Time',
    color: 'hsl(var(--chart-2))',
  },
  head: {
    label: 'Head Movement',
    color: 'hsl(var(--chart-3))',
  },
};


export function ProctoringView({ candidateId }: ProctoringViewProps) {
  const candidate = getCandidateById(candidateId);
  const alerts = getAlertsByCandidateId(candidateId);

  if (!candidate) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Monitoring: {candidate.name}</CardTitle>
          <CardDescription>Exam ID: {candidate.examId}</CardDescription>
        </CardHeader>
        <CardFooter className='flex gap-4'>
             <Badge className="text-base px-3 py-1">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Suspicion Score: {candidate.suspicionScore}%
            </Badge>
             <ReportDialog candidate={candidate} alerts={alerts} />
        </CardFooter>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WebcamFeed />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        {alertIcons[alert.type]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {alert.timestamp}
                        </p>
                        {alert.screenshotDataUri && (
                            <Image
                                src={alert.screenshotDataUri}
                                alt={`Alert screenshot for ${alert.description}`}
                                width={200}
                                height={112}
                                data-ai-hint="alert screenshot"
                                className="mt-2 rounded-md border"
                            />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    <p>No alerts triggered for this candidate.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AudioAnalyzer />
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChartIcon className="mr-2 h-5 w-5" />
                  Behavioral Statistics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[200px]">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 10, right: 10 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="metric"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            width={100}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="value" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
