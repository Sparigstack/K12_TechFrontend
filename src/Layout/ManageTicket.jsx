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
    const ShowOpenTicketDetails = () => {
        $("#MainGridDiv").addClass('d-none');
        $("#OpenTicketDiv").removeClass('d-none');
        $("#CloseTicketBtn").addClass('BorderColorBtn');
        $("#CloseTicketBtn").removeClass('SaveBtn');
        $("#OpenTicketBtn").addClass('SaveBtn');
        $("#OpenTicketBtn").removeClass('BorderColorBtn');
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
        var SearchString = $("#SearchTicket").val();
        ShowLoder();
        if (SearchString == "") {
            SearchString = null;
        }
        await ApiGetCall("/openTickets/" + schoolid + "&" + SearchString).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var i = 1;
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
    return (
        <>
            <div className='row col-12'>
                <h1 className="PageHeading">Manage Tickets</h1>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        <div className="row">
                            <div className='col-md-6 mt-2'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" autoComplete="off" type="text" placeholder="Search Ticket (User, ticket number, Device asset tag / Serial number)" id="SearchTicket" onKeyUp={ListOfOpenTickets} />
                                </form>
                            </div>
                            <div className="col-md-6 text-end">
                                <label className='BorderColorBtn ms-3 text-center' id="OpenTicketBtn" onClick={ShowOpenTicketDetails}>View All Open Ticket</label>
                                <label className='BorderColorBtn ms-3 text-center' id="CloseTicketBtn">View All Close Ticket</label>
                            </div>
                        </div>

                        {/* Grid Div */}
                        <div className="row mt-4" id="MainGridDiv">
                            <div className='col-md-6'>
                                <div className="greyBox" style={{ height: '75%', overflowY: 'scroll' }}>
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
                                                <th>Ticket No.
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>Serial No.
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                            </tr>
                                            {OpenTicket.map((item, i) => {
                                                var returData;
                                                returData = (<tr key={i}>
                                                    <td>{item.studentName}</td>
                                                    <td className="ps-5">{item.ticketid}</td>
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
                                <div className="greyBox" style={{ height: '75%', overflowY: 'scroll' }}>
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
                                                <th>Ticket No.
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                                <th>Serial No.
                                                    <img src="/images/TicketGridIcon.svg" className="img-fluid ps-2" />
                                                </th>
                                            </tr>
                                            {CloseTicket.map((item, i) => {
                                                var returData;
                                                returData = (<tr key={i}>
                                                    <td>{item.studentName}</td>
                                                    <td className="ps-5">{item.ticketid}</td>
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
                                    <div className="col-md-8">
                                        <b className='font-18'>list of Open Ticket</b><br />
                                    </div>
                                    <div className="col-md-4 row">
                                        <div className="col-md-8 text-end">
                                            <label className='BorderBtn'> Export Ticket CSV
                                                <img src='/images/ExportInventory.svg' className='img-fluid ps-2' />
                                            </label>
                                        </div>
                                        <div className="col-md-4">
                                            <select>
                                                <option value="0">Sort by</option>
                                                <option value="1">Tickets by grade</option>
                                                <option value="2">Tickets by building</option>
                                                <option value="3">Tickets by Status</option>
                                                <option value="4">Tickets by Outside locations</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12 d-flex justify-content-evenly align-items-center pt-3 pb-1 ps-0">
                                        <div className="form-check">
                                            <input className="form-check-input CheckboxClass" type="checkbox" />
                                            <label className="form-check-label ps-1">
                                                Select All
                                            </label>
                                        </div>
                                        {TicketStatus.map((item, i) => {
                                            var returData;
                                            returData = (<div className="form-check" key={i}>
                                                <input className="form-check-input CheckboxClass" type="checkbox" />
                                                <label className="form-check-label ps-1">
                                                    {item.status}
                                                </label>
                                            </div>
                                            );
                                            return returData;
                                        })}

                                        <button className="SaveBtn">Submit</button>
                                    </div>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className="col-12" style={{ overflowY: 'scroll', height: '310px' }}>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th className="text-center">Select</th>
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
                                                returData = (<tr key={i}>
                                                    <td>
                                                        <div className="text-center">
                                                            <input className="form-check-input CheckboxClass" type="checkbox" />
                                                        </div>
                                                    </td>
                                                    <td className="ps-3">{item.Date}</td>
                                                    <td>{item.ticketCreatedBy}</td>
                                                    <td className="ps-5">{item.ticketid}</td>
                                                    <td>{item.serialNum}</td>
                                                    <td className="text-center">
                                                        {(item.ticket_status == "Open") ?
                                                            <span style={{ color: "#3CBBA5" }}>Open</span>
                                                            :
                                                            <></>
                                                        }
                                                    </td>
                                                    <td className="text-center">
                                                        <img src="/images/DownRoundArrow.svg" className="cursor-pointer img-fluid" />
                                                    </td>
                                                </tr>
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