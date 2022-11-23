import { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import '../Styles/Login.css';
import { ApiPostCall } from "../JS/Connector";
import $ from 'jquery';
import { Cookies } from 'react-cookie'
export function Login() {
    const [state, setState] = useState({});
    const cookies = new Cookies();
    const clientId = process.env.REACT_APP_ClientId;
    useEffect(() => {
        return () => {
            setState({});
        };
    }, []);
    const onSuccess = async (res) => {
        $("#Overlay").show();
        $("#LoderId").show();
        var response = res.profileObj;
        var accessToken = res.accessToken;
        var raw = JSON.stringify({
            Name: response.name,
            Email: response.email
        });
        await ApiPostCall("/addUser", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                console.log(result);
                cookies.set('accesstoken', accessToken, {path: '/', maxAge: 1200}); //30 minutes
                // cookies.set('accesstoken', accessToken);
                // const responseRs = JSON.parse(result);
                // if (responseRs.status == "Success") {
                //     window.location = "/test";
                // } else {
                // }
            }
            $("#Overlay").hide();
            $("#LoderId").hide();
        });
    }
    const onFailure = (res) => {
        console.log("Login Failed!", res);
    }
    return (
        <>
            <div className="LoginDiv" id="LoginForm">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong mx-auto">
                                <div className=" px-5 pt-5">
                                    <div className="mb-5">
                                        <img src="/Images/Logo.png" className="img-fluid" alt="Logo" />
                                    </div>
                                    <div id="signInButton" className="col-12 text-center">
                                        <GoogleLogin clientId={clientId}
                                            buttonText="Login With google"
                                            onSuccess={onSuccess}
                                            onFailure={onFailure}
                                            cookiePolicy={'single_host_origin'}
                                            // isSignedIn={true}
                                        />
                                    </div>
                                    <div className="col-12 text-center ForgotPwd mt-5 mb-2">
                                        Don't have an account? <a href="#" className="signuplink">Sign Up</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}