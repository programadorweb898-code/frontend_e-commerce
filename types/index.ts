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
  role: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

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
