import '../Styles/SideMenu/Sidemenu.css';
import '../Styles/SideMenu/semi-dark.css';
import $ from 'jquery';
import { useEffect, useRef } from 'react';
import { ApiGetCall } from '../JS/Connector';
import { useState } from 'react';
import { Pagination } from '../Components/Pagination';
export function ManageInventory() {
    const width = $(window).width();
    const [AllDevices, setAllDevices] = useState([]);
    const [DeviceDetails, setDeviceDetails] = useState([]);
    const BaseUrl = process.env.REACT_APP_Base_URL;
    const fileRef = useRef();
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 100;
            $(".GridBox").css('height', finalHeight);
            if (width <= 993) {
                $(".RocketImgClass").addClass('d-none');
            }
            GetListOfDevices();
        };
    }, []);
    const GetListOfDevices = async () => {
        $("#Overlay").show();
        $("#LoderId").show();
        await ApiGetCall("/getInventories").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.response == "success") {
                    setAllDevices(responseRs.msg);
                }
                $("#Overlay").hide();
                $("#LoderId").hide();
            }
        });
    }
    const GetDeviceDetailById = async (UserId) => {
        await ApiGetCall("/fetchDeviceDetails/" + UserId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                $("#Overlay").hide();
                $("#LoderId").hide();
                var sugData = responseRs.msg;
                if (responseRs.response == "success") {
                    if (width >= 993) {
                        $(".RowClass").removeClass("GridBgColor");
                        $("#MainRow_" + UserId).addClass("GridBgColor");
                        $(".RocketImgClass").addClass('d-none');
                        $(".RocketImgClass").removeClass('RocketImage');
                        $("#RocketImg_" + UserId).removeClass('d-none');
                        $("#RocketImg_" + UserId).addClass('RocketImage');
                    }
                    $("#DeviceDetailsDiv").removeClass('d-none');
                    setDeviceDetails(sugData);
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
    function handleForm(e) {
        e.preventDefault();
        const fileInput = fileRef.current;
        const files = fileInput.files[0];
        const filename = files.name;
        var extension = filename.split('.').pop();
        if (extension == "csv") {
            $("#ImportInventoryText").text(filename);
        } else {
            $("#ImportInventoryText").text('Upload only csv file.');
        }
        var formdata = new FormData();
        formdata.append("file", files);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        fetch(`${BaseUrl}/upload`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }
    return (
        <>
            <div className='row col-12'>
                <div className='col-md-6'>
                    <h1 className="PageHeading">Manage Inventory</h1>
                </div>
                <div className='col-md-6 text-end d-flex justify-content-end align-items-center'>
                    <form onSubmit={handleForm}>
                        <input type="file" ref={fileRef} name="upload_file" id="UploadFileId" accept='.csv' />
                        <label className='ImportInventoryBtn' for="UploadFileId"> Import Inventory
                            <img src='/images/ImportInventory.svg' className='img-fluid ps-2' />
                        </label>
                        <input type="submit" value="Upload" className='UploadBtn' /><br />
                        <label id="ImportInventoryText" style={{ color: "red" }}></label>
                    </form>
                    <form>
                        <label className='BorderBtn ms-3' for="UploadFileId"> Add Inventory
                            <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                        </label><br />
                        <label></label>
                    </form>
                </div>
            </div>
            <div className="container-fluid px-0">
                <div className="GridBox">
                    <div className="container  ps-3">
                        <div className='row pt-2 d-flex align-items-center'>
                            <div className='col-md-4 mt-2'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" type="text" placeholder="Search A Specific Device" />
                                </form>
                            </div>
                            <div className='col-md-4 mt-2'>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                    <label className="form-check-label ps-1" htmlFor="flexCheckDefault">
                                        Decommissioned
                                    </label>
                                </div>
                            </div>
                            <div className='col-md-4 text-end mt-2'>
                                <select name="sorting" id="SortBy">
                                    <option value="0">Sort By</option>
                                    <option value="Name">Name</option>
                                    <option value="Date">Date</option>
                                </select>
                            </div>
                        </div>
                        <div className='row mt-2'>
                            <div className='col-md-6'>
                                <div className='col-12 greyBox'>
                                    <div className='Header'>
                                        <b className='font-16'>list of Devices</b><br />
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                    <table className="table innerGridBox mt-2" style={{ overflow: "scroll" }}>
                                        <tbody>
                                            {AllDevices.map((item, i) => {
                                                var returData;
                                                returData = (<tr key={i} onClick={(e) => GetDeviceDetailById(item.ID)} id={`MainRow_${item.ID}`} className="RowClass position-relative">
                                                    <td className='ps-5'>{item.Student_name}</td>
                                                    <td>{item.Serial_number}</td>
                                                    <td>{item.Device_model}</td>
                                                    <div>
                                                        <img src='/Images/RocketPng.svg' id={`RocketImg_${item.ID}`} className='img-fluid RocketImgClass d-none' />
                                                    </div>
                                                </tr>
                                                );
                                                return returData;
                                            })}
                                            </tbody>
                                    </table>
                                   <Pagination/>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='col-12 greyBox d-none' id="DeviceDetailsDiv">
                                    <div className='Header'>
                                        <b className='font-16'>Devices Details</b><br />
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                    <table className="table  DeviceDetailBox">
                                        <tbody>
                                            <tr>
                                                <td>ID</td>
                                                <td>: {DeviceDetails.ID}</td>
                                            </tr>
                                            <tr>
                                                <td>Purchase Date</td>
                                                <td>: {DeviceDetails.Purchase_date}</td>
                                            </tr>
                                            <tr>
                                                <td>OEM Warranty Until</td>
                                                <td>: {DeviceDetails.OEM_warranty_until}</td>
                                            </tr>
                                            <tr>
                                                <td>Extended Warranty Until</td>
                                                <td>: {DeviceDetails.Extended_warranty_until}</td>
                                            </tr>
                                            <tr>
                                                <td>ADP Coverage</td>
                                                <td>: {DeviceDetails.ADP_coverage}</td>
                                            </tr>
                                            <tr>
                                                <td>OEM</td>
                                                <td>: {DeviceDetails.OEM}</td>
                                            </tr>
                                            <tr>
                                                <td>Device Model</td>
                                                <td>: {DeviceDetails.Device_model}</td>
                                            </tr>
                                            <tr>
                                                <td>OS</td>
                                                <td>: {DeviceDetails.OS}</td>
                                            </tr>
                                            <tr>
                                                <td>Serial Number</td>
                                                <td>: {DeviceDetails.Serial_number}</td>
                                            </tr>
                                            <tr>
                                                <td>Asset Tag</td>
                                                <td>: {DeviceDetails.Asset_tag}</td>
                                            </tr>
                                            <tr>
                                                <td>Building</td>
                                                <td>: {DeviceDetails.Building}</td>
                                            </tr>
                                            <tr>
                                                <td>Grade</td>
                                                <td>: {DeviceDetails.Grade}</td>
                                            </tr>
                                            <tr>
                                                <td>Student Name</td>
                                                <td>: {DeviceDetails.Student_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Student ID</td>
                                                <td>: {DeviceDetails.Student_ID}</td>
                                            </tr>
                                            <tr>
                                                <td>Parent Email</td>
                                                <td>: {DeviceDetails.Parent_email}</td>
                                            </tr>
                                            <tr>
                                                <td>Parent Phone Number</td>
                                                <td>: {DeviceDetails.Parent_phone_number}</td>
                                            </tr>
                                            <tr>
                                                <td>Parental Coverage</td>
                                                <td>: {DeviceDetails.Parental_coverage}</td>
                                            </tr>
                                            <tr>
                                                <td>Repair Cap</td>
                                                <td>: {DeviceDetails.Repair_cap}</td>
                                            </tr>
                                            <tr>
                                                <td>Created At</td>
                                                <td>: {DeviceDetails.created_at}</td>
                                            </tr>
                                            <tr>
                                                <td>Updated At</td>
                                                <td>: {DeviceDetails.updated_at}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className='row text-center'>
                                        <div className='col-md-5 mt-2'>
                                            <button className='SaveBtn'>Create Ticket</button>
                                        </div>
                                        <div className='col-md-6 mt-2'>
                                            <button className='SaveBtn'>Decommission Device</button>
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