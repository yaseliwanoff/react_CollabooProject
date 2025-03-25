import React, { createContext, useContext, useState, useEffect } from 'react';

interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Инициализация токена из localStorage
    const storedToken = localStorage.getItem("firebaseToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken должен использоваться внутри TokenProvider');
  }
  return context;
};
