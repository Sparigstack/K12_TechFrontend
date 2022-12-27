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
    const [IsDecommission, setIsDecommission] = useState(1);
    const [DeviceDetails, setDeviceDetails] = useState([]);
    const [DeviceHistory, setDeviceHistory] = useState([]);
    const [norecord, setNorecord] = useState("");
    const [historynorecord, sethistorynorecord] = useState("");
    const [Deviceid, setDeviceid] = useState("");
    const [isShow, invokeModal] = useState(false);

    // form input fields start
    const [DeviceManufacturer, setDeviceManufacturer] = useState("");
    const [Devicetype, setDevicetype] = useState("");
    const [ManufacturerWarrentyUntil, setManufacturerWarrentyUntil] = useState("");
    const [ManufacturerADPUntil, setManufacturerADPUntil] = useState("");
    const [ThirdPartyWarrantyUntil, setThirdPartyWarrantyUntil] = useState("");
    const [ThirdPartyADPUntil, setThirdPartyADPUntil] = useState("");
    const [ExpectedRetirement, setExpectedRetirement] = useState("");
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [StudentId, setStudentId] = useState("");
    const [Grade, setGrade] = useState("");
    const [DeviceModel, setDeviceModel] = useState("");
    const [DeviceMPN, setDeviceMPN] = useState("");
    const [SerialNumber, setSerialNumber] = useState("");
    const [AssetTag, setAssetTag] = useState("");
    const [PurchaseDate, setPurchaseDate] = useState("");
    const [Building, setBuilding] = useState("");
    const [UserType, setUserType] = useState("");
    const [ParentGuardianName, setParentGuardianName] = useState("");
    const [ParentGuardianEmail, setParentGuardianEmail] = useState("");
    const [ParentPhoneNumber, setParentPhoneNumber] = useState("");
    const [RepairCap, setRepairCap] = useState("");
    const [DeviceOS, setDeviceOS] = useState("");
    // form input fields end

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
            GetListOfDevices(1);
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
    const GetListOfDevices = async (flag) => {
        $("#SortBy").val(0);
        ShowLoder();
        await ApiGetCall("/getallInventories/" + schoolid + "&" + flag).then((result) => {
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
    const SearchDevice = async() =>{
        var searchString = $("#SearchInput").val();
        ShowLoder();
        if (searchString == "") {
            searchString = null;
        }
        await ApiGetCall("/searchInventory/" + schoolid + "&" + searchString + "&" + IsDecommission).then((result) => {
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
                console.log(sugData);
                var historyData = responseRs.deviceHistory;
                if (responseRs.response == "success") {
                    setDeviceDetails(sugData);
                    if (historyData.length != 0) {
                        sethistorynorecord("");
                        setDeviceHistory(historyData);
                    } else {
                        sethistorynorecord(<div className="col-12 GridNoRecord text-center">
                            <label>No Record Found</label>
                        </div>);
                    }
                    if (flag == 1) {
                        invokeModal(true);
                    } else {
                        invokeModal(false);
                        $("#GridDiv").addClass('d-none');
                        $("#AddImportBtnDiv").addClass('d-none');
                        $("#AddUpdateDiv").removeClass('d-none');
                        $("#AddUpdateHeader").text("Update Inventory");
                        setManufacturerWarrentyUntil(sugData.Manufacturer_warranty_until);
                        setManufacturerADPUntil(sugData.Manufacturer_ADP_until);
                        setThirdPartyWarrantyUntil(sugData.Third_party_extended_warranty_until);
                        setThirdPartyADPUntil(sugData.Third_party_ADP_until);
                        setExpectedRetirement(sugData.Expected_retirement);
                        setPurchaseDate(sugData.Purchase_date);
                        setDeviceManufacturer(sugData.Device_manufacturer);
                        setFirstName(sugData.Device_user_first_name);
                        setStudentId(sugData.Student_ID);
                        setDeviceModel(sugData.Device_model);
                        setSerialNumber(sugData.Serial_number);
                        setBuilding(sugData.Building);
                        setParentGuardianName(sugData.Parent_guardian_name);
                        setParentPhoneNumber(sugData.Parent_phone_number);
                        setDeviceOS(sugData.Device_os);
                        setDevicetype(sugData.Device_type);
                        setLastName(sugData.Device_user_last_name);
                        setGrade(sugData.Grade);
                        setDeviceMPN(sugData.Device_MPN);
                        setAssetTag(sugData.Asset_tag);
                        setUserType(sugData.User_type);
                        setParentGuardianEmail(sugData.Parent_Guardian_Email);
                        setRepairCap(sugData.Repair_cap);
                        if (sugData.Parental_coverage == 1) {
                            $("#ParentalCoverageYes").prop('checked', true);
                        } else {
                            $("#ParentalCoverageNo").prop('checked', true);
                        }

                        if (sugData.Loaner_device == "yes") {
                            $("#LoanerDeviceYes").prop('checked', true);
                        } else {
                            $("#LoanerDeviceNo").prop('checked', true);
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
        if ($('input[name="LoanerDevice"]:checked').length == 0) {
            $("#LoanerDeviceRadioButtonRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#RadioButtonRequired").css('display', 'none');
        $("#LoanerDeviceRadioButtonRequired").css('display', 'none');
        ShowLoder();
        var parentalCoverage = 0;
        var LoanerDevice = "no";
        if ($("#ParentalCoverageYes").is(":checked")) {
            parentalCoverage = 1;
        }
        if ($("#LoanerDeviceYes").is(":checked")) {
            LoanerDevice = "yes";
        }
        var raw = JSON.stringify({
            ID: Deviceid,
            schoolid: schoolid,
            userid: userid,
            Manufacturerwarrantyuntil: ManufacturerWarrentyUntil,
            ManufacturerADPuntil: ManufacturerADPUntil,
            Thirdpartyextendedwarrantyuntil: ThirdPartyWarrantyUntil,
            ThirdpartyADPuntil: ThirdPartyADPUntil,
            Expectedretirement: ExpectedRetirement,
            PurchaseDate: PurchaseDate,
            Devicemanufacturer: DeviceManufacturer,
            Deviceuserfirstname: FirstName,
            StudentID: StudentId,
            Devicemodel: DeviceModel,
            Serialnumber: SerialNumber,
            Building: Building,
            Parentguardianname: ParentGuardianName,
            Parentphonenumber: ParentPhoneNumber,
            Deviceos: DeviceOS,
            DeviceType: Devicetype,
            Deviceuserlastname: LastName,
            Grade: Grade,
            DeviceMPN: DeviceMPN,
            Assettag: AssetTag,
            Usertype: UserType,
            ParentguardianEmail: ParentGuardianEmail,
            Repaircap: RepairCap,
            Loanerdevice: LoanerDevice,
            Parentalcoverage: parentalCoverage
        });
        console.log(raw)
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
        if ($('input[name="LoanerDevice"]:checked').length == 0) {
            $("#LoanerDeviceRadioButtonRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#RadioButtonRequired").css('display', 'none');
        $("#LoanerDeviceRadioButtonRequired").css('display', 'none');
        ShowLoder();
        var parentalCoverage = 0;
        var LoanerDevice = "no";
        if ($("#ParentalCoverageYes").is(":checked")) {
            parentalCoverage = 1;
        }
        if ($("#LoanerDeviceYes").is(":checked")) {
            LoanerDevice = "yes";
        }
        var raw = JSON.stringify({
            schoolid: schoolid,
            userid: userid,
            Manufacturerwarrantyuntil: ManufacturerWarrentyUntil,
            ManufacturerADPuntil: ManufacturerADPUntil,
            Thirdpartyextendedwarrantyuntil: ThirdPartyWarrantyUntil,
            ThirdpartyADPuntil: ThirdPartyADPUntil,
            Expectedretirement: ExpectedRetirement,
            PurchaseDate: PurchaseDate,
            Devicemanufacturer: DeviceManufacturer,
            Deviceuserfirstname: FirstName,
            StudentID: StudentId,
            Devicemodel: DeviceModel,
            Serialnumber: SerialNumber,
            Building: Building,
            Parentguardianname: ParentGuardianName,
            Parentphonenumber: ParentPhoneNumber,
            Deviceos: DeviceOS,
            DeviceType: Devicetype,
            Deviceuserlastname: LastName,
            Grade: Grade,
            DeviceMPN: DeviceMPN,
            Assettag: AssetTag,
            Usertype: UserType,
            ParentguardianEmail: ParentGuardianEmail,
            Repaircap: RepairCap,
            Loanerdevice: LoanerDevice,
            Parentalcoverage: parentalCoverage
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
        await ApiGetCall("/sortby/" + schoolid + "&" + sortbyval + "&" + IsDecommission).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.response == "success") {
                    if (responseRs.msg.length != 0) {
                        setNorecord("");
                        setAllDevices(responseRs.msg);
                    } else {
                        var sugArray = [];
                        var i = 1;
                        sugArray.push(
                            <div className="col-12 GridNoRecord text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setNorecord(sugArray);
                    }
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
    const GetDecommissionData = async () => {
        if ($("#DecommissionedId").is(":checked")) {
            $("#HighlightTitle").text("Decommissioned Devices");
            setIsDecommission(2);
            $("#ChangeDecommissionText").text('Active');
            $("#ChangeDecommissionText").val('3');
            $(".CommonCheckBoxClass").prop('checked', false);
            $("#SelectAllId").prop('checked', false);
            $("#SortBy").val(0);
            var searchString = $("#SearchInput").val();
            ShowLoder();
            if (searchString == "") {
                searchString = null;
            }
            await ApiGetCall("/getallDecommission/" + schoolid + "&" + searchString).then((result) => {
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
        } else {
            $("#HighlightTitle").text("List of all Devices");
            setIsDecommission(1);
            $("#ChangeDecommissionText").text('Decommission');
            $("#ChangeDecommissionText").val('2');
            $(".CommonCheckBoxClass").prop('checked', false);
            $("#SelectAllId").prop('checked', false);
            GetListOfDevices(1);
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
                                    <input className="form-control" autoComplete='off' type="text" placeholder="Search A Student Name" id="SearchInput" onKeyUp={SearchDevice} />
                                </form>
                            </div>
                            <div className='col-md-3  px-0 pt-2'>
                                <input className="form-check-input me-2" type="checkbox" onChange={GetDecommissionData} id="DecommissionedId" />Show Decommissioned
                            </div>
                            <div className='col-md-3'>
                                <div className='col-md-4 offset-md-8 mt-2'>
                                    <select name="sorting" id="SortBy" onChange={SortByName}>
                                        <option value="0">Sort by</option>
                                        <option value="1">Student Name</option>
                                        <option value="2">Device model</option>
                                        <option value="3">Grade</option>
                                        <option value="4">Building</option>
                                        {/* <option value="5">OEM</option> */}
                                        <option value="6">Date of Purchase</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 greyBox mt-3'>
                            <div className='Header row align-items-center '>
                                <div className='col-md-5 mb-2 d-flex justify-content-between'>
                                    <b className='font-16 mb-0' id="HighlightTitle">List of all Devices</b><br />
                                </div>
                                <div className='col-md-4 text-end' style={{ color: "red" }} id="ErrorDiv">

                                </div>
                                <div className='col-md-3 mb-2 d-none' id="ActionDropDown" onChange={InventoryAction}>
                                    <select>
                                        <option value="0">Actions</option>
                                        <option value="1">Mass update device details</option>
                                        <option value="2" id="ChangeDecommissionText">Decommission</option>
                                    </select>
                                </div>
                                <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                            </div>
                            <div className='innerGridBox mt-2'>
                                <div className='row GridHeader mx-1 px-0'>
                                    <div className='col-md-2 font-13 px-0 text-center'>Select All<input className="form-check-input ms-1" id="SelectAllId" type="checkbox" onClick={SelectAllDevices} /></div>
                                    <div className='col-md-2'>Student Name</div>
                                    <div className='col-md-2'>Device Model</div>
                                    <div className='col-md-1 text-center'>Grade</div>
                                    <div className='col-md-1 text-center'>Building</div>
                                    <div className='col-md-2 text-center'>Purchase Date</div>
                                    <div className='col-md-1'></div>
                                </div>
                                <div className='scroll-330'>
                                    {AllDevices.map((item, i) => {
                                        var returData;
                                        returData = (<div key={i} className="row grid mx-1 px-0">
                                            <div className='col-md-2 text-center'>
                                                <input className="form-check-input CommonCheckBoxClass" deviceid={item.ID} type="checkbox" onChange={ShowActionDropDown} />
                                            </div>
                                            <div className='col-md-2'>{item.Device_user_first_name} {item.Device_user_last_name}</div>
                                            <div className='col-md-2'>{item.Device_model}</div>
                                            <div className='col-md-1 text-center'>{item.Grade}</div>
                                            <div className='col-md-1 text-center'>{item.Building}</div>
                                            <div className='col-md-2 text-center'>{item.Purchase_date}</div>
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
                                    <div className='col-md-7 FormLabel'>Manufacturer Warranty Until</div>
                                    <div className='col-md-5'>
                                        <input type="date" name='ManufacturerWarrentyUntil' className="form-control" required value={ManufacturerWarrentyUntil}
                                            onChange={(e) => setManufacturerWarrentyUntil(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-7 FormLabel'>Manufacturer ADP Until</div>
                                    <div className='col-md-5'>
                                        <input type="date" name='ManufacturerADPUntil' className="form-control" required value={ManufacturerADPUntil}
                                            onChange={(e) => setManufacturerADPUntil(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Third Party Extended Warranty Until</div>
                                    <div className='col-md-5'>
                                        <input type="date" name='ThirdPartywarrantyuntil' className="form-control" required value={ThirdPartyWarrantyUntil}
                                            onChange={(e) => setThirdPartyWarrantyUntil(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Third Party ADP Until</div>
                                    <div className='col-md-5'>
                                        <input type="date" name='thirdpartyadpuntil' className="form-control" required value={ThirdPartyADPUntil}
                                            onChange={(e) => setThirdPartyADPUntil(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Expected Retirement</div>
                                    <div className='col-md-5'>
                                        <input type="date" name='expectedretirement' className="form-control" required value={ExpectedRetirement}
                                            onChange={(e) => setExpectedRetirement(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Purchase Date</div>
                                    <div className='col-md-5'>
                                        <input type="date" name='PurchaseDate' className="form-control" required value={PurchaseDate}
                                            onChange={(e) => setPurchaseDate(e.target.value)} />
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
                                    <div className='col-md-7 FormLabel'>Device Manufacturer</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='devicemanufacturer' className="form-control" required value={DeviceManufacturer}
                                            onChange={(e) => setDeviceManufacturer(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-7 FormLabel'>Device Type</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='devicetype' className="form-control" required value={Devicetype}
                                            onChange={(e) => setDevicetype(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Device User FirstName</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='firstname' className="form-control" required value={FirstName}
                                            onChange={(e) => setFirstName(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Device User LastName</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='lastName' className="form-control" required value={LastName}
                                            onChange={(e) => setLastName(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Student ID</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='Studentid' className="form-control" required value={StudentId}
                                            onChange={(e) => setStudentId(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Grade / Department</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='grade' className="form-control" required value={Grade}
                                            onChange={(e) => setGrade(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Device Model</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='devicemodel' className="form-control" required value={DeviceModel}
                                            onChange={(e) => setDeviceModel(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Device MPN</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='devicempn' className="form-control" required value={DeviceMPN}
                                            onChange={(e) => setDeviceMPN(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Serial Number</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='serialnumber' className="form-control" required value={SerialNumber}
                                            onChange={(e) => setSerialNumber(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Asset Tag</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='assettag' className="form-control" required value={AssetTag}
                                            onChange={(e) => setAssetTag(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Building</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='building' className="form-control" required value={Building}
                                            onChange={(e) => setBuilding(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>User Type</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='usertype' className="form-control" required value={UserType}
                                            onChange={(e) => setUserType(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Parent Guardian Name</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='guardianName' className="form-control" required value={ParentGuardianName}
                                            onChange={(e) => setParentGuardianName(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Parent Guardian Email</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='guardianemail' className="form-control" required value={ParentGuardianEmail}
                                            onChange={(e) => setParentGuardianEmail(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Parent Phone Number</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='parentphonenumber' className="form-control" required value={ParentPhoneNumber}
                                            onChange={(e) => setParentPhoneNumber(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Repair Cap</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='repaircap' className="form-control" required value={RepairCap}
                                            onChange={(e) => setRepairCap(e.target.value)} />
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-7 FormLabel'>Device OS</div>
                                    <div className='col-md-5'>
                                        <input type="text" name='deviceos' className="form-control" required value={DeviceOS}
                                            onChange={(e) => setDeviceOS(e.target.value)} />
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
                                    <div className='col-md-7 FormLabel'>Loaner Device</div>
                                    <div className='col-md-5 d-flex'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name='LoanerDevice' id="LoanerDeviceYes" />
                                            <label className="form-check-label">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check ms-5">
                                            <input className="form-check-input" type="radio" name='LoanerDevice' id="LoanerDeviceNo" />
                                            <label className="form-check-label">
                                                No
                                            </label>
                                        </div>
                                        <span className="form-text invalid-feedback" id="LoanerDeviceRadioButtonRequired">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-7 FormLabel'>Parental Coverage</div>
                                    <div className='col-md-5 d-flex'>
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
                    <div id="DeviceDetailsScroll" >
                        <div className='row'>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>ID: </div>
                                <div className='col-6'>  {DeviceDetails.ID}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Expected Retirement: </div>
                                <div className='col-6'> {DeviceDetails.Expected_retirement}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Device Manufacturer: </div>
                                <div className='col-6'> {DeviceDetails.Device_manufacturer}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Student Name: </div>
                                <div className='col-6'> {DeviceDetails.Device_user_first_name} {DeviceDetails.Device_user_last_name}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Student ID: </div>
                                <div className='col-6'> {DeviceDetails.Student_ID}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Device Model: </div>
                                <div className='col-6'> {DeviceDetails.Device_model}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Serial Number: </div>
                                <div className='col-6'> {DeviceDetails.Serial_number}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Building: </div>
                                <div className='col-6'> {DeviceDetails.Building}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Device OS: </div>
                                <div className='col-6'> {DeviceDetails.Device_os}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Device Type: </div>
                                <div className='col-6'> {DeviceDetails.Device_type}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Grade / Department: </div>
                                <div className='col-6'> {DeviceDetails.Grade}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Device MPN: </div>
                                <div className='col-6'> {DeviceDetails.Device_MPN}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Asset Tag: </div>
                                <div className='col-6'> {DeviceDetails.Asset_tag}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>User Type: </div>
                                <div className='col-6'> {DeviceDetails.User_type}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Repair Cap: </div>
                                <div className='col-6'> {DeviceDetails.Repair_cap}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Loaner Device: </div>
                                <div className='col-6'> {DeviceDetails.Loaner_device}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Parental Coverage: </div>
                                <div className='col-6'> {(DeviceDetails.Parental_coverage == 1) ?
                                    <>Yes</> : <>No</>}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-6'>Created At: </div>
                                <div className='col-6'> {MMDDYYYY(DeviceDetails.created_at)}</div>
                            </div>
                            <div className='col-12 row py-1'>
                                <div className='col-6'>Purchase Date: </div>
                                <div className='col-6'> {DeviceDetails.Purchase_date}</div>
                            </div>
                            <div className='col-12 row py-1'>
                                <div className='col-6'>Manufacturer Warranty Until: </div>
                                <div className='col-6'>  {DeviceDetails.Manufacturer_warranty_until}</div>
                            </div>
                            <div className='col-12 row py-1'>
                                <div className='col-6'>Third Party Extended Warranty Until: </div>
                                <div className='col-6'> {DeviceDetails.Third_party_extended_warranty_until}</div>
                            </div>
                            <div className='col-12 row py-1'>
                                <div className='col-6'>Manufacturer ADP Until: </div>
                                <div className='col-6'> {DeviceDetails.Manufacturer_ADP_until}</div>
                            </div>
                            <div className='col-12 row py-1'>
                                <div className='col-6'>Third Party ADP Until: </div>
                                <div className='col-6'> {DeviceDetails.Third_party_ADP_until}</div>
                            </div>
                            <div className='col-12 row py-1'>
                                <div className='col-6'>Parent Phone Number: </div>
                                <div className='col-6'> {DeviceDetails.Parent_phone_number}</div>
                            </div>
                            <div className='col-12 row py-1'>
                                <div className='col-6'>Parent Guardian Email: </div>
                                <div className='col-6'> {DeviceDetails.Parent_Guardian_Email}</div>
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
                            {historynorecord}
                        </div>
                    </div>
                    <div className='row text-center pt-3'>
                        <div className='col-md-6 pe-0 text-end'>
                            <button className='SaveBtn' onClick={(e) => AddUpdateInventory(Deviceid, "/update-inventory")}>Update Device</button>
                        </div>
                        <div className='col-md-6 pe-0 text-start'>
                            <button className='SaveBtn' onClick={CreateTicket}>Create Ticket</button>
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