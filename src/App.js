import './index.js';
import './App.css';
import { Login } from './Layout/Login';
import './Styles/Common.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import { Temp } from './Layout/Temp';
import Layout from './Components/Layout';
import Cookies from 'js-cookie';
import { ManageInventory } from './Layout/ManageInventory';
import { Logout } from './Layout/Logout';
import { MsalProvider } from "@azure/msal-react";
import { ErrorPage } from './Layout/404.jsx';
// import { DeviceType } from './Layout/DeviceType.jsx';
// import { OsModel } from './Layout/OsModel.jsx';
import { ImportExportInventory } from './Layout/ImportExportInventory.jsx';
import { CreateTicket } from './Layout/CreateTicket.jsx';
import { ManageTicket } from './Layout/ManageTicket.jsx';
import './JS/Connector.js';
import './JS/Common.js';
function App({ msalInstance }) {
  var accesstoken = Cookies.get('accesstoken');
  const clientId = process.env.REACT_APP_ClientId;
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);

  }, []);
  return (
    <MsalProvider instance={msalInstance}>
        {accesstoken != null ?
          <Layout>
            <Routes>
              <Route path="*" element={<ErrorPage />} />
              <Route path="/" element={<Temp />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/dashboard" element={<Temp />} />
              <Route path="/manage-inventory/*" element={<ManageInventory />} />
              {/* <Route path="/device-type" element={<DeviceType />} /> */}
              {/* <Route path="/os-model" element={<OsModel />} /> */}
              <Route path="/importexport-inventory" element={<ImportExportInventory />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/manage-tickets/*" element={<ManageTicket />} />
            </Routes>
          </Layout>
          :
          <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<Login />} />
          </Routes>
        }
    </MsalProvider>
  )
}


export default App;
