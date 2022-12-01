import { Cookies } from 'react-cookie';
import { useMsal } from "@azure/msal-react";
export function Logout(){
    const cookies = new Cookies();
    const { instance } = useMsal();
    instance.logoutRedirect();
    cookies.remove('accesstoken');
    cookies.remove('emailid');
    window.location = "/";
}