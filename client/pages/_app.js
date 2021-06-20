import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
const AppComponent = ({ Component, pageProps, currentUser }) => {
   return (
      <div>
         <Component {...pageProps} />;
      </div>
   );
};

AppComponent.getInitialPageProps = async (appContext) => {
   const client = buildClient(appContext.ctx);
   const { data } = await client.get("/api/users/currentuser");
   let pageprops = {};
   if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
   }

   return {
      pageProps,
      ...data,
   };
};

export default AppComponent;