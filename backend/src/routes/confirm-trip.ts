import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import z from "zod";

dayjs.extend(localizedFormat);

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({ tripId: z.string() }),
      },
    },
    async (request) => {
      const { tripId } = request.params;

      return { tripId };
    }
  );
}
