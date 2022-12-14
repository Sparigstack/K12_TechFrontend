import { useEffect } from "react";
import $ from 'jquery';
import { CheckValidation, ShowLoder, HideLoder } from "../JS/Common";
import { ApiGetCall, ApiPostCall } from "../JS/Connector";
import { useState } from "react";
import { Cookies } from 'react-cookie';
import { getUrlParameter } from "../JS/Common";
export function CreateTicket() {
    const cookies = new Cookies();
    var schoolid = 1;
    var userid = parseInt(cookies.get('CsvUserId'));
    const [DeviceIssues, setAllDevicesIssues] = useState([]);
    const [Notes, setNotes] = useState("");
    const [norecord, setNorecord] = useState("");
    var Deviceid = getUrlParameter("id");
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
            GetDeviceIssues();
        };
    }, []);

    const CreateTicket = async () => {
        var hdnDeviceid = $("#hdnDeviceId").val();
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
            "Notes" : Notes,
            "schoolId":schoolid,
            "userId":userid
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
        if(hdnDeviceid != "false"){
            NewJson['inventoryId'] = parseInt(hdnDeviceid);
            NewJson['status'] = "open";
        }else{
            NewJson['inventoryId'] = null;
            NewJson['status'] = null;
        }
        var raw = JSON.stringify({
            DeviceIssueArray : DeviceIssueArray,
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
    const GetDeviceIssues = async () => {
        var searchString = $("#SearchInput").val();
        ShowLoder();
        if (searchString == "") {
            searchString = null;
        }
        await ApiGetCall("/allDeviceIssue/" + searchString).then((result) => {
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
                    setAllDevicesIssues(sugData);
                    }else{
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
                                <input className="form-control" autoComplete='off' type="text" placeholder="Search Device (Student Name, Serial Number, Asset Tag*)" id="SearchInput" onKeyUp={GetDeviceIssues}/>
                            </form>
                        </div>
                        <div className='mt-4'>
                            <div className='col-12 greyBox' id="AddDeviceIssues">
                                <div className='Header'>
                                    <b className='font-16'>Device Issue</b><br />
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className="row px-3 pb-3">
                                    {DeviceIssues.map((item, i) => {
                                        var returData;
                                        returData = (<div className="col-md-3 pt-3">
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
                                <div className="col-12 text-center p-5">
                                    <button className='SaveBtn' onClick={CreateTicket}>Create Ticket</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}