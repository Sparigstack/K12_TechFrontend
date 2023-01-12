import { useState } from "react"
import { CheckValidation } from "../JS/Common";
import { ShowLoder, HideLoder } from "../JS/Common";
import { ApiPostCall } from "../JS/Connector";
import $ from 'jquery';

export function Signup() {
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Email, setEmail] = useState("");
    const SignUp = async () => {
        var isFormValid = CheckValidation("RegisterForm");
        if (!isFormValid) return;
        ShowLoder();
        var raw = JSON.stringify({
            FirstName: FirstName,
            lastname: LastName,
            email: Email
        });
        await ApiPostCall("/addUsers", raw).then((result) => {
            if (result == undefined || result == "") {
                $("#AlertSignupDanger").removeClass('d-none');
                $("#AlertSignupDanger").css('color', 'red');
                $("#AlertSignupDanger").text('Something went wrong');
            } else {
                HideLoder();
                $("#AlertSignupMsgs").text('Registered Successfully.Now you can login using this email.');
                $("#AlertSignupMsgs").css('color', 'green');
                setTimeout(function () {
                    window.location = "/";
                }, 2500);
            }
        });
    }
    return (
        <>
            <div className="position-relative MainDiv">
                <div className="card mx-auto">
                    <div className="p-4 row">
                        <div className="col-12 text-center">
                            <label id="AlertSignupMsgs" className="font-16"></label>
                            <label id="AlertSignupDanger" className="d-none font-16"></label>
                        </div>
                        <div className="my-4">
                            <img src="/Images/LoginLogo.png" className="img-fluid" alt="Logo" />
                        </div>
                        <div className="col-12 mt-2" id="RegisterForm">
                            <div className='row py-2'>
                                <div className='col-12 text-start FormLabel mb-2'>First Name</div>
                                <div className='col-12'>
                                    <input type="text" autoComplete="off" name='firstname' className="form-control" required value={FirstName}
                                        onChange={(e) => setFirstName(e.target.value)} />
                                    <span className="form-text text-start invalid-feedback">
                                        *required
                                    </span>
                                </div>
                            </div>
                            <div className='row py-2'>
                                <div className='col-12 text-start FormLabel mb-2'>Last Name</div>
                                <div className='col-12'>
                                    <input type="text" autoComplete="off" name='lastname' className="form-control" required value={LastName}
                                        onChange={(e) => setLastName(e.target.value)} />
                                    <span className="form-text text-start invalid-feedback">
                                        *required
                                    </span>
                                </div>
                            </div>
                            <div className='row py-2'>
                                <div className='col-12 text-start FormLabel mb-2'>Email</div>
                                <div className='col-12'>
                                    <input type="text" autoComplete="off" name='email' className="form-control" required value={Email}
                                        onChange={(e) => setEmail(e.target.value)} />
                                    <span className="form-text text-start invalid-feedback">
                                        *required
                                    </span>
                                </div>
                            </div>
                            <button className='SaveBtn my-3 col-md-6' onClick={SignUp}>Sign Up</button>
                        </div>
                        <div className="row">
                            <div className="col-md-6 text-center pt-2 pb-1 font-13">
                                See a demo video?<br /><a className="ps-2 cursor-pointer" style={{ color: "rgb(30 191 162)" }} href="https://www.k12techrepairs.com/" target="_blank">Click Here</a>
                            </div>
                            <div className="col-md-6 text-center pt-2 pb-1 font-13">
                                Already a User?<br /><a className="ps-2 cursor-pointer" style={{ color: "rgb(30 191 162)" }} href="/">LOGIN</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}