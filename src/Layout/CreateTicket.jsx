import { useEffect } from "react";
import $ from 'jquery';
import { CheckValidation, ShowLoder, HideLoder } from "../JS/Common";
import { ApiGetCall, ApiPostCall } from "../JS/Connector";
import { useState } from "react";
import { getUrlParameter } from "../JS/Common";
import { ShowSuggestionBox } from "../JS/Common";
import { MMDDYYYY } from "../JS/Common";
export function CreateTicket() {
    var schoolid = 1;
    const [DeviceIssues, setAllDevicesIssues] = useState([]);
    const [DeviceDeatils, setDeviceDeatils] = useState([]);
    const [Notes, setNotes] = useState("");
    const [norecord, setNorecord] = useState("");
    const [username, setusername] = useState("");
    var Deviceid = getUrlParameter("id");
    var userid = getUrlParameter("userid");
    const [SuggestionBoxArray, setSuggestionBoxArray] = useState("");
    const [LoanerSuggestionBoxArray, setLoanerSuggestionBoxArray] = useState("");
    const [LoanerId, setLoanerId] = useState("");
    useEffect(() => {
        return () => {
            var uri = window.location.toString();
            if (uri.indexOf("?") > 0) {
                var clean_uri = uri.substring(0, uri.indexOf("?"));
                window.history.replaceState({}, document.title, clean_uri);
            }
            $("#hdnDeviceId").val(Deviceid);
            $("#hdnUserId").val(userid);
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
            StoreDeviceSearchData(1);
            var DeviceidGlobal = $("#hdnDeviceId").val();
            if (DeviceidGlobal != "false") {
                ShowDeviceDetails("", 2);
            }
        };
    }, []);

    // on keyup store data in array
    const StoreDeviceSearchData = async (flag) => {
        var searchstring = $("#SearchDeviceId").val();
        ShowLoder();
        if (searchstring == "") {
            searchstring = null;
        }
        await ApiGetCall("/searchInventoryCT/" + schoolid + "&" + searchstring).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                var sugData = responseRs.msg;
                var sugArray = [];
                var i = 1;
                if (responseRs.response == "success") {
                    if (sugData.length != 0) {
                        if (flag != 1) {
                            ShowSuggestionBox('SearchDeviceClass');
                        }
                        for (var i = 0; i < sugData.length; i++) {
                            sugArray.push(
                                <div className="row brdr-Btm font-14" key={i} onClick={(e) => ShowDeviceDetails(e, 1)} UsreId={sugData[i].user_id} Deviceid={sugData[i].ID} style={{ padding: "8px 15px" }}>
                                    <div className="col-8">{sugData[i].Device_user_first_name} {sugData[i].Device_user_last_name}</div>
                                    <div className="col-4 text-end">{sugData[i].Serial_number}</div>
                                    <div className="col-12">{sugData[i].Device_model}</div>
                                </div>
                            )
                        }
                        setSuggestionBoxArray(sugArray);
                    } else {
                        sugArray.push(
                            <>
                                <div className="col-12 text-center" key={i}>
                                    <label>No Record Found</label>
                                </div>
                                <div className="col-12 d-flex align-items-center justify-content-center position-absolute pb-2" style={{ bottom: "0", borderTop: "1px solid #e1dddd" }}>
                                    <a href="/manage-inventory/add-inventory" target="_blank">
                                        <img src="/images/AddInventory.svg" className="img-fluid pe-2" />
                                        <b className="font-18 BlackFont pt-1">Add Inventory</b>
                                    </a>
                                </div>
                            </>
                        );
                        setSuggestionBoxArray(sugArray);
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

    //final save call
    const CreateTicket = async () => {
        var assignloanerval = $("#AssignLoanerId").val();
        var lonerDeviceStatus = 0;
        var hdnDeviceid = parseInt($("#hdnDeviceId").val());
        var UserID = parseInt($("#hdnUserId").val());
        var checkvalid = 0;
        var isFormValid = CheckValidation("AddDeviceIssues");
        $(".CheckboxClass").each(function () {
            if ($(this).is(":checked")) {
                checkvalid = 1;
            }
        });
        if (checkvalid == 0) {
            $("#DeviceIssueRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#DeviceIssueRequired").css('display', 'none');
        ShowLoder();
        var DeviceIssueArray = [];
        var NewJson = {};
        NewJson['Notes'] = Notes;
        NewJson['schoolId'] = schoolid;
        NewJson['userId'] = UserID;
        NewJson['inventoryId'] = hdnDeviceid;
        if(assignloanerval != ""){
            lonerDeviceStatus = 1;
            NewJson['lonerId'] = LoanerId;
            NewJson['lonerDeviceStatus'] = lonerDeviceStatus;
        }else{
            NewJson['lonerId'] = null;
            NewJson['lonerDeviceStatus'] = 0;
        }
        $(".CheckboxClass").each(function () {
            var vjson = {};
            var vid = $(this).attr('id');
            var vsplit = vid.split('_');
            var Finalid = parseInt(vsplit[1]);
            if ($(this).is(":checked")) {
                vjson['ID'] = Finalid;
                DeviceIssueArray.push(vjson);
            }
        });
        var raw = JSON.stringify({
            DeviceIssueArray: DeviceIssueArray,
            msg: NewJson
        });
        await ApiPostCall("/generateIssue", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("Ticket Created Successfully.");
                    setTimeout(function () {
                        window.location = "/create-ticket";
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

    // Device Issue Get call
    const GetDeviceIssues = async () => {
        ShowLoder();
        await ApiGetCall("/allDeviceIssue").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                var sugData = responseRs.msg;
                var sugArray = [];
                var i = 1;
                if (responseRs.response == "success") {
                    if (sugData.length != 0) {
                        setNorecord("");
                        setAllDevicesIssues(sugData);
                    } else {
                        sugArray.push(
                            <div className="col-12 GridNoRecord text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setNorecord(sugArray);
                        setAllDevicesIssues([]);
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

    //Device details Get call
    const SearchDevice = async () => {
        var UserId = $("#hdnDeviceId").val();
        await ApiGetCall("/fetchDeviceDetails/" + UserId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                var sugData = responseRs.msg;
                if (responseRs.response == "success") {
                    setNorecord("");
                    setDeviceDeatils(sugData);
                    setusername(responseRs.userName);
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

    //on click of search data
    const ShowDeviceDetails = (e, flag) => {
        setNorecord("");
        $("#SearchDeviceId").val("");
        var userid = "";
        var ticketuserid = "";
        if (flag == 1) {
            userid = parseInt(e.currentTarget.attributes[2].value);
            ticketuserid = parseInt(e.currentTarget.attributes[1].value);
        } else {
            userid = parseInt($("#hdnDeviceId").val());
            ticketuserid = parseInt($("#hdnUserId").val());
        }
        $("#hdnDeviceId").val(userid);
        $("#hdnUserId").val(ticketuserid);
        $(".SuggestionBox").hide();
        $("#SearchText").addClass('d-none');
        $("#AddDeviceIssues").removeClass('d-none');
        GetDeviceIssues();
        SearchDevice();
    }

    const SetLoanerData = (e) => {
        var loanerid = parseInt(e.currentTarget.attributes[1].value);
        var studentname = e.currentTarget.attributes[2].value;
        $("#AssignLoanerId").val(studentname);
        setLoanerId(loanerid);
        $(".AssignLoanerClass").css('visibility', 'hidden');
        $(".AssignLoanerClass").css('opacity', '0');
    }

    //assign a loaner suggestion box
    const StoreLoanerSearchData = async () => {
        var searchstring = $("#AssignLoanerId").val();
        ShowLoder();
        if (searchstring == "") {
            searchstring = null;
        }
        await ApiGetCall("/allLonerDevice/" + schoolid + "&" + searchstring).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                HideLoder();
                var sugData = responseRs.msg;
                var sugArray = [];
                var i = 1;
                console.log(responseRs)
                if (responseRs.response == "success") {
                    if (sugData.length != 0) {
                        ShowSuggestionBox('AssignLoanerClass');
                        for (var i = 0; i < sugData.length; i++) {
                            sugArray.push(
                                <div className="row brdr-Btm font-14" key={i} loanerid={sugData[i].Inventory_ID} studentname={sugData[i].Device_user_first_name + ' ' + sugData[i].Device_user_last_name} style={{ padding: "8px 15px" }} onClick={(e) => SetLoanerData(e)}>
                                    <div className="col-8">{sugData[i].Device_user_first_name} {sugData[i].Device_user_last_name}</div>
                                    <div className="col-4 text-end">{sugData[i].Serial_number}</div>
                                    <div className="col-12">{sugData[i].Device_model}</div>
                                </div>
                            )
                        }
                        setLoanerSuggestionBoxArray(sugArray);
                    } else {
                        sugArray.push(
                            <>
                                <div className="col-12 text-center" key={i}>
                                    <label>No Record Found</label>
                                </div>
                            </>
                        );
                        setLoanerSuggestionBoxArray(sugArray);
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
    return (
        <>
            <input type="hidden" id="hdnDeviceId" />
            <input type="hidden" id="hdnUserId" />
            <div className='row col-12'>
                <h1 className="PageHeading">Create Ticket</h1>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        <div className='col-md-6 mt-2'>
                            <form className="gridsearchbar">
                                <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                <div className="position-absolute top-50 translate-middle-y me-3 RefreshButton" style={{ right: "0" }} title="Refresh" onClick={(e) => StoreDeviceSearchData(2)}><i className="bi bi-arrow-clockwise"></i></div>
                                <input className="form-control" autoComplete="off" type="text" placeholder="Search Device (Student Name, Serial Number, Asset Tag*)" id="SearchDeviceId" onKeyUp={(e) => StoreDeviceSearchData(2)} />
                                <div className="SuggestionBox SearchDeviceClass">
                                    {SuggestionBoxArray}
                                </div>
                            </form>
                        </div>
                        <div className='mt-3'>
                            <div className='col-12 greyBox d-none' id="AddDeviceIssues">
                                <div className="row">
                                    <div className="col-md-4 my-1"><span className="fw-600">Model type:</span> &nbsp; {DeviceDeatils.Device_model}</div>
                                    <div className="col-md-4 my-1"><span className="fw-600">Purchase Date:</span> &nbsp; {MMDDYYYY(DeviceDeatils.Purchase_date)}</div>
                                    <div className="col-md-4 my-1"><span className="fw-600">Student Name:</span> &nbsp; {DeviceDeatils.Device_user_first_name} {DeviceDeatils.Device_user_last_name}</div>
                                    <div className="col-md-4 my-1"><span className="fw-600">User Name:</span> &nbsp; {username}</div>
                                    <div className="col-md-4 my-1"><span className="fw-600">Asset Tag:</span> &nbsp; {DeviceDeatils.Asset_tag}</div>
                                    <div className="col-md-4 my-1"><span className="fw-600">Serial Number:</span> &nbsp; {DeviceDeatils.Serial_number}</div>
                                    <div className="col-12">
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                </div>
                                <div className='Header'>
                                    <b className='font-18'>Device Issue</b><br />
                                </div>
                                <div className="row px-3 pb-3">
                                    {DeviceIssues.map((item, i) => {
                                        var returData;
                                        returData = (<div className="col-md-3 pt-2" key={i}>
                                            <div className="form-check">
                                                <input className="form-check-input CheckboxClass" type="checkbox" id={`DeviceIssue_${item.ID}`} />
                                                <label className="form-check-label ps-1">
                                                    {item.issue}
                                                </label>
                                            </div>
                                        </div>
                                        );
                                        return returData;
                                    })}
                                    <span className="form-text invalid-feedback" id="DeviceIssueRequired">
                                        *required
                                    </span>
                                    {norecord}
                                </div>
                                <div className="row px-4">
                                    <textarea placeholder="Notes*" rows="3" className="form-control" required value={Notes}
                                        onChange={(e) => setNotes(e.target.value)}></textarea>
                                    <span className="form-text invalid-feedback">
                                        *required
                                    </span>
                                </div>
                                <div className="row d-flex align-items-center p-3">
                                    <div className="col-md-3 text-end pe-0">
                                        <h5 className="mb-0 pe-5">Assign a Loaner: </h5>
                                    </div>
                                    <div className="col-md-6 ps-0">
                                        <form className="gridsearchbar">
                                            <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                            <input className="form-control" style={{ backgroundColor: "white" }} autoComplete="off" type="text" placeholder="Search" id="AssignLoanerId" onKeyUp={StoreLoanerSearchData} />
                                            <div className="SuggestionBox AssignLoanerClass">
                                                {LoanerSuggestionBoxArray}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-12 text-center py-2">
                                    <button className='SaveBtn' onClick={CreateTicket}>Create Ticket</button>
                                </div>
                            </div>
                            <div className="col-12 text-center p-5" id="SearchText">
                                <h3>Search a Device for create ticket</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}