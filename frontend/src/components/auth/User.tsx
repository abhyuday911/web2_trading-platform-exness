"use client";

import React, { useEffect, useState } from "react";
import { SignUp } from "./Signup";
import { SignIn } from "./Signin";
import axios from "axios";
axios.defaults.withCredentials = true;

const User = () => {
  const [loggedInUser, setLoggedInUser] = useState<null | User>(null);

  useEffect(() => {
    setLoggedInUser(null)
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:3030/api/me");
        setLoggedInUser(data);

        console.log("16 data", data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  if (loggedInUser) {
    return (
      <div className="flex w-full justify-between p-2">
        <h1 className="text-green-600">USD: {loggedInUser.balance.usd}</h1>
        <h1>{loggedInUser.email}</h1>
      </div>
    );
  }

  return (
    <>
      <SignUp setLoggedInUser={setLoggedInUser} />
      <SignIn />
    </>
  );
};

export default User;
