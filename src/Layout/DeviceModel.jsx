import $ from 'jquery';
import { useState } from 'react';
import { useEffect } from 'react';
import { ApiDeleteCall, CheckValidation } from '../JS/Connector';
import { ApiPostCall } from '../JS/Connector';
import { ApiGetCall } from '../JS/Connector';
import { getUrlParameter } from '../JS/Connector';
export function DeviceModel() {
    const [Name, setName] = useState("");
    const [Type, setType] = useState("");
    const [Number, setNumber] = useState("");
    const [AllDevices, setAllDevices] = useState([]);
    const [norecord, setNorecord] = useState("");
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 90;
            $(".GridBox").css('height', finalHeight);
            $(".greyBox").css('height', finalHeight - 90);
            CheckUrl();
        };
    }, []);

    const CheckUrl = () => {
        var PathName = window.location.pathname;
        var pathsplit = PathName.split('/');
        var prodActive = pathsplit[2];
        if (prodActive == "add-device-model") {
            ShowAddDiv();
        } else if (prodActive == "update-device-model") {
            GetDeviceDataById();
        }
        else {
            GetDeviceAllData();
        }
    }

    const ShowAddDiv = () => {
        $("#GridDiv").addClass('d-none');
        $("#UpdateDeviceDiv").addClass('d-none');
        $("#AddDeviceDiv").removeClass('d-none');
    }

    const AppendUrl = (URL, ID) => {
        if (ID == null) {
            var newURLString = window.location.href + URL;
            window.location.href = newURLString;
        } else {
            var newURLString = window.location.href + URL + "/?id=" + ID;
            window.location.href = newURLString;
        }
    }

    const CancelClick = () => {
        window.location.href = "/device-model";
    }

    // Grid Get call
    const GetDeviceAllData = async () => {
        $("#Overlay").show();
        $("#LoderId").show();
        await ApiGetCall("/allDevice").then((result) => {
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

    // Get Data By Id
    const GetDeviceDataById = async () => {
        var vId = parseInt(getUrlParameter("id"));
        $("#Overlay").show();
        $("#LoderId").show();
        await ApiGetCall("/fetchDevice/" + vId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                $("#Overlay").hide();
                $("#LoderId").hide();
                var sugData = responseRs.msg;
                if (responseRs.response == "success") {
                    $("#GridDiv").addClass('d-none');
                    $("#AddDeviceDiv").addClass('d-none');
                    $("#UpdateDeviceDiv").removeClass('d-none');
                    setName(sugData.name);
                    setType(sugData.type);
                    setNumber(sugData.device_num);
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
    }

    // Add Device Model Save
    const SaveDeviceModel = async () => {
        var isFormValid = CheckValidation("AddForm");
        if (!isFormValid) return;

        $("#Overlay").show();
        $("#LoderId").show();
        var raw = JSON.stringify({
            name: Name,
            type: Type,
            device_num: Number
        });
        await ApiPostCall("/addNdUpdateDevice", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                $("#Overlay").hide();
                $("#LoderId").hide();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("Device Model Added Successfully.");
                    setTimeout(function () {
                        window.location = "/device-model";
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
    const UpdateDeviceModel = async () => {
        var vId = parseInt(getUrlParameter("id"));
        var isFormValid = CheckValidation("AddForm");
        if (!isFormValid) return;
        $("#Overlay").show();
        $("#LoderId").show();
        var raw = JSON.stringify({
            ID: vId,
            name: Name,
            type: Type,
            device_num: Number
        });
        await ApiPostCall("/addNdUpdateDevice", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                $("#Overlay").hide();
                $("#LoderId").hide();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("Device Model Updated Successfully.");
                    setTimeout(function () {
                        window.location = "/device-model";
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
    const DeleteDeviceModel = async (UserId) => {
        $("#Overlay").show();
        $("#LoderId").show();
        var raw = JSON.stringify({
            ID: UserId
        });
        await ApiDeleteCall("/deleteDevice", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                $("#Overlay").hide();
                $("#LoderId").hide();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("Device Model Deleted Successfully.");
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
                <div className='row col-12'>
                    <div className='col-md-6'>
                        <h1 className="PageHeading">Device Model</h1>
                    </div>
                    <div className='col-md-6 text-end d-flex justify-content-end align-items-center'>
                        <label className='BorderBtn ms-3 cursor-pointer' onClick={(e) => AppendUrl("/add-device-model")}>
                            Add Device <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                        </label>
                    </div>
                </div>
                <div className="container-fluid px-0 pt-3" id='GridDiv'>
                    <div className="GridBox" style={{ height: "78vh" }}>
                        <div className="m-4">
                            <div className="row GridHeader">
                                <div className="col-md-4">Name</div>
                                <div className="col-md-3">Type</div>
                                <div className="col-md-3">Number</div>
                                <div className="col-md-2 text-center">Action</div>
                            </div>
                            <div className="GridDataDiv" style={{ overflowY: "scroll", overflowX: "hidden" }}>
                                {AllDevices.map((item, i) => {
                                    var returData;
                                    returData = (<div className="col-12 grid" key={i}>
                                        <div className="row" key={i}>
                                            <div className="col-4">
                                                {item.name}
                                            </div>
                                            <div className="col-3">
                                                {item.type}
                                            </div>
                                            <div className="col-3">
                                                {item.device_num}
                                            </div>
                                            <div className="col-2 text-center">
                                                <span>
                                                    <img src="/images/EditIcon.svg" title="Edit Device" className="cursor-pointer me-1"
                                                        alt="Edit" onClick={(e) => AppendUrl("/update-device-model", item.ID)}
                                                    />
                                                </span>
                                                <span>
                                                    <img src="/images/DeleteIcon.svg" title="Delete Device" className="cursor-pointer me-1" userid={item.ID}
                                                        alt="Delete" onClick={(e) => DeleteDeviceModel(item.ID)}
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

            {/* Add Device Div */}
            <>
                <div id="AddDeviceDiv" className="d-none">
                    <div className="container-fluid px-0 pt-3" id='GridDiv'>
                        <div className="GridBox">
                            <div className='m-4 greyBox'>
                                <div className='col-12'>
                                    <h5 className='fs-5 mb-0' style={{ fontWeight: "600" }}>Add Device Model</h5>
                                    <img src='/images/LongHRLine.png' className='img-fluid w-100' />
                                </div>
                                <div className='col-12 row m-2' id="AddForm">
                                    <div className='col-md-6'>
                                        <div className="row align-items-center">
                                            <div className="col-md-4">
                                                <label className="col-form-label">Name</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" id="DeviceName" className="form-control" required value={Name}
                                                    onChange={(e) => setName(e.target.value)} />
                                            </div>
                                            <div className="col-md-2">
                                                <span className="form-text invalid-feedback">
                                                    *required
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="row align-items-center">
                                            <div className="col-md-2">
                                                <label className="col-form-label">Type</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" id="DeviceType" className="form-control" required value={Type}
                                                    onChange={(e) => setType(e.target.value)} />
                                            </div>
                                            <div className="col-md-2">
                                                <span className="form-text invalid-feedback">
                                                    *required
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6 mt-3'>
                                        <div className="row align-items-center">
                                            <div className="col-md-4">
                                                <label className="col-form-label">Device Number</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" id="DeviceNumber" className="form-control" required value={Number}
                                                    onChange={(e) => setNumber(e.target.value)} />
                                            </div>
                                            <div className="col-md-2">
                                                <span className="form-text invalid-feedback">
                                                    *required
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-center p-5'>
                                    <button className='SaveBtn' onClick={SaveDeviceModel}>Save Device Model</button>
                                    <label className='ms-4 cursor-pointer' onClick={CancelClick}>Cancel</label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </>

            {/* Update Device Div */}
            <>
                <div id="UpdateDeviceDiv" className="d-none">
                    <div className="container-fluid px-0 pt-3" id='GridDiv'>
                        <div className="GridBox">
                            <div className='m-4 greyBox'>
                                <div className='col-12'>
                                    <h5 className='fs-5 mb-0' style={{ fontWeight: "600" }}>Update Device Model</h5>
                                    <img src='/images/LongHRLine.png' className='img-fluid w-100' />
                                </div>
                                <div className='col-12 row m-2' id="AddForm">
                                    <div className='col-md-6'>
                                        <div className="row align-items-center">
                                            <div className="col-md-4">
                                                <label className="col-form-label">Name</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" id="DeviceName" className="form-control" required value={Name}
                                                    onChange={(e) => setName(e.target.value)} />
                                            </div>
                                            <div className="col-md-2">
                                                <span className="form-text invalid-feedback">
                                                    *required
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="row align-items-center">
                                            <div className="col-md-2">
                                                <label className="col-form-label">Type</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" id="DeviceType" className="form-control" required value={Type}
                                                    onChange={(e) => setType(e.target.value)} />
                                            </div>
                                            <div className="col-md-2">
                                                <span className="form-text invalid-feedback">
                                                    *required
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6 mt-3'>
                                        <div className="row align-items-center">
                                            <div className="col-md-4">
                                                <label className="col-form-label">Device Number</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" id="DeviceNumber" className="form-control" required value={Number}
                                                    onChange={(e) => setNumber(e.target.value)} />
                                            </div>
                                            <div className="col-md-2">
                                                <span className="form-text invalid-feedback">
                                                    *required
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-center p-5'>
                                    <button className='SaveBtn' onClick={UpdateDeviceModel}>Save Device Model</button>
                                    <label className='ms-4 cursor-pointer' onClick={CancelClick}>Cancel</label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </>
        </>
    )
}