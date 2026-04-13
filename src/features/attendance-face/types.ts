export type FaceVerifyRequest = {
  npm: string;
  tokenAbsensi: string;
  imageBase64: string;
  lat: number;
  long: number;
  deviceId?: string;
  timestamp: string;
};

export type FaceVerifyResponse = {
  verified: boolean;
  confidence: number;
  message: string;
  attendanceId?: string;
};