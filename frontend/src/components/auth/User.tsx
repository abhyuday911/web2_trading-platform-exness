"use client";

import React, { useEffect, useState } from "react";
import { SignUp } from "./Signup";
import { SignIn } from "./Signin";
import axios from "axios";
axios.defaults.withCredentials = true;

const User = () => {
  const [loggedInUser, setLoggedInUser] = useState<null | User>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:3030/api/me");
        setLoggedInUser(data);

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log(loggedInUser);
  });

  if (loggedInUser) {
    return (
      <div className="flex w-full justify-between p-2">
        <h1 className="text-green-600">USD: $30,000</h1>
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
