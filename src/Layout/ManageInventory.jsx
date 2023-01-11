import '../Styles/SideMenu/Sidemenu.css';
import '../Styles/SideMenu/semi-dark.css';
import React from 'react';
import $ from 'jquery';
import { useEffect } from 'react';
import { ApiGetCallWithoutHeaders } from '../JS/Connector';
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
    const [Loanerhistory, setLoanerHistory] = useState([]);
    const [loanernorecord, setloanernorecord] = useState("");
    const [norecord, setNorecord] = useState("");
    const [historynorecord, sethistorynorecord] = useState("");
    const [Deviceid, setDeviceid] = useState("");
    const [TicketUserid, setTicketUserid] = useState("");
    const [isShow, invokeModal] = useState(false);
    const [isStatusPopup, setisStatusPopup] = useState(false);
    const [Tabid, setTabid] = useState("");

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
        // return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
            CheckUrl();
        // };
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
        var Ticketuserid = getUrlParameter("userid");
        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
            var clean_uri = uri.substring(0, uri.indexOf("?"));
            window.history.replaceState({}, document.title, clean_uri);
        }
        $("#hdnDeviceId").val(Deviceid);
        $("#hdnTicketUserId").val(Ticketuserid);
        setTicketUserid(Ticketuserid);
        setDeviceid(Deviceid);
        ShowLoder();
        $("#GridDiv").addClass('d-none');
        $("#AddImportBtnDiv").addClass('d-none');
        $("#AddUpdateDiv").removeClass('d-none');
        $("#AddUpdateHeader").text("Add New Inventory");
        $("#LoanerDeviceNo").prop('checked', true);
        $("#AssignDeviceToUserDiv").removeClass('d-none');
        $("#AssignUserDeviceNo").prop('checked', true);
        HideLoder();
        if (Deviceid >= 1) {
            GetDeviceDetailById(Deviceid, '2', Ticketuserid);
        }
    }
    const GetListOfDevices = async () => {
        $("#SortBy").val(0);
        ShowLoder();
        await ApiGetCallWithoutHeaders("/getallInventories/" + schoolid + "&1").then((result) => {
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
    const SearchDevice = async () => {
        var searchString = $("#SearchInput").val();
        ShowLoder();
        if (searchString == "") {
            searchString = null;
        }
        await ApiGetCallWithoutHeaders("/searchInventory/" + schoolid + "&" + searchString + "&" + IsDecommission).then((result) => {
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
    const GetDeviceDetailById = async (UserId, flag, TicketUserid) => {
        $("#hdnDeviceId").val(UserId);
        $("#hdnTicketUserId").val(TicketUserid);
        setDeviceid(UserId);
        setTicketUserid(TicketUserid);
        await ApiGetCallWithoutHeaders("/fetchDeviceDetails/" + UserId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                var sugData = responseRs.msg;
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

                        if (sugData.Loaner_device == 1) {
                            $("#AssignDeviceToUserDiv").addClass('d-none');
                            $("#LoanerDeviceYes").prop('checked', true);
                        } else {
                            $("#AssignDeviceToUserDiv").removeClass('d-none');
                            $("#LoanerDeviceNo").prop('checked', true);
                        }

                        if (sugData.Device_user_first_name != "") {
                            $("#AssignUserDeviceYes").prop('checked', true);
                            $("#StudentDetailsDiv").removeClass('d-none');
                        } else {
                            $("#AssignUserDeviceYes").prop('checked', false);
                            $("#StudentDetailsDiv").addClass('d-none');
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
    const AddUpdateInventory = (TicketUserid, DeviceId, url) => {
        var PathName = window.location.pathname;
        var FinalUrl = PathName + url + "?id=" + DeviceId + "&userid=" + TicketUserid;
        window.location.href = FinalUrl;
    }
    const UpdateInventory = async () => {
        var DataFlag = 0;
        var userid = parseInt(cookies.get('CsvUserId'));

        var isFormValid = CheckValidation("AddInventoryForm");
        if (!$("#StudentDetailsDiv").hasClass('d-none')) {
            if ($('input[name="ParentalCoverage"]:checked').length == 0) {
                $("#RadioButtonRequired").css('display', 'block');
                isFormValid = false;
            }
            DataFlag = 1;
            isFormValid = CheckValidation('StudentDetailsDiv');
        }
        if (!isFormValid) return;
        $("#RadioButtonRequired").css('display', 'none');
        $("#LoanerDeviceRadioButtonRequired").css('display', 'none');
        ShowLoder();
        var parentalCoverage = 0;
        var LoanerDevice = 0;
        if ($("#ParentalCoverageYes").is(":checked")) {
            parentalCoverage = 1;
        }
        if ($("#LoanerDeviceYes").is(":checked")) {
            LoanerDevice = 1;
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
            Parentalcoverage: parentalCoverage,
            flag: DataFlag
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
        var DataFlag = 0;
        var userid = parseInt(cookies.get('CsvUserId'));
        var isFormValid = CheckValidation("AddInventoryForm");
        if (!$("#StudentDetailsDiv").hasClass('d-none')) {
            if ($('input[name="ParentalCoverage"]:checked').length == 0) {
                $("#RadioButtonRequired").css('display', 'block');
                isFormValid = false;
            }
            DataFlag = 1;
            isFormValid = CheckValidation('StudentDetailsDiv');
        }
        if (!isFormValid) return;
        $("#RadioButtonRequired").css('display', 'none');
        $("#LoanerDeviceRadioButtonRequired").css('display', 'none');
        ShowLoder();
        var parentalCoverage = 0;
        var LoanerDevice = 0;
        if ($("#ParentalCoverageYes").is(":checked")) {
            parentalCoverage = 1;
        }
        if ($("#LoanerDeviceYes").is(":checked")) {
            LoanerDevice = 1;
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
            Parentalcoverage: parentalCoverage,
            flag: DataFlag
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
        await ApiGetCallWithoutHeaders("/sortby/" + schoolid + "&" + sortbyval + "&" + IsDecommission).then((result) => {
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
        var ticktuserid = parseInt($("#hdnTicketUserId").val());
        window.location.href = '/create-ticket/?id=' + userid + "&userid=" + ticktuserid;
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
    const CloseStatusPopup = () => {
        setisStatusPopup(false);
    }
    const ShowDeviceDetail = (divId) => {
        if (divId == "DeviceHistoryDiv") {
            $("#DeviceDetailsScroll").addClass('d-none');
            $("#DeviceDetailsTab").removeClass('active');
            $("#DeviceHistoryTab").addClass('active');
        } else {
            $("#DeviceHistoryDiv").addClass('d-none');
            $("#DeviceHistoryTab").removeClass('active');
            $("#DeviceDetailsTab").addClass('active');
        }
        if ($("#" + divId).hasClass('d-none')) {
            $("#" + divId).fadeIn();
            $("#" + divId).fadeIn("slow");
            $("#" + divId).fadeIn(3000);
            $("#" + divId).removeClass('d-none');
        } else {
            $("#" + divId).fadeOut();
            $("#" + divId).fadeOut("slow");
            $("#" + divId).fadeOut(3000);
            $("#" + divId).addClass('d-none');
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
        setIsDecommission(2);
        $("#ChangeDecommissionText").text('Active');
        $("#ChangeDecommissionText").val('3');
        $(".CommonCheckBoxClass").prop('checked', false);
        $("#SelectAllId").prop('checked', false);
        $("#SortBy").val(0);
        ShowLoder();
        await ApiGetCallWithoutHeaders("/getallDecommission/" + schoolid).then((result) => {
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
    const ShowTicketHistoryDiv = (ticketid) => {
        if ($("#TicketHistoryDiv_" + ticketid).hasClass('d-none')) {
            $("#TicketHistoryDiv_" + ticketid).removeClass('d-none');
            $("#TicketHistoryDiv_" + ticketid).fadeIn();
            $("#TicketHistoryDiv_" + ticketid).fadeIn("slow");
            $("#TicketHistoryDiv_" + ticketid).fadeIn(3000);
        } else {
            $("#TicketHistoryDiv_" + ticketid).addClass('d-none');
            $("#TicketHistoryDiv_" + ticketid).fadeOut();
            $("#TicketHistoryDiv_" + ticketid).fadeOut("slow");
            $("#TicketHistoryDiv_" + ticketid).fadeOut(3000);
        }
    }
    const GetLoanerDeviceData = async () => {
        setIsDecommission(3);
        $("#ChangeDecommissionText").text('Decommission');
        $("#ChangeDecommissionText").val('2');
        $(".CommonCheckBoxClass").prop('checked', false);
        $("#SelectAllId").prop('checked', false);
        $("#SortBy").val(0);
        ShowLoder();
        await ApiGetCallWithoutHeaders("/allLonerDevice/" + schoolid + "&null").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                console.log(responseRs)

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
    const ShowDeviceGrid = (DivId) => {
        $("#SelectAllId").prop('checked', false);
        $(".CommonCheckBoxClass").prop('checked', false);
        $("#ActionDropDown").addClass('d-none');
        $(".linkclass").removeClass('active');
        $("#" + DivId).addClass('active');
        if (DivId == "ActiveDeviceTab") {
            setTabid(1);
            $("#ChangeDecommissionText").text('Decommission');
            $("#ChangeDecommissionText").val('2');
            GetListOfDevices();
        } else if (DivId == "DecommissionedDeviceTab") {
            setTabid(3);
            $("#ChangeDecommissionText").text('Active');
            $("#ChangeDecommissionText").val('3');
            GetDecommissionData();
        } else {
            setTabid(2);
            GetLoanerDeviceData();
        }
    }
    const ShowLoanerHistory = async (ItemId) => {
        setisStatusPopup(true);
        ShowLoder();
        await ApiGetCallWithoutHeaders("/lonerdeviceHistory/" + ItemId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var sugArray = [];
                var i = 1;
                if (responseRs.response == "success") {
                    if (responseRs.msg.length != 0) {
                        setloanernorecord("");
                        setLoanerHistory(responseRs.msg);
                    }
                } else {
                    sugArray.push(
                        <div className="col-12 text-center" key={i}>
                            <label>No Record Found</label>
                        </div>
                    );
                    setloanernorecord(sugArray);
                    setLoanerHistory([]);
                }
                HideLoder();
            }
        });
    }
    const CheckLoanerDevice = (RadioId) => {
        if (RadioId == 2) {
            $("#AssignDeviceToUserDiv").removeClass('d-none');
        } else {
            $("#AssignDeviceToUserDiv").addClass('d-none');
        }
    }
    const ShowStudentDetailsDiv = (RadioId) => {
        if (RadioId == 1) {
            $("#StudentDetailsDiv").removeClass('d-none');
        } else {
            $("#StudentDetailsDiv").addClass('d-none');
        }
    }
    return (
        <>
            <input type="hidden" id="hdnDeviceId" />
            <input type="hidden" id="hdnTicketUserId" />
            <div className='row col-12'>
                <div className='col-md-6'>
                    <h1 className="PageHeading">Manage Inventory</h1>
                </div>
                <div className='col-md-6 mb-2 pe-0 text-end d-flex justify-content-end align-items-center' id="AddImportBtnDiv">
                    <a href='/importexport-inventory' className='BlackFont cursor-pointer'><label className='BorderBtn text-center'> Import Inventory
                        <img src='/images/ImportInventory.svg' className='img-fluid ps-2' />
                    </label></a>
                    <label className='BorderBtn ms-3 text-center' onClick={(e) => AddUpdateInventory(0, 0, "/add-inventory")}> Add Inventory
                        <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                    </label>
                </div>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        <div className='row'>
                            <div className="col-md-7 px-0">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item navitembrdrbtm text-center cursor-pointer">
                                        <a className="nav-link linkclass active" aria-current="page" id="ActiveDeviceTab" onClick={(e) => ShowDeviceGrid("ActiveDeviceTab")}>Active Devices</a>
                                    </li>
                                    <li className="nav-item navitembrdrbtm text-center cursor-pointer">
                                        <a className="nav-link linkclass" id="LoanerDeviceTab" aria-disabled="true" onClick={(e) => ShowDeviceGrid("LoanerDeviceTab")}>Loaner Devices</a>
                                    </li>
                                    <li className="nav-item navitembrdrbtm text-center cursor-pointer">
                                        <a className="nav-link linkclass " aria-current="page" id="DecommissionedDeviceTab" onClick={(e) => ShowDeviceGrid("DecommissionedDeviceTab")}>Decommissioned Devices</a>
                                    </li>

                                </ul>
                            </div>
                            <div className='col-md-3 text-end pe-0 SearchBarDiv'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" autoComplete="off" type="text" placeholder="Search" id="SearchInput" onKeyUp={SearchDevice} />
                                </form>
                            </div>
                            <div className="col-md-2 pe-0 SearchBarDiv">
                                <select name="sorting" id="SortBy" onChange={SortByName}>
                                    <option value="0">Sort by</option>
                                    <option value="1">Student Name</option>
                                    <option value="2">Device model</option>
                                    <option value="3">Grade</option>
                                    <option value="4">Building</option>
                                    <option value="6">Date of Purchase</option>
                                </select>
                            </div>
                            {/* <div className='col-md-3  px-0 pt-2'>
                                <input className="form-check-input me-2" type="checkbox" onChange={GetDecommissionData} id="DecommissionedId" />Show Decommissioned
                            </div> */}
                        </div>
                        <div className='row greyBox mt-3'>
                            <div className='Header row align-items-center '>
                                <div className='col-md-5 mb-2 d-flex justify-content-between'>
                                </div>
                                <div className='col-md-4 text-end' style={{ color: "red" }} id="ErrorDiv"></div>
                                <div className='col-md-3 mb-2 d-none' id="ActionDropDown" onChange={InventoryAction}>
                                    <select>
                                        <option value="0">Actions</option>
                                        <option value="1">Mass update device details</option>
                                        <option value="2" id="ChangeDecommissionText">Decommission</option>
                                    </select>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <div className='row GridHeader mx-1 px-0'>
                                    {Tabid != 2 ?
                                        <div className='col-md-2 font-13 px-0 text-center'>
                                            Select All<input className="form-check-input ms-1" id="SelectAllId" type="checkbox" onClick={SelectAllDevices} />
                                        </div>
                                        :
                                        <></>
                                    }
                                    <div className='col-md-2'>Device Model</div>
                                    <div className='col-md-2'>Student Name</div>
                                    <div className='col-md-1 text-center'>Grade</div>
                                    <div className='col-md-1 text-center'>Building</div>
                                    {Tabid != 2 ?
                                        <div className='col-md-2 text-center'>Purchase Date</div>
                                        :
                                        <div className='col-md-4 text-center'>Purchase Date</div>
                                    }
                                    <div className='col-md-1'></div>
                                </div>
                                <div className='scroll-330'>
                                    {AllDevices.map((item, i) => {
                                        var returData;
                                        returData = (<div key={i} className="row grid mx-1 px-0">
                                            {item.inventory_status == 3 ?
                                                <></>
                                                :
                                                <div className='col-md-2 text-center'>
                                                    <input className="form-check-input CommonCheckBoxClass" deviceid={item.ID} type="checkbox" onChange={ShowActionDropDown} />
                                                </div>
                                            }

                                            <div className='col-md-2'>{item.Device_model}</div>
                                            <div className='col-md-2'>
                                                {item.inventory_status == 3 ?
                                                    <>-</>
                                                    :
                                                    item.Device_user_first_name + ' ' + item.Device_user_last_name
                                                }
                                            </div>
                                            <div className='col-md-1 text-center'>
                                                {item.inventory_status == 3 ?
                                                    <>-</>
                                                    :
                                                    item.Grade
                                                }
                                            </div>
                                            <div className='col-md-1 text-center'>
                                                {item.inventory_status == 3 ?
                                                    <>-</>
                                                    :
                                                    item.Building
                                                }
                                            </div>
                                            {item.inventory_status == 3 ?
                                                <div className='col-md-4 text-center'>{item.Purchase_date}</div>
                                                :
                                                <div className='col-md-2 text-center'>{item.Purchase_date}</div>
                                            }
                                            <div className='col-md-1 text-end cursor-pointer d-flex justify-content-evenly'>
                                                {item.Loaner_device == "1" ?
                                                    <>
                                                        <i class="bi bi-info-circle-fill" title="Show Details" onClick={(e) => GetDeviceDetailById(item.ID, '1', item.user_id)}></i>
                                                        <img src="/images/clock-history.svg" className='img-fluid LoanerHistoryIcon' onClick={(e) => ShowLoanerHistory(item.ID)} />

                                                    </>
                                                    :
                                                    <i class="bi bi-info-circle-fill" title="Show Details" onClick={(e) => GetDeviceDetailById(item.Inventory_ID, '1', item.user_id)}></i>
                                                }
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

            {/* AddUpdate Inventory */}
            <div className='d-none' id="AddUpdateDiv">
                <div className="GridBox p-3">
                    <div className='greyBox '>
                        <div className='Header'>
                            <b className='font-16' id="AddUpdateHeader">Add New Inventory</b><br />
                            <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                        </div>
                        <div id='AddInventoryForm'>
                            <div className='row px-2 justify-content-between'>
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
                            <div className='row px-2 justify-content-between'>
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
                                <div className='col-12 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Is this device a loaner device?</div>
                                    <div className='col-md-7 d-flex'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name='LoanerDevice' id="LoanerDeviceYes" onChange={(e) => CheckLoanerDevice(1)} />
                                            <label className="form-check-label">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check ms-5">
                                            <input className="form-check-input" type="radio" name='LoanerDevice' id="LoanerDeviceNo" onChange={(e) => CheckLoanerDevice(2)} />
                                            <label className="form-check-label">
                                                No
                                            </label>
                                        </div>
                                        <span className="form-text invalid-feedback" id="LoanerDeviceRadioButtonRequired">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-12 row align-items-center d-none' id="AssignDeviceToUserDiv">
                                    <div className='col-md-5 FormLabel'>Do you want to assign this device to User?</div>
                                    <div className='col-md-7 d-flex'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name='AssignDevice' id="AssignUserDeviceYes" onChange={(e) => ShowStudentDetailsDiv(1)} />
                                            <label className="form-check-label">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check ms-5">
                                            <input className="form-check-input" type="radio" name='AssignDevice' id="AssignUserDeviceNo" onChange={(e) => ShowStudentDetailsDiv(2)} />
                                            <label className="form-check-label">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row d-none' id="StudentDetailsDiv">
                            <h3 className='pt-3'>Student Details</h3>
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
                    <div className="px-0">
                        <ul className="nav nav-tabs row">
                            <li className="nav-item col-6 px-0 navitembrdrbtm text-center cursor-pointer">
                                <a className="nav-link deviceLinkClass active" aria-current="page" id="DeviceDetailsTab" onClick={(e) => ShowDeviceDetail("DeviceDetailsScroll")}>Device Details</a>
                            </li>
                            <li className="nav-item col-6 px-0 text-center navitembrdrbtm cursor-pointer">
                                <a className="nav-link deviceLinkClass" id="DeviceHistoryTab" aria-disabled="true" onClick={(e) => ShowDeviceDetail("DeviceHistoryDiv")}>Device History</a>
                            </li>
                        </ul>
                    </div>
                    <div id="DeviceDetailsScroll" className=" mt-3">
                        <div className='row'>
                            <div className='col-md-6 row py-1'>
                                <div className='col-8 fw-600'>Manufacturer Warranty Until : </div>
                                <div className='col-4'>  {DeviceDetails.Manufacturer_warranty_until}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-8 fw-600'>Manufacturer ADP Until : </div>
                                <div className='col-4'> {DeviceDetails.Manufacturer_ADP_until}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-8 fw-600'>Third Party ADP Until : </div>
                                <div className='col-4'> {DeviceDetails.Third_party_ADP_until}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-8 fw-600'>Expected Retirement : </div>
                                <div className='col-4'> {DeviceDetails.Expected_retirement}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-8 fw-600'>Purchase Date : </div>
                                <div className='col-4'> {DeviceDetails.Purchase_date}</div>
                            </div>
                            <div className='col-12 row py-1'>
                                <div className='col-6 fw-600'>Third Party Extended Warranty Until : </div>
                                <div className='col-6'> {DeviceDetails.Third_party_extended_warranty_until}</div>
                            </div>
                            <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device Manufacturer : </div>
                                <div className='col-5'> {DeviceDetails.Device_manufacturer}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device Type : </div>
                                <div className='col-5'> {DeviceDetails.Device_type}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device Model : </div>
                                <div className='col-5'> {DeviceDetails.Device_model}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device MPN : </div>
                                <div className='col-5'> {DeviceDetails.Device_MPN}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Serial Number : </div>
                                <div className='col-5'> {DeviceDetails.Serial_number}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Asset Tag : </div>
                                <div className='col-5'> {DeviceDetails.Asset_tag}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>User Type : </div>
                                <div className='col-5'> {DeviceDetails.User_type}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Repair Cap : </div>
                                <div className='col-5'> {DeviceDetails.Repair_cap}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device OS : </div>
                                <div className='col-5'> {DeviceDetails.Device_os}</div>
                            </div>
                            <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                            <div className='col-10 row py-1'>
                                <div className='col-4 fw-600'>Loaner Device : </div>
                                <div className='col-8'> {(DeviceDetails.Loaner_device == 1) ?
                                    <>Yes</> : <>No</>}</div>
                            </div>
                            {DeviceDetails.inventory_status != 3 ?
                                <div className='row' id="ModalStudentDiv">
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                                    <div className='col-md-6 row py-1'>
                                        <div className='col-6 fw-600'>Student Name : </div>
                                        <div className='col-6'> {DeviceDetails.Device_user_first_name} {DeviceDetails.Device_user_last_name}</div>
                                    </div>
                                    <div className='col-md-6 row py-1'>
                                        <div className='col-6 fw-600'>Grade : </div>
                                        <div className='col-6'> {DeviceDetails.Grade}</div>
                                    </div>
                                    <div className='col-md-6 row py-1'>
                                        <div className='col-6 fw-600'>Building : </div>
                                        <div className='col-6'> {DeviceDetails.Building}</div>
                                    </div>
                                    <div className='col-md-6 row py-1'>
                                        <div className='col-6 fw-600'>Parental Coverage : </div>
                                        <div className='col-6'> {(DeviceDetails.Parental_coverage == 1) ?
                                            <>Yes</> : <>No</>}</div>
                                    </div>
                                    <div className='col-md-6 row py-1'>
                                        <div className='col-6 fw-600'>Parent Contact : </div>
                                        <div className='col-6'> {DeviceDetails.Parent_phone_number}</div>
                                    </div>
                                    <div className='col-md-6 row py-1'>
                                        <div className='col-6 fw-600'>Parent Email : </div>
                                        <div className='col-6'> {DeviceDetails.Parent_Guardian_Email}</div>
                                    </div>
                                </div>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    <div id='DeviceHistoryDiv' className='d-none mt-3'>
                        <div className='row px-3'>
                            {DeviceHistory.map((item, i) => {
                                var returData;
                                returData = (<div className='row' key={i}>
                                    <div className='col-12 p-1 pe-0 row'>
                                        <div className='col-md-3 fw-600'>Created Date : </div>
                                        <div className='col-md-9'>  {item.Issue_createdDate}</div>
                                    </div>
                                    <div className='col-12 p-1 pe-0 row'>
                                        <div className='col-md-3 fw-600'>Created By : </div>
                                        <div className='col-md-9'> {item.Created_by_user}</div>
                                    </div>
                                    <div className='col-12 p-1 pe-0 row'>
                                        <div className='col-md-3 fw-600'>Issue : </div>
                                        <div className='col-md-9' style={{ display: "inline" }}>
                                            {item.Issue.map(item => item).join(', ')}
                                        </div>
                                    </div>
                                    <div className='col-12 p-1 pe-0 row text-justify'>
                                        <div className='col-md-3 fw-600'>Notes : </div>
                                        <div className='col-md-9'> {item.Notes}</div>
                                    </div>
                                    <div className='col-12 p-1 pe-0 row'>
                                        <div className='col-md-3 fw-600'>Status : </div>
                                        <div className='col-md-9' > <label style={{ color: "#3CBBA5" }}>{item.Status}</label>
                                            <label className='cursor-pointer' onClick={(e) => ShowTicketHistoryDiv(item.Ticket_ID)}>
                                                <img src="/images/DownRoundArrow.svg" className="img-fluid ps-5 cursor-pointer pe-2" title="Show Ticket History" />Show Ticket History
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-12 pt-3 d-none" id={`TicketHistoryDiv_${item.Ticket_ID}`}>
                                        {/* <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2 px-0' /> */}
                                        {/* <h4><u>Ticket History</u></h4> */}
                                        <div className="row">
                                            {(item.ticketHistory.length != 0) ?
                                                item.ticketHistory.map((tickethistory, j) => {
                                                    var returData;
                                                    returData = <div className="col-12 py-1" key={j}>
                                                        On {tickethistory.date}, {tickethistory.update_by_user} has changed the ticket status {tickethistory.previous_status} to {tickethistory.updated_status}
                                                    </div>
                                                    return returData;
                                                })
                                                :
                                                <div className="col-12 text-center">
                                                    <label>No Record Found</label>
                                                </div>
                                            }

                                        </div>
                                    </div>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2 px-0' />
                                </div>
                                );
                                return returData;
                            })}
                            {historynorecord}
                        </div>
                    </div>
                    <div className='row text-center pt-3'>
                        <div className='col-md-6 pe-0 text-end'>
                            <button className='SaveBtn' onClick={(e) => AddUpdateInventory(TicketUserid, Deviceid, "/update-inventory")}>Update Device</button>
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

            <Modal show={isStatusPopup} size="lg">
                <Modal.Header closeButton onClick={CloseStatusPopup}>
                    <Modal.Title>Loaner History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Loanerhistory.map((item, i) => {
                        var returData;
                        returData = (
                            (item.endDate != null) ?
                                <label>
                                    Device was assigned as a loaner to {item.whoUseLonerDevice} from {item.startDate} to {item.endDate}
                                </label>
                                :
                                <label>
                                    Device was assigned as a loaner to {item.whoUseLonerDevice} from {item.startDate}
                                </label>

                        );
                        return returData;
                    })}
                    {loanernorecord}
                </Modal.Body>
                <Modal.Footer>
                    <label className='cursor-pointer' onClick={CloseStatusPopup}>Cancel</label>
                </Modal.Footer>
            </Modal>
        </>
    )
}