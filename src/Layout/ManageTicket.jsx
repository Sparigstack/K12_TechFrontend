import { useEffect, useState } from "react";
import $ from 'jquery';
import { ShowLoder, HideLoder } from "../JS/Common";
import { ApiGetCall } from "../JS/Connector";
import { Cookies } from 'react-cookie';
import { ApiPostCall } from "../JS/Connector";
import { CSVLink } from "react-csv";
export function ManageTicket() {
    const cookies = new Cookies();
    const [OpenTicketCsvData, setOpenTicketCsvData] = useState([]);
    const [CloseTicketCsvData, setCloseTicketCsvData] = useState([]);
    const [TabCheck, setTabCheck] = useState("");
    const headers = [
        { label: "Ticket Id", key: "ticketid" },
        { label: "Student Name", key: "studentName" },
        { label: "Ticket Created By", key: "ticketCreatedBy" },
        { label: "Serial Number", key: "serialNum" },
        { label: "Ticket Status", key: "ticket_status" },
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
    const schoolid = 1;
    var userid = parseInt(cookies.get('CsvUserId'));
    const [OpenTicket, setOpenTicket] = useState([]);
    const [TicketStatus, setTicketStatus] = useState([]);
    const [CloseTicket, setCloseTicket] = useState([]);
    const [openticketnorecord, setopenticketnorecord] = useState("");
    const [closeticketnorecord, setcloseticketnorecord] = useState("");

    const [OpenTicketList, setOpenTicketList] = useState([]);
    const [CloseTicketList, setCloseTicketList] = useState([]);
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
            $(".GridBox").css('overflow', 'hidden');
            ListOfTicketStatus();
            CheckUrl();
        };
    }, []);
    const CheckUrl = () => {
        ShowLoder();
        var PathName = window.location.pathname;
        var pathsplit = PathName.split('/');
        var prodActive = pathsplit[2];
        if (prodActive == "open-tickets") {
            setTabCheck(1);
            HideLoder();
            ListOfOpenTickets();
        } else if (prodActive == "close-tickets") {
            setTabCheck(2);
            HideLoder();
            ListOfCloseTickets();
        }
        else {
            HideLoder();
            GetListOfTickets();
        }
    }
    const GetListOfTickets = async () => {
        $("#OpenTicketDiv").addClass('d-none');
        $("#CloseTicketDiv").addClass('d-none');
        ShowLoder();
        await ApiGetCall("/allTickets/" + schoolid + "&" + userid).then((result) => {
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
        await ApiGetCall("/getTicketStatus").then((result) => {
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
        var SortBy = $("#OpenTicketSortBy option:selected").val();
        ShowLoder();
        if (SortBy == "") {
            SortBy = null;
        }
        await ApiGetCall("/openTickets/" + schoolid + "&" + SortBy).then((result) => {
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
        if ($("#NotesId_" + TicketId).hasClass('d-none')) {
            $("#NotesId_" + TicketId).fadeIn();
            $("#NotesId_" + TicketId).fadeIn("slow");
            $("#NotesId_" + TicketId).fadeIn(3000);
            $("#NotesId_" + TicketId).removeClass('d-none');
            $("#DownArrow_" + TicketId).addClass('d-none');
            $("#UpArrow_" + TicketId).removeClass('d-none');
        } else {
            $("#NotesId_" + TicketId).fadeOut();
            $("#NotesId_" + TicketId).fadeOut("slow");
            $("#NotesId_" + TicketId).fadeOut(3000);
            $("#NotesId_" + TicketId).addClass('d-none');
            $("#NotesId_" + TicketId).addClass('d-none');
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
        var SortBy = $("#CloseTicketSortBy option:selected").val();
        ShowLoder();
        if (SortBy == "") {
            SortBy = null;
        }
        await ApiGetCall("/closeTickets/" + schoolid + "&" + SortBy).then((result) => {
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
    // const CheckCloseTicketCheckbox = () =>{
    //     var vlen = $(".CloseTicketCheckbox:checked").length;
    //     var visibleLen = $(".CloseTicketCheckbox:visible").length;

    //     if(visibleLen == vlen){
    //         $("#CloseTicketSelectAll").prop('checked',true);
    //     }else{
    //         $("#CloseTicketSelectAll").prop('checked',false);
    //     }
    // }
    const OpenTicketStatusSubmit = async () => {
        ShowLoder();
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
            var vArray = [];
            $(".OpenTicketCheckbox").each(function () {
                var vJson = {};
                if ($(this).is(":checked")) {
                    var vid = parseInt($(this).attr('ticketid'));
                    vJson['ID'] = vid;
                    vArray.push(vJson);
                }
            });
            var raw = JSON.stringify({
                IDArray: vArray,
                Status: actionid
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
                            window.location = "/manage-tickets/open-tickets";
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
    const SearchTickets = () => {
        if (TabCheck == 1) {
            // open ticket search
            var value = $("#SearchTicket").val();
            $("#myTable .row").hide();
            $('#myTable .row').each(function () {
                if ($(this).text().toLowerCase().indexOf("" + value + "") !== -1) {
                    $(this).closest('#myTable .row').show();
                }
            });
            var vlen = $('#myTable .row:visible').length;
            if (vlen == 0) {
                var sugArray = [];
                sugArray.push(
                    <div className="col-12 p-5 text-center">
                        <label>No Record Found</label>
                    </div>
                );
                setopenticketnorecord(sugArray);
            } else {
                setopenticketnorecord("");
            }
        } else if (TabCheck == 2) {
            // close ticket search
            var value = $("#SearchTicket").val();
            $("#CloseTicketTable .row").hide();
            $('#CloseTicketTable .row').each(function () {
                if ($(this).text().toLowerCase().indexOf("" + value + "") !== -1) {
                    $(this).closest('#CloseTicketTable .row').show();
                }
            });
            var vlen = $('#CloseTicketTable .row:visible').length;
            if (vlen == 0) {
                var sugArray = [];
                sugArray.push(
                    <div className="col-12 p-5 text-center">
                        <label>No Record Found</label>
                    </div>
                );
                setcloseticketnorecord(sugArray);
            } else {
                setcloseticketnorecord("");
            }
        }
    }
    return (
        <>
            <div className='row col-12'>
                <h1 className="PageHeading">Manage Tickets</h1>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        {/* Grid Div */}
                        <div className="row">
                            <div className="col-md-8">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item navitembrdrbtm ">
                                        <a className="nav-link linkclass active" aria-current="page" id="AllTicketBtn" href="/manage-tickets">View All Tickets</a>
                                    </li>
                                    <li className="nav-item navitembrdrbtm">
                                        <a className="nav-link linkclass" aria-current="page" id="OpenTicketBtn" href="/manage-tickets/open-tickets">View All Open Tickets</a>
                                    </li>
                                    <li className="nav-item navitembrdrbtm">
                                        <a className="nav-link linkclass" id="CloseTicketBtn" aria-disabled="true" href="/manage-tickets/close-tickets">View All Close Tickets</a>
                                    </li>
                                </ul>
                            </div>
                            <div className='col-md-4 text-end pe-0'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" autoComplete="off" type="text" placeholder="Search Ticket" id="SearchTicket" onKeyUp={SearchTickets} />
                                    {/* (User, ticket number, Device asset tag / Serial number) */}
                                </form>
                            </div>
                        </div>
                        <div className="row mt-3" id="MainGridDiv">
                            <div className='col-md-6'>
                                <div className="greyBox" style={{ height: '95%', overflowY: 'scroll' }}>
                                    <div className='Header'>
                                        <b className='font-17'>list of Open Ticket</b><br />
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>User Name
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>Date created
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>Status
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                            </tr>
                                            {OpenTicket.map((item, i) => {
                                                var returData;
                                                returData = (<tr key={i}>
                                                    <td>{item.studentName}</td>
                                                    <td className="ps-3">{item.Date}</td>
                                                    <td>{item.ticket_status}</td>
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
                                <div className="greyBox" style={{ height: '95%', overflowY: 'scroll' }}>
                                    <div className='Header'>
                                        <b className='font-17'>list of Close Ticket</b><br />
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>User Name
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>Date created
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>Status
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                            </tr>
                                            {CloseTicket.map((item, i) => {
                                                var returData;
                                                returData = (<tr key={i}>
                                                    <td>{item.studentName}</td>
                                                    <td className="ps-3">{item.Date}</td>
                                                    <td>{item.ticket_status}</td>
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
                                    <div className="col-md-8 pe-0">
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
                                    <div className="col-md-4 row pe-0">
                                        <div className="col-md-8 text-end">
                                            <div className="mt-2"><CSVLink {...csvReport} className="BlackFont BorderBtn">Export Ticket CSV<img src='/images/ExportInventory.svg' className='img-fluid ps-2' /></CSVLink></div>
                                        </div>
                                        <div className="col-md-4 px-0">
                                            <select onChange={ListOfOpenTickets} id="OpenTicketSortBy">
                                                <option value="0">Sort by</option>
                                                <option value="1">Tickets by grade</option>
                                                <option value="2">Tickets by building</option>
                                                <option value="3">Tickets by Status</option>
                                                <option value="4">Tickets by Outside locations</option>
                                            </select>
                                        </div>
                                    </div>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                                </div>
                                <div className="col-12 scroll-350">
                                    <div className='row GridHeader px-0 '>
                                        <div className='col-md-1 font-13 px-0 text-center'>
                                            Select All<input className="form-check-input ms-2" id="OpenTicketSelectAll" type="checkbox" onChange={(e) => SelectAllOpenCloseTicket("OpenTicketSelectAll", "OpenTicketCheckbox", "OpenTicketStatusDiv")} />
                                        </div>
                                        <div className='col-md-1 text-center '>Date</div>
                                        <div className='col-md-2 text-center'>User Name</div>
                                        <div className='col-md-1 px-0 text-center'>Ticket No.</div>
                                        <div className='col-md-2 text-center'>Serial No.</div>
                                        <div className='col-md-1 text-center'>Grade</div>
                                        <div className='col-md-1 text-center'>Building</div>
                                        <div className='col-md-2 text-center'>Status</div>
                                        <div className='col-md-1'></div>
                                    </div>
                                    <div className='scroll-330' id="myTable">
                                        {OpenTicketList.map((item, i) => {
                                            var returData;
                                            returData = (<div className="row grid px-0 subjectName" key={i}>
                                                <div className='col-md-1 text-center' key={i}>
                                                    <input className="form-check-input OpenTicketCheckbox" ticketid={item.ticketid} type="checkbox" onClick={CheckOpenTicketCheckbox} />
                                                </div>
                                                <div className="col-md-1 px-0 text-center">{item.Date}</div>
                                                <div className="col-md-2 text-center">{item.ticketCreatedBy}</div>
                                                <div className="col-md-1 text-center">{item.ticketid}</div>
                                                <div className="col-md-2 text-center">{item.serialNum}</div>
                                                <div className="col-md-1 text-center">{item.Grade}</div>
                                                <div className="col-md-1 text-center">{item.Building}</div>
                                                <div className="col-md-2 text-center" style={{ color: "#3CBBA5" }}>
                                                    {item.ticket_status}
                                                </div>
                                                <div className="col-md-1 text-center">
                                                    <img src="/images/DownRoundArrow.svg" id={`DownArrow_${item.ticketid}`} className="cursor-pointer img-fluid" onClick={(e) => ShowTicketNote(item.ticketid)} />
                                                    <img src='/images/UpRoundArrow.svg' id={`UpArrow_${item.ticketid}`} className='img-fluid cursor-pointer d-none' onClick={(e) => ShowTicketNote(item.ticketid)} />
                                                </div>
                                                <div className="col-12 py-2 d-none" id={`NotesId_${item.ticketid}`}>
                                                    <textarea className="form-control bgWhite" rows={3} disabled value={"Notes:  " + item.notes}></textarea>
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
                                    <div className="col-md-8">
                                        {/* <button className="BorderBtn ms-4 d-none" id="DeleteTicketBtn">Delete Ticket</button> */}
                                    </div>
                                    <div className="col-md-4 row pe-0">
                                        <div className="col-md-8 text-end">
                                            <div className="mt-2"><CSVLink {...csvCloseReport} className="BlackFont BorderBtn">Export Ticket CSV<img src='/images/ExportInventory.svg' className='img-fluid ps-2' /></CSVLink></div>
                                        </div>
                                        <div className="col-md-4 px-0">
                                            <select onChange={ListOfCloseTickets} id="CloseTicketSortBy">
                                                <option value="0">Sort by</option>
                                                <option value="1">Tickets by grade</option>
                                                <option value="2">Tickets by building</option>
                                                <option value="3">Tickets by Status</option>
                                                <option value="4">Tickets by Outside locations</option>
                                            </select>
                                        </div>
                                    </div>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100 my-2' />
                                </div>
                                <div className="col-12 scroll-350">
                                    <div className="col-12 scroll-350">
                                        <div className='row GridHeader px-0'>
                                            <div className='col-md-2 text-center'>Date</div>
                                            <div className='col-md-2 text-center'>User Name</div>
                                            <div className='col-md-2 px-0 text-center'>Ticket No.</div>
                                            <div className='col-md-2 text-center'>Serial No.</div>
                                            <div className='col-md-1 text-center'>Grade</div>
                                            <div className='col-md-1 text-center'>Building</div>
                                            <div className='col-md-2 text-center'>Status</div>
                                        </div>
                                        <div className='scroll-330' id="CloseTicketTable">
                                            {CloseTicketList.map((item, i) => {
                                                var returData;
                                                returData = (<div className="row grid px-0" key={i}>
                                                    <div className="col-md-2 text-center">{item.Date}</div>
                                                    <div className="col-md-2 text-center">{item.ticketCreatedBy}</div>
                                                    <div className="col-md-2 text-center">{item.ticketid}</div>
                                                    <div className="col-md-2 text-center">{item.serialNum}</div>
                                                    <div className="col-md-1 text-center">{item.Grade}</div>
                                                    <div className="col-md-1 text-center">{item.Building}</div>
                                                    <div className="col-md-2 text-center" style={{ color: "#FF7076" }}>
                                                        {item.ticket_status}
                                                    </div>
                                                    <div className="d-none">{item.Grade}</div>
                                                    <div className="d-none">{item.Building}</div>
                                                    <div className="d-none">{item.ticket_status}</div>
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
        </>
    )
}