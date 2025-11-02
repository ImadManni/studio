import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Eye, Mic, FileText } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Eye className="h-8 w-8 text-primary" />,
    title: "Gaze & Presence Tracking",
    description: "Monitors candidate's gaze and ensures they remain in frame during the exam.",
  },
  {
    icon: <Mic className="h-8 w-8 text-primary" />,
    title: "Suspicious Audio Detection",
    description: "Analyzes ambient sound for keywords or multiple voices to flag potential cheating.",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Automated AI Reports",
    description: "Generates a comprehensive integrity report with a suspicion score after each session.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="text-primary h-8 w-8" />
          <h1 className="text-xl font-bold text-foreground">
            AI Proctor Sentinel
          </h1>
        </Link>
        <nav>
          <Button asChild>
            <Link href="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center py-20 md:py-32">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsla(var(--primary)/0.2)_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
            Ensure Exam Integrity with AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
            AI Proctor Sentinel is a cutting-edge solution that uses artificial intelligence to monitor online exams, deter cheating, and provide detailed integrity reports.
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                View Live Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-card/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Powerful Proctoring Features</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Our suite of AI-powered tools provides comprehensive monitoring to uphold academic honesty.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/70 backdrop-blur-sm border-border/50">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="mt-4 text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AI Proctor Sentinel. All rights reserved.</p>
      </footer>
    </div>
  );
}
