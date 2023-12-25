import * as React from "react";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  return (
    <div className="h-full w-fit m-auto flex items-center justify-center mt-32 border-[1px] border-white/20 rounded-lg px-5 py-10">
      <form>
        <h1 className="text-center mb-5 text-3xl font-medium tracking-wide">
          Login
        </h1>
        <div className="flex flex-col gap-5 font-medium">
          {/* <input
            type="text"
            placeholder="Enter your Name"
            id="name"
            className="ml-2 bg-primary rounded-md px-2 py-[6px] text-black w-[400px] placeholder:text-gray-400"
          /> */}
          <input
            type="text"
            placeholder="Enter your Email"
            id="email"
            className="ml-2 bg-primary rounded-md px-2 py-[6px] text-black w-[400px] placeholder:text-gray-400"
          />
          <input
            type="text"
            placeholder="Enter your Password"
            id="password"
            className="ml-2 bg-primary rounded-md px-2 py-[6px] text-black w-[400px] placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="border-[1px] rounded-md bg-primary text-dark w-fit m-auto px-4 py-1 hover:scale-110 transition-all duration-150 ease-in"
          >
            Login
          </button>
        </div>
        <div className="px-2 py-4 my-5 rounded-lg bg-red-200 text-red-600">
          An Error Occured!
        </div>
      </form>
    </div>
  );
};

export default Login;
