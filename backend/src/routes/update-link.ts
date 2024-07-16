import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function updateLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/links/:linkId",
    {
      schema: {
        params: z.object({ linkId: z.string().uuid() }),
        body: z.object({
          title: z.string().min(3),
          url: z.string().url(),
        }),
      },
    },
    async (request) => {
      const { linkId } = request.params;
      const { title, url } = request.body;

      const link = await prisma.link.findUnique({ where: { id: linkId } });

      if (!link) {
        throw new ClientError("Link not found.");
      }

      await prisma.link.update({
        where: { id: linkId },
        data: { title, url },
      });

      return { linkId: link.id };
    }
  );
}
