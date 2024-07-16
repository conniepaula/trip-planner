"use server";
import { z } from "zod";

const tripParticipantsSchema = z.object({
  participants: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
      is_confirmed: z.coerce.boolean(),
    }),
  ),
});

export type TripParticipants = z.infer<typeof tripParticipantsSchema>;

function assertIsTripParticipants(
  data: unknown,
): asserts data is TripParticipants {
  if (!tripParticipantsSchema.safeParse(data).success) {
    throw new Error("Invalid trip participants data format.");
  }
}

export async function getTripParticipants(tripId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}/participants`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error(`Error fetching trip participants: ${res.status}`);
  }

  const responseData = await res.json();

  assertIsTripParticipants(responseData);

  return responseData;
}
