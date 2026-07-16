/** Placeholder image processing — swap for production DICOM pipeline. */
export function applyWindowLevel(pixelData: number[], center: number, width: number): number[] {
  const min = center - width / 2;
  const max = center + width / 2;
  return pixelData.map((v) => Math.max(0, Math.min(255, ((v - min) / (max - min)) * 255)));
}

export function rotateImageDegrees(rotation: number): number {
  return ((rotation % 360) + 360) % 360;
}
