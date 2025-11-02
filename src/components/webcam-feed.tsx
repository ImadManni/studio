'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera, AlertTriangle, Phone, Users, EyeOff } from 'lucide-react';
import { Badge } from './ui/badge';

type DetectionState =
  | 'initializing'
  | 'no_camera'
  | 'face_ok'
  | 'no_face'
  | 'multi_face'
  | 'phone_detected'
  | 'looking_away';

const detectionConfig: Record<
  DetectionState,
  { message: string; icon: React.ReactNode; color: string; borderColor: string }
> = {
  initializing: {
    message: 'Initializing Camera...',
    icon: <Camera className="h-4 w-4" />,
    color: 'bg-blue-500/20 text-blue-400',
    borderColor: 'border-blue-500',
  },
  no_camera: {
    message: 'Webcam not found or permission denied',
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'bg-red-500/20 text-red-400',
    borderColor: 'border-red-500',
  },
  face_ok: {
    message: 'Identity Verified',
    icon: <Camera className="h-4 w-4" />,
    color: 'bg-green-500/20 text-green-400',
    borderColor: 'border-green-500',
  },
  no_face: {
    message: 'No Face Detected',
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'bg-red-500/20 text-red-400',
    borderColor: 'border-red-500',
  },
  multi_face: {
    message: 'Multiple Faces Detected',
    icon: <Users className="h-4 w-4" />,
    color: 'bg-red-500/20 text-red-400',
    borderColor: 'border-red-500',
  },
  phone_detected: {
    message: 'Phone Detected',
    icon: <Phone className="h-4 w-4" />,
    color: 'bg-orange-500/20 text-orange-400',
    borderColor: 'border-orange-500',
  },
  looking_away: {
    message: 'Looking Away From Screen',
    icon: <EyeOff className="h-4 w-4" />,
    color: 'bg-yellow-500/20 text-yellow-400',
    borderColor: 'border-yellow-500',
  },
};

const SIMULATED_EVENTS: DetectionState[] = [
  'face_ok',
  'face_ok',
  'face_ok',
  'looking_away',
  'face_ok',
  'phone_detected',
  'face_ok',
  'no_face',
  'face_ok',
  'multi_face',
];

export function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detectionState, setDetectionState] = useState<DetectionState>('initializing');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let eventInterval: NodeJS.Timeout | null = null;
    let eventIndex = 0;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setDetectionState('face_ok');

            // Simulate events
            eventInterval = setInterval(() => {
              eventIndex = (eventIndex + 1) % SIMULATED_EVENTS.length;
              setDetectionState(SIMULATED_EVENTS[eventIndex]);
            }, 7000);
          }
        } else {
          setDetectionState('no_camera');
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        setDetectionState('no_camera');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (eventInterval) {
        clearInterval(eventInterval);
      }
    };
  }, []);

  const config = detectionConfig[detectionState];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Live Feed</CardTitle>
        <Badge variant="outline" className={`transition-colors ${config.color}`}>
          {config.icon}
          <span>{config.message}</span>
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-md bg-muted">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          <div
            className={`absolute inset-0 border-4 transition-colors ${config.borderColor}`}
            style={{
              boxShadow: `0 0 20px ${config.borderColor.replace('border-', 'var(--color-')}) inset`,
            }}
          />
          {(detectionState === 'no_camera' || detectionState === 'initializing') && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
              {config.icon}
              <p className="mt-2 text-sm text-muted-foreground">
                {config.message}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
