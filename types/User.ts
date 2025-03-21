export interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: "USER" | "EDITOR" | "ADMIN";
  hashedRefreshToken: string;
}
