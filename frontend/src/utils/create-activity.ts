"use server";

import { z } from "zod";

const activityFormSchema = z.object({
  title: z.string(),
  occurs_at: z.coerce.date(),
  trip_id: z.string().uuid(),
});

const activityCreationResponseSchema = z.object({
  activity_id: z.string().uuid(),
});

export type ActivityCreationResponse = z.infer<
  typeof activityCreationResponseSchema
>;

function assertIsActivityCreationResponse(
  data: unknown,
): asserts data is ActivityCreationResponse {
  if (!activityCreationResponseSchema.safeParse(data).success) {
    throw new Error("Invalid activity creation response data.");
  }
}

export async function createActivity(data: FormData) {
  const formData = Object.fromEntries(data);

  const parsedData = activityFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return { message: "Invalid activity form data." };
  }

  const { occurs_at, title, trip_id } = parsedData.data;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${trip_id}/activities`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, occurs_at }),
    },
  );

  if (!res.ok) {
    throw new Error(`Error creating activity: ${res.status}`);
  }

  const responseData = await res.json();

  assertIsActivityCreationResponse(responseData);

  return responseData;
}
