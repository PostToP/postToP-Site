"use client";

import {authClient} from "@/utils/auth";

export default function Page() {
  function handleLoginSubmit() {
    authClient.signIn.social({
      provider: "google",
      scopes: ["openid", "email", "profile", "https://www.googleapis.com/auth/youtube.readonly"],
      callbackURL: "/",
    });
  }

  return (
    <>
      <div>Login Page</div>
      <button type="button" onClick={handleLoginSubmit}>
        Sign in with Google
      </button>
    </>
  );
}
