"use server";
import { z } from "zod";

const tripDetailsSchema = z.object({
  trip: z.object({
    id: z.string().uuid(),
    destination: z.string(),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
    is_confirmed: z.coerce.boolean(),
  }),
});

export type TripDetails = z.infer<typeof tripDetailsSchema>;

function assertIsTripDetails(data: unknown): asserts data is TripDetails {
  if (!tripDetailsSchema.safeParse(data).success) {
    throw new Error("Invalid trip data.");
  }
}

export async function getTripDetails(tripId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error(`Error fetching trip details: ${res.status}`);
  }

  const responseData = await res.json();

  assertIsTripDetails(responseData);

  return responseData;
}
