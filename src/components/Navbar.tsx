import React from "react";
import { ThemeToggle } from "./ThemeToggle";

function Navbar() {
  return (
    <div className="fixed w-full top-5 flex justify-between max-w-[30rem] rounded-md bg-(--primary-foreground) px-4 py-2 ">
      <img src="/logo.svg" alt="logo" className="w-5 h-5" />
      <div>
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Navbar;
