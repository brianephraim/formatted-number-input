import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function PageQrCode() {
  const [qrSvg, setQrSvg] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextUrl = window.location.href;
    setPageUrl(nextUrl);

    QRCode.toString(nextUrl, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 192,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((svg: string) => {
        setQrSvg(svg);
      })
      .catch(() => {
        setHasError(true);
      });
  }, []);

  return (
    <div className="page-qr-code">
      <div className="page-qr-code__card">
        {qrSvg ? (
          <div
            className="page-qr-code__svg"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        ) : (
          <div className="page-qr-code__placeholder">
            {hasError ? 'QR unavailable' : 'Generating QR...'}
          </div>
        )}
      </div>

      <div className="page-qr-code__content">
        <p className="page-qr-code__eyebrow">Mobile Test</p>
        <h3 className="page-qr-code__title">Open this demo on your phone</h3>
        <p className="page-qr-code__body">
          Scan this QR code from your desktop screen to open the same GitHub
          Pages web demo on mobile.
        </p>
        {pageUrl ? <a href={pageUrl}>{pageUrl}</a> : null}
      </div>
    </div>
  );
}
