import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import z from "zod";

import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/participants",
    {
      schema: {
        params: z.object({ tripId: z.string().uuid() }),
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { name, email } = request.body;

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });

      if (!trip) {
        throw new ClientError("Trip not found.");
      }

      const participant = await prisma.participant.create({
        data: { email, name, trip_id: tripId },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");

      const mail = await getMailClient();

      const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

      const message = await mail.sendMail({
        from: { name: "Plan.ner", address: "noreply@plan.er" },
        to: { name: participant.name, address: participant.email },
        subject: `Confirm your participation - Trip to ${trip.destination}`,
        html: `<div style="width:100%;max-width:600px;margin:0 auto;padding:20px;background-color:#1f1f23;border-radius:8px;">
                <div style="text-align:center;padding-bottom:20px;">
                  <h1 style="color:#fda4af;margin:0;">Trip Confirmation</h1>
                </div>
                <div style="padding:20px;background-color:#2c2c34;border-radius:8px;">
                  <p style="margin:0 0 10px;color:#f4f4f5;">Hi ${participant.name},</p>
                  <p style="margin:0 0 10px;color:#f4f4f5;">You have been invited to plan a trip to <strong>${trip.destination}</strong> from <strong>${formattedStartDate}</strong> to <strong>${formattedEndDate}</strong> on Plann.er.</p>
                  <p style="margin:0 0 10px;color:#f4f4f5;">To confirm your participation, please click the link below:</p>
                  <p style="margin:0 0 10px;"><a href="${confirmationLink}" style="color:#fda4af;text-decoration:none;font-weight:bold;">Confirm Your Trip</a></p>
                </div>
              </div>`.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { participantId: participant.id };
    }
  );
}
