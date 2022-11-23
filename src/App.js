import './App.css';
import { Login } from './Layout/Login';
import './Styles/Common.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import { Temp } from './Layout/Temp';
import Layout from './Components/Layout';
import Cookies from 'js-cookie';
function App() {
  const clientId = process.env.REACT_APP_ClientId;
  var token = Cookies.get('accesstoken');
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);
  });

  return (
    <Router>
      {token != null ?
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/test" element={<Temp />} />
          </Routes>
        </Layout>
        :
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      }
    </Router>
  );
}

export default App;
