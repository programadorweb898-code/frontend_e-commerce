export interface Product {
  _id: string;
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
    productId: string;
    title: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}
