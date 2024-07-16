import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function deleteParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/participants/:participantId/delete",
    {
      schema: {
        params: z.object({ participantId: z.string().uuid() }),
      },
    },
    async (request) => {
      const { participantId } = request.params;

      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
      });

      if (!participant) {
        throw new ClientError("Participant not found.");
      }

      if (participant.is_owner) {
        throw new Error("Participants who are trip owners cannot be deleted.");
      }

      await prisma.participant.delete({
        where: { id: participantId },
      });

      return { participantId };
    }
  );
}
