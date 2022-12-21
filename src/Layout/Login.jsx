import { useState, useEffect, Component } from "react";
import GoogleLogin from "react-google-login";
import '../Styles/Login.css';
import { ApiPostCall } from "../JS/Connector";
import { Cookies } from 'react-cookie';
import $ from 'jquery';
import { SignInMicrosoft } from "../Components/SignInMicrosoft";
import { ShowLoder, HideLoder } from "../JS/Common";
export function Login() {
    const [state, setState] = useState({});
    const cookies = new Cookies();
    const clientId = process.env.REACT_APP_GoogleClientId;
    useEffect(() => {
        return () => {
            setState({});
        };
    }, []);
    const onSuccess = async (res) => {
        ShowLoder();
        var accessToken = res.accessToken;
        var raw = JSON.stringify({
            name: res.profileObj.name,
            email: res.profileObj.email,
            googleId: res.googleId,
            microsoftId: null,
            accessToken: accessToken,
            flag: 1,
            schoolId: 1
        });
        await ApiPostCall("/register", raw).then((result) => {
            if (result == undefined || result == "") {
                HideLoder();
                $(".alert-danger").show();
                $("#AlertDangerMsg").text('Login Failed!');
                setTimeout(function () {
                    $(".alert-danger").hide();
                    $("#AlertDangerMsg").text();
                }, 1500);
            } else {
                const responseRs = JSON.parse(result);
                cookies.set('accesstoken', accessToken);
                cookies.set('emailid', res.profileObj.email);
                if (responseRs.status == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("Login Successfully.");
                    setTimeout(function () {
                        window.location = "/dashboard";
                    }, 1500);
                }
                HideLoder();
                // cookies.set('accesstoken', accessToken, { path: '/', maxAge: 1200 }); //30 minutes
            }
           
        });
    }
    return (
        <>
            <div className="position-relative MainDiv">
                <div className="card mx-auto">
                    <div className="px-5 pt-5">
                        <div className="mb-5">
                            <img src="/Images/LoginLogo.png" className="img-fluid" alt="Logo" />
                        </div>
                        <div className="col-12 text-center mt-4">
                            <GoogleLogin clientId={clientId}
                                buttonText=""
                                onSuccess={onSuccess}
                                render={renderProps => (
                                    <div onClick={renderProps.onClick} className="MicrosoftGoogleBtn">
                                        <img src="/Images/GoogleBtn.svg" className="img-fluid pe-2" /> Login With Google
                                    </div>
                                )}
                            />
                        </div>
                        <div className="col-12 text-center py-3">
                            <img src="/Images/LoginOr.png" className="img-fluid" />
                        </div>
                        <div className="col-12 text-center">
                            <SignInMicrosoft />
                        </div>
                        <div className="col-12 text-center pt-5 pb-1">
                            See a demo video?<a className="ps-2 cursor-pointer" style={{color:"rgb(30 191 162)"}} href="https://www.k12techrepairs.com/" target="_blank">Click Here</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
