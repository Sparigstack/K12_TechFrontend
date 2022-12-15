import { useEffect, useState } from "react";
import $ from 'jquery';
import { ShowLoder, HideLoder } from "../JS/Common";
import { ApiGetCall } from "../JS/Connector";
import { Cookies } from 'react-cookie';
export function ManageTicket() {
    const cookies = new Cookies();
    const schoolid = 1;
    var userid = parseInt(cookies.get('CsvUserId'));
    const [OpenTicket, setOpenTicket] = useState([]);
    const [CloseTicket, setCloseTicket] = useState([]);
    const [openticketnorecord,setopenticketnorecord] = useState("");
    const [closeticketnorecord,setcloseticketnorecord] = useState("");
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
            $(".GridBox").css('overflow', 'hidden');
            // CheckUrl();
            GetListOfTickets();
        };
    }, []);
    const CheckUrl = () => {
        ShowLoder();
        var PathName = window.location.pathname;
        var pathsplit = PathName.split('/');
        var prodActive = pathsplit[2];
        if (prodActive == "open-ticket") {
            ShowOpenTicketDetails();
        } else if (prodActive == "close-ticket") {
            // ShowCloseTicketDetails();
        }
        else {
            // GetListOfTickets();
        }
        HideLoder();
    }

    const GetListOfTickets = async () => {
        ShowLoder();
        await ApiGetCall("/allTickets/" + schoolid + "&" + userid).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                console.log(responseRs)
                var i = 1;
                if (responseRs.response == "success") {
                    if (responseRs.Openticket.length != 0) {
                        setOpenTicket(responseRs.Openticket);
                    } else {
                    var sugArray = [];
                        sugArray.push(
                            <div className="col-12 GridNoRecord text-center" key={i}>
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
                            <div className="col-12 GridNoRecord text-center" key={i}>
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

    const OpenCloseTicket = (url) => {
        var PathName = window.location.pathname;
        var FinalUrl = PathName + url;
        window.location.href = FinalUrl;
    }

    const ShowOpenTicketDetails = () => {
        $("#MainGridDiv").addClass('d-none');
        $("#OpenTicketDiv").removeClass('d-none');
        $("#CloseTicketBtn").addClass('BorderColorBtn');
        $("#CloseTicketBtn").removeClass('SaveBtn');
        $("#OpenTicketBtn").addClass('SaveBtn');
        $("#OpenTicketBtn").removeClass('BorderColorBtn');
    }
    return (
        <>
            <div className='row col-12'>
                <h1 className="PageHeading">Manage Ticket</h1>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox p-3">
                    <div className="container ps-3">
                        <div className="row">
                            <div className='col-md-6 mt-2'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" autoComplete="off" type="text" placeholder="Search Ticket (User, ticket number, Device asset tag / Serial number)" id="SearchTicket" />
                                    <div className="SuggestionBox">
                                        {/* {SuggestionBoxArray} */}
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-6 text-end">
                                <label className='BorderColorBtn ms-3 text-center' id="OpenTicketBtn" onClick={ShowOpenTicketDetails}>Open Ticket</label>
                                <label className='BorderColorBtn ms-3 text-center' id="CloseTicketBtn">Close Ticket</label>
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
                                                    <td>{item.ticketid}</td>
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
                                                    <td>{item.ticketid}</td>
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
                                                <option value="0">All</option>
                                                <option value="1">Open</option>
                                                <option value="2">In Progress</option>
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
                                        <div className="form-check">
                                            <input className="form-check-input CheckboxClass" type="checkbox" />
                                            <label className="form-check-label ps-1">
                                                Send out for repair
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input CheckboxClass" type="checkbox" />
                                            <label className="form-check-label ps-1">
                                                Waiting on parts
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input CheckboxClass" type="checkbox" />
                                            <label className="form-check-label ps-1">
                                                Decommission device
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input CheckboxClass" type="checkbox" />
                                            <label className="form-check-label ps-1">
                                                Close Ticket
                                            </label>
                                        </div>
                                        <button className="SaveBtn">Submit</button>
                                    </div>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className="col-12">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th className="text-center">Select</th>
                                                <th>Date
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
                                            <tr>
                                                <td>
                                                    <div className="text-center">
                                                        <input className="form-check-input CheckboxClass" type="checkbox" />
                                                    </div>
                                                </td>
                                                <td>02/11/2022</td>
                                                <td>Dhruval Patel</td>
                                                <td>#123 456 789</td>
                                                <td>#123 456 789</td>
                                                <td className="text-center">Open</td>
                                                <td className="text-center">
                                                    <img src="/images/DownRoundArrow.svg" className="cursor-pointer img-fluid" />
                                                </td>
                                            </tr>
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