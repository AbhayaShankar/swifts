import * as React from "react";
import Navbar from "./components/Navbar";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="w-full h-full px-48">{children}</div>
    </div>
  );
};

export default Wrapper;
