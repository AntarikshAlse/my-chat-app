import "../styles/style.scss";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import UserContext from "../lib/UserContext";
import { supabase, fetchUserRoles } from "../lib/Store";

export default function NextChat({ Component, pageProps }) {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [prevEvent, setPrevEvent] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setAccessToken(session?.access_token);
        const currentUser = session?.user;
        setUser(currentUser);
        setUserLoaded(session ? true : false);
        if (session?.user) {
          signIn();
          router.push("/channels/[id]", "/channels/1");
        } else if (error) {
          console.log("🚀 ~ file: _app.jsx:31 ~ useEffect ~ error", error);
        }
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== accessToken) {
        setAccessToken(session?.access_token);
        const currentUser = session?.user;
        setUser(currentUser);
        if (currentUser) {
          signIn(currentUser.id, currentUser.email);
          router.push("/channels/[id]", "/channels/1");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [accessToken]);
  const signIn = async () => {
    await fetchUserRoles((userRoles) =>
      setUserRoles(userRoles.map((userRole) => userRole.role))
    );
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  };
  const value = {
    userLoaded,
    user,
    userRoles,
    signIn,
    signOut,
  };
  return (
    <UserContext.Provider value={value}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
