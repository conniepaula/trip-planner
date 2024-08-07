import fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { createTrip } from "./routes/create-trip";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipant } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-handler";
import { env } from "./env";
import { deleteParticipant } from "./routes/delete-participant";
import { deleteLink } from "./routes/delete-link";
import { updateLink } from "./routes/update-link";

const app = fastify();

app.register(cors, { origin: "*" });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

// Trip
app.register(createTrip);
app.register(confirmTrip);
app.register(updateTrip);
app.register(getTripDetails);

// Participants
app.register(confirmParticipant);
app.register(getParticipant);
app.register(getParticipants);
app.register(createInvite);
app.register(deleteParticipant);

// Activities
app.register(createActivity);
app.register(getActivities);

// Links
app.register(createLink);
app.register(deleteLink);
app.register(getLinks);
app.register(updateLink);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running on PORT ${env.PORT}`);
});
