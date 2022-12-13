import $ from 'jquery';
import { useState } from 'react';
import { useEffect } from 'react';
import { ApiDeleteCall } from '../JS/Connector';
import { ApiPostCall } from '../JS/Connector';
import { ApiGetCall } from '../JS/Connector';
import { DateFormat } from '../JS/Common';
import { CheckValidation } from '../JS/Common';
import { ShowLoder, HideLoder } from '../JS/Common';
export function DeviceType() {
    const [Type, setType] = useState("");
    const [AllDevices, setAllDevices] = useState([]);
    const [norecord, setNorecord] = useState("");
    const [AddUpdateFlag, setAddUpdateFlag] = useState(0);
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 90;
            $(".GridBox").css('height', finalHeight);
            $("#GreyBoxId").css('height', finalHeight - 70);
            GetDeviceAllData();
        };
    }, []);

    const AddDeviceType = () => {
        $("#DeviceTypeModelImage").addClass('d-none');
        $("#AddDeviceTypeModelID").removeClass('d-none');
        setAddUpdateFlag(0);
        $("#DeviceTypeName").val("");
    }

    const handleClose = () => {
        window.location.reload();
    }

    const handleShow = async (UserId) => {
        setAddUpdateFlag(1);
        $("#HdnUserId").val(UserId);

        await ApiGetCall("/fetchDevice/" + UserId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                var sugData = responseRs.msg;
                if (responseRs.response == "success") {
                    $("#DeviceTypeModelImage").addClass('d-none');
                    $("#AddDeviceTypeModelID").removeClass('d-none');
                    $("#DeviceTypeName").focus();
                    setType(sugData.type);
                } else {
                    $(".alert-danger").show();
                    $("#AlertDangerMsg").text(responseRs.msg);
                    setTimeout(function () {
                        $(".alert-danger").hide();
                        $("#AlertDangerMsg").text();
                    }, 1500);
                }
            }
        });
    };

    // Grid Get call
    const GetDeviceAllData = async () => {
        ShowLoder();
        await ApiGetCall("/allDevice").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                var sugData = responseRs.msg;
                var sugArray = [];
                var i = 1;
                if (responseRs.response == "success") {
                    if (sugData != "") {
                        setNorecord("");
                        setAllDevices(sugData);
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

    // Add Device Model Save
    const SaveDevice = async () => {
        var isFormValid = CheckValidation("AddUpdateForm");
        if (!isFormValid) return;

        ShowLoder();
        var raw = JSON.stringify({
            type: Type
        });
        await ApiPostCall("/addNdUpdateDevice", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    $("#DeviceTypeModelImage").removeClass('d-none');
                    $("#AddDeviceTypeModelID").addClass('d-none');
                    $(".alert-success").show();
                    $("#AlertMsg").text("Device Type Added Successfully.");
                    setTimeout(function () {
                        window.location = "/device-type";
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

    //Update Device Model Save
    const UpdateDevice = async () => {
        var vId = parseInt($("#HdnUserId").val());
        var isFormValid = CheckValidation("AddUpdateForm");
        if (!isFormValid) return;
        ShowLoder();
        var raw = JSON.stringify({
            ID: vId,
            type: Type
        });
        await ApiPostCall("/addNdUpdateDevice", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    $("#DeviceTypeModelImage").removeClass('d-none');
                    $("#AddDeviceTypeModelID").addClass('d-none');
                    $(".alert-success").show();
                    $("#AlertMsg").text("Device Type Updated Successfully.");
                    setTimeout(function () {
                        window.location = "/device-type";
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

    //Delete Device Model
    const DeleteDevice = async (UserId) => {
        ShowLoder();
        var raw = JSON.stringify({
            ID: UserId
        });
        await ApiDeleteCall("/deleteDevice", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    $(".ActionBox").addClass('d-none');
                    $(".alert-success").show();
                    $("#AlertMsg").text("Device Type Deleted Successfully.");
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
            <input type="hidden" id="HdnUserId" />
            {/* Grid */}
            <div>
                <div className='row col-12 d-flex align-items-center'>
                    <div className='col-md-6'>
                        <h1 className="PageHeading">Device Type</h1>
                    </div>
                    <div className='col-md-6 text-end d-flex justify-content-end align-items-center'>
                        <label className='BorderBtn ms-3 cursor-pointer' onClick={AddDeviceType}>
                            Add Device Type <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                        </label>
                    </div>
                </div>
                <div className='GridBox mt-2 p-4' id='GridDiv'>
                    <div className='row'>
                        <div className='greyBox col-md-8' id="GreyBoxId">
                            <div className='row d-flex align-items-center p-1'>
                                <div className='col-md-7'>
                                    <span className='GridTitle'>Device Type List</span>
                                </div>
                                <div className='col-md-5 text-end'>
                                    <form className="gridsearchbar">
                                        <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                        <input className="form-control" type="text" placeholder="Search Device Type" />
                                    </form>
                                </div>
                            </div>
                            <div className='col-12'>
                                <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                            </div>
                            <div>
                                <div className="mx-4">
                                    <div className="row GridHeader">
                                        <div className="col-md-6">Device Type Name</div>
                                        <div className="col-md-3">Create Date</div>
                                        <div className="col-md-3 text-center">Action</div>
                                        <div className='col-12 p-0'>
                                            <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                        </div>
                                    </div>
                                    <div className="GridDataDiv row" style={{ overflowY: "scroll", overflowX: "hidden" }}>
                                        {AllDevices.map((item, i) => {
                                            var returData;
                                            returData = (<div className="col-12" key={i}>
                                                <div className="row" key={i}>
                                                    <div className="col-6">
                                                        {item.type}
                                                    </div>
                                                    <div className="col-3">
                                                        {DateFormat(item.created_at)}
                                                    </div>
                                                    <div className="col-3 text-center">
                                                        <img src="/images/EditIcon.svg" title="Edit OS Model" className="cursor-pointer me-1"
                                                            alt="Edit" onClick={(e) => handleShow(item.ID)}
                                                        />
                                                        <img src="/images/DeleteIcon.svg" title="Delete OS Model" className="cursor-pointer me-1" userid={item.ID}
                                                            alt="Delete" onClick={(e) => DeleteDevice(item.ID)}
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
                            <div className='greyBox d-none p-4' id="AddDeviceTypeModelID">
                                <div className='col-12'>
                                    <span className='GridTitle'>Device Type</span>
                                </div>
                                <div className='col-12'>
                                    <img src='/images/SmallHRLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className='col-12 mt-4' id="AddUpdateForm">
                                    <label>Device Type Name*</label>
                                    <input type="text" autoComplete='off' id="DeviceTypeName" className="form-control mt-2" required value={Type}
                                        onChange={(e) => setType(e.target.value)} />
                                    <span className="form-text invalid-feedback">
                                        *required
                                    </span>
                                </div>
                                <div className='col-12 text-center my-4'>
                                    {AddUpdateFlag == 0 ?
                                        <button className='SaveBtn' onClick={SaveDevice}>Save Device Type</button>
                                        :
                                        <button className='SaveBtn' onClick={UpdateDevice}>Update Device Type</button>
                                    }
                                    <label className='ms-2 cursor-pointer' onClick={handleClose}>Cancel</label>
                                </div>
                            </div>
                            <img src='/images/OsModelImage.svg' className='img-fluid' id="DeviceTypeModelImage" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}