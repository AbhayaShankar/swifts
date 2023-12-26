import * as React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { user, logoutUser } = React.useContext(AuthContext);
  return (
    <div className="px-10 py-3 border-white/20 border-b-[1px]">
      <div className="flex items-center justify-between h-6">
        <h1 className="text-big swift tracking-wider">
          <Link to={"/"}>Swifts Chat</Link>
        </h1>
        {user && (
          <h2 className="text-[15px]">
            Logged in as
            <span className="italic text-base tracking-wide text-orange-600/80">
              {"  "}
              {user?.name}
            </span>
          </h2>
        )}
        <div className="flex items-center gap-10 tracking-wider">
          {user && (
            <Link
              onClick={() => logoutUser()}
              to={"/login"}
              className="text-white/60 hover:text-white transition-all duration-100 ease-in"
            >
              Logout
            </Link>
          )}
          {!user && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
