import { ProctoringView } from '@/components/proctoring-view';
import { candidates } from '@/lib/data';

export async function generateStaticParams() {
  return candidates.map(c => ({ id: c.id }));
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function CandidatePage({ params }: PageProps) {
  return <ProctoringView candidateId={params.id} />;
}
