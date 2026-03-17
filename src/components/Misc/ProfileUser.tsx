import {useEffect, useState} from "react";
import UserBackend from "@/utils/Backend/UserBackend";
import Card from "../Card/Card";

export default function ProfileUser({user_handle}: {user_handle?: string}) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function fetchUser() {
            if (user_handle) {
                const res = await UserBackend.getUserInfo(user_handle);
                if (res.ok) {
                    setUser(res.data);
                } else {
                    console.error("Error fetching user info:", res.error);
                }
            }
        }
        fetchUser();
    }, [user_handle]);

    if (!user) {
        return <div>Loading user info...</div>;
    }

    return (
        <Card>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-text-secondary">Handle: {user.handle}</p>
            <p className="text-text-secondary">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        </Card>
    );
}
