"use server";

import { revalidatePath } from "next/cache";

export async function createSuperhero(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name?.trim()) {
    throw new Error("Name is required");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/super-heroes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to create superhero");
  }
  revalidatePath("/dashboard");

  return res.json();
}
