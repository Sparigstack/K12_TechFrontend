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
                alert("Something went wrong");
            } else {
                HideLoder();
                $(".alert-success").show();
                $("#AlertMsg").text("Registered Successfully.Now you can login using this email.");
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
                    <div className="px-5 pt-5">
                        <div className="mb-5">
                            <img src="/Images/LoginLogo.png" className="img-fluid" alt="Logo" />
                        </div>
                        <div className="col-12 text-center mt-4" id="RegisterForm">
                            <div className='row align-items-center py-2'>
                                <div className='col-12 FormLabel mb-2'>First Name</div>
                                <div className='col-12'>
                                    <input type="text" autoComplete="off" name='firstname' className="form-control" required value={FirstName}
                                        onChange={(e) => setFirstName(e.target.value)} />
                                    <span className="form-text invalid-feedback">
                                        *required
                                    </span>
                                </div>
                            </div>
                            <div className='row align-items-center py-2'>
                                <div className='col-12 FormLabel mb-2'>Last Name</div>
                                <div className='col-12'>
                                    <input type="text" autoComplete="off" name='lastname' className="form-control" required value={LastName}
                                        onChange={(e) => setLastName(e.target.value)} />
                                    <span className="form-text invalid-feedback">
                                        *required
                                    </span>
                                </div>
                            </div>
                            <div className='row align-items-center py-2'>
                                <div className='col-12 FormLabel mb-2'>Email</div>
                                <div className='col-12'>
                                    <input type="text" autoComplete="off" name='email' className="form-control" required value={Email}
                                        onChange={(e) => setEmail(e.target.value)} />
                                    <span className="form-text invalid-feedback">
                                        *required
                                    </span>
                                </div>
                            </div>
                            <button className='SaveBtn my-3' onClick={SignUp}>Sign Up</button>
                        </div>
                        <div className="col-12 text-center pt-1 pb-1">
                            Already a User?<a className="ps-2 cursor-pointer" style={{ color: "rgb(30 191 162)" }} href="/">LOGIN</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}