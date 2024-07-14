"use server";

import { z } from "zod";

const participantSchema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  email: z.string().email(),
});

const tripFormSchema = z.object({
  destination: z
    .string()
    .min(2, "Destination must have at least 2 characters."),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  participants_to_invite: z.array(participantSchema).optional(),
  owner_name: z.string().min(3, "Your name must have at least 5 characters"),
  owner_email: z.string().email(),
});

export async function createTrip(data: FormData) {
  let formData = Object.fromEntries(data);

  // TODO: Improve logic

  const participantsToInvite = [];
  for (const key in formData) {
    if (key.startsWith("participants_to_invite")) {
      const value = formData[key];
      if (typeof value === "string") {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          participantsToInvite.push(...parsedValue); // Spread the array to avoid nesting
        } else {
          participantsToInvite.push(parsedValue);
        }
      }
    }
  }

  const parsed = tripFormSchema.safeParse({
    ...formData,
    participants_to_invite: participantsToInvite,
  });

  if (!parsed.success) {
    return { message: "Invalid form data" };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...formData,
      participants_to_invite: participantsToInvite,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const responseData = await res.json();

  return responseData;
}
