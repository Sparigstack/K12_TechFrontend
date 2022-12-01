import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { BrowserRouter } from 'react-router-dom';
import { ApiPostCall } from './JS/Connector';
import $ from 'jquery';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();
const pca = new PublicClientApplication({
  auth: {
    clientId: "c78b6413-319a-4267-b7d0-2d3402cf88cf",
    authority: "https://login.microsoftonline.com/d984a495-9d28-40f5-8eba-8fd50d652757", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: "/",
  },
});

pca.addEventCallback(event => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    var payloadData = event.payload;
    pca.setActiveAccount(event.payload.account);
    var raw = JSON.stringify({
      name: payloadData.account.name,
      email: payloadData.account.username,
      googleId: null,
      microsoftId: payloadData.uniqueId,
      accessToken: payloadData.accessToken,
      flag: 2
    });
    ApiPostCall("/register", raw).then((result) => {
      if (result == undefined || result == "") {
        $(".alert-danger").show();
        $("#AlertDangerMsg").text('Login Failed!');
        setTimeout(function () {
          $(".alert-danger").hide();
          $("#AlertDangerMsg").text();
        }, 1500);
      } else {
        const responseRs = JSON.parse(result);
        cookies.set('accesstoken', payloadData.accessToken);
        cookies.set('emailid', payloadData.account.username);
        if (responseRs.status == "success") {
          $(".alert-success").show();
          $("#AlertMsg").text("Login Successfully.");
          setTimeout(function () {
            window.location = "/dashboard";
          }, 1500);
        }
      }
      $("#Overlay").hide();
      $("#LoderId").hide();
    });
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App msalInstance={pca} />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
