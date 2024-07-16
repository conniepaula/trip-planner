"use server";

import { z } from "zod";

const tripLinksSchema = z.object({
  links: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      url: z.string().url(),
      trip_id: z.string().uuid(),
    }),
  ),
});

export type TripLinks = z.infer<typeof tripLinksSchema>;

function assertIsTripLinks(data: unknown): asserts data is TripLinks {
  if (!tripLinksSchema.safeParse(data).success) {
    throw new Error("Invalid trip links.");
  }
}

export async function getTripLinks(tripId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}/links`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error(`Error fetching trip links: ${res.status}`);
  }

  const responseData = await res.json();

  assertIsTripLinks(responseData);

  return responseData;
}
