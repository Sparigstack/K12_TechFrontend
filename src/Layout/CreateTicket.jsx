import { useEffect } from "react";
import $ from 'jquery';
import { CheckValidation, ShowLoder, HideLoder } from "../JS/Common";
import { ApiGetCall, ApiPostCall } from "../JS/Connector";
import { useState } from "react";
import { Cookies } from 'react-cookie';
import { getUrlParameter } from "../JS/Common";
import { ShowSuggestionBox } from "../JS/Common";
export function CreateTicket() {
    const cookies = new Cookies();
    var schoolid = 1;
    var userid = parseInt(cookies.get('CsvUserId'));
    const [DeviceIssues, setAllDevicesIssues] = useState([]);
    const [DeviceDeatils, setDeviceDeatils] = useState([]);
    const [Notes, setNotes] = useState("");
    const [norecord, setNorecord] = useState("");
    var Deviceid = getUrlParameter("id");
    const [SuggestionBoxArray, setSuggestionBoxArray] = useState("");
    useEffect(() => {
        return () => {
            var uri = window.location.toString();
            if (uri.indexOf("?") > 0) {
                var clean_uri = uri.substring(0, uri.indexOf("?"));
                window.history.replaceState({}, document.title, clean_uri);
            }
            $("#hdnDeviceId").val(Deviceid);
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
            StoreDeviceSearchData();
            var DeviceidGlobal = $("#hdnDeviceId").val();
            if (DeviceidGlobal != "false") {
                ShowDeviceDetails("", 2);
            }
        };
    }, []);

    // on keyup store data in array
    const StoreDeviceSearchData = async () => {
        var searchstring = $("#SearchDeviceId").val();
        ShowLoder();
        if (searchstring == "") {
            searchstring = null;
        }
        await ApiGetCall("/searchInventory/" + searchstring).then((result) => {
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
                        ShowSuggestionBox();
                        for (var i = 0; i < sugData.length; i++) {
                            sugArray.push(
                                <div className="row brdr-Btm font-14" key={i} onClick={(e) => ShowDeviceDetails(e, 1)} Deviceid={sugData[i].ID} style={{padding:"8px 15px"}}>
                                    <div className="col-8">{sugData[i].Student_name}</div>
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
                                <div className="col-12 d-flex align-items-center justify-content-center position-absolute pb-2" style={{ bottom: "0",borderTop:"1px solid #e1dddd" }}>
                                    <a href="/manage-inventory/add-inventory" >
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
        var hdnDeviceid = parseInt($("#hdnDeviceId").val());
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
        var NewJson = {
            "Notes": Notes,
            "schoolId": schoolid,
            "userId": userid,
            "inventoryId": hdnDeviceid,
            "status": 1
        };
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
    const SearcDevice = async () => {
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
        if (flag == 1) {
            userid = parseInt(e.currentTarget.attributes[1].value);
        } else {
            userid = parseInt($("#hdnDeviceId").val());
        }
        $("#hdnDeviceId").val(userid);
        $(".SuggestionBox").hide();
        $("#SearchText").addClass('d-none');
        $("#AddDeviceIssues").removeClass('d-none');
        GetDeviceIssues();
        SearcDevice();
    }
    return (
        <>
            <input type="hidden" id="hdnDeviceId" />
            <div className='row col-12'>
                <h1 className="PageHeading">Create Ticket</h1>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        <div className='col-md-6 mt-2'>
                            <form className="gridsearchbar">
                                <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                <input className="form-control" autoComplete="off" type="text" placeholder="Search Device (Student Name, Serial Number, Asset Tag*)" id="SearchDeviceId" onKeyUp={StoreDeviceSearchData} />
                                <div className="SuggestionBox">
                                    {SuggestionBoxArray}
                                </div>
                            </form>
                        </div>
                        <div className='mt-4'>
                            <div className='col-12 greyBox d-none' id="AddDeviceIssues">
                                <div className='Header'>
                                    <b className='font-17'>Device Details</b><br />
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className="row">
                                    <div className="col-md-4 my-1"><b>Device Number:</b> &nbsp; {DeviceDeatils.Serial_number}</div>
                                    <div className="col-md-4 my-1"><b>Model type:</b> &nbsp; {DeviceDeatils.Device_model}</div>
                                    <div className="col-md-4 my-1"><b>Under warranty till:</b> &nbsp; {DeviceDeatils.Extended_warranty_until}</div>
                                    <div className="col-12">
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                </div>
                                <div className='Header'>
                                    <b className='font-17'>Device Issue</b><br />
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className="row px-3 pb-3">
                                    {DeviceIssues.map((item, i) => {
                                        var returData;
                                        returData = (<div className="col-md-3 pt-3" key={i}>
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
                                <div className="row p-4">
                                    <textarea placeholder="Notes*" rows="3" className="form-control" required value={Notes}
                                        onChange={(e) => setNotes(e.target.value)}></textarea>
                                    <span className="form-text invalid-feedback">
                                        *required
                                    </span>
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