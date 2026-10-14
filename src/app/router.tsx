import React, { useState } from 'react';

export type AppRoute = 'plans' | 'all-phases' | 'reports';

interface RouterContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
}

export const RouterContext = React.createContext<RouterContextType>({
  currentRoute: 'plans',
  navigate: () => {},
});

export const useRouter = () => React.useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('plans');

  return (
    <RouterContext.Provider value={{ currentRoute, navigate: setCurrentRoute }}>
      {children}
    </RouterContext.Provider>
  );
};
