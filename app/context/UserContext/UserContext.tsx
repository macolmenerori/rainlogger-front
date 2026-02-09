import { createContext, useContext, useMemo, useState } from 'react';

import type { User } from '@/types/auth';
import { tokenStorage } from '@/utils/tokenStorage';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    tokenStorage.removeToken();
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, logout }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
