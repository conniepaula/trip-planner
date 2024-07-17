"use server";

import { z } from "zod";

const activityFormSchema = z.object({
  title: z.string(),
  occurs_at: z.coerce.date(),
});

const activityCreationResponseSchema = z.object({
  activityId: z.string().uuid(),
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

export async function createActivity(data: FormData, tripId: string) {
  const formData = Object.fromEntries(data);

  const parsedData = activityFormSchema.safeParse(formData);

  if (!parsedData.success) {
    throw new Error("Invalid activity creation form data.");
  }

  const { title, occurs_at } = parsedData.data;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}/activities`,
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
