
'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Camera, AlertTriangle, Phone, Users, EyeOff } from 'lucide-react';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

type DetectionState =
  | 'initializing'
  | 'no_camera_permission'
  | 'no_camera_found'
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
  no_camera_permission: {
    message: 'Webcam permission denied',
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'bg-red-500/20 text-red-400',
    borderColor: 'border-red-500',
  },
  no_camera_found: {
    message: 'Webcam not found',
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
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const requestCameraPermission = async () => {
    setDetectionState('initializing');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
        setDetectionState('face_ok');
      } else {
        setDetectionState('no_camera_found');
        setHasCameraPermission(false);
      }
    } catch (error: any) {
      console.error('Error accessing webcam:', error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setDetectionState('no_camera_permission');
      } else {
        setDetectionState('no_camera_found');
      }
      setHasCameraPermission(false);
       toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
    }
  };


  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    let eventInterval: NodeJS.Timeout | null = null;
    let eventIndex = 0;

    if (hasCameraPermission) {
      // Simulate events
      eventInterval = setInterval(() => {
        eventIndex = (eventIndex + 1) % SIMULATED_EVENTS.length;
        setDetectionState(SIMULATED_EVENTS[eventIndex]);
      }, 7000);
    }

    return () => {
      if (eventInterval) {
        clearInterval(eventInterval);
      }
      if(videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [hasCameraPermission]);

  const config = detectionConfig[detectionState];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Live Feed</CardTitle>
        {hasCameraPermission && (
        <Badge variant="outline" className={`transition-colors ${config.color}`}>
          {config.icon}
          <span>{config.message}</span>
        </Badge>
        )}
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
            className={`absolute inset-0 border-4 transition-colors ${hasCameraPermission ? config.borderColor : 'border-transparent'}`}
            style={{
              boxShadow: hasCameraPermission ? `0 0 20px ${config.borderColor.replace('border-', 'var(--color-')}) inset` : 'none',
            }}
          />
          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
              <Alert variant="destructive" className="max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  {detectionState === 'no_camera_permission' 
                    ? "You've denied camera access. Please enable it in your browser's site settings and try again."
                    : "No webcam was found. Please connect a camera and try again."
                  }
                   <Button onClick={requestCameraPermission} className="mt-4 w-full">Retry</Button>
                </AlertDescription>
              </Alert>
            </div>
          )}
           {detectionState === 'initializing' && hasCameraPermission === null && (
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

    