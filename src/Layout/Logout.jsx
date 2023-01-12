import { Cookies } from 'react-cookie';
import { useMsal } from "@azure/msal-react";
export function Logout(){
    const cookies = new Cookies();
    const { instance } = useMsal();
    cookies.remove('accesstoken');
    cookies.remove('emailid');
    cookies.remove('CsvUserId');
    cookies.remove('SchoolId');
    cookies.remove('G_AUTHUSER_H');
    instance.logoutRedirect();
  
    window.location = "/";
}