"use server";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(email: string, password: string) {
    const user = await auth.api.signUpEmail({
        body: {
            name: email.split("@")[0],
            email,
            password,
        },
    })
    return user
}


export async function login(email: string, password: string) {
   await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    })
}

export async function signOutUser() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}


export async function getUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session
}
