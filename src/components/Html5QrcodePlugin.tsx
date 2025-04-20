
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
    // when component mounts
    let html5QrCode: Html5Qrcode;

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
        html5QrCode = new Html5Qrcode(qrcodeRegionId);
        html5QrCodeRef.current = html5QrCode;
        
        console.log("Starting QR code scanner...");

        // Ajuste o tamanho do qrbox para ser responsivo
        const qrboxSize = typeof qrbox === 'number' 
          ? Math.min(qrbox, Math.min(element.offsetWidth, element.offsetHeight) - 10) 
          : qrbox;
          
        // Configuração para melhor desempenho
        const config = { 
          fps, 
          qrbox: qrboxSize,
          disableFlip,
          aspectRatio: 1.0,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        };

        // Configuração personalizada para silenciar erros repetitivos do QR code scanner
        const errorCallback = (error: string) => {
          // Log all errors for debugging
          console.log("QR Code scanner error:", error);
          
          // Filtrar apenas erros importantes, ignorando os erros comuns de IndexSizeError e NotFoundException
          if (!error.includes('IndexSizeError') && !error.includes('NotFoundException')) {
            if (qrCodeErrorCallback) {
              qrCodeErrorCallback(error);
            } else {
              console.error("QR Code scanner error:", error);
            }
          }
        };

        // Start scanning with improved error handling
        html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText: string, decodedResult: any) => {
            console.log("QR code detected:", decodedText);
            qrCodeSuccessCallback(decodedText, decodedResult);
          },
          errorCallback
        ).catch((err) => {
          console.error("Error starting QR Code scanner", err);
        });
      } catch (err) {
        console.error("Failed to initialize QR code scanner:", err);
      }
    }, 500); // Pequeno atraso para garantir que o DOM está pronto

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
      <div id={qrcodeRegionId} className="w-full h-64 bg-gray-100 rounded-md overflow-hidden" />
    </div>
  );
};

export default Html5QrcodePlugin;
