"use server";

import { z } from "zod";

const responseSchema = z.object({
  participantId: z.string().uuid(),
});

type ResponseSchema = z.infer<typeof responseSchema>;

function assertIsResponseSchema(data: unknown): asserts data is ResponseSchema {
  if (!responseSchema.safeParse(data).success) {
    throw new Error("Invalid participant deletion response schema.");
  }
}

export async function deleteParticipant(participantId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/participants/${participantId}/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const responseData = await res.json();

  assertIsResponseSchema(responseData);

  return responseData;
}
