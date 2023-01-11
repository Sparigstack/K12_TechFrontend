import { useEffect } from "react";
import $ from 'jquery';
import { ApiGetCallWithoutHeaders } from "../JS/Connector";
import { useState } from "react";
export function Test() {
    const [test, setAllDevicesIssues] = useState([]);
    useEffect(() => {
        // return () => {
            GetDeviceIssues();
        // };
    }, []);
    const GetDeviceIssues = async () => {
        await ApiGetCallWithoutHeaders("/allDeviceIssue").then((result) => {
            console.log(result);
            if (result == undefined || result == "") {
                alert("Something went wrong");
            } else {
                const responseRs = JSON.parse(result);
                var sugData = responseRs.msg;
                if (responseRs.response == "success") {
                    setAllDevicesIssues(sugData);
                } else {
                    $(".alert-danger").show();
                    $("#AlertDangerMsg").text(responseRs.message);
                    setTimeout(function () {
                        $(".alert-danger").hide();
                        $("#AlertDangerMsg").text();
                    }, 1500);
                }
            }
        });
    }
    return (
        <>
            {test.map((item, i) => {
                var returData;
                returData = (<label key={i}>
                    <td>{item.issue}</td>
                </label>
                );
                return returData;
            })}
        </>
    )
}