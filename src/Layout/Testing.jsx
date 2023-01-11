import { useEffect } from "react";
import $ from 'jquery';
import { ApiGetCallWithoutHeaders } from "../JS/Connector";
import { useState } from "react";
export function Test() {
    const [test, setAllDevicesIssues] = useState([]);
    useEffect(() => {
        // return () => {
        // GetDeviceIssues();
        // };
    }, []);
    // const GetDeviceIssues = async () => {
    //     await ApiGetCallWithoutHeaders("/allDeviceIssue").then((result) => {
    //         console.log(result);
    //         if (result == undefined || result == "") {
    //             alert("Something went wrong");
    //         } else {
    //             const responseRs = JSON.parse(result);
    //             var sugData = responseRs.msg;
    //             if (responseRs.response == "success") {
    //                 setAllDevicesIssues(sugData);
    //             } else {
    //                 $(".alert-danger").show();
    //                 $("#AlertDangerMsg").text(responseRs.message);
    //                 setTimeout(function () {
    //                     $(".alert-danger").hide();
    //                     $("#AlertDangerMsg").text();
    //                 }, 1500);
    //             }
    //         }
    //     });
    // }
    return (
        <>
            <div className="mx-auto text-center col-12 p-4 VerticalTop">
                <h3>Dashboard is under development.</h3>
                <h5>
                    <a href="/manage-inventory">Click here</a> to go to Manage Inventories.
                </h5>
            </div>
            {/* {test.map((item, i) => {
                var returData;
                returData = (<label key={i}>
                    <td>{item.issue}</td>
                </label>
                );
                return returData;
            })} */}
        </>
    )
}