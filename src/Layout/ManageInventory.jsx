import '../Styles/SideMenu/Sidemenu.css';
import '../Styles/SideMenu/semi-dark.css';
import $ from 'jquery';
import { useEffect } from 'react';
import { ApiGetCall } from '../JS/Connector';
import { useState } from 'react';
import { DateFormat } from '../JS/Common';
import { CheckValidation } from '../JS/Common';
import { ApiPostCall } from '../JS/Connector';
import { Cookies } from 'react-cookie';
export function ManageInventory() {
    const cookies = new Cookies();
    const width = $(window).width();
    const [AllDevices, setAllDevices] = useState([]);
    const [DeviceDetails, setDeviceDetails] = useState([]);
    const [TotalPages, setTotalPages] = useState("");

    // form input fields start
    const [PurchaseDate, setPurchaseDate] = useState("");
    const [OEMWarrantyUntil, setOEMWarrantyUntil] = useState("");
    const [ExtendedWarrantyUntil, setExtendedWarrantyUntil] = useState("");
    const [ADPCoverage, setADPCoverage] = useState("");
    const [StudentName, setStudentName] = useState("");
    const [StudentID, setStudentID] = useState("");
    const [ParentEmail, setParentEmail] = useState("");
    const [ParentPhoneNumber, setParentPhoneNumber] = useState("");
    const [OEM, setOEM] = useState("");
    const [SerialNumber, setSerialNumber] = useState("");
    const [AssetTag, setAssetTag] = useState("");
    const [Building, setBuilding] = useState("");
    const [Grade, setGrade] = useState("");
    // form input fields end


    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 80;
            $(".GridBox").css('height', finalHeight);
            if (width <= 993) {
                $(".RocketImgClass").addClass('d-none');
            }
            CheckUrl();

        };
    }, []);
    const CheckUrl = () => {
        var PathName = window.location.pathname;
        var pathsplit = PathName.split('/');
        var prodActive = pathsplit[2];
        if (prodActive == "add-inventory") {
            ShowAddUpdatediv();
        } else if (prodActive == "update-inventory") {
            // showupdatediv();
        }
        else {
            GetListOfDevices(1);
        }
    }
    const ShowAddUpdatediv = () => {
        $("#Overlay").show();
        $("#LoderId").show();
        $("#GridDiv").addClass('d-none');
        $("#AddImportBtnDiv").addClass('d-none');
        $("#AddUpdateDiv").removeClass('d-none');
        $("#Overlay").hide();
        $("#LoderId").hide();
    }
    const GetListOfDevices = async (page) => {
        $("#Overlay").show();
        $("#LoderId").show();
        await ApiGetCall("/getInventories/1?page=" + page).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                console.log(responseRs);
                if (responseRs.response == "success") {
                    $(".RocketImgClass").addClass('d-none');
                    $("#DeviceDetailsDiv").addClass('d-none');
                    var total = responseRs.msg.total;
                    var count = total > 0 ? total : 1;
                    var Divide = Math.ceil(count / 8);
                    setTotalPages(Divide);
                    $(".PaginationClass").removeClass("ActivePagination");
                    $("#ActiveId_" + page).addClass("ActivePagination");
                    setAllDevices(responseRs.msg.data);
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
    const AddInventory = (url) => {
        var PathName = window.location.pathname;
        var FinalUrl = PathName + url;
        window.location.href = FinalUrl;
    }
    const SaveInventory = async() => {
        var userid = parseInt(cookies.get('CsvUserId'));
        var isFormValid = CheckValidation("AddInventoryForm");
        if ($('input[name="ParentalCoverage"]:checked').length == 0) {
            $("#RadioButtonRequired").css('display', 'block');
            isFormValid = false;
        }
        if (!isFormValid) return;
        $("#RadioButtonRequired").css('display', 'none');
        $("#Overlay").show();
        $("#LoderId").show();
        var parentalCoverage = 0;
        var devicemodel = $("#DeviceModel option:selected").val();
        var osmodel = $("#OS option:selected").val();
        // var usercsvnumver = "csv_" + userid + "_2";
        // if($("#ParentalCoverageYes").is(":checked")){
        //     parentalCoverage = 1;
        // }
        // var raw = JSON.stringify({
        //     PurchaseDate : PurchaseDate,
        //     OemWarrantyUntil : OEMWarrantyUntil,
        //     ExtendedWarrantyUntil : ExtendedWarrantyUntil,
        //     ADPCoverage : ADPCoverage,
        //     StudentName : StudentName,
        //     StudentID : StudentID,
        //     ParentEmail : ParentEmail,
        //     ParentPhoneNumber : ParentPhoneNumber,
        //     ParentalCoverage : parentalCoverage,
        //     OEM : OEM,
        //     DeviceModel : devicemodel,
        //     OS : osmodel,
        //     SerialNumber : SerialNumber,
        //     AssetTag : AssetTag,
        //     Building : Building,
        //     Grade : Grade,
        //     schoolId : 1,
        //     userId : userid,
        //     usercsvnum:"csv_10_2"
        // });
        // await ApiPostCall("/addmanualInventoy", raw).then((result) => {
        //     if (result == undefined || result == "") {
        //         alert("Something went wrong");
        //     } else {
        //         console.log(result)
        //         $("#Overlay").hide();
        //         $("#LoderId").hide();
        //         if (result == "success") {
        //             $(".alert-success").show();
        //             $("#AlertMsg").text("New Inventory Added Successfully.");
        //             setTimeout(function () {
        //                 window.location = "/manage-inventory";
        //             }, 1500);
        //         } else {
        //             $(".alert-danger").show();
        //             $("#AlertDangerMsg").text(result);
        //             setTimeout(function () {
        //                 $(".alert-danger").hide();
        //                 $("#AlertDangerMsg").text();
        //             }, 1500);
        //         }
        //     }
        // });
    }
    const CancelClick = () =>{
        window.location.href = "/manage-inventory";
    }
    return (
        <>
            <div className='row col-12'>
                <div className='col-md-6'>
                    <h1 className="PageHeading">Manage Inventory</h1>
                </div>
                <div className='col-md-6 mb-2 pe-0 text-end d-flex justify-content-end align-items-center' id="AddImportBtnDiv">
                    <a href='/importexport-inventory' className='BlackFont cursor-pointer'><label className='BorderBtn ms-3'> Import Inventory
                        <img src='/images/ImportInventory.svg' className='img-fluid ps-2' />
                    </label></a>
                    <label className='BorderBtn ms-3' onClick={(e) => AddInventory("/add-inventory")}> Add Inventory
                        <img src='/images/AddInventory.svg' className='img-fluid ps-2' />
                    </label>
                </div>
            </div>
            <div className="container-fluid px-0" id="GridDiv">
                <div className="GridBox">
                    <div className="container  ps-3">
                        <div className='row pt-4 d-flex align-items-center'>
                            <div className='col-md-4 mt-2'>
                                <form className="gridsearchbar">
                                    <div className="position-absolute top-50 translate-middle-y search-icon ms-3 searchIcon"><i className="bi bi-search"></i></div>
                                    <input className="form-control" type="text" placeholder="Search A Specific Device" />
                                </form>
                            </div>
                            <div className='col-md-6 mt-2'>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                    <label className="form-check-label ps-1" htmlFor="flexCheckDefault">
                                        Decommissioned
                                    </label>
                                </div>
                            </div>
                            <div className='col-md-2 text-end mt-2'>
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
                                        <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                    </div>
                                    <table className="table innerGridBox" style={{ overflow: "scroll" }}>
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
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div><i class="bi bi-caret-left-fill"></i></div>
                                        <div className="mx-3 d-flex justify-content-center align-items-center">
                                            {[...Array(TotalPages)].map((x, i) =>
                                                <span className="PaginationClass" id={`ActiveId_${i + 1}`} key={i} onClick={(e) => GetListOfDevices(i + 1)}>{i + 1}</span>
                                            )}
                                        </div>
                                        <div><i class="bi bi-caret-right-fill"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='col-12 greyBox d-none' id="DeviceDetailsDiv">
                                    <div className='Header row align-items-center'>
                                        <div className='col-md-11'>
                                            <b className='font-16'>Devices Details</b><br />
                                        </div>
                                        <div className='col-md-1 text-end'>
                                            <img src='/images/EditIcon.svg' className='img-fluid' title='Update Inventory' />
                                        </div>
                                        <div className='col-12'>
                                            <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                        </div>
                                    </div>
                                    <div className='DeviceDetailBox' style={{ overflowY: "scroll", overflowX: "hidden", height: "290px" }}>
                                        <div className='row p-2'>
                                            <div className='col-5'>ID </div>
                                            <div className='col-7'>:  {DeviceDetails.ID}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Purchase Date </div>
                                            <div className='col-7'>:  {DateFormat(DeviceDetails.Purchase_date)}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>OEM Warranty Until </div>
                                            <div className='col-7'>: {DateFormat(DeviceDetails.OEM_warranty_until)}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Extended Warranty Until </div>
                                            <div className='col-7'>: {DateFormat(DeviceDetails.Extended_warranty_until)}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>ADP Coverage </div>
                                            <div className='col-7'>: {DateFormat(DeviceDetails.ADP_coverage)}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>OEM </div>
                                            <div className='col-7'>: {DeviceDetails.OEM}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Device Model </div>
                                            <div className='col-7'>: {DeviceDetails.Device_model}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>OS </div>
                                            <div className='col-7'>: {DeviceDetails.OS}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Serial Number </div>
                                            <div className='col-7'>: {DeviceDetails.Serial_number}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Asset Tag </div>
                                            <div className='col-7'>: {DeviceDetails.Asset_tag}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Building </div>
                                            <div className='col-7'>: {DeviceDetails.Building}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Grade </div>
                                            <div className='col-7'>: {DeviceDetails.Grade}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Student Name</div>
                                            <div className='col-7'>: {DeviceDetails.Student_name}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Student ID </div>
                                            <div className='col-7'>: {DeviceDetails.Student_ID}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Parent Email </div>
                                            <div className='col-7'>: {DeviceDetails.Parent_email}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Parent Phone Number </div>
                                            <div className='col-7'>: {DeviceDetails.Parent_phone_number}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Parental Coverage </div>
                                            <div className='col-7'>: {DeviceDetails.Parental_coverage}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Repair Cap </div>
                                            <div className='col-7'>: {DeviceDetails.Repair_cap}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Created At </div>
                                            <div className='col-7'>: {DateFormat(DeviceDetails.created_at)}</div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-5'>Updated At </div>
                                            <div className='col-7'>: {DateFormat(DeviceDetails.updated_at)}</div>
                                        </div>
                                    </div>
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

            {/* AddUpdate Inventory */}
            <div className='d-none' id="AddUpdateDiv">
                <div className="GridBox p-3">
                    <div className='greyBox '>
                        <div className='Header'>
                            <b className='font-16'>Add New Inventory</b><br />
                            <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                        </div>
                        <div id='AddInventoryForm'>
                            <div className='row p-2 justify-content-between'>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Purchase Date</div>
                                    <div className='col-md-7'>
                                        <input type="date" name='PurchaseDate' className="form-control" required value={PurchaseDate}
                                            onChange={(e) => setPurchaseDate(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>OEM Warranty Until</div>
                                    <div className='col-md-7'>
                                        <input type="date" name='OemWarrantyUntil' className="form-control" required value={OEMWarrantyUntil}
                                            onChange={(e) => setOEMWarrantyUntil(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Extended Warranty Until</div>
                                    <div className='col-md-7'>
                                        <input type="date" name='ExtendedWarrantyUntil' className="form-control" required value={ExtendedWarrantyUntil}
                                            onChange={(e) => setExtendedWarrantyUntil(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>ADP Coverage</div>
                                    <div className='col-md-7'>
                                        <input type="date" name='ADPCoverage' className="form-control" required value={ADPCoverage}
                                            onChange={(e) => setADPCoverage(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-12 text-center pt-2'>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                            </div>
                            <div className='row p-2 justify-content-between'>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Student Name </div>
                                    <div className='col-md-7'>
                                        <input type="text" name='StudentName' className="form-control" required value={StudentName}
                                            onChange={(e) => setStudentName(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Student ID</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='StudentID' className="form-control" required value={StudentID}
                                            onChange={(e) => setStudentID(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Parent / Guardian Email</div>
                                    <div className='col-md-7'>
                                        <input type="email" name='ParentEmail' className="form-control" required value={ParentEmail}
                                            onChange={(e) => setParentEmail(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Parent Phone Number</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='ParentPhoneNumber' className="form-control" required value={ParentPhoneNumber}
                                            onChange={(e) => setParentPhoneNumber(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 pt-3 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Parental Coverage</div>
                                    <div className='col-md-7 d-flex'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name='ParentalCoverage' id="ParentalCoverageYes" />
                                            <label className="form-check-label">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check ms-5">
                                            <input className="form-check-input" type="radio" name='ParentalCoverage' id="ParentalCoverageNo" />
                                            <label className="form-check-label">
                                                No
                                            </label>
                                        </div>
                                        <span className="form-text invalid-feedback" id="RadioButtonRequired">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-12 text-center pt-2'>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                            </div>
                            <div className='row p-2 justify-content-between'>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>OEM</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='OEM' className="form-control" required value={OEM}
                                            onChange={(e) => setOEM(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center'>
                                    <div className='col-md-5 FormLabel'>Device Model</div>
                                    <div className='col-md-7'>
                                        <select id="DeviceModel" required name="DeviceModel">
                                            <option value="0">Select Device Model</option>
                                            <option value="Name">Name</option>
                                            <option value="Date">Date</option>
                                        </select>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>OS</div>
                                    <div className='col-md-7'>
                                        <select id="OS" required name='OS'>
                                            <option value="0">Select OS</option>
                                            <option value="Name">Name</option>
                                            <option value="Date">Date</option>
                                        </select>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Serial Number</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='SerialNumber' className="form-control" required value={SerialNumber}
                                            onChange={(e) => setSerialNumber(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Asset Tag</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='AssetTag' className="form-control" required value={AssetTag}
                                            onChange={(e) => setAssetTag(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Building</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='Building' className="form-control" required value={Building}
                                            onChange={(e) => setBuilding(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-6 row align-items-center pt-2'>
                                    <div className='col-md-5 FormLabel'>Grade</div>
                                    <div className='col-md-7'>
                                        <input type="text" name='Grade' className="form-control" required value={Grade}
                                            onChange={(e) => setGrade(e.target.value)}/>
                                        <span className="form-text invalid-feedback">
                                            *required
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 text-center pt-4'>
                            <button className='SaveBtn' onClick={SaveInventory}>Save Inentory</button>
                            <label className='ms-2 cursor-pointer' onClick={CancelClick}>Cancel</label>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}