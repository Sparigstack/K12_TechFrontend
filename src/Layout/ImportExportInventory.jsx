import { useEffect, useRef } from "react";
import $ from 'jquery';
import { ApiGetCall } from '../JS/Connector';
import { useState } from "react";
import Cookies from 'js-cookie';
import { ShowLoder, HideLoder } from "../JS/Common";
import { CSVLink } from "react-csv";
export function ImportExportInventory() {
    const [CsvData, setCsvData] = useState([]);
    const headers = [
        {label : "ID",key : "ID"},
        {label : "Purchase_date",key : "Purchase_date"},
        {label : "OEM_warranty_until",key : "OEM_warranty_until"},
        {label : "Extended_warranty_until",key : "Extended_warranty_until"},
        {label : "ADP_coverage",key : "ADP_coverage"},
        {label : "OEM",key : "OEM"},
        {label : "Device_model",key : "Device_model"},
        {label : "OS",key : "OS"},
        {label : "Serial_number",key : "Serial_number"},
        {label : "Asset_tag",key : "Asset_tag"},
        {label : "Building",key : "Building"},
        {label : "Grade",key : "Grade"},
        {label : "Student_name",key : "Student_name"},
        {label : "Student_ID",key : "Student_ID"},
        {label : "Parent_email",key : "Parent_email"},
        {label : "Parent_phone_number",key : "Parent_phone_number"},
        {label : "Parental_coverage",key : "Parental_coverage"},
        {label : "Repair_cap",key : "Repair_cap"},
        {label : "created_at",key : "created_at"},
        {label : "updated_at",key : "updated_at"}
    ];
    const csvReport = {
        filename: 'Inventory.csv',
        headers: headers,
        data: CsvData
    };
    var SchoolId = 1;
    const BaseUrl = process.env.REACT_APP_Base_URL;
    const [UpdateFlag, setUpdateFlag] = useState(0);
    var CsvUserId = Cookies.get('CsvUserId');
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
        formdata.append("userid", CsvUserId);
        formdata.append("updateflag", UpdateFlag);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        fetch(`${BaseUrl}/upload`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                if (result == "success") {
                    $(".alert-success").show();
                    $("#AlertMsg").text("CSV imported Successfully.");
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500);
                }else{
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
        await ApiGetCall("/getInventories/"+SchoolId+"&null").then((result) => {
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                console.log(responseRs);
                var msgdata = responseRs.msg.data;
                setCsvData(msgdata);
                $("#ExportedFileDiv").removeClass('d-none');
                HideLoder();
            }
        });
    }
    const UpdateCsvFlag = () => {
        if ($("#UpdateCsv").is(":checked")) {
            setUpdateFlag(1);
        } else {
            setUpdateFlag(0);
        }
    }
    const RemoveCsv = () =>{
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
                                        First Import Inventory file and upload a file. If you want to update csv records then select Update CSV. Want to see an example?  <a href="/inventory_managementcsv.csv" style={{ color: "#04ADFD", fontWeight: "600" }}>Click here</a> to download a sample CSV file.
                                    </p>
                                    <div className="row pt-4">
                                        <div className="col-md-7 px-0">
                                            <form onSubmit={ImportCSV}>
                                                <input type="file" ref={fileRef} name="upload_file" id="UploadFileId" accept='.csv' />
                                                <label className='ImportInventoryBtn' for="UploadFileId"> Import Inventory
                                                    <img src='/images/ImportInventory.svg' className='img-fluid ps-2' />
                                                </label>
                                                <input type="submit" value="Upload" className='UploadBtn' />
                                                <label id="ImportInventoryText" ></label>
                                            </form>
                                        </div>
                                        <div className='col-md-5 pt-2'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="UpdateCsv" onChange={UpdateCsvFlag}/>
                                                <label className="form-check-label ps-1" htmlFor="UpdateCsv">
                                                    Update CSV
                                                </label>
                                            </div>
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
                                        Want to export csv? Click on Export Inventory. If you want to Including Decommission then select and export.You can download and remove csv file.
                                    </p>
                                    <div className="row pt-4 px-3">
                                        <div className="col-md-6 px-0">
                                            <label className='BorderBtn' onClick={ExportInventory}> Export Inventory
                                                <img src='/images/ExportInventory.svg' className='img-fluid ps-2' />
                                            </label>
                                        </div>
                                        <div className="col-md-6 px-0 pt-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="IncludingDecommission" />
                                                <label className="form-check-label ps-1" htmlFor="IncludingDecommission">
                                                    Including Decommission
                                                </label>
                                            </div>
                                        </div>
                                        <div className='row align-items-center pe-0 pt-2 d-none' id="ExportedFileDiv">
                                            <div className="col-md-7">
                                                <label style={{ fontSize: "12px", color: "#04ADFD" }} id="ExportedFileName">
                                                    Inventory.csv
                                                </label>
                                            </div>
                                            <div className="text-end col-md-5 pe-0">
                                                <button className='SaveBtn'><CSVLink {...csvReport} className="WhiteFont">Download</CSVLink></button>
                                                <img src="/images/CloseCsvIcon.svg" className="cursor-pointer img-fluid ps-3" onClick={RemoveCsv}/>
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