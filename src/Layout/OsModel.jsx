import $ from 'jquery';
import { useState } from 'react';
import { useEffect } from 'react';
import { CheckValidation } from '../JS/Connector';
import { ApiPostCall } from '../JS/Connector';
import { ApiGetCall,ApiDeleteCall } from '../JS/Connector';
export function OsModel() {
    const [Name, setName] = useState("");
    const [AllOS, setAllOS] = useState([]);
    const [norecord, setNorecord] = useState("");
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 90;
            $(".GridBox").css('height', finalHeight);
            $(".greyBox").css('height', finalHeight - 90);
            GetOSAllData();
        };
    }, []);
    const AddOsModel = () => {
        $("#AddOsDiv").removeClass('d-none');
    }
    const GetOSAllData = async () => {
        $("#Overlay").show();
        $("#LoderId").show();
        await ApiGetCall("/allOs").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                $("#Overlay").hide();
                $("#LoderId").hide();
                var sugData = responseRs.msg;
                var sugArray = [];
                var i = 1;
                if (responseRs.response == "success") {
                    if (sugData != "") {
                        setNorecord("");
                        setAllOS(sugData);
                    } else {
                        sugArray.push(
                            <div className="col-12 GridNoRecord text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setNorecord(sugArray);
                    }
                } else {
                    $(".alert-danger").show();
                    $("#AlertDangerMsg").text(responseRs.message);
                    setTimeout(function () {
                        $(".alert-danger").hide();
                        $("#AlertDangerMsg").text();
                    }, 1500);
                }
            }
        });
    }
    const SaveOsName = async () => {
        var isFormValid = CheckValidation("AddOsDiv");
        if (!isFormValid) return;

        $("#Overlay").show();
        $("#LoderId").show();
        var raw = JSON.stringify({
            name: Name,
        });
        await ApiPostCall("/addNdUpdateOs", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                $("#Overlay").hide();
                $("#LoderId").hide();
                if (result == "success") {
                    $("#AddOsDiv").addClass('d-none');
                    $(".alert-success").show();
                    $("#AlertMsg").text("OS Model Added Successfully.");
                    setTimeout(function () {
                        window.location = "/os-model";
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
    const ShowInputOsName = (UserId) =>{
        $("#OsNameSpan_" + UserId).addClass('d-none');
        $("#OsNameInput_" + UserId).removeClass('d-none');
        $("#OsNameInput_" + UserId).focus();
        $("#EditIcon_" + UserId).addClass('d-none');
        $("#UpdateSaveIcon_" + UserId).removeClass('d-none');
    }
    const UpdateOsName = async(UserId) => {
        $("#Overlay").show();
        $("#LoderId").show();
        var UpdatedName = $("#OsNameInput_" + UserId).val();
        var raw = JSON.stringify({
            ID:UserId,
            name: UpdatedName,
        });
        await ApiPostCall("/addNdUpdateOs", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                $("#Overlay").hide();
                $("#LoderId").hide();
                if (result == "success") {
                    $("#AddOsDiv").addClass('d-none');
                    $(".alert-success").show();
                    $("#AlertMsg").text("OS Model Updated Successfully.");
                    setTimeout(function () {
                        window.location.reload();
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
    const DeleteOs = async(UserId) =>{
        $("#Overlay").show();
        $("#LoderId").show();
        var raw = JSON.stringify({
            ID: UserId
        });
        await ApiDeleteCall("/deleteOs", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                $("#Overlay").hide();
                $("#LoderId").hide();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("OS Model Deleted Successfully.");
                    setTimeout(function () {
                        window.location.reload();
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
            {/* Grid */}
            <div>
                <div className='row col-12'>
                    <div className='col-md-6'>
                        <h1 className="PageHeading">Operating System Model</h1>
                    </div>
                    <div className='col-md-6 text-end d-flex justify-content-end align-items-center'>
                        <label className='BorderBtn ms-3 cursor-pointer' onClick={AddOsModel}>
                            Add Operating System <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                        </label>
                    </div>
                    <div className='col-md-6'></div>
                    <div className='col-md-6 mt-3 d-none' id="AddOsDiv">
                        <div className="row align-items-center">
                            <div className="col-md-2 text-center">
                                <label className="col-form-label">Name</label>
                            </div>
                            <div className="col-md-8">
                                <input type="text" id="OsName" className="form-control" required value={Name}
                                    onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='col-md-2'>
                                <button className='SaveBtn' onClick={SaveOsName}>Save</button>
                            </div>
                            <div className="col-md-12">
                                <span className="form-text invalid-feedback">
                                    *required
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid px-0 pt-3" id='GridDiv'>
                    <div className="GridBox" style={{ height: "78vh" }}>
                        <div className="m-4">
                            <div className="row GridHeader">
                                <div className="col-md-5">Name</div>
                                <div className="col-md-4">Created At</div>
                                <div className="col-md-3 text-center">Action</div>
                            </div>
                            <div className="GridDataDiv" style={{ overflowY: "scroll", overflowX: "hidden" }}>
                                {AllOS.map((item, i) => {
                                    var returData;
                                    var date = new Date(item.created_at),
                                        yr = date.getFullYear(),
                                        month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth(),
                                        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
                                        newDate = yr + '-' + month + '-' + day;
                                    returData = (<div className="col-12 grid" key={i}>
                                        <div className="row" key={i}>
                                            <div className="col-5">
                                                <input type="text" id={`OsNameInput_${item.ID}`} className="form-control d-none" required defaultValue={item.os}
                                                    />
                                                <span id={`OsNameSpan_${item.ID}`}>{item.os}</span>
                                            </div>
                                            <div className="col-4">
                                                {newDate}
                                            </div>
                                            <div className="col-3 text-center">
                                                <span>
                                                    <img src="/images/EditIcon.svg" title="Edit Operating System" className="cursor-pointer me-1" id={`EditIcon_${item.ID}`}
                                                        alt="Edit" onClick={(e) => ShowInputOsName(item.ID)}
                                                    />
                                                </span>
                                                <span>
                                                    <img src='/images/SaveIcon.svg' title='Update Opeating System' className="cursor-pointer me-1 d-none" id={`UpdateSaveIcon_${item.ID}`}
                                                        alt="Update" height="20px" onClick={(e) => UpdateOsName(item.ID)}
                                                    />
                                                </span>
                                                <span>
                                                    <img src="/images/DeleteIcon.svg" title="Delete Operating System" className="cursor-pointer me-1"
                                                        alt="Delete" onClick={(e) => DeleteOs(item.ID)}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                    return returData;
                                })}
                                {norecord}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}