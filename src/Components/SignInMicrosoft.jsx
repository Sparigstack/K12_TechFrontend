import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";
export function SignInMicrosoft() {
    const { instance } = useMsal();
    const handleLogin = () => {
        instance.loginPopup({
            scopes: ['user.read']
        });
    }
    return (
        <>
            <Button onClick={handleLogin} className="MicrosoftGoogleBtn">
                <img src="/images/MicrosoftBtn.svg" className="img-fluid pe-2" /> Login With Microsoft
            </Button>
        </>
    );
}