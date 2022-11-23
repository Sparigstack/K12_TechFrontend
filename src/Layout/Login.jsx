import { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import '../Styles/Login.css';
import axios from "axios";
export function Login() {
    const [state, setState] = useState({});
    const clientId = "646628515848-m5a6l1kqaqb8pvqih00omv1mjr11iq4v.apps.googleusercontent.com";
    useEffect(() => {
        return () => {
            setState({});
        };
    }, []);
    const onSuccess = async (res) => {
        var response = res.profileObj;
        await axios.post('http://127.0.0.1:8000/api/addUser', {
            Name: response.name,
            Email: response.email,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
        // const TestData = await axios.get("http://127.0.0.1:8000/api/test");
        // console.log(TestData.data);
        // console.log("Login Success!", res.profileObj);
        // window.location = "/test";
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
                                            isSignedIn={true}
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