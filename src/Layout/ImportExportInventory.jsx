import { useEffect, useRef } from "react";
import $ from 'jquery';
import { ApiGetCall } from '../JS/Connector';
import { useState } from "react";
import Cookies from 'js-cookie';
import { ShowLoder, HideLoder } from "../JS/Common";
import { CSVLink } from "react-csv";
import { MMDDYYYY } from "../JS/Common";
export function ImportExportInventory() {
    const [CsvData, setCsvData] = useState([]);
    const headers = [
        { label: "ID", key: "ID" },
        { label: "Device_manufacturer", key: "Device_manufacturer" },
        { label: "Device Type", key: "Device_Type" },
        { label: "Manufacturer_warranty_until", key: "Manufacturer_warranty_until" },
        { label: "Manufacturer_ADP_until", key: "Manufacturer_ADP_until" },
        { label: "Third_party_extended_warranty_until", key: "Third_party_extended_warranty_until" },
        { label: "Third_party_ADP_until", key: "Third_party_ADP_until" },
        { label: "Expected_retirement", key: "Expected_retirement" },
        { label: "Loaner_device", key: "Loaner_device" },
        { label: "Device_user_first_name", key: "Device_user_first_name" },
        { label: "Device_user_last_name", key: "Device_user_last_name" },
        { label: "Student_ID", key: "Student_ID" },
        { label: "Grade/Department", key: "Grade" },
        { label: "Device_model", key: "Device_model" },
        { label: "Device_MPN", key: "Device_MPN" },
        { label: "Serial_number", key: "Serial_number" },
        { label: "Asset_tag", key: "Asset_tag" },
        { label: "Purchase_date", key: "Purchase_date" },
        { label: "Building", key: "Building" },
        { label: "User_type", key: "User_type" },
        { label: "Parent_guardian_name", key: "Parent_guardian_name" },
        { label: "Parent_Guardian_Email", key: "Parent_guardian_Email" },
        { label: "Parent_phone_number", key: "Parent_phone_number" },
        { label: "Parental_coverage", key: "Parental_coverage" },
        { label: "Repair_cap", key: "Repair_cap" },
        { label: "inventory_status", key: "inventory_status" },
        { label: "created_at", key: "created_at" },
        { label: "updated_at", key: "updated_at" },
        { label: "Device_os", key: "Device_os" }
    ];
    const csvReport = {
        filename: 'Inventory.csv',
        headers: headers,
        data: CsvData
    };
    var SchoolId = 1;
    const BaseUrl = process.env.REACT_APP_Base_URL;
    var CsvUserId = parseInt(Cookies.get('CsvUserId'));
    const fileRef = useRef();
    useEffect(() => {
        return () => {
            const height = window.innerHeight;
            const navbarheight = $(".navbar").height();
            var finalHeight = height - navbarheight - 90;
            $(".GridBox").css('height', finalHeight);
        };
    }, []);
    function ImportCSV(e) {
        e.preventDefault();
        const fileInput = fileRef.current;
        const files = fileInput.files[0];
        const filename = files.name;
        var extension = filename.split('.').pop();
        if (extension == "csv") {
            $("#ImportInventoryText").text(filename);
            $("#ImportInventoryText").css('color', 'green');
        } else {
            $("#ImportInventoryText").text('Upload only csv file.');
            $("#ImportInventoryText").css('color', 'red');
        }
        var formdata = new FormData();
        formdata.append("file", files);
        formdata.append("ID", CsvUserId);
        formdata.append("schId", SchoolId);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        fetch(`${BaseUrl}/upload`, requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("CSV imported Successfully.");
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500);
                } else {
                    $(".alert-danger").show();
                    $("#AlertDangerMsg").text(result);
                    setTimeout(function () {
                        $(".alert-danger").hide();
                        $("#AlertDangerMsg").text();
                    }, 1500);
                }
            })
            .catch(error => console.log('error', error));

    }
    const ExportInventory = async () => {
        ShowLoder();
        await ApiGetCall("/getInventories/" + SchoolId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var msgdata = responseRs.msg;
                // for (var i = 0; i < msgdata.length; i++) {
                //     msgdata[i].Expected_retirement = MMDDYYYY(msgdata[i].Expected_retirement);
                //     msgdata[i].Manufacturer_ADP_until = MMDDYYYY(msgdata[i].Manufacturer_ADP_until);
                //     msgdata[i].Manufacturer_warranty_until = MMDDYYYY(msgdata[i].Manufacturer_warranty_until);
                //     msgdata[i].Purchase_date = MMDDYYYY(msgdata[i].Purchase_date);
                //     msgdata[i].Third_party_ADP_until = MMDDYYYY(msgdata[i].Third_party_ADP_until);
                //     msgdata[i].Third_party_extended_warranty_until = MMDDYYYY(msgdata[i].Third_party_extended_warranty_until);
                //     msgdata[i].created_at = MMDDYYYY(msgdata[i].created_at);
                //     msgdata[i].updated_at = MMDDYYYY(msgdata[i].updated_at);
                // }
                setCsvData(msgdata);
                $("#ExportedFileDiv").removeClass('d-none');
                HideLoder();
            }
        });
    }
    const ExportDecommissionedInventory = async () => {
        ShowLoder();
        await ApiGetCall("/getInventories/" + SchoolId).then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var msgdata = responseRs.decommisionInvenoty;
                setCsvData(msgdata);
                $("#ExportedFileDiv").removeClass('d-none');
                HideLoder();
            }
        });
    }
    const RemoveCsv = () => {
        setCsvData([]);
        $("#ExportedFileDiv").addClass('d-none');
    }
    return (
        <>
            <div>
                <div className='row col-12 d-flex align-items-center'>
                    <h1 className="PageHeading">Import/Export Inventory</h1>
                </div>
                <div className='GridBox mt-2 p-5' id='GridDiv'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className="greyBox">
                                <div className='row d-flex align-items-center p-1'>
                                    <span className='GridTitle'>Import Inventory</span>
                                </div>
                                <div className='col-12'>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className="p-2">
                                    <p className="text-justify">
                                        To ensure inventory and data accuracy please download our templated CSV file and ensure your columns match the template before you import your inventory into the system. <a href="/inventory_managementcsv.csv" style={{ color: "#04ADFD", fontWeight: "600" }}>CLICK HERE</a> to download the template CSV file.
                                    </p>
                                    <div className="row pt-4">
                                        <div className="col-12 px-0">
                                            <form onSubmit={ImportCSV}>
                                                <input type="file" ref={fileRef} name="upload_file" id="UploadFileId" accept='.csv' />
                                                <label className='ImportInventoryBtn' for="UploadFileId"> Import Inventory
                                                    <img src='/images/ImportInventory.svg' className='img-fluid ps-2' />
                                                </label>
                                                <input type="submit" value="Upload" className='UploadBtn' />
                                                <label id="ImportInventoryText" ></label>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="greyBox">
                                <div className='row d-flex align-items-center p-1'>
                                    <span className='GridTitle'>Export Inventory</span>
                                </div>
                                <div className='col-12'>
                                    <img src='/images/HorizontalLine.svg' className='img-fluid w-100' />
                                </div>
                                <div className="p-2">
                                    <p className="text-justify">
                                        Want to export your inventory? For active inventory click on the “export active inventory” button. For decommissioned inventory click on the “export decommissioned inventory” button below
                                    </p>
                                    <div className="row pt-4 px-3">
                                        <div className="col-12 px-0">
                                            <label className='BorderBtn' onClick={ExportInventory}>Export Active Inventory
                                                <img src='/images/ExportInventory.svg' className='img-fluid ps-2' />
                                            </label>
                                        </div>
                                        <div className="col-12 px-0 pt-2">
                                            <label className='BorderBtn' onClick={ExportDecommissionedInventory}>Export Decommissioned Inventory
                                                <img src='/images/ExportInventory.svg' className='img-fluid ps-2' />
                                            </label>
                                        </div>

                                        <div className='row align-items-center pe-0 pt-2 d-none' id="ExportedFileDiv">
                                            <div className="col-md-7">
                                                <label style={{ fontSize: "12px", color: "#04ADFD" }} id="ExportedFileName">
                                                    Inventory.csv
                                                </label>
                                            </div>
                                            <div className="text-end col-md-5 pe-0">
                                                <button className='SaveBtn'><CSVLink {...csvReport} className="WhiteFont">Download</CSVLink></button>
                                                <img src="/images/CloseCsvIcon.svg" className="cursor-pointer img-fluid ps-3" onClick={RemoveCsv} />
                                            </div>
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