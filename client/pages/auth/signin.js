import Router from "next/router";
import { useState } from "react";
import useRequest from "../../hooks/use-request";

export default () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [doRequest, errors] = useRequest({
      url: "/api/users/signin",
      method: "post",
      body: {
         email,
         password,
      },
      onSuccess: () => {
         Router.push("/");
      },
   });
   const onSubmit = async (event) => {
      event.preventDefault();

      await doRequest();
   };

   return (
      <form onSubmit={onSubmit}>
         <h1>Sign In</h1>
         <div className="form-group">
            <label htmlFor="">Email Address</label>
            <input
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="form-control"
               type="email"
            />
         </div>
         <div className="form-group">
            <label htmlFor="">Password</label>
            <input
               className="form-control"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               type="password"
            />
         </div>
         {errors}
         <button className="btn btn-primary">Sign In</button>
      </form>
   );
};
