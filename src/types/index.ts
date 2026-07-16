export interface IGadget {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  pricePerDay: number;
  imageUrl: string;
  rating: number;
  location: string;
  status: "Available" | "Low Stock" | "Rented Out";
  specifications: Record<string, string>;
  serialNumber: string;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Alias of IGadget to support existing React views.
 */
export type Gadget = IGadget;

export interface FilterParams {
  searchQuery?: string;
  category?: string;
  maxPrice?: number;
  sortBy?: string;
  location?: string;
  status?: "Available" | "Low Stock" | "Rented Out";
}

/**
 * Alias of FilterParams to support existing React views.
 */
export type FilterOptions = FilterParams;

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface UserSession {
  token: string;
  user: IUser;
}

export interface AdminSession {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: "admin";
  };
}
