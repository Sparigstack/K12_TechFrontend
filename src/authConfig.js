export const msalConfig = {
    auth: {
      clientId: "c78b6413-319a-4267-b7d0-2d3402cf88cf",
      authority: "https://login.microsoftonline.com/d984a495-9d28-40f5-8eba-8fd50d652757", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: "/",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["User.Read"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/User.Read"
  };