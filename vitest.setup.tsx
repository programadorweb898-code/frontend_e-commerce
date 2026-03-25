import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock de next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill, alt, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={alt ?? ""} data-fill={fill ? "true" : undefined} />;
  },
}));

// Mock de next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

// Mock de lucide-react
vi.mock("lucide-react", () => ({
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  AlertCircle: () => <div data-testid="alert-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  User: () => <div data-testid="user-icon" />,
  X: () => <div data-testid="x-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  Search: () => <div data-testid="search-icon" />,
}));
