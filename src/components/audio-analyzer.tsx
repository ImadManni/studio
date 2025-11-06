'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Mic, StopCircle, Loader, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeAudioForSuspiciousKeywords } from '@/lib/actions';
import type { AnalyzeAudioOutput } from '@/ai/flows/analyze-audio-suspicious-keywords';

export function AudioAnalyzer() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeAudioOutput | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    setAnalysisResult(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = handleStopRecording;
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);

        setTimeout(() => {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }, 5000); // Record for 5 seconds

      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Audio Error',
          description: 'Could not access microphone. Please check permissions.',
        });
      }
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      const response = await analyzeAudioForSuspiciousKeywords(base64Audio);
      
      if (response.success && response.data) {
        setAnalysisResult(response.data);
        if (response.data.isSuspicious) {
          toast({
            title: 'Suspicious Audio Detected',
            description: response.data.analysisDetails,
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: response.error,
        });
      }
      setIsLoading(false);
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Audio Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleStartRecording}
          disabled={isRecording || isLoading}
          className="w-full"
        >
          {isRecording ? (
            <>
              <StopCircle className="mr-2 h-4 w-4 animate-pulse" />
              Recording... (5s)
            </>
          ) : isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Audio Analysis
            </>
          )}
        </Button>
        {analysisResult && (
          <div className="p-4 rounded-md bg-muted/50 space-y-2 text-sm">
            <h4 className="font-semibold flex items-center">
              {analysisResult.isSuspicious ? (
                <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
              ) : null}
              Analysis Complete
            </h4>
            <p>
              <span className="font-medium">Suspicious: </span>
              <span className={analysisResult.isSuspicious ? 'text-destructive' : 'text-green-400'}>
                {analysisResult.isSuspicious ? 'Yes' : 'No'}
              </span>
            </p>
            <p><span className="font-medium">Multiple Voices: </span>{analysisResult.multipleVoicesDetected ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Keywords Found: </span>{analysisResult.suspiciousKeywords.length > 0 ? analysisResult.suspiciousKeywords.join(', ') : 'None'}</p>
            <p className="text-muted-foreground italic">"{analysisResult.analysisDetails}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
