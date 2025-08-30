"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

type SignUpProps = {
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export function SignUp({ setLoggedInUser }: SignUpProps) {
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data } = await axios.post("http://localhost:3030/signup", {
        email,
        password,
      });

      setLoggedInUser(data.email);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign up to your account</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              name="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" />
          </div>
          <Button type="submit" className="w-full mt-4" size={"lg"}>
            Sign up
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
