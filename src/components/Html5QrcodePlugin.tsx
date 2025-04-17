
import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: number;
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
    const config = { fps, qrbox, disableFlip };
    
    // Creates an instance of Html5Qrcode
    const html5QrCode = new Html5Qrcode(qrcodeRegionId);
    html5QrCodeRef.current = html5QrCode;

    // Configuração personalizada para silenciar erros repetitivos do QR code scanner
    const errorCallback = (error: string) => {
      // Filtrar apenas erros importantes, ignorando os erros comuns de IndexSizeError e NotFoundException
      if (!error.includes('IndexSizeError') && !error.includes('NotFoundException')) {
        if (qrCodeErrorCallback) {
          qrCodeErrorCallback(error);
        } else {
          console.error("QR Code scanner error:", error);
        }
      }
    };

    // Start scanning
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback,
      errorCallback
    ).catch((err) => {
      console.error("Error starting QR Code scanner", err);
    });

    // cleanup function when component unmounts
    return () => {
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
