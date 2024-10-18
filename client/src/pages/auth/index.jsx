import Background from "@/assets/login2.png";
import Victory from "@/assets/download.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

function Auth() {

  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");


  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email Is required");
      return false
    }
    if (!password.length) {
      toast.error("Password Is required ");
      return false
    }
    return true;

  }

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email Is required");
      return false
    }
    if (!password.length) {
      toast.error("Password Is required ");
      return false
    }

    if (password !== conformPassword) {
      toast.error("Password And ConformPassword should be Same .");
      return false
    }
    return true;
  }

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(
        LOGIN_ROUTE, { email, password },
        { withCredentials: true }
      );
      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) navigate('/chat')
        else navigate('/profile')
      }
      console.log(response);
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE, { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo(response.data.user);
        navigate("/profile")
      }
      console.log(response);
    }
  };
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center p-8">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center mb-10">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img
                src={Victory}
                alt="Vicotry Emoji"
                className=" p-3 h-[100px] w-full object-contain"
              />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs
              className="w-3/4"
              defaultValue="login"
            >
              <TabsList className="bg-transparent rounded-none w-full ">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 tall
                   duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 tall
                   duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-2 mt-5" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="Password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="Password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="Password"
                  className="rounded-full p-6"
                  value={conformPassword}
                  onChange={(e) => setConformPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center overflow-hidden">
          <img
            src={Background}
            alt="Background login"
            className="h-full max-h-[700px] max-w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Auth;