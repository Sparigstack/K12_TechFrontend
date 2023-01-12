import { useEffect, useState } from "react";
import $ from 'jquery';
import { ShowLoder, HideLoder } from "../JS/Common";
import { ApiGetCallWithoutHeaders } from "../JS/Connector";
import { Cookies } from 'react-cookie';
import { ApiPostCall } from "../JS/Connector";
import { CSVLink } from "react-csv";
import { Modal } from 'react-bootstrap';
import { MMDDYYYY } from "../JS/Common";
export function ManageTicket() {
    const cookies = new Cookies();
    const schoolid = parseInt(cookies.get('SchoolId'));
    var CsvUserId = parseInt(cookies.get('CsvUserId'));
    const [isShow, invokeModal] = useState(false);
    const [isStatusPopup, setisStatusPopup] = useState(false);
    const [OpenTicketCsvData, setOpenTicketCsvData] = useState([]);
    const [CloseTicketCsvData, setCloseTicketCsvData] = useState([]);
    const [TabCheck, setTabCheck] = useState("");
    const [AsDesc, setAsDesc] = useState("as");
    var userid = parseInt(cookies.get('CsvUserId'));
    const [OpenTicket, setOpenTicket] = useState([]);
    const [TicketStatus, setTicketStatus] = useState([]);
    const [CloseTicket, setCloseTicket] = useState([]);
    const [openticketnorecord, setopenticketnorecord] = useState("");
    const [closeticketnorecord, setcloseticketnorecord] = useState("");
    const [OpenTicketList, setOpenTicketList] = useState([]);
    const [CloseTicketList, setCloseTicketList] = useState([]);
    const [DeviceDetails, setDeviceDetails] = useState([]);
    const [DeviceHistory, setDeviceHistory] = useState([]);
    const [historynorecord, sethistorynorecord] = useState("");
    const ClosePopup = () => {
        invokeModal(false);
    }
    const CloseStatusPopup = () => {
        setisStatusPopup(false);
    }
    const headers = [
        { label: "Ticket Id", key: "ticketid" },
        { label: "Student Name", key: "studentname" },
        { label: "Ticket Created By", key: "TicketCreatedBy" },
        { label: "Serial Number", key: "serialNum" },
        { label: "Ticket Status", key: "ticket_status" },
        { label: "Device Model", key: "Device_model" },
        { label: "Building", key: "Building" },
        { label: "Notes", key: "notes" },
        { label: "Grade", key: "Grade" },
        { label: "Date", key: "Date" }
    ];
    const csvReport = {
        filename: 'Ticket.csv',
        headers: headers,
        data: OpenTicketCsvData
    };
    const csvCloseReport = {
        filename: 'Ticket.csv',
        headers: headers,
        data: CloseTicketCsvData
    };
    useEffect(() => {
        // return () => {
        // const height = window.innerHeight;
        // const navbarheight = $(".navbar").height();
        // var finalHeight = height - navbarheight - 80;
        // $(".GridBox").css('height', finalHeight);
        // $(".GridBox").css('overflow', 'hidden');
        ListOfTicketStatus();
        CheckUrl();
        // };
    }, []);
    const CheckUrl = () => {
        ShowLoder();
        var PathName = window.location.pathname;
        var pathsplit = PathName.split('/');
        var prodActive = pathsplit[2];
        if (prodActive == "all-tickets") {
            HideLoder();
            GetListOfTickets();
        } else if (prodActive == "close-tickets") {
            setTabCheck(2);
            HideLoder();
            ListOfCloseTickets();
        }
        else {
            HideLoder();
            setTabCheck(1);
            ListOfOpenTickets();
        }
    }
    const GetListOfTickets = async () => {
        $(".linkclass").removeClass('active');
        $("#AllTicketBtn").addClass('active');
        $("#MainGridDiv").removeClass('d-none');
        $("#CloseTicketDiv").addClass('d-none');
        $("#OpenTicketDiv").addClass('d-none');
        $(".SearchBarDiv").addClass('d-none');
        ShowLoder();
        await ApiGetCallWithoutHeaders("/allTickets/" + schoolid + "&" + userid).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var i = 1;
                if (responseRs.response == "success") {
                    if (responseRs.Openticket.length != 0) {
                        setOpenTicket(responseRs.Openticket);
                    } else {
                        var sugArray = [];
                        sugArray.push(
                            <div className="col-12 p-5 text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setopenticketnorecord(sugArray);
                        setOpenTicket([]);
                    }

                    if (responseRs.Closeticket.length != 0) {
                        setCloseTicket(responseRs.Closeticket);
                    } else {
                        var sugArray = [];
                        sugArray.push(
                            <div className="col-12 p-5 text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setcloseticketnorecord(sugArray);
                        setCloseTicket([]);
                    }
                }
                HideLoder();
            }
        });
    }
    const ListOfTicketStatus = async () => {
        ShowLoder();
        await ApiGetCallWithoutHeaders("/getTicketStatus").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                setTicketStatus(responseRs);
                HideLoder();
            }
        });
    }
    const ListOfOpenTickets = async () => {
        $(".linkclass").removeClass('active');
        $("#OpenTicketBtn").addClass('active');
        $("#MainGridDiv").addClass('d-none');
        $("#CloseTicketDiv").addClass('d-none');
        $("#OpenTicketDiv").removeClass('d-none');
        $(".SearchBarDiv").removeClass('d-none');
        ShowLoder();
        await ApiGetCallWithoutHeaders("/openTickets/" + schoolid + "&null&null").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var i = 1;
                if (responseRs.response == "success") {
                    if (responseRs.Openticket.length != 0) {
                        setOpenTicketList(responseRs.Openticket);
                        setOpenTicketCsvData(responseRs.Openticket);
                    } else {
                        var sugArray = [];
                        sugArray.push(
                            <div className="col-12 p-5 text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setopenticketnorecord(sugArray);
                        setOpenTicketList([]);
                    }
                }
                HideLoder();
            }
        });
    }
    const ShowTicketNote = (TicketId) => {
        if ($(".NotesId_" + TicketId).hasClass('d-none')) {
            $(".NotesId_" + TicketId).fadeIn();
            $(".NotesId_" + TicketId).fadeIn("slow");
            $(".NotesId_" + TicketId).fadeIn(3000);
            $(".NotesId_" + TicketId).removeClass('d-none');
            $("#DownArrow_" + TicketId).addClass('d-none');
            $("#UpArrow_" + TicketId).removeClass('d-none');
        } else {
            $(".NotesId_" + TicketId).fadeOut();
            $(".NotesId_" + TicketId).fadeOut("slow");
            $(".NotesId_" + TicketId).fadeOut(3000);
            $(".NotesId_" + TicketId).addClass('d-none');
            $(".NotesId_" + TicketId).addClass('d-none');
            $("#UpArrow_" + TicketId).addClass('d-none');
            $("#DownArrow_" + TicketId).removeClass('d-none');
        }
    }
    const ListOfCloseTickets = async () => {
        $(".linkclass").removeClass('active');
        $("#CloseTicketBtn").addClass('active');
        $("#MainGridDiv").addClass('d-none');
        $("#OpenTicketDiv").addClass('d-none');
        $("#CloseTicketDiv").removeClass('d-none');
        $(".SearchBarDiv").removeClass('d-none');
        ShowLoder();
        await ApiGetCallWithoutHeaders("/closeTickets/" + schoolid + "&null&null").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var i = 1;
                if (responseRs.response == "success") {
                    if (responseRs.Closeticket.length != 0) {
                        setCloseTicketList(responseRs.Closeticket);
                        setCloseTicketCsvData(responseRs.Closeticket);
                    } else {

                        var sugArray = [];
                        sugArray.push(
                            <div className="col-12 p-5 text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setcloseticketnorecord(sugArray);
                        setCloseTicketList([]);
                    }
                }
                HideLoder();
            }
        });
    }
    const SelectAllOpenCloseTicket = (divid, divclass, OpenClosediv) => {
        if ($("#" + divid).is(":checked")) {
            $("#" + OpenClosediv).removeClass('d-none');
            $("." + divclass).prop('checked', true);
        } else {
            $("#" + OpenClosediv).addClass('d-none');
            $("." + divclass).prop('checked', false);
        }
    }
    const CheckOpenTicketCheckbox = () => {
        var vlen = $(".OpenTicketCheckbox:checked").length;
        var visibleLen = $(".OpenTicketCheckbox:visible").length;
        if (vlen >= 1) {
            $("#OpenTicketStatusDiv").removeClass('d-none');
        } else {
            $("#OpenTicketStatusDiv").addClass('d-none');
        }

        if (visibleLen == vlen) {
            $("#OpenTicketSelectAll").prop('checked', true);
        } else {
            $("#OpenTicketSelectAll").prop('checked', false);
        }
    }
    const OpenTicketStatusSubmit = async () => {
        var vTemp = 0;
        var actionid = "";
        $(".TicketStatus").each(function () {
            if ($(this).is(":checked")) {
                vTemp = 1;
                actionid = parseInt($(this).attr('statusid'));
            }
        });
        if (vTemp == 0) {
            alert("Select at least one status");
        } else {
            if (actionid == 2) {
                setisStatusPopup(true);
            } else {
                FinalSubmitTicketStatus();
            }
        }
    }
    const SubmitCloseTicketStatus = async () => {
        var isFormValid = true;
        if ($('input[name="CloseStatus"]:checked').length == 0) {
            $("#LoanerRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#LoanerRequired").css('display', 'none');
        ShowLoder();
        var actionid = "";
        $(".TicketStatus").each(function () {
            if ($(this).is(":checked")) {
                actionid = parseInt($(this).attr('statusid'));
            }
        });
        var vArray = [];
        $(".OpenTicketCheckbox").each(function () {
            var vJson = {};
            if ($(this).is(":checked")) {
                var vid = parseInt($(this).attr('ticketid'));
                var issueid = parseInt($(this).attr('issueid'));
                vJson['TicketID'] = vid;
                vJson['IssueID'] = issueid;
                vArray.push(vJson);
            }
        });
        var closestatusvalue = 0;
        if ($("#ParmanentDevice").is(":checked")) {
            closestatusvalue = 1;
        } else {
            closestatusvalue = 2;
        }
        var raw = JSON.stringify({
            UserId: CsvUserId,
            IssueIDArray: vArray,
            Status: actionid,
            Flag: 1,
            closestatus: closestatusvalue
        });
        await ApiPostCall("/changeticketStatus", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    setisStatusPopup(false);
                    $(".alert-success").show();
                    $("#AlertMsg").text("Status Updated Successfully.");
                    setTimeout(function () {
                        window.location = "/manage-tickets";
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
    const FinalSubmitTicketStatus = async () => {
        ShowLoder();
        var actionid = "";
        $(".TicketStatus").each(function () {
            if ($(this).is(":checked")) {
                actionid = parseInt($(this).attr('statusid'));
            }
        });
        var vArray = [];
        $(".OpenTicketCheckbox").each(function () {
            var vJson = {};
            if ($(this).is(":checked")) {
                var vid = parseInt($(this).attr('ticketid'));
                var issueid = parseInt($(this).attr('issueid'));
                vJson['TicketID'] = vid;
                vJson['IssueID'] = issueid;
                vArray.push(vJson);
            }
        });
        var raw = JSON.stringify({
            UserId: CsvUserId,
            IssueIDArray: vArray,
            Status: actionid,
            Flag: 0
        });
        await ApiPostCall("/changeticketStatus", raw).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                HideLoder();
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("Status Updated Successfully.");
                    setTimeout(function () {
                        window.location = "/manage-tickets";
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
    const SearchTickets = () => {
        var vVal = $("#TicketSortBy option:selected").val();
        var SearchName = $("#TicketSortBy option:selected").attr('searchname');
        var sugArray = [];
        sugArray.push(
            <div className="col-12 p-5 text-center">
                <label>No Record Found</label>
            </div>
        );
        if (vVal == 0) {
            if (TabCheck == 1) {// open ticket search
                var value = $("#SearchTicket").val();
                $("#myTable .row").hide();
                $('#myTable .row').each(function () {
                    if ($(this).text().toLowerCase().indexOf("" + value + "") !== -1) {
                        $(this).closest('#myTable .row').show();
                    }
                });
                var vlen = $('#myTable .row:visible').length;
                if (vlen == 0) {
                    setopenticketnorecord(sugArray);
                } else {
                    setopenticketnorecord("");
                }
            } else if (TabCheck == 2) {// close ticket search
                var value = $("#SearchTicket").val();
                $("#CloseTicketTable .row").hide();
                $('#CloseTicketTable .row').each(function () {
                    if ($(this).text().toLowerCase().indexOf("" + value + "") !== -1) {
                        $(this).closest('#CloseTicketTable .row').show();
                    }
                });
                var vlen = $('#CloseTicketTable .row:visible').length;
                if (vlen == 0) {
                    setcloseticketnorecord(sugArray);
                } else {
                    setcloseticketnorecord("");
                }
            }
        } else {
            if (TabCheck == 1) {
                var value = $("#SearchTicket").val();
                $("#myTable .row").hide();
                $('#myTable .row .' + SearchName + '').each(function () {
                    if ($(this).text().toLowerCase().indexOf("" + value + "") !== -1) {
                        $(this).closest('#myTable .row').show();
                    }
                });
                var vlen = $('#myTable .row:visible').length;
                if (vlen == 0) {
                    setopenticketnorecord(sugArray);
                } else {
                    setopenticketnorecord("");
                }
            } else if (TabCheck == 2) {
                var value = $("#SearchTicket").val();
                $("#CloseTicketTable .row").hide();
                $('#CloseTicketTable .row .' + SearchName + '').each(function () {
                    if ($(this).text().toLowerCase().indexOf("" + value + "") !== -1) {
                        $(this).closest('#CloseTicketTable .row').show();
                    }
                });
                var vlen = $('#CloseTicketTable .row:visible').length;
                if (vlen == 0) {
                    setcloseticketnorecord(sugArray);
                } else {
                    setcloseticketnorecord("");
                }
            }
        }
    }
    const SortByOpenTicket = async (AsDescGrade) => {
        ShowLoder();
        await ApiGetCallWithoutHeaders("/openTickets/" + schoolid + "&" + AsDescGrade + "&" + AsDesc).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var i = 1;
                if (responseRs.response == "success") {
                    if (responseRs.Openticket.length != 0) {
                        setOpenTicketList(responseRs.Openticket);
                        setOpenTicketCsvData(responseRs.Openticket);
                        if (AsDesc == "as") {
                            setAsDesc("desc");
                        } else {
                            setAsDesc("as");
                        }
                    } else {
                        var sugArray = [];
                        sugArray.push(
                            <div className="col-12 p-5 text-center" key={i}>
                                <label>No Record Found</label>
                            </div>
                        );
                        setopenticketnorecord(sugArray);
                        setOpenTicketList([]);
                    }
                }
                HideLoder();
            }
        });
    }
    // const SortByCloseTicket = async (sortId) => {
    //     ShowLoder();
    //     await ApiGetCallWithoutHeaders("/closeTickets/" + schoolid + "&" + sortId + "&" + closeAsDesc).then((result) => {
    //         if (result == undefined || result == "") {
    //             alert("Something went wrong");
    //         } else {
    //             const responseRs = JSON.parse(result);
    //             var i = 1;
    //             if (responseRs.response == "success") {
    //                 if (responseRs.Closeticket.length != 0) {
    //                     setCloseTicketList(responseRs.Closeticket);
    //                     setCloseTicketCsvData(responseRs.Closeticket);
    //                     if (closeAsDesc == "as") {
    //                         setcloseAsDesc("desc");
    //                     } else {
    //                         setcloseAsDesc("as");
    //                     }
    //                 } else {
    //                     var sugArray = [];
    //                     sugArray.push(
    //                         <div className="col-12 p-5 text-center" key={i}>
    //                             <label>No Record Found</label>
    //                         </div>
    //                     );
    //                     setcloseticketnorecord(sugArray);
    //                     setCloseTicketList([]);
    //                 }
    //             }
    //             HideLoder();
    //         }
    //     });
    // }
    const FocusOnSearch = () => {
        $("#SearchTicket").focus();
        $("#SearchTicket").val("");
    }
    const ShowModal = async (UserId, ticketid) => {
        await ApiGetCallWithoutHeaders("/fetchDeviceDetailforTicket/" + UserId + "&" + ticketid).then((result) => {
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
                    invokeModal(true);
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
    const ShowTicketHistoryDiv = () => {
        if ($("#TicketHistoryDiv").hasClass('d-none')) {
            $("#TicketHistoryDiv").removeClass('d-none');
            $("#TicketHistoryDiv").fadeIn();
            $("#TicketHistoryDiv").fadeIn("slow");
            $("#TicketHistoryDiv").fadeIn(3000);
        } else {
            $("#TicketHistoryDiv").addClass('d-none');
            $("#TicketHistoryDiv").fadeOut();
            $("#TicketHistoryDiv").fadeOut("slow");
            $("#TicketHistoryDiv").fadeOut(3000);
        }
    }
    const OpenCreateTicket = () => {
        window.location = "/create-ticket";
    }
    return (
        <>
            <div className='row col-12'>
                <div className='col-md-6'>
                    <h1 className="PageHeading">Manage Tickets</h1>
                </div>
                <div className='col-md-6 mb-2 pe-0 text-end d-flex justify-content-end align-items-center'>
                    <label className='BorderBtn ms-3 text-center' onClick={OpenCreateTicket}> Create Ticket
                        <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                    </label>
                </div>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        {/* Grid Div */}
                        <div className="row">
                            <div className="col-md-7 px-0">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item navitembrdrbtm text-center">
                                        <a className="nav-link linkclass active" aria-current="page" id="OpenTicketBtn" href="/manage-tickets">View All Open Tickets</a>
                                    </li>
                                    <li className="nav-item navitembrdrbtm text-center">
                                        <a className="nav-link linkclass" aria-current="page" id="AllTicketBtn" href="/manage-tickets/all-tickets">View All Tickets</a>
                                    </li>
                                    <li className="nav-item navitembrdrbtm text-center">
                                        <a className="nav-link linkclass" id="CloseTicketBtn" aria-disabled="true" href="/manage-tickets/close-tickets">View All Close Tickets</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-2 pe-0 SearchBarDiv">
                                <select id="TicketSortBy" onChange={FocusOnSearch}>
                                    <option value="0">Search</option>
                                    <option value="1" searchname="studentname">Search by Student Name</option>
                                    <option value="2" searchname="devicemodel">Search by Device Model</option>
                                    <option value="3" searchname="serialnoclass">Search by Serial No.</option>
                                    <option value="4" searchname="dateclass">Search by Created At</option>
                                    <option value="5" searchname="statusclass">Search by Status</option>
                                </select>
                            </div>
                            <div className='col-md-3 text-end pe-0 SearchBarDiv'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" autoComplete="off" type="text" placeholder="Search Ticket" id="SearchTicket" onKeyUp={SearchTickets} />
                                </form>
                            </div>
                        </div>
                        <div className="row mt-3" id="MainGridDiv">
                            <div className='col-md-6'>
                                <div className="greyBox">
                                    <div className='Header'>
                                        <b className='font-17'>list of Open Ticket</b><br />
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>User Name</th>
                                                <th>Date created</th>
                                                <th>Serial Number</th>
                                            </tr>
                                            {OpenTicket.map((item, i) => {
                                                var returData;
                                                returData = (<tr key={i}>
                                                    <td>{item.studentname}</td>
                                                    <td className="ps-3">{item.Date}</td>
                                                    <td>{item.serialNum}</td>
                                                </tr>
                                                );
                                                return returData;
                                            })}
                                            {openticketnorecord}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="greyBox">
                                    <div className='Header'>
                                        <b className='font-17'>list of Close Ticket</b><br />
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>User Name</th>
                                                <th>Date created</th>
                                                <th>Serial Number</th>
                                            </tr>
                                            {CloseTicket.map((item, i) => {
                                                var returData;
                                                returData = (<tr key={i}>
                                                    <td>{item.studentname}</td>
                                                    <td className="ps-3">{item.Date}</td>
                                                    <td>{item.serialNum}</td>
                                                </tr>
                                                );
                                                return returData;
                                            })}
                                            {closeticketnorecord}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Open Ticket Div */}
                        <div className="row mt-3" id="OpenTicketDiv">
                            <div className="greyBox">
                                <div className='Header row align-items-center'>
                                    <div className="col-md-9 pe-0">
                                        <div className="row d-none" id="OpenTicketStatusDiv">
                                            <div className="col-md-11 row pe-0">
                                                {TicketStatus.map((item, i) => {
                                                    var returData;
                                                    returData = (
                                                        <div className="col-md-4 pe-0" key={i}>
                                                            <input className="form-check-input me-2 TicketStatus" statusid={item.ID} type="radio" name="ticketstatus" />{item.status}
                                                        </div>
                                                    );
                                                    return returData;
                                                })}
                                            </div>
                                            <div className="col-md-1">
                                                <button className="BorderBtn" onClick={OpenTicketStatusSubmit}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 text-end pb-2 row pe-0">
                                        <div className="mt-2"><CSVLink {...csvReport} className="BlackFont BorderBtn">Export Ticket CSV<img src='/images/ExportInventory.svg' className='img-fluid ps-2' /></CSVLink></div>
                                    </div>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                                </div>
                                <div className="col-12">
                                    <div className='row GridHeader px-0 '>
                                        <div className='col-md-2 font-13 px-0 text-center'>
                                            Select All<input className="form-check-input ms-2" id="OpenTicketSelectAll" type="checkbox" onChange={(e) => SelectAllOpenCloseTicket("OpenTicketSelectAll", "OpenTicketCheckbox", "OpenTicketStatusDiv")} />
                                        </div>
                                        <div className='col-md-2 text-center'>Student Name</div>
                                        <div className='col-md-2 text-center'>Device Model</div>
                                        <div className='col-md-2 text-center'>Serial No.</div>
                                        <div className='col-md-1 text-center px-0'>Created at</div>
                                        <div className='col-md-2 text-center cursor-pointer' title="Sort by Status" onClick={(e) => SortByOpenTicket(3)}>Status<img src="/images/TicketGridIcon.svg" className="img-fluid ps-1" /></div>
                                        <div className='col-md-1'></div>
                                    </div>
                                    <div id="myTable">
                                        {OpenTicketList.map((item, i) => {
                                            var returData;
                                            returData = (<div className="row grid px-0 subjectName" key={i} ticketid={item.IssuedbID}>
                                                <div className='col-md-2 text-center' key={i}>
                                                    <input className="form-check-input OpenTicketCheckbox" ticketid={item.ticketid} issueid={item.IssuedbID} type="checkbox" onClick={CheckOpenTicketCheckbox} />
                                                </div>
                                                <div className="col-md-2 text-center studentname">{item.studentname}</div>
                                                <div className="col-md-2 px-0 text-center devicemodel">{item.Device_model}</div>
                                                <div className="col-md-2 text-center serialnoclass cursor-pointer" title="Show Device Details" onClick={(e) => ShowModal(item.Inventory_ID, item.ticketid)}><u>{item.serialNum}</u></div>
                                                <div className="col-md-1 text-center dateclass px-0">{item.Date}</div>
                                                <div className="col-md-2 text-center statusclass px-0" style={{ color: "#3CBBA5" }}>
                                                    {item.ticket_status}
                                                </div>
                                                <div className="col-md-1 text-center">
                                                    <img src="/images/DownRoundArrow.svg" id={`DownArrow_${item.ticketid}`} className="cursor-pointer img-fluid" onClick={(e) => ShowTicketNote(item.ticketid)} />
                                                    <img src='/images/UpRoundArrow.svg' id={`UpArrow_${item.ticketid}`} className='img-fluid cursor-pointer d-none' onClick={(e) => ShowTicketNote(item.ticketid)} />
                                                </div>
                                                <div className={`col-12 py-2 px-5 d-none NotesId_${item.ticketid}`}>
                                                    <textarea className="form-control bgWhite" rows={3} disabled value={"Notes:  " + item.notes}></textarea>
                                                </div>
                                                <div className={`col-12 py-1 px-5 d-none NotesId_${item.ticketid}`}>
                                                    <b className="font-16 pe-3">Device Issues:</b>
                                                    <div style={{ display: "inline" }}>:
                                                        {item.Device_isuue.map(item => item).join(', ')}
                                                    </div>
                                                </div>
                                            </div>
                                            );
                                            return returData;
                                        })}
                                        {openticketnorecord}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Close Ticket Div */}
                        <div className="row mt-3" id="CloseTicketDiv">
                            <div className="greyBox">
                                <div className='Header row align-items-center'>
                                    <div className="col-md-9">
                                        {/* <button className="BorderBtn ms-4 d-none" id="DeleteTicketBtn">Delete Ticket</button> */}
                                    </div>
                                    <div className="col-md-3 text-end pb-2 row pe-0">
                                        <div className="mt-2"><CSVLink {...csvCloseReport} className="BlackFont BorderBtn">Export Ticket CSV<img src='/images/ExportInventory.svg' className='img-fluid ps-2' /></CSVLink></div>
                                    </div>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                                </div>
                                <div className="col-12 ">
                                    <div className="col-12 ">
                                        <div className='row GridHeader px-0'>
                                            <div className='col-md-2 text-center'>Student Name</div>
                                            <div className='col-md-2 text-center'>Device Model</div>
                                            <div className='col-md-2 text-center'>Serial No.</div>
                                            <div className='col-md-2 text-center px-0'>Created at</div>
                                            <div className='col-md-2 text-center'>Status</div>
                                            <div className='col-md-2'></div>
                                        </div>
                                        <div  id="CloseTicketTable">
                                            {CloseTicketList.map((item, i) => {
                                                var returData;
                                                returData = (<div className="row grid px-0" key={i}>
                                                    <div className="col-md-2 text-center dateclass">{item.studentname}</div>
                                                    <div className="col-md-2 text-center usernameclass">{item.Device_model}</div>
                                                    <div className="col-md-2 text-center serialnoclass cursor-pointer" title="Show Device Details" onClick={(e) => ShowModal(item.Inventory_ID, item.ticketid)}><u>{item.serialNum}</u></div>
                                                    <div className="col-md-2 text-center dateclass px-0">{item.Date}</div>
                                                    <div className="col-md-2 text-center statusclass" style={{ color: "#FF7076" }}>
                                                        {item.ticket_status}
                                                    </div>
                                                    <div className="col-md-2 text-center">
                                                        <img src="/images/DownRoundArrow.svg" id={`DownArrow_${item.ticketid}`} className="cursor-pointer img-fluid" onClick={(e) => ShowTicketNote(item.ticketid)} />
                                                        <img src='/images/UpRoundArrow.svg' id={`UpArrow_${item.ticketid}`} className='img-fluid cursor-pointer d-none' onClick={(e) => ShowTicketNote(item.ticketid)} />
                                                    </div>
                                                    <div className={`col-12 py-2 px-5 d-none NotesId_${item.ticketid}`}>
                                                        <textarea className="form-control bgWhite" rows={3} disabled value={"Notes:  " + item.notes}></textarea>
                                                    </div>
                                                </div>
                                                );
                                                return returData;
                                            })}
                                            {closeticketnorecord}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                <div className='col-7 fw-600'>Serial Number : </div>
                                <div className='col-5'> {DeviceDetails.Serial_number}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device Model : </div>
                                <div className='col-5'> {DeviceDetails.Device_model}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device Manufacturer : </div>
                                <div className='col-5'> {DeviceDetails.Device_manufacturer}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device Type : </div>
                                <div className='col-5'> {DeviceDetails.Device_type}</div>
                            </div>

                            <div className='col-md-6 row py-1'>
                                <div className='col-7 fw-600'>Device MPN : </div>
                                <div className='col-5'> {DeviceDetails.Device_MPN}</div>
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
                            <div className='col-md-6 row py-1'>
                                <div className='col-8 fw-600'>Purchase Date : </div>
                                <div className='col-4'> {DeviceDetails.Purchase_date}</div>
                            </div>
                            <div className='col-md-6 row py-1'>
                                <div className='col-8 fw-600'>Expected Retirement : </div>
                                <div className='col-4'> {DeviceDetails.Expected_retirement}</div>
                            </div>
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
                            <div className='col-12 row py-1'>
                                <div className='col-6 fw-600'>Third Party Extended Warranty Until : </div>
                                <div className='col-6'> {DeviceDetails.Third_party_extended_warranty_until}</div>
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
                                        <div className='col-6 fw-600'>Parent Name : </div>
                                        <div className='col-6'> {DeviceDetails.Parent_guardian_name}</div>
                                    </div>
                                    <div className='col-md-6 row py-1'>
                                        <div className='col-6 fw-600'>Parent Contact : </div>
                                        <div className='col-6'> {DeviceDetails.Parent_phone_number}</div>
                                    </div>
                                    <div className='col-md-6 row py-1'>
                                        <div className='col-6 fw-600'>Parental Coverage : </div>
                                        <div className='col-6'> {(DeviceDetails.Parental_coverage == 1) ?
                                            <>Yes</> : <>No</>}</div>
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
                                        <div className='col-md-9'> <label style={{ color: "#3CBBA5" }}>{item.Status}</label>
                                            <label className='cursor-pointer' onClick={ShowTicketHistoryDiv}>
                                                <img src="/images/DownRoundArrow.svg" className="img-fluid ps-5 cursor-pointer pe-2" title="Show Ticket History" />Show Ticket History
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-12 pt-3 d-none" id="TicketHistoryDiv">
                                        {/* <h4><u>Ticket History</u></h4> */}
                                        <div className="row">
                                            {(item.Ticket_history.length != 0) ?
                                                item.Ticket_history.map((tickethistory, j) => {
                                                    var returData;
                                                    returData = <div className="col-12 py-1" key={j}>
                                                        On {tickethistory.date}, {tickethistory.update_by_user} has changed the ticket status from {tickethistory.previous_status} to {tickethistory.updated_status}
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
                                </div>
                                );
                                return returData;
                            })}
                            {historynorecord}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <label className='cursor-pointer' onClick={ClosePopup}>Cancel</label>
                </Modal.Footer>
            </Modal>

            <Modal show={isStatusPopup} size="md">
                <Modal.Header closeButton onClick={CloseStatusPopup}>
                    <Modal.Title>Assign a loaner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-12 pb-3">
                        <input className="form-check-input me-2" type="radio" name="CloseStatus" id="FreeDevice" />Vacant loaner device?
                    </div>
                    <div className="col-12">
                        <input className="form-check-input me-2" type="radio" name="CloseStatus" id="ParmanentDevice" />Keep loaner device as a permanent device for student?
                    </div>
                    <span className="form-text invalid-feedback" id="LoanerRequired">
                        *required
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <button className="SaveBtn" onClick={SubmitCloseTicketStatus}>Submit</button>
                    <label className='cursor-pointer' onClick={CloseStatusPopup}>Cancel</label>
                </Modal.Footer>
            </Modal>
        </>
    )
}