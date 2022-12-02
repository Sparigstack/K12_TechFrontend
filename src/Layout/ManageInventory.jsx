import '../Styles/SideMenu/Sidemenu.css';
import '../Styles/SideMenu/semi-dark.css';
import $ from 'jquery';
import { useEffect } from 'react';
import { ApiPostCall } from '../JS/Connector';
export function ManageInventory() {
    const width = $(window).width();
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
    const ImportInventory = async () => {
        let fileInput = document.querySelector(".default-file-input");
        fileInput.addEventListener("change", e => {
            var fileInputValue = fileInput.value;
            var extension = fileInputValue.split('.').pop();
            if (extension == "csv") {
                $("#ImportInventoryText").text(fileInput.value);
            } else {
                $("#ImportInventoryText").text('Upload only csv file.');
            }
            var raw = JSON.stringify({
                upload_file: fileInputValue
            });
            ApiPostCall("/upload", raw).then((result) => {
                if (result == undefined || result == "") {
                    $("#Overlay").hide();
                    $("#LoderId").hide();
                    $(".alert-danger").show();
                    $("#AlertDangerMsg").text('Login Failed!');
                    setTimeout(function () {
                        $(".alert-danger").hide();
                        $("#AlertDangerMsg").text();
                    }, 1500);
                } else {
                    const responseRs = JSON.parse(result);
                    console.log(responseRs)
                    // if (responseRs.status == "success") {
                    //     $(".alert-success").show();
                    //     $("#AlertMsg").text("Login Successfully.");
                    //     setTimeout(function () {
                    //         window.location = "/dashboard";
                    //     }, 1500);
                    // }
                    $("#Overlay").hide();
                    $("#LoderId").hide();
                }

            });
        });
    }
    function uploadAction(e) {
        var data = new FormData();
        var imagedata = document.querySelector('input[type="file"]').files[0];
        data.append("upload_file", imagedata);
        ApiPostCall("/upload", data).then((result) => {
            if (result == undefined || result == "") {
                $("#Overlay").hide();
                $("#LoderId").hide();
                $(".alert-danger").show();
                $("#AlertDangerMsg").text('Login Failed!');
                setTimeout(function () {
                    $(".alert-danger").hide();
                    $("#AlertDangerMsg").text();
                }, 1500);
            } else {
                // const responseRs = JSON.parse(result);
                alert(result)
                $("#Overlay").hide();
                $("#LoderId").hide();
            }

        });
    }


    return (
        <>
            <div className='col-12 row'>
                <div className='col-md-6'>
                    <h1 className="PageHeading">Manage Inventory</h1>
                </div>
                <div className='col-md-6 text-end'>
                    <input type="file" name="upload_file"></input>
                    <input type="button" value="upload" onClick={uploadAction}></input>
                    {/* <div>
                        <label className='BorderBtn' onClick={ImportInventory}> Import Inventory
                            <img src='/images/ImportInventory.svg' className='img-fluid ps-2' />
                            <input type="file" name='upload_file' accept=".csv" className='default-file-input' />
                        </label><br />
                        <label id="ImportInventoryText" style={{ color: "red" }}></label>
                    </div> */}
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
                                            <tr onClick={(e) => ShowDeviceDetailsDiv(1)} id="GridId_1">
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