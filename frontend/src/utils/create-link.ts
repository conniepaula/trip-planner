"use server";

import { z } from "zod";

const linkSchema = z.object({
  title: z.string().min(2, "Min 2 characters"),
  url: z.string().url(),
});

const responseSchema = z.object({
  linkId: z.string().uuid(),
});

type ResponseSchema = z.infer<typeof responseSchema>;

function assertIsResponseSchema(data: unknown): asserts data is ResponseSchema {
  if (!responseSchema.safeParse(data).success) {
    throw new Error("Invalid link creation response schema.");
  }
}

export async function createLink(data: FormData, tripId: string) {
  let formData = Object.fromEntries(data);

  const parsed = linkSchema.safeParse(formData);

  if (!parsed.success) {
    return { message: "Invalid link form data." };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}/links`,
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

  assertIsResponseSchema(responseData);

  return responseData;
}
