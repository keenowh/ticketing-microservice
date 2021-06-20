import axios from "axios";

export default buildClient = ({ req }) => {
   if (typeof window === "undefined") {
      // we are on the server
      return axios.create({
         baseURL: "http://ingress-nginx.ingress-nginx.svc.cluster.local",
         headers: req.headers,
      });
   } else {
      // We are in the browser
      return axios.create({
         baseURL: "/",
      });
   }
};
