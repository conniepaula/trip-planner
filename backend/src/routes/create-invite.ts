import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import z from "zod";

import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-error";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/participants",
    {
      schema: {
        params: z.object({ tripId: z.string().uuid() }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });

      if (!trip) {
        throw new ClientError("Trip not found.");
      }

      const participant = await prisma.participant.create({
        data: { email, trip_id: tripId },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");

      const mail = await getMailClient();

      const confirmationLink = `https://localhost:3333/participants/${participant.id}/confirm`;

      const message = await mail.sendMail({
        from: { name: "Test", address: "hi@hi.com" },
        to: participant.email,
        subject: `Your trip to ${trip.destination}`,
        html: `<p><a href="${confirmationLink}">Confirm</a> your trip to ${trip.destination} from <strong>${formattedStartDate}</strong> to <strong>${formattedEndDate}</strong>.</p>`.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { participantId: participant.id };
    }
  );
}
