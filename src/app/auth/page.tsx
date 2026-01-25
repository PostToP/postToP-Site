"use client";

import LoginForm from "@/components/Form/LoginForm";
import RegisterForm from "@/components/Form/RegisterForm";
import { useState } from "react";


export default function Page() {
    const [isLogin, setIsLogin] = useState(true);
    return <>
        <div>Login Page</div>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Go to Register" : "Go to Login"}
        </button >
    </>;
}