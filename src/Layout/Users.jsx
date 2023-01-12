import { useEffect, useState } from "react";
import $ from 'jquery';
import { ShowLoder, HideLoder } from "../JS/Common";
import { CheckValidation } from "../JS/Common";
import { ApiGetCallWithoutHeaders, ApiPostCall, ApiDeleteCall } from "../JS/Connector";
import { Cookies } from 'react-cookie';
export function Users() {
    const cookies = new Cookies();
    var schoolid = parseInt(cookies.get('SchoolId'));
    const [Flag, setFlag] = useState(1);
    const [AccessDevices, setAccessDevices] = useState([]);
    const [CurrentUsers, setCurrentUsers] = useState([]);
    const [noRecord, setnoRecord] = useState([]);
    // form input fields start
    const [Username, setUsername] = useState("");
    const [email, setemail] = useState("");
    const [building, setbuilding] = useState("");
    // form input fields end

    useEffect(() => {
        // return () => {
            // const height = window.innerHeight;
            // const navbarheight = $(".navbar").height();
            // var finalHeight = height - navbarheight - 80;
            // $(".GridBox").css('height', finalHeight);
            // $(".GridBox").css('overflow', 'hidden');
            GetAccessDevice();
            GetUsers();
        // };
    }, []);
    const GetAccessDevice = async () => {
        ShowLoder();
        await ApiGetCallWithoutHeaders("/allAccess").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                setAccessDevices(responseRs);
                HideLoder();
            }
        });
    }
    const GetUsers = async () => {
        ShowLoder();
        await ApiGetCallWithoutHeaders("/allUser").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var sugArray = [];
                var i = 1;
                if (responseRs.length != 0) {
                    setnoRecord("");
                    setCurrentUsers(responseRs);
                } else {
                    sugArray.push(
                        <div className="col-12 GridNoRecord text-center" key={i}>
                            <label>No Record Found</label>
                        </div>
                    );
                    setnoRecord(sugArray);
                    setCurrentUsers([]);
                }
                HideLoder();
            }
        });
    }
    const CreateNewUser = async () => {
        var isFormValid = CheckValidation("UserForm");
        if ($("#AccessDevice option:selected").val() == 0) {
            $("#AccessRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#AccessRequired").css('display', 'none');
        ShowLoder();
        var accessdevice = $("#AccessDevice option:selected").val();
        var raw = JSON.stringify({
            username: Username,
            access: accessdevice,
            email: email,
            Building: building,
            schoolId: schoolid
        });
        await ApiPostCall("/addUser", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                const responseRs = JSON.parse(result);
                if (responseRs.status == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("User Added Successfully.");
                    setTimeout(function () {
                        window.location = "/users";
                    }, 1500);
                } else {
                    $(".alert-danger").show();
                    $("#AlertDangerMsg").text(responseRs);
                    setTimeout(function () {
                        $(".alert-danger").hide();
                        $("#AlertDangerMsg").text();
                    }, 1500);
                }
            }
        });
    }
    const GetUserbyid = async (UserId) => {
        setFlag(2);
        ShowLoder();
        $("#hdnUserId").val(UserId);
        await ApiGetCallWithoutHeaders("/getUserById/" + UserId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                $("#HeaderUser").text('Edit User');
                setUsername(responseRs[0].name);
                $("#AccessDevice").val(responseRs[0].access_type);
                setemail(responseRs[0].email);
                HideLoder();
            }
        });
    }
    const DeleteUserbyid = async(UserId)=>{
        ShowLoder();
        var raw = JSON.stringify({
            ID: UserId
        });
        await ApiDeleteCall("/deleteUser", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("User Deleted Succesfully.");
                    setTimeout(function () {
                        window.location = "/users";
                    }, 1500);
                } else {
                    $(".alert-danger").show();
                    $("#AlertDangerMsg").text(result);
                    setTimeout(function () {
                        $(".alert-danger").hide();
                        $("#AlertDangerMsg").text();
                    }, 1500);
                }
            }
        });
    }
    const UpdateExistingUser = async() =>{
        var isFormValid = CheckValidation("UserForm");
        if ($("#AccessDevice option:selected").val() == 0) {
            $("#AccessRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#AccessRequired").css('display', 'none');
        ShowLoder();
        var accessdevice = $("#AccessDevice option:selected").val();
        var userid = parseInt($("#hdnUserId").val());
        var raw = JSON.stringify({
            username: Username,
            access: accessdevice,
            email: email,
            Building: building,
            schoolId: schoolid,
            id: userid
        });
        await ApiPostCall("/updateUser", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("User Updated Successfully.");
                    setTimeout(function () {
                        window.location = "/users";
                    }, 1500);
                } else {
                    $(".alert-danger").show();
                    $("#AlertDangerMsg").text(result);
                    setTimeout(function () {
                        $(".alert-danger").hide();
                        $("#AlertDangerMsg").text();
                    }, 1500);
                }
            }
        });
    }
    return (
        <>
            <input type="hidden" id="hdnUserId" />
            <div className='row col-12'>
                <h1 className="PageHeading">Users</h1>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="row mt-3 d-flex">
                        <div className="col-md-6">
                            <div className="greyBox">
                                <div>
                                    <b className='font-16 mb-0' id="HeaderUser">Add User</b>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                                </div>
                                <div className="row p-3" id="UserForm">
                                    <div className='col-12 py-2'>
                                        User Name*
                                        <input type="text" name='Username' autoComplete="off" className="form-control mt-2" required value={Username}
                                            onChange={(e) => setUsername(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                    <div className="col-12 py-2">
                                        Access*
                                        <select className="mt-2" id="AccessDevice">
                                            <option value="0">Select Access Device</option>
                                            {AccessDevices.map((item, i) => {
                                                var returData;
                                                returData = (<option value={item.ID} key={i}>{item.access_type}</option>);
                                                return returData;
                                            })}
                                        </select>
                                        <span className="form-text invalid-feedback" id="AccessRequired">
                                            *required
                                        </span>
                                    </div>
                                    <div className='col-12 pb-2 pt-3'>
                                        Email*
                                        <input type="text" name='Email' autoComplete="off" className="form-control mt-2" required value={email}
                                            onChange={(e) => setemail(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                    <div className='col-12 pt-2'>
                                        Building*
                                        <input type="text" name='Building' autoComplete="off" className="form-control mt-2" value={building}
                                            onChange={(e) => setbuilding(e.target.value)} />
                                        {/* <span className="form-text invalid-feedback">
                                            *required
                                        </span> */}
                                    </div>
                                    <div className="col-12 text-center py-3">
                                        {Flag == 1 ?
                                            <button className='SaveBtn' onClick={CreateNewUser}>Create New User</button>
                                            :
                                            <button className='SaveBtn' onClick={UpdateExistingUser}>Update User</button>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="greyBox">
                                <div>
                                    <b className='font-16 mb-0'>Current Users</b>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                                </div>
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>User Name</th>
                                            <th>Access</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                        {CurrentUsers.map((item, i) => {
                                            var returData;
                                            returData = (<tr key={i}>
                                                <td>{item.name}</td>
                                                <td>{item.Acess}</td>
                                                <td className="text-center">
                                                    <img src="/images/EditIcon.svg" className="img-fluid me-2" onClick={(e) => GetUserbyid(item.id)} />
                                                    <img src="/images/DeleteIcon.svg" className="img-fluid" onClick={(e) => DeleteUserbyid(item.id)}/>
                                                </td>
                                            </tr>);
                                            return returData;
                                        })}
                                        {noRecord}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}