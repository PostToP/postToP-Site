import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function RegisterForm() {
    const {register} = useContext(AuthContext);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            await register(username, password);
            console.log("Login successful");
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit} method="post">
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    );
}
