export interface Certification {
  id: number;
  name: string;
  nameAr?: string;
  issuer: string;
  issuerAr?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  logoUrl?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  category?: string;
  categoryAr?: string;
  sortOrder: number;
}
