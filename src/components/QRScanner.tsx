import React, { useRef, useState, useEffect } from 'react';
import jsQR from 'jsqr';
import { Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface QRScannerProps {
  onClose: () => void;
  onScan?: (result: string) => void;
}

export default function QRScanner({ onClose, onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let animFrame: number;
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        const ms = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(ms);
        currentStream = ms;
        if (videoRef.current) {
          videoRef.current.srcObject = ms;
          // Important: Tell browser to play inline (iOS Safari)
          videoRef.current.setAttribute("playsinline", "true"); 
          videoRef.current.play();
          requestAnimationFrame(tick);
        }
      } catch (err) {
        setError('لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الصلاحيات.');
        console.error(err);
      }
    };

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        if (canvasRef.current && videoRef.current) {
          canvasRef.current.height = videoRef.current.videoHeight;
          canvasRef.current.width = videoRef.current.videoWidth;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });
            if (code) {
              if (onScan) {
                onScan(code.data);
              }
              // Stop parsing once we find a code
              return;
            }
          }
        }
      }
      animFrame = requestAnimationFrame(tick);
    };

    startCamera();

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center rtl" dir="rtl">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-4 bg-surface/10 text-white rounded-full hover:bg-surface/20 transition-all backdrop-blur-md"
      >
        <X size={24} />
      </button>

      <div className="relative w-full max-w-md aspect-[3/4] md:aspect-square bg-black rounded-3xl overflow-hidden border-4 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-red-400 font-bold">
            {error}
          </div>
        ) : (
          <>
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanner overlay */}
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
              <div className="w-full h-full border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)_inset] relative">
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-0.5 bg-green-500 shadow-[0_0_10px_#22c55e]"
                />
              </div>
            </div>
            
            <div className="absolute bottom-10 left-0 w-full text-center text-white/70 font-bold pointer-events-none">
              قم بتوجيه الكاميرا نحو رمز الاستجابة السريعة (QR)
            </div>
          </>
        )}
      </div>
    </div>
  );
}
