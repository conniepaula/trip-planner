import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import nodemailer from "nodemailer";

import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

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
          participants_to_invite: z.array(
            z.object({ name: z.string().min(2), email: z.string().email() })
          ),
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
        participants_to_invite,
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
                ...participants_to_invite.map((participant) => {
                  return { name: participant.name, email: participant.email };
                }),
              ],
            },
          },
        },
      });

      const formattedStartDate = dayjs(starts_at).format("LL");
      const formattedEndDate = dayjs(ends_at).format("LL");
      const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: { name: "Plan.ner", address: "noreply@plan.er" },
        to: { name: owner_name, address: owner_email },
        subject: `Confirm your participation - Trip to ${trip.destination}`,
        html: `<div style="width:100%;max-width:600px;margin:0 auto;padding:20px;background-color:#1f1f23;border-radius:8px;">
                <div style="text-align:center;padding-bottom:20px;">
                  <h1 style="color:#fda4af;margin:0;">Trip Confirmation</h1>
                </div>
                <div style="padding:20px;background-color:#2c2c34;border-radius:8px;">
                  <p style="margin:0 0 10px;color:#f4f4f5;">Hi ${owner_name},</p>
                  <p style="margin:0 0 10px;color:#f4f4f5;">You have created a trip to <strong>${trip.destination}</strong> from <strong>${formattedStartDate}</strong> to <strong>${formattedEndDate}</strong> on Plann.er.</p>
                  <p style="margin:0 0 10px;color:#f4f4f5;">When you confirm your trip, invitations will be sent to your guests' email addresses, if there are any.</p>
                  <br></br>
                  <p style="margin:0 0 10px;color:#f4f4f5;">To confirm your action, please click the link below:</p>
                  <p style="margin:0 0 10px;"><a href="${confirmationLink}" style="color:#fda4af;text-decoration:none;font-weight:bold;">Confirm Your Trip</a></p>
                </div>
              </div>`.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { tripId: trip.id };
    }
  );
}
