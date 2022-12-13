import $ from 'jquery';
import Cookies from 'js-cookie';
import { ShowLoder , HideLoder } from './Common';
const BaseUrl = process.env.REACT_APP_Base_URL;
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Access-Control-Allow-Origin", "*");
export function ApiGetCall(endpoint) {
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };
    return fetch(`${BaseUrl}${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => { return result })
        .catch((error) => { return error });
}
export function ApiPutCall(endpoint, payload) {
    var urlencoded = payload;
    var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
    };
    return fetch(`${BaseUrl}${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => { return result })
        .catch((error) => { return error });
}
export function ApiDeleteCall(endpoint, payload) {
    var urlencoded = payload;
    var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
    };
    return fetch(`${BaseUrl}${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => { return result })
        .catch((error) => { return error });
}
export function ApiPostCall(endpoint, payload) {
    var urlencoded = payload;
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
    };
    return fetch(`${BaseUrl}${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => { return result })
        .catch((error) => { return error });
}
export function VerifyToken(endpoint){
    var accesstoken = Cookies.get('accesstoken');
    var emailid = Cookies.get('emailid');
    ShowLoder();
    var raw = JSON.stringify({
      email: emailid,
      accessToken: accesstoken
    });
    ApiPostCall("/loginValidation", raw).then((result) => {
      if (result == undefined || result == "") {
          $(".alert-danger").show();
          $("#AlertDangerMsg").text('Login Failed!');
          setTimeout(function () {
              $(".alert-danger").hide();
              $("#AlertDangerMsg").text();
          }, 1500);
      } else {
          const responseRs = JSON.parse(result);
          if (responseRs.status == "success") {
            Cookies.set('CsvUserId', responseRs.msg.id);
            endpoint();
          }else{
            window.location = "/";
          }
      }
     
  });
  HideLoder();
}
