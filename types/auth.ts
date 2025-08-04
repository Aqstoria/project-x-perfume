declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: string;
    markup?: number;
    customerId?: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      customerId?: string;
      markup?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
    customerId?: string;
    markup?: number;
  }
} 