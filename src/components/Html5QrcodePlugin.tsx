
import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: number | { width: number; height: number };
  disableFlip?: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (errorMessage: string) => void;
}

const Html5QrcodePlugin = ({
  fps = 10,
  qrbox = 250,
  disableFlip = false,
  qrCodeSuccessCallback,
  qrCodeErrorCallback
}: Html5QrcodePluginProps) => {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Clear any previous instance
    if (html5QrCodeRef.current?.isScanning) {
      html5QrCodeRef.current.stop().catch(console.error);
    }

    // Espera um momento para garantir que o DOM está totalmente renderizado
    const initTimeout = setTimeout(() => {
      try {
        // Certifique-se de que o elemento existe
        const element = document.getElementById(qrcodeRegionId);
        if (!element) {
          console.error("QR code container element not found");
          return;
        }

        // Creates an instance of Html5Qrcode
        const html5QrCode = new Html5Qrcode(qrcodeRegionId, { verbose: true });
        html5QrCodeRef.current = html5QrCode;
        
        console.log("Starting QR code scanner with enhanced configuration...");

        // Calcular o tamanho responsivo para qrbox
        const containerWidth = element.clientWidth || 300;
        const containerHeight = element.clientHeight || 300;
        const minDimension = Math.min(containerWidth, containerHeight);
        const qrboxSize = typeof qrbox === 'number' 
          ? Math.min(qrbox, minDimension - 10) 
          : { 
              width: Math.min(qrbox.width, minDimension - 10),
              height: Math.min(qrbox.height, minDimension - 10)
            };

        // Configuração avançada
        const config = { 
          fps, 
          qrbox: qrboxSize,
          disableFlip,
          aspectRatio: 1.0,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          },
          rememberLastUsedCamera: true,
          supportedScanTypes: [Html5Qrcode.SCAN_TYPE_CAMERA]
        };

        console.log("QR Scanner config:", config);

        // Configuração personalizada para erros
        const errorCallback = (error: string) => {
          console.log("QR Code scanner error:", error);
          
          // Filter out common errors that aren't relevant to users
          if (!error.includes('NotFoundException') && 
              !error.includes('IndexSizeError') && 
              !error.includes('NotAllowedError: The request is not allowed') && 
              !error.includes('NotFoundError: Requested device not found')) {
            if (qrCodeErrorCallback) {
              qrCodeErrorCallback(error);
            }
          }
        };

        // Start scanning with improved error handling
        html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText: string, decodedResult: any) => {
            console.log("QR code detected successfully:", decodedText);
            qrCodeSuccessCallback(decodedText, decodedResult);
          },
          errorCallback
        ).catch((err) => {
          console.error("Error starting QR Code scanner:", err);
        });
      } catch (err) {
        console.error("Failed to initialize QR code scanner:", err);
      }
    }, 800); // Aumento do atraso para garantir que o DOM esteja completamente pronto

    // cleanup function when component unmounts
    return () => {
      clearTimeout(initTimeout);
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().then(() => {
          console.log('QR Code scanner stopped');
        }).catch((err) => {
          console.error('Failed to stop QR Code scanner', err);
        });
      }
    };
  }, [fps, qrbox, disableFlip, qrCodeSuccessCallback, qrCodeErrorCallback]);

  return (
    <div>
      <div id={qrcodeRegionId} className="w-full h-72 bg-gray-100 rounded-md overflow-hidden" />
    </div>
  );
};

export default Html5QrcodePlugin;
