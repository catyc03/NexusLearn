import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<Omit<User, 'id' | 'email' | 'password'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be a secure backend. For this demo, we use localStorage.
const getUsers = (): User[] => {
    try {
        const users = localStorage.getItem('nexuslearn_users');
        return users ? JSON.parse(users) : [];
    } catch {
        return [];
    }
};

const setUsers = (users: User[]) => {
    localStorage.setItem('nexuslearn_users', JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
      try {
        const user = localStorage.getItem('nexuslearn_session');
        return user ? JSON.parse(user) : null;
      } catch {
        return null;
      }
  });

  const login = async (email: string, pass: string): Promise<void> => {
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === pass); // NOTE: Passwords should be hashed!
      if (user) {
          const { password, ...userSessionData } = user;
          setCurrentUser(userSessionData);
          localStorage.setItem('nexuslearn_session', JSON.stringify(userSessionData));
      } else {
          throw new Error('Invalid email or password.');
      }
  };

  const signup = async (email: string, pass: string): Promise<void> => {
      const users = getUsers();
      if (users.find(u => u.email === email)) {
          throw new Error('An account with this email already exists.');
      }
      const newUser: User = { id: `user-${Date.now()}`, email, password: pass, name: '' }; // NOTE: Passwords should be hashed!
      users.push(newUser);
      setUsers(users);

      const { password, ...userSessionData } = newUser;
      setCurrentUser(userSessionData);
      localStorage.setItem('nexuslearn_session', JSON.stringify(userSessionData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexuslearn_session');
  };

  const updateUser = async (updates: Partial<Omit<User, 'id' | 'email' | 'password'>>) => {
      if (!currentUser) throw new Error("No user is logged in.");

      // Update the "database" of users
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex === -1) throw new Error("Current user not found in user list.");
      
      users[userIndex] = { ...users[userIndex], ...updates };
      setUsers(users);

      // Update the current session state and storage
      const newSessionUser = { ...currentUser, ...updates };
      setCurrentUser(newSessionUser);
      localStorage.setItem('nexuslearn_session', JSON.stringify(newSessionUser));
  };

  const value = useMemo(() => ({ currentUser, login, signup, logout, updateUser }), [currentUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};