import { useEffect, useState } from "react";
import $ from 'jquery';
import { ShowLoder, HideLoder, MMDDYYYY } from "../JS/Common";
import { ApiGetCall } from "../JS/Connector";
import { Cookies } from 'react-cookie';
export function ManageTicket() {
    const cookies = new Cookies();
    const schoolid = 1;
    var userid = parseInt(cookies.get('CsvUserId'));
    const [OpenTicket, setOpenTicket] = useState([]);
    const [TicketStatus, setTicketStatus] = useState([]);
    const [CloseTicket, setCloseTicket] = useState([]);
    const [openticketnorecord, setopenticketnorecord] = useState("");
    const [closeticketnorecord, setcloseticketnorecord] = useState("");

    const [OpenTicketList, setOpenTicketList] = useState([]);
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
            $(".GridBox").css('overflow', 'hidden');
            GetListOfTickets();
        };
    }, []);
    const GetListOfTickets = async () => {
        ShowLoder();
        await ApiGetCall("/allTickets/" + schoolid + "&" + userid).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var i = 1;
                console.log(responseRs.Openticket)
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
    const ShowOpenTicketDetails = (TabId) => {
        $(".linkclass").removeClass('active');
        $("#" + TabId).addClass('active');
        $("#MainGridDiv").addClass('d-none');
        $("#OpenTicketDiv").removeClass('d-none');
        ListOfTicketStatus();
    }
    const ListOfTicketStatus = async () => {
        ShowLoder();
        await ApiGetCall("/getTicketStatus").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                console.log(responseRs)
                setTicketStatus(responseRs);
                HideLoder();
                ListOfOpenTickets();
            }
        });
    }
    const ListOfOpenTickets = async () => {
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
                console.log(responseRs.Openticket)
                if (responseRs.response == "success") {
                    if (responseRs.Openticket.length != 0) {
                        setOpenTicketList(responseRs.Openticket);
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
    return (
        <>
            <div className='row col-12'>
                <h1 className="PageHeading">Manage Tickets</h1>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        <div className="row">
                            <div className="col-md-8">
                                <ul class="nav nav-tabs">
                                    <li class="nav-item navitembrdrbtm">
                                        <a class="nav-link linkclass" aria-current="page" href="#" id="OpenTicketBtn" onClick={(e) => ShowOpenTicketDetails("OpenTicketBtn")}>View All Open Ticket</a>
                                    </li>
                                    <li class="nav-item navitembrdrbtm">
                                        <a class="nav-link linkclass" href="#" tabindex="-1" id="CloseTicketBtn" aria-disabled="true" onClick={(e) => ShowOpenTicketDetails("CloseTicketBtn")}>View All Close Ticket</a>
                                    </li>
                                </ul>
                            </div>
                            <div className='col-md-4 text-end pe-0'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" autoComplete="off" type="text" placeholder="Search Ticket" id="SearchTicket" onKeyUp={ListOfOpenTickets} />
                                    {/* (User, ticket number, Device asset tag / Serial number) */}
                                </form>
                            </div>
                        </div>
                        {/* Grid Div */}
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
                                    <div className="col-md-7 row pe-0">
                                        {TicketStatus.map((item, i) => {
                                            var returData;
                                            returData = (
                                                <div className="col-md-4 pe-0" key={i}>
                                                    <input className="form-check-input me-2" id="SelectAllId" type="checkbox" />{item.status}
                                                </div>
                                            );
                                            return returData;
                                        })}
                                    </div>
                                    <div className="col-md-1">
                                        <button className="BorderBtn">Submit</button>
                                    </div>
                                    <div className="col-md-4 row pe-0">
                                        <div className="col-md-8 text-end">
                                            <label className='BorderBtn'> Export Ticket CSV
                                                <img src='/images/ExportInventory.svg' className='img-fluid ps-2' />
                                            </label>
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
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th className="text-center">
                                                    Select All<input className="form-check-input ms-2" id="SelectAllId" type="checkbox" />
                                                </th>
                                                <th>Date created
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>User Name
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>Ticket No.
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>Serial No.
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th className="text-center">Status</th>
                                                <th></th>
                                            </tr>
                                            {OpenTicketList.map((item, i) => {
                                                var returData;
                                                returData = (<>
                                                    <tr key={i}>
                                                        <td>
                                                            <div className="text-center">
                                                                <input className="form-check-input CheckboxClass" type="checkbox" />
                                                            </div>
                                                        </td>
                                                        <td className="ps-3">{item.Date}</td>
                                                        <td>{item.ticketCreatedBy}</td>
                                                        <td className="ps-5">{item.ticketid}</td>
                                                        <td>{item.serialNum}</td>
                                                        <td className="text-center" style={{ color: "#3CBBA5" }}>
                                                            {item.ticket_status}
                                                        </td>
                                                        <td className="text-center">
                                                            <img src="/images/DownRoundArrow.svg" id={`DownArrow_${item.ticketid}`} className="cursor-pointer img-fluid" onClick={(e) => ShowTicketNote(item.ticketid)} />
                                                            <img src='/images/UpRoundArrow.svg' id={`UpArrow_${item.ticketid}`} className='img-fluid cursor-pointer d-none' onClick={(e) => ShowTicketNote(item.ticketid)} />
                                                        </td>
                                                    </tr>
                                                    <tr className="py-2 d-none" id={`NotesId_${item.ticketid}`}>
                                                        <td colSpan={7}>
                                                            <textarea className="form-control bgWhite" rows={3} disabled value={"Notes:  " + item.notes}></textarea>
                                                        </td>
                                                    </tr>
                                                </>
                                                );
                                                return returData;
                                            })}
                                            {openticketnorecord}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}