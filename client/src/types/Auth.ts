export interface Auth {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
  token?: string;
  user?: {
    email: string;
  };
}
