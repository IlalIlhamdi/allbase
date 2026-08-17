export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: number | string;
  description: string;
  credentialUrl?: string;
  verificationLabel?: string;
  verifyText?: string;
}
