import $ from 'jquery';
import { useState } from 'react';
import { useEffect } from 'react';
import { ApiDeleteCall, CheckValidation } from '../JS/Connector';
import { ApiPostCall } from '../JS/Connector';
import { ApiGetCall } from '../JS/Connector';
import Modal from 'react-bootstrap/Modal';
export function DeviceType() {
    const [Name, setName] = useState("");
    const [Type, setType] = useState("");
    const [Number, setNumber] = useState("");
    const [AllDevices, setAllDevices] = useState([]);
    const [norecord, setNorecord] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    
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
    
    const handleShow = (UserId) => {
        setShow(true);
        $("#HdnUserId").val(UserId);
        if(UserId != 0){
            $(".ActionBox").addClass('d-none');
            setAddUpdateFlag(1);
            GetDeviceDataById();
        }
    };

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
        var vId = parseInt($("#HdnUserId").val());
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
    const SaveDevice = async () => {
        var isFormValid = CheckValidation("AddUpdateForm");
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
                    setShow(false);
                    $(".alert-success").show();
                    $("#AlertMsg").text("Device Model Added Successfully.");
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
                    setShow(false);
                    $(".alert-success").show();
                    $("#AlertMsg").text("Device Model Updated Successfully.");
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
                    $(".ActionBox").addClass('d-none');
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

    const ShowActionBox = (UserId) => {
        if ($("#ActionBoxId_" + UserId).hasClass('d-none')) {
            $(".ActionBox").addClass('d-none');
            $("#ActionBoxId_" + UserId).removeClass('d-none');
        } else {
            $(".ActionBox").addClass('d-none');
            $("#ActionBoxId_" + UserId).addClass('d-none');
        }
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
                        <label className='BorderBtn ms-3 cursor-pointer' onClick={(e) => handleShow(0)}>
                            Add Device <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                        </label>
                    </div>
                </div>
                <div className='GridBox mt-2 p-4' id='GridDiv'>
                    <div className='greyBox' id="GreyBoxId">
                        <div className='row d-flex align-items-center p-1'>
                            <div className='col-md-9'>
                                <span className='GridTitle'>Device Type List</span>
                            </div>
                            <div className='col-md-3 text-end'>
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
                                    <div className="col-md-4">Device Name</div>
                                    <div className="col-md-3">Device Type</div>
                                    <div className="col-md-3">Serial Number</div>
                                    <div className="col-md-2 text-end">Action</div>
                                    <div className='col-12 p-0'>
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                </div>
                                <div className="GridDataDiv row" style={{ overflowY: "scroll", overflowX: "hidden" }}>
                                    {AllDevices.map((item, i) => {
                                        var returData;
                                        returData = (<div className="col-12" key={i}>
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
                                                <div className="col-2 text-end">
                                                    <div className=''>
                                                        <img src='/images/ActionIcon.svg' className='img-fluid cursor-pointer ActionBoxImage' alt="Action" onClick={(e) => ShowActionBox(item.ID)} />
                                                        <div className='ActionBox d-none' id={`ActionBoxId_${item.ID}`}>
                                                            <div className="cursor-pointer grid p-1" onClick={(e) => handleShow(item.ID)}>
                                                                <img src="/images/EditIcon.svg" title="Edit Device" className="me-1"
                                                                    alt="Edit"
                                                                />Edit Device
                                                            </div>
                                                            <div className='pt-2 cursor-pointer grid p-1' onClick={(e) => DeleteDevice(item.ID)}>
                                                                <img src="/images/DeleteIcon.svg" title="Delete Device" className="cursor-pointer me-1" userid={item.ID}
                                                                    alt="Delete"
                                                                />Remove
                                                            </div>
                                                        </div>
                                                    </div>
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
                </div>
            </div>

            {/* Modal */}
            <Modal size="lg" show={show} onHide={handleClose} keyboard={true}>
                <div className='row ModalHeader'>
                    <div className='col-md-11'>
                        <h4>Device Type</h4>
                    </div>
                    <div className='col-md-1 text-end' onClick={handleClose}><img src='/images/CloseIcon.svg' className='img-fluid' /></div>
                    <div className='col-12 px-0'>
                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                    </div>
                </div>
                <div className='col-12 row mx-1 mb-3' id="AddUpdateForm">
                    <div className='col-md-4'>
                        <label>Device Name</label>
                        <input type="text" id="DeviceName" autoComplete='off' className="form-control" required value={Name}
                            onChange={(e) => setName(e.target.value)} />
                        <span className="invalid-feedback">
                            *required
                        </span>
                    </div>
                    <div className='col-md-4'>
                        <label>Device Type</label>
                        <input type="text" id="DeviceType" autoComplete='off' className="form-control" required value={Type}
                            onChange={(e) => setType(e.target.value)} />
                        <span className="invalid-feedback">
                            *required
                        </span>
                    </div>
                    <div className='col-md-4'>
                        <label>Serial Number</label>
                        <input type="text" id="DeviceNumber" autoComplete='off' className="form-control" required value={Number}
                            onChange={(e) => setNumber(e.target.value)} />
                        <span className="invalid-feedback">
                            *required
                        </span>
                    </div>
                </div>
                <div className='text-center mt-4 mb-4'>
                    {AddUpdateFlag == 0 ?
                        <button className='SaveBtn' onClick={SaveDevice}>Save Device Model</button>
                        :
                        <button className='SaveBtn' onClick={UpdateDevice}>Update Device Model</button>
                    }
                    <label className='ms-2 cursor-pointer' onClick={handleClose}>Cancel</label>
                </div>
            </Modal>
        </>
    )
}