"use server";

import { z } from "zod";

const tripDetailsFormSchema = z.object({
  destination: z
    .string()
    .min(2, "Destination must have at least 2 characters."),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
});

export async function updateTrip(data: FormData, tripId: string) {
  let formData = Object.fromEntries(data);

  const parsed = tripDetailsFormSchema.safeParse(formData);

  if (!parsed.success) {
    throw new Error("Invalid trip update form data");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}`,
    {
      method: "PUT",
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
