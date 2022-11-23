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

function App() {
  const clientId = "646628515848-m5a6l1kqaqb8pvqih00omv1mjr11iq4v.apps.googleusercontent.com";
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
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/test" element={<Temp />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
