import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import nodemailer from "nodemailer";

import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(2),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
    async (request) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new ClientError("Invalid trip start date.");
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new ClientError("Invalid trip end date.");
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                },
                ...emails_to_invite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const formattedStartDate = dayjs(starts_at).format("LL");
      const formattedEndDate = dayjs(ends_at).format("LL");
      const confirmationLink = `https://localhost:3333/trips/${trip.id}/confirm`;

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: { name: "Test", address: "hi@hi.com" },
        to: { name: owner_name, address: owner_email },
        subject: `Your trip to ${destination}`,
        html: `<p><a href="${confirmationLink}">Confirm</a> your trip to ${destination} from <strong>${formattedStartDate}</strong> to <strong>${formattedEndDate}</strong>.</p>`.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { tripId: trip.id };
    }
  );
}
