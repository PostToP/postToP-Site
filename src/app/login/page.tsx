"use client";

async function sendLoginRequest(username: string, password: string) {
    const address = process.env.SERVER || "localhost:8000";
    const url = `http://${address}/auth`;
    const body = JSON.stringify({
        username: username,
        password: password,
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body,
    })
    if (!res.ok) {
        throw new Error("Login failed: " + res.statusText);
    }
    const data = await res.json();

    localStorage.setItem("authToken", data.token);
    return data;
}


export default function Page() {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        sendLoginRequest(username, password)
            .then(data => {
                console.log("Login successful:", data);
                window.location.href = "/";
            })
            .catch(error => {
                console.error("Login error:", error);
            });
    }



    return <>
        <div>Login Page</div>
        <form onSubmit={handleSubmit} method="post">
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    </>;
}