import React from "react";
import UI_IMG from "../../assets/images/bg-img.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>
      <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-sky-100 bg-[url('/bg-img3.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <img className="w-64 lg:w-[90%]" />
      </div>
    </div>
  );
};

export default AuthLayout;
