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
        setState({});
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
            flag: 1
        });
        await ApiPostCall("/register", raw).then((result) => {
            if (result == undefined || result == "") {
                HideLoder();
                $("#AlertDanger").removeClass('d-none');
                $("#AlertDanger").text('Login Failed!');
                $("#AlertDanger").css('color', 'red');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == "success") {
                    cookies.set('accesstoken', accessToken);
                    cookies.set('emailid', res.profileObj.email);
                    $("#AlertMsgs").text('Login Successfully.');
                    $("#AlertMsgs").css('color', 'green');
                    setTimeout(function () {
                        window.location = "/dashboard";
                    }, 1500);
                }
                else {
                    $("#AlertDanger").removeClass('d-none');
                    $("#AlertDanger").css('color', 'red');
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
                    <div className="p-4 row">
                        <div className="col-12 text-center">
                            <label id="AlertMsgs" className="font-16"></label>
                            <label id="AlertDanger" className="d-none font-16">You are not a valid user, <a href='#' style={{color:"red",textDecoration:"underline"}}>click here</a> to contact Administrator!</label>
                        </div>
                        <div className="mb-5 mt-4">
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
                        <div className="row">
                            <div className="col-md-6 text-center pt-5 pb-1 font-13">
                                See a demo video?<br /><a className="ps-2 cursor-pointer" style={{ color: "rgb(30 191 162)" }} href="https://www.k12techrepairs.com/" target="_blank">Click Here</a>
                            </div>
                            <div className="col-md-6 text-center pt-5 pb-1 font-13">
                                Need an account?<br /><a className="ps-2 cursor-pointer" style={{ color: "rgb(30 191 162)" }} href="/register">SIGN UP</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
