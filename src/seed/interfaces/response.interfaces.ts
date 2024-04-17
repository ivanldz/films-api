export interface SeedResponse {
  adminCreated: AdminData;
  totalFilmsCreated: number;
}

export interface AdminData {
  id: number;
  email: string;
  password: string;
}
