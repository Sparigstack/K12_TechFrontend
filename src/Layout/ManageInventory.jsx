import '../Styles/SideMenu/Sidemenu.css';
import '../Styles/SideMenu/semi-dark.css';
import React from 'react';
import $ from 'jquery';
import { useEffect } from 'react';
import { ApiGetCall } from '../JS/Connector';
import { useState } from 'react';
import { CheckValidation } from '../JS/Common';
import { ApiPostCall } from '../JS/Connector';
import { Cookies } from 'react-cookie';
import { getUrlParameter } from '../JS/Common';
import { ShowLoder, HideLoder } from '../JS/Common';
import { Modal } from 'react-bootstrap';
import { MMDDYYYY } from '../JS/Common';
export function ManageInventory() {
    const schoolid = 1;
    const cookies = new Cookies();
    const [AllDevices, setAllDevices] = useState([]);
    const [DeviceDetails, setDeviceDetails] = useState([]);
    const [DeviceHistory, setDeviceHistory] = useState([]);
    const [norecord, setNorecord] = useState("");
    const [Deviceid, setDeviceid] = useState("");

    // form input fields start
    const [PurchaseDate, setPurchaseDate] = useState("");
    const [OEMWarrantyUntil, setOEMWarrantyUntil] = useState("");
    const [ExtendedWarrantyUntil, setExtendedWarrantyUntil] = useState("");
    const [ADPCoverage, setADPCoverage] = useState("");
    const [StudentName, setStudentName] = useState("");
    const [StudentID, setStudentID] = useState("");
    const [ParentEmail, setParentEmail] = useState("");
    const [ParentPhoneNumber, setParentPhoneNumber] = useState("");
    const [OEM, setOEM] = useState("");
    const [SerialNumber, setSerialNumber] = useState("");
    const [AssetTag, setAssetTag] = useState("");
    const [Building, setBuilding] = useState("");
    const [Grade, setGrade] = useState("");
    const [DeviceModel, setDeviceModel] = useState("");
    const [OS, setOS] = useState("");
    // form input fields end
    const [isShow, invokeModal] = useState(false);

    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
            CheckUrl();
        };
    }, []);
    const CheckUrl = () => {
        ShowLoder();
        var PathName = window.location.pathname;
        var pathsplit = PathName.split('/');
        var prodActive = pathsplit[2];
        if (prodActive == "add-inventory") {
            HideLoder();
            ShowAddUpdatediv();
        } else if (prodActive == "update-inventory") {
            HideLoder();
            invokeModal(false);
            ShowAddUpdatediv();
        }
        else {
            HideLoder();
            GetListOfDevices();
        }
    }
    const ShowAddUpdatediv = () => {
        var Deviceid = getUrlParameter("id");
        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
            var clean_uri = uri.substring(0, uri.indexOf("?"));
            window.history.replaceState({}, document.title, clean_uri);
        }
        $("#hdnDeviceId").val(Deviceid);
        setDeviceid(Deviceid);
        ShowLoder();
        $("#GridDiv").addClass('d-none');
        $("#AddImportBtnDiv").addClass('d-none');
        $("#AddUpdateDiv").removeClass('d-none');
        $("#AddUpdateHeader").text("Add New Inventory");
        HideLoder();
        if (Deviceid >= 1) {
            GetDeviceDetailById(Deviceid, '2');
        }
    }
    const GetListOfDevices = async () => {
        $("#SortBy").val(0);
        var searchString = $("#SearchInput").val();
        ShowLoder();
        if (searchString == "") {
            searchString = null;
        }
        await ApiGetCall("/getallInventories/" + schoolid + "&" + searchString).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var sugArray = [];
                var i = 1;
                if (responseRs.response == "success") {
                    if (responseRs.msg.length != 0) {
                        setNorecord("");
                        setAllDevices(responseRs.msg);
                    } else {
                        sugArray.push(
                            <div className="col-12 GridNoRecord text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setNorecord(sugArray);
                        setAllDevices([]);
                    }
                }
                HideLoder();
            }
        });
    }
    const GetDeviceDetailById = async (UserId, flag) => {
        $("#hdnDeviceId").val(UserId);
        setDeviceid(UserId);
        await ApiGetCall("/fetchDeviceDetails/" + UserId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                var sugData = responseRs.msg;
                var historyData = responseRs.deviceHistory;
                if (responseRs.response == "success") {
                    setDeviceDetails(sugData);
                    setDeviceHistory(historyData);
                    if (flag == 1) {
                        invokeModal(true);
                    } else {
                        invokeModal(false);
                        $("#GridDiv").addClass('d-none');
                        $("#AddImportBtnDiv").addClass('d-none');
                        $("#AddUpdateDiv").removeClass('d-none');
                        $("#AddUpdateHeader").text("Update Inventory");
                        setPurchaseDate(sugData.Purchase_date);
                        setOEMWarrantyUntil(sugData.OEM_warranty_until);
                        setExtendedWarrantyUntil(sugData.Extended_warranty_until);
                        setADPCoverage(sugData.ADP_coverage);
                        setStudentName(sugData.Student_name);
                        setStudentID(sugData.Student_ID);
                        setParentEmail(sugData.Parent_email);
                        setParentPhoneNumber(sugData.Parent_phone_number);
                        setOEM(sugData.OEM);
                        setDeviceModel(sugData.Device_model);
                        setOS(sugData.OS);
                        setSerialNumber(sugData.Serial_number);
                        setAssetTag(sugData.Asset_tag);
                        setBuilding(sugData.Building);
                        setGrade(sugData.Grade);
                        if (sugData.Parental_coverage == 1) {
                            $("#ParentalCoverageYes").prop('checked', true);
                        } else {
                            $("#ParentalCoverageNo").prop('checked', true);
                        }
                    }
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
    const AddUpdateInventory = (DeviceId, url) => {
        var PathName = window.location.pathname;
        var FinalUrl = PathName + url + "?id=" + DeviceId;
        window.location.href = FinalUrl;
    }
    const UpdateInventory = async () => {
        var userid = parseInt(cookies.get('CsvUserId'));

        var isFormValid = CheckValidation("AddInventoryForm");
        if ($('input[name="ParentalCoverage"]:checked').length == 0) {
            $("#RadioButtonRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#RadioButtonRequired").css('display', 'none');
        ShowLoder();
        var parentalCoverage = 0;
        if ($("#ParentalCoverageYes").is(":checked")) {
            parentalCoverage = 1;
        }
        var raw = JSON.stringify({
            ID: Deviceid,
            PurchaseDate: PurchaseDate,
            OemWarrantyUntil: OEMWarrantyUntil,
            ExtendedWarrantyUntil: ExtendedWarrantyUntil,
            ADPCoverage: ADPCoverage,
            StudentName: StudentName,
            StudentID: StudentID,
            ParentEmail: ParentEmail,
            ParentPhoneNumber: ParentPhoneNumber,
            ParentalCoverage: parentalCoverage,
            OEM: OEM,
            DeviceModel: DeviceModel,
            OS: OS,
            SerialNumber: SerialNumber,
            AssetTag: AssetTag,
            Building: Building,
            Grade: Grade,
            schoolId: 1,
            userId: userid
        });
        await ApiPostCall("/addeditmanualInventoy", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text(" Inventory Updated Successfully.");
                    setTimeout(function () {
                        window.location = "/manage-inventory";
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
    const SaveInventory = async () => {
        var userid = parseInt(cookies.get('CsvUserId'));

        var isFormValid = CheckValidation("AddInventoryForm");
        if ($('input[name="ParentalCoverage"]:checked').length == 0) {
            $("#RadioButtonRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#RadioButtonRequired").css('display', 'none');
        ShowLoder();
        var parentalCoverage = 0;
        if ($("#ParentalCoverageYes").is(":checked")) {
            parentalCoverage = 1;
        }
        var raw = JSON.stringify({
            PurchaseDate: PurchaseDate,
            OemWarrantyUntil: OEMWarrantyUntil,
            ExtendedWarrantyUntil: ExtendedWarrantyUntil,
            ADPCoverage: ADPCoverage,
            StudentName: StudentName,
            StudentID: StudentID,
            ParentEmail: ParentEmail,
            ParentPhoneNumber: ParentPhoneNumber,
            ParentalCoverage: parentalCoverage,
            OEM: OEM,
            DeviceModel: DeviceModel,
            OS: OS,
            SerialNumber: SerialNumber,
            AssetTag: AssetTag,
            Building: Building,
            Grade: Grade,
            schoolId: 1,
            userId: userid
        });
        await ApiPostCall("/addeditmanualInventoy", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                if (responseRs.response == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("New Inventory Added Successfully.");
                    setTimeout(function () {
                        window.location = "/manage-inventory";
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
    const CancelClick = () => {
        window.location.href = "/manage-inventory";
    }
    const SortByName = async () => {
        var sortbyval = $("#SortBy option:selected").val();
        ShowLoder();
        await ApiGetCall("/sortby/" + schoolid + "&" + sortbyval).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.response == "success") {
                    setAllDevices(responseRs.msg);
                    setNorecord("");
                }
                HideLoder();
            }
        });
    }
    const CreateTicket = () => {
        var userid = parseInt($("#hdnDeviceId").val());
        window.location.href = '/create-ticket/?id=' + userid;
    }
    const ShowActionDropDown = () => {
        $("#ActionDropDown").removeClass('d-none');
    }
    const SelectAllDevices = () => {
        if ($("#SelectAllId").is(":checked")) {
            $("#ActionDropDown").removeClass('d-none');
            $(".CommonCheckBoxClass").prop('checked', true);
        } else {
            $("#ActionDropDown").addClass('d-none');
            $(".CommonCheckBoxClass").prop('checked', false);
        }
    }
    const ClosePopup = () => {
        invokeModal(false);
    }
    const ShowDeviceDetail = (divId) => {
        if ($("#" + divId).hasClass('d-none')) {
            $("#" + divId).fadeIn();
            $("#" + divId).fadeIn("slow");
            $("#" + divId).fadeIn(3000);
            $("#" + divId).removeClass('d-none');
            $("#DownArrow_" + divId).addClass('d-none');
            $("#UpArrow_" + divId).removeClass('d-none');
        } else {
            $("#" + divId).fadeOut();
            $("#" + divId).fadeOut("slow");
            $("#" + divId).fadeOut(3000);
            $("#" + divId).addClass('d-none');
            $("#UpArrow_" + divId).addClass('d-none');
            $("#DownArrow_" + divId).removeClass('d-none');
        }
    }
    const InventoryAction = async () => {
        ShowLoder();
        var actionid = parseInt($("#ActionDropDown option:selected").val());
        var ActionArray = [];
        var vlen = $(".CommonCheckBoxClass:checked").length;
        if (vlen == 0) {
            $("#ErrorDiv").text("Select at least one device.");
        } else {
            $("#ErrorDiv").text("");
            $(".CommonCheckBoxClass:checked").each(function () {
                var vJson = {};
                vJson['ID'] = $(this).attr('deviceid');
                ActionArray.push(vJson);
            });
            var raw = JSON.stringify({
                IDArray: ActionArray,
                actionid: actionid
            });
            await ApiPostCall("/manageInventoryAction", raw).then((result) => {
                if (result == undefined || result == "") {
                    alert("Something went wrong");
                } else {
                    HideLoder();
                    if (result == "success") {
                        $(".alert-success").show();
                        $("#AlertMsg").text("Updated Successfully.");
                        setTimeout(function () {
                            window.location = "/manage-inventory";
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
    }
    return (
        <>
            <input type="hidden" id="hdnDeviceId" />
            <div className='row col-12'>
                <div className='col-md-6'>
                    <h1 className="PageHeading">Manage Inventory</h1>
                </div>
                <div className='col-md-6 mb-2 pe-0 text-end d-flex justify-content-end align-items-center' id="AddImportBtnDiv">
                    <a href='/importexport-inventory' className='BlackFont cursor-pointer'><label className='BorderBtn text-center'> Import Inventory
                        <img src='/images/ImportInventory.svg' className='img-fluid ps-2' />
                    </label></a>
                    <label className='BorderBtn ms-3 text-center' onClick={(e) => AddUpdateInventory(0, "/add-inventory")}> Add Inventory
                        <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                    </label>
                </div>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox">
                    <div className="container ps-3">
                        <div className='row pt-2 d-flex align-items-center'>
                            <div className='col-md-6 mt-2'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" autoComplete='off' type="text" placeholder="Search A Student Name" id="SearchInput" onKeyUp={GetListOfDevices} />
                                </form>
                            </div>
                            <div className='col-md-6'>
                                <div className='col-md-4 offset-md-8 mt-2'>
                                    <select name="sorting" id="SortBy" onChange={SortByName}>
                                        <option value="0">Sort by</option>
                                        <option value="1">Student Name</option>
                                        <option value="2">Device model</option>
                                        <option value="3">Grade</option>
                                        <option value="4">Building</option>
                                        <option value="5">OEM</option>
                                        <option value="6">Date of Purchase</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 greyBox mt-3'>
                            <div className='Header row align-items-center '>
                                <div className='col-md-5 mb-2'>
                                    <b className='font-16 mb-0'>list of Devices</b><br />
                                </div>
                                <div className='col-md-4 text-end' style={{ color: "red" }} id="ErrorDiv">

                                </div>
                                <div className='col-md-3 mb-2 d-none' id="ActionDropDown" onChange={InventoryAction}>
                                    <select>
                                        <option value="0">Actions</option>
                                        <option value="1">Mass update device details</option>
                                        <option value="2">Decommission</option>
                                    </select>
                                </div>
                                <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                            </div>
                            <div className='innerGridBox mt-2'>
                                <div className='row GridHeader mx-1 px-0'>
                                    <div className='col-md-1 font-13 px-0'>Select All<input className="form-check-input ms-1" id="SelectAllId" type="checkbox" onClick={SelectAllDevices} /></div>
                                    <div className='col-md-2'>Student Name</div>
                                    <div className='col-md-2'>Serial Number</div>
                                    <div className='col-md-2'>Device Model</div>
                                    <div className='col-md-2'>Asset Tag</div>
                                    <div className='col-md-1'>Grade</div>
                                    <div className='col-md-1'>Building</div>
                                    <div className='col-md-1'></div>
                                </div>
                                <div className='scroll-330'>
                                    {AllDevices.map((item, i) => {
                                        var returData;
                                        returData = (<div key={i} className="row grid mx-1 px-0">
                                            <div className='col-md-1'>
                                                <input className="form-check-input CommonCheckBoxClass" deviceid={item.ID} type="checkbox" onChange={ShowActionDropDown} />
                                            </div>
                                            <div className='col-md-2'>{item.Student_name}</div>
                                            <div className='col-md-2'>{item.Serial_number}</div>
                                            <div className='col-md-2'>{item.Device_model}</div>
                                            <div className='col-md-2'>{item.Asset_tag}</div>
                                            <div className='col-md-1'>{item.Grade}</div>
                                            <div className='col-md-1'>{item.Building}</div>
                                            <div className='col-md-1 text-end cursor-pointer'><i class="bi bi-info-circle-fill" title="Show Details" onClick={(e) => GetDeviceDetailById(item.ID, '1')}></i></div>
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

            {/* AddUpdate Inventory */}
            <div className='d-none' id="AddUpdateDiv">
                <div className="GridBox p-3">
                    <div className='greyBox '>
                        <div className='Header'>
                            <b className='font-16' id="AddUpdateHeader">Add New Inventory</b><br />
                            <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                        </div>
                        <div id='AddInventoryForm'>
                            <div className='row p-2 justify-content-between'>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Purchase Date</div>
                                    <div className='col-md-7'>
                                        <input type="date" name='PurchaseDate' className="form-control" required value={PurchaseDate}
                                            onChange={(e) => setPurchaseDate(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>OEM Warranty Until</div>
                                    <div className='col-md-7'>
                                        <input type="date" name='OemWarrantyUntil' className="form-control" required value={OEMWarrantyUntil}
                                            onChange={(e) => setOEMWarrantyUntil(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Extended Warranty Until</div>
                                    <div className='col-md-7'>
                                        <input type="date" name='ExtendedWarrantyUntil' className="form-control" required value={ExtendedWarrantyUntil}
                                            onChange={(e) => setExtendedWarrantyUntil(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>ADP Coverage</div>
                                    <div className='col-md-7'>
                                        <input type="date" name='ADPCoverage' className="form-control" required value={ADPCoverage}
                                            onChange={(e) => setADPCoverage(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-12 text-center pt-2'>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                            </div>
                            <div className='row p-2 justify-content-between'>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Student Name </div>
                                    <div className='col-md-7'>
                                        <input type="text" name='StudentName' className="form-control" required value={StudentName}
                                            onChange={(e) => setStudentName(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Student ID</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='StudentID' className="form-control" required value={StudentID}
                                            onChange={(e) => setStudentID(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Parent / Guardian Email</div>
                                    <div className='col-md-7'>
                                        <input type="email" name='ParentEmail' className="form-control" required value={ParentEmail}
                                            onChange={(e) => setParentEmail(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Parent Phone Number</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='ParentPhoneNumber' className="form-control" required value={ParentPhoneNumber}
                                            onChange={(e) => setParentPhoneNumber(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 pt-3 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Parental Coverage</div>
                                    <div className='col-md-7 d-flex'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name='ParentalCoverage' id="ParentalCoverageYes" />
                                            <label className="form-check-label">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check ms-5">
                                            <input className="form-check-input" type="radio" name='ParentalCoverage' id="ParentalCoverageNo" />
                                            <label className="form-check-label">
                                                No
                                            </label>
                                        </div>
                                        <span className="form-text invalid-feedback" id="RadioButtonRequired">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-12 text-center pt-2'>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                            </div>
                            <div className='row p-2 justify-content-between'>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>OEM</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='OEM' className="form-control" required value={OEM}
                                            onChange={(e) => setOEM(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Device Model</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='DeviceModel' className="form-control" required value={DeviceModel}
                                            onChange={(e) => setDeviceModel(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>OS</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='os' className="form-control" required value={OS}
                                            onChange={(e) => setOS(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Serial Number</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='SerialNumber' className="form-control" required value={SerialNumber}
                                            onChange={(e) => setSerialNumber(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Asset Tag</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='AssetTag' className="form-control" required value={AssetTag}
                                            onChange={(e) => setAssetTag(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Building</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='Building' className="form-control" required value={Building}
                                            onChange={(e) => setBuilding(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Grade</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='Grade' className="form-control" required value={Grade}
                                            onChange={(e) => setGrade(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 text-center pt-4'>
                            {(Deviceid >= 1) ?
                                <button className='SaveBtn' onClick={UpdateInventory} >Update Inentory</button>
                                :
                                <button className='SaveBtn' onClick={SaveInventory} >Save Inentory</button>
                            }
                            <label className='ms-2 cursor-pointer' onClick={CancelClick}>Cancel</label>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isShow} size="lg">
                <Modal.Header closeButton onClick={ClosePopup}>
                    <Modal.Title>Details</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-11'>
                            <h5>Device Details</h5>
                        </div>
                        <div className='col-1'>
                            <img src='/images/DownRoundArrow.svg' id="DownArrow_DeviceDetailsScroll" className='img-fluid cursor-pointer' onClick={(e) => ShowDeviceDetail("DeviceDetailsScroll")} />
                            <img src='/images/UpRoundArrow.svg' id="UpArrow_DeviceDetailsScroll" className='img-fluid cursor-pointer d-none' onClick={(e) => ShowDeviceDetail("DeviceDetailsScroll")} />
                        </div>
                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100 ' />
                    </div>
                    <div id="DeviceDetailsScroll" className='d-none'>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>ID </div>
                                    <div className='col-7'>:  {DeviceDetails.ID}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>OEM Warranty Until </div>
                                    <div className='col-7'>: {MMDDYYYY(DeviceDetails.OEM_warranty_until)}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>ADP Coverage </div>
                                    <div className='col-7'>: {MMDDYYYY(DeviceDetails.ADP_coverage)}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>OEM </div>
                                    <div className='col-7'>: {DeviceDetails.OEM}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Serial Number </div>
                                    <div className='col-7'>: {DeviceDetails.Serial_number}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Asset Tag </div>
                                    <div className='col-7'>: {DeviceDetails.Asset_tag}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Building </div>
                                    <div className='col-7'>: {DeviceDetails.Building}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Parent Email </div>
                                    <div className='col-7'>: {DeviceDetails.Parent_email}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Parent Contact </div>
                                    <div className='col-7'>: {DeviceDetails.Parent_phone_number}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Updated At </div>
                                    <div className='col-7'>: {MMDDYYYY(DeviceDetails.updated_at)}</div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Purchase Date </div>
                                    <div className='col-7'>: {MMDDYYYY(DeviceDetails.Purchase_date)}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Extended Warranty Until </div>
                                    <div className='col-7'>: {MMDDYYYY(DeviceDetails.Extended_warranty_until)}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Device Model </div>
                                    <div className='col-7'>: {DeviceDetails.Device_model}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>OS </div>
                                    <div className='col-7'>: {DeviceDetails.OS}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Grade </div>
                                    <div className='col-7'>: {DeviceDetails.Grade}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Student Name</div>
                                    <div className='col-7'>: {DeviceDetails.Student_name}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Student ID </div>
                                    <div className='col-7'>: {DeviceDetails.Student_ID}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Parental Coverage </div>
                                    <div className='col-7'>: {(DeviceDetails.Parental_coverage == 1) ?
                                        <>Yes</> : <>No</>}</div>
                                </div>
                                <div className='row p-1 pe-0'>
                                    <div className='col-5'>Created At </div>
                                    <div className='col-7'>: {MMDDYYYY(DeviceDetails.created_at)}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='row pt-4'>
                        <div className='col-11'>
                            <h5>Device History</h5>
                        </div>
                        <div className='col-1'>
                            <img src='/images/DownRoundArrow.svg' id="DownArrow_DeviceHistoryDiv" className='img-fluid cursor-pointer' onClick={(e) => ShowDeviceDetail("DeviceHistoryDiv")} />
                            <img src='/images/UpRoundArrow.svg' id="UpArrow_DeviceHistoryDiv" className='img-fluid cursor-pointer d-none' onClick={(e) => ShowDeviceDetail("DeviceHistoryDiv")} />
                        </div>
                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100 ' />
                    </div>
                    <div id='DeviceHistoryDiv' className='d-none'>
                        <div className='row px-3'>
                            {DeviceHistory.map((item, i) => {
                                var returData;
                                returData = (<div className='brdr-Btm row'>
                                    <div className='col-md-6 p-1 pe-0 row'>
                                        <div className='col-md-6'>Issue </div>
                                        <div className='col-md-6'>:  {item.Issue}</div>
                                    </div>
                                    <div className='col-md-6 p-1 pe-0 row'>
                                        <div className='col-md-6'>Issue Created Date </div>
                                        <div className='col-md-6'>:  {item.Issue_createdDate}</div>
                                    </div>
                                    <div className='col-md-6 p-1 pe-0 row'>
                                        <div className='col-md-6'>Notes </div>
                                        <div className='col-md-6'>:  {item.Notes}</div>
                                    </div>
                                    <div className='col-md-6 p-1 pe-0 row'>
                                        <div className='col-md-6'>Status </div>
                                        <div className='col-md-6'>:  {item.Status}</div>
                                    </div>
                                </div>
                                );
                                return returData;
                            })}
                        </div>
                    </div>
                    <div className='row text-center pt-3'>
                        <div className='col-md-4 pe-0 text-end'>
                            <button className='SaveBtn' onClick={(e) => AddUpdateInventory(Deviceid, "/update-inventory")}>Update Inventory</button>
                        </div>
                        <div className='col-md-4 pe-0 text-center'>
                            <button className='SaveBtn' onClick={CreateTicket}>Create Ticket</button>
                        </div>
                        <div className='col-md-4 text-start'>
                            <button className='SaveBtn'>Decommission Device</button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <label className='cursor-pointer' onClick={ClosePopup}>Cancel</label>
                </Modal.Footer>
            </Modal>
        </>
    )
}