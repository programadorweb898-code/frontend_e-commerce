export interface Product {
  _id: string;
  fakeStoreId?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  error?: boolean; // Campo añadido para estado de error optimista
}

export interface CartApiItem {
  productId: string | Product;
  quantity: number;
  priceSnapShot: number;
}

export interface CartApiResponse {
  items: CartApiItem[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export type CartProductInput = Pick<Product, "_id" | "title" | "price" | "image">;

export interface Order {
  _id: string;
  userId: string;
  items: {
    productId: Product;
    title: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}
