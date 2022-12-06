import '../Styles/SideMenu/Sidemenu.css';
import '../Styles/SideMenu/semi-dark.css';
import $ from 'jquery';
import { useEffect, useRef } from 'react';
export function ManageInventory() {
    const width = $(window).width();
    const BaseUrl = process.env.REACT_APP_Base_URL;
    const fileRef = useRef();
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 90;
            $(".GridBox").css('height', finalHeight);
            if (width <= 993) {
                $(".RocketImgClass").addClass('d-none');
            }
        };
    }, []);
    const ShowDeviceDetailsDiv = (currentObj) => {
        if (width >= 993) {
            $(".RocketImgClass").removeClass('d-none');
            $(".RocketImgClass").removeClass('RocketImage');
            $("#RocketImg_" + currentObj).addClass('RocketImage');
        }
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
                        <input type="file" ref={fileRef} name="upload_file" id="UploadFileId" accept='.csv'/>
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
                        <div className='row pt-4 d-flex align-items-center'>
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
                        <div className='row mt-4'>
                            <div className='col-md-6'>
                                <div className='col-12 greyBox'>
                                    <div className='Header'>
                                        <b className='font-16'>list of Devices</b><br />
                                        <img src='/Images/HorizontalLine.png' className='img-fluid w-100' />
                                    </div>
                                    <table className="table innerGridBox mt-2">
                                        <tbody>
                                            <tr onClick={(e) => ShowDeviceDetailsDiv(1)}>
                                                <td>Priyam Maheta</td>
                                                <td>#6598 9256</td>
                                                <td>iPad</td>
                                                <td className='p-0'>
                                                    <img src='/Images/RocketPng.svg' id="RocketImg_1" className='img-fluid RocketImgClass' />
                                                </td>
                                            </tr>
                                            <tr onClick={(e) => ShowDeviceDetailsDiv(2)}>
                                                <td>Ayush Sheth</td>
                                                <td>#6598 9256</td>
                                                <td>Laminators</td>
                                                <td className='p-0'>
                                                    <img src='/Images/RocketPng.svg' id="RocketImg_2" className='img-fluid RocketImgClass' />
                                                </td>
                                            </tr>
                                            <tr onClick={(e) => ShowDeviceDetailsDiv(3)}>
                                                <td>Bhargav Chauhan</td>
                                                <td>#6598 9256</td>
                                                <td>Projectors</td>
                                                <td className='p-0'>
                                                    <img src='/Images/RocketPng.svg' id="RocketImg_3" className='img-fluid RocketImgClass' />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='col-12 greyBox'>
                                    <div className='Header'>
                                        <b className='font-16'>Devices Details</b><br />
                                        <img src='/Images/HorizontalLine.png' className='img-fluid w-100' />
                                    </div>
                                    <table className="table mt-2 DeviceDetailBox">
                                        <tbody>
                                            <tr>
                                                <td>OEM</td>
                                                <td>Lorem ipsum dolor sit amet</td>
                                            </tr>
                                            <tr>
                                                <td>Model</td>
                                                <td>Lorem ipsum dolor sit amet</td>
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