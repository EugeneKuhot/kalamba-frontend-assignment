import React from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  activePage?: "home" | "login" | "register";
}

export default function Layout({ children, activePage }: LayoutProps) {
  return (
    <>
      <Navbar activePage={activePage} />
      {children}
      <Footer />
    </>
  );
}
