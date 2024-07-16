"use server";

import { z } from "zod";

const participantSchema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  email: z.string().email(),
});

export async function inviteParticipant(data: FormData, tripId: string) {
  let formData = Object.fromEntries(data);

  const parsed = participantSchema.safeParse(formData);

  if (!parsed.success) {
    return { message: "Invalid form data" };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}/participants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    },
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const responseData = await res.json();

  return responseData;
}
