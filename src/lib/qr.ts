import QRCode from "qrcode";

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 300,
      color: {
        dark: "#1A237E",
        light: "#FFFFFF",
      },
    });
  } catch (err) {
    console.error("Failed to generate QR data URL:", err);
    return "";
  }
}

export async function generateQrBuffer(text: string): Promise<Uint8Array> {
  try {
    const pngBuffer = await QRCode.toBuffer(text, {
      type: "png",
      margin: 1,
      width: 300,
      color: {
        dark: "#1A237E",
        light: "#FFFFFF",
      },
    });
    return new Uint8Array(pngBuffer);
  } catch (err) {
    console.error("Failed to generate QR buffer:", err);
    return new Uint8Array();
  }
}
