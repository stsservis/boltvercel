import React from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  // Directly render children without any authentication checks
  return <>{children}</>;
};

export default AuthWrapper;