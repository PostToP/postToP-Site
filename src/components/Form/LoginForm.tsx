import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function LoginForm() {
    const { login } = useContext(AuthContext);


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            await login(username, password);
            console.log("Login successful");
            window.location.href = "/";
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit} method="post">
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
}