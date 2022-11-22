import { useState, useEffect } from "react";
import axios from "axios";
import '../Styles/Login.css';
import { CheckValidation } from "../JS/Connector";
export function Login() {
    const [state, setState] = useState({});
    const [Email,setEmail] = useState("");
    const [Password,setPassword] = useState("");
    useEffect(() => {
        return () => {
            setState({});
        };
    }, []);
    const Login = async () =>{
        // var checkvalidation = CheckValidation("LoginForm");
        const TestData = await axios.get("http://127.0.0.1:8000/api/test");
        console.log(TestData.data);
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
                                    <div className="mb-4 text-center">
                                        <h5>SIGN IN</h5>
                                    </div>
                                    <div className="mb-4">
                                        <input type="email" className="form-control" value={Email} onChange={e => setEmail(e.target.value)} placeholder="Email Id" required/>
                                        <div className="invalid-feedback">
                                            *required
                                        </div>
                                    </div>
                                    <div>
                                        <input type="password" className="form-control" value={Password} onChange={e => setPassword(e.target.value)} placeholder="Password" required/>
                                        <div className="invalid-feedback">
                                            *required
                                        </div>
                                    </div>
                                    <div className="col-12 text-end">
                                        <a href="#" className="ForgotPwd">Forgot Password?</a>
                                    </div>
                                    <div className="col-12 text-center mt-3">
                                        <button type="submit" className="loginBtn btnhover" onClick={Login}>LOGIN</button>
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