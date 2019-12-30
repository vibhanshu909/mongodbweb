import React from "react";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">{children}</div>
  );
};

export default Layout;
