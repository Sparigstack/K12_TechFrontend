import React from "react";
import { Sidebar } from "./Sidebar";
const Layout = ({ children }) => {
  return (
    <>
      <div className="container-fluid px-0">
        <Sidebar />
        <div className="container-fluid px-0">
          <main className="LayoutMainDiv">{children}</main>
        </div>
      </div>
    </>
  );
};
export default Layout;
