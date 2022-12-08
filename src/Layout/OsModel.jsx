import $ from 'jquery';
import { useState } from 'react';
import { useEffect } from 'react';
import { CheckValidation } from '../JS/Connector';
import { ApiPostCall } from '../JS/Connector';
import { ApiGetCall, ApiDeleteCall } from '../JS/Connector';
export function OsModel() {
    const [Name, setName] = useState("");
    const [AllOS, setAllOS] = useState([]);
    const [norecord, setNorecord] = useState("");
    const [AddUpdateFlag, setAddUpdateFlag] = useState(0);
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 90;
            $(".GridBox").css('height', finalHeight);
            $("#GreyBoxId").css('height', finalHeight - 90);
            GetOSAllData();
        };
    }, []);
    const AddOsModel = () => {
        $("#OSModelImage").addClass('d-none');
        $("#AddOSModelID").removeClass('d-none');
        setAddUpdateFlag(0);
        $("#OsName").val("");
        $("#OsName").focus();
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
                    $("#AddOSModelID").addClass('d-none');
                    $("#OSModelImage").removeClass('d-none');
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
    const ShowInputOsName = async (UserId) => {
        setAddUpdateFlag(1);
        $("#HdnUserId").val(UserId);

        await ApiGetCall("/fetchOs/" + UserId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                $("#Overlay").hide();
                $("#LoderId").hide();
                var sugData = responseRs.msg;
                if (responseRs.response == "success") {
                    $("#OSModelImage").addClass('d-none');
                    $("#AddOSModelID").removeClass('d-none');
                    $("#OsName").focus();
                    setName(sugData.os);
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
    const UpdateOsName = async () => {
        var UserId = parseInt($("#HdnUserId").val());
        $("#Overlay").show();
        $("#LoderId").show();
        var raw = JSON.stringify({
            ID: UserId,
            name: Name,
        });
        await ApiPostCall("/addNdUpdateOs", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                $("#Overlay").hide();
                $("#LoderId").hide();
                if (result == "success") {
                    $("#OSModelImage").removeClass('d-none');
                    $("#AddOSModelID").addClass('d-none');
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
    const DeleteOs = async (UserId) => {
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
    const handleClose = () => {
        window.location.reload();
    }
    return (
        <>
            <input type="hidden" id="HdnUserId" />
            <div>
                <div className='row col-12 d-flex align-items-center'>
                    <div className='col-md-6'>
                        <h1 className="PageHeading">Operating System Model</h1>
                    </div>
                    <div className='col-md-6 text-end d-flex justify-content-end align-items-center'>
                        <label className='BorderBtn ms-3 cursor-pointer' onClick={AddOsModel}>
                            Add Operating System <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                        </label>
                    </div>
                </div>
                <div className='GridBox mt-2 p-4' id='GridDiv'>
                    <div className='row'>
                        <div className='greyBox col-md-8' id="GreyBoxId">
                            <div className='row d-flex align-items-center p-1'>
                                <div className='col-md-7'>
                                    <span className='GridTitle'>Operating System Model List</span>
                                </div>
                                <div className='col-md-5 text-end'>
                                    <form className="gridsearchbar">
                                        <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                        <input className="form-control" type="text" placeholder="Search OS Model" />
                                    </form>
                                </div>
                            </div>
                            <div className='col-12'>
                                <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                            </div>
                            <div>
                                <div className="mx-4">
                                    <div className="row GridHeader">
                                        <div className="col-md-5">OS Name</div>
                                        <div className="col-md-4">Create Date</div>
                                        <div className="col-md-3 text-center">Action</div>
                                        <div className='col-12 p-0'>
                                            <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                        </div>
                                    </div>
                                    <div className="GridDataDiv row" style={{ overflowY: "scroll", overflowX: "hidden" }}>
                                        {AllOS.map((item, i) => {
                                            var returData;
                                            var date = new Date(item.created_at),
                                                yr = date.getFullYear(),
                                                month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth(),
                                                day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
                                                newDate = day + '-' + month + '-' + yr;
                                            returData = (<div className="col-12" key={i}>
                                                <div className="row" key={i}>
                                                    <div className="col-5">
                                                        {item.os}
                                                    </div>
                                                    <div className="col-4">
                                                        {newDate}
                                                    </div>
                                                    <div className="col-3 text-center">
                                                        <img src="/images/EditIcon.svg" title="Edit OS Model" className="cursor-pointer me-1"
                                                            alt="Edit" onClick={(e) => ShowInputOsName(item.ID)}
                                                        />
                                                        <img src="/images/DeleteIcon.svg" title="Delete OS Model" className="cursor-pointer me-1" userid={item.ID}
                                                            alt="Delete" onClick={(e) => DeleteOs(item.ID)}
                                                        />
                                                    </div>
                                                    <div className='col-12 p-0 m-0'>
                                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
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
                        <div className='col-md-4 pe-0'>
                            <div className='greyBox d-none' id="AddOSModelID">
                                <div className='col-12'>
                                    <span className='GridTitle'>Operatin System Model</span>
                                </div>
                                <div className='col-12'>
                                    <img src='/images/SmallHRLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className='col-12 mt-4' id="AddOsDiv">
                                    <label>Operating System Name*</label>
                                    <input type="text" autoComplete='off' id="OsName" className="form-control mt-2" required value={Name}
                                        onChange={(e) => setName(e.target.value)} />
                                    <span className="form-text invalid-feedback">
                                        *required
                                    </span>
                                </div>
                                <div className='col-12 text-center my-4'>
                                    {AddUpdateFlag == 0 ?
                                        <button className='SaveBtn' onClick={SaveOsName}>Save OS Model</button>
                                        :
                                        <button className='SaveBtn' onClick={UpdateOsName}>Update OS Model</button>
                                    }
                                    <label className='ms-2 cursor-pointer' onClick={handleClose}>Cancel</label>
                                </div>
                            </div>
                            <img src='/images/OsModelImage.svg' className='img-fluid' id="OSModelImage" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}