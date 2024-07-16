"use server";

import { z } from "zod";

const tripActivitiesSchema = z.object({
  activities: z.array(
    z.object({
      date: z.coerce.date(),
      activities: z.array(
        z.object({
          id: z.string().uuid(),
          title: z.string(),
          occurs_at: z.coerce.date(),
          trip_id: z.string().uuid(),
        }),
      ),
    }),
  ),
});

export type TripActivities = z.infer<typeof tripActivitiesSchema>;

function assertIsTripActivities(data: unknown): asserts data is TripActivities {
  if (!tripActivitiesSchema.safeParse(data).success) {
    throw new Error("Invalid trip activities.");
  }
}

export async function getTripActivities(tripId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}/activities`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error(`Error fetching trip activities: ${res.status}`);
  }

  const responseData = await res.json();

  assertIsTripActivities(responseData);

  return responseData;
}
