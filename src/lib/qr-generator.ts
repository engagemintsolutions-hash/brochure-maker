import QRCode from 'qrcode';

/**
 * Generates a QR code as a data URL (PNG).
 */
export async function generateQrDataUrl(
  url: string,
  size: number = 120,
): Promise<string> {
  return QRCode.toDataURL(url, {
    width: size,
    margin: 1,
    color: { dark: '#1A1A1A', light: '#FFFFFF' },
    errorCorrectionLevel: 'M',
  });
}
