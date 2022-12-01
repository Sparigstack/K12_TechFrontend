import React from "react";
import { Sidemenu } from "./Sidemenu";
import { VerifyToken } from "../JS/Connector";
import { useState, useEffect } from "react";
const Layout = ({ children }) => {
    const [TempCheck, setTempCheck] = useState(false);
    useEffect(() => {
        window.scroll(0, 0);
        VerifyToken(MyFunction);
    }, []);
    const MyFunction = () => {
        setTempCheck(true);
    }
    return (
        <>
            {TempCheck == true ?
                <div className="wrapper">
                    <Sidemenu />
                    <main className="page-content">
                        {children}
                    </main>
                </div>
                :
                <></>
            }
        </>
    );
};
export default Layout;