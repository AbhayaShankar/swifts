import * as React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <div className="px-10 py-3 border-white/20 border-b-[1px]">
      <div className="flex items-center justify-between h-6">
        <h1>
          <Link to={"/"}>Swifts Chat</Link>
        </h1>
        <div className="flex items-center gap-10 ">
          <Link
            to={"/login"}
            className="text-white/60 hover:text-white transition-all duration-100 ease-in"
          >
            Login
          </Link>
          <Link
            to={"/register"}
            className="text-white/60 hover:text-white transition-all duration-100 ease-in"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
