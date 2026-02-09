export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  permissions: string[];
  passwordChangedAt?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: 'success';
  token: string;
  data: {
    user: User;
  };
};

export type IsLoggedInResponse = {
  status: 'success';
  message: string;
  data: {
    user: User;
  };
};

export type AuthErrorResponse = {
  status: 'fail';
  message: string;
};
