import TripGuests from "@/components/trip/trip-guests";
import NewActivity from "@/components/trip/new-activity";
import Separator from "@/components/ui/separator";
import TripLinks from "@/components/trip/trip-links";
import TripActivities from "@/components/trip/trip-activities";
import TripDetails from "@/components/trip/trip-details";
import { TripProvider } from "@/contexts/trip-context";
import { getTripActivities } from "@/utils/get-trip-activities";
import { getTripDetails } from "@/utils/get-trip-details";
import { getTripLinks } from "@/utils/get-trip-links";
import { getTripParticipants } from "@/utils/get-trip-participants";

export default async function TripPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { tripId } = params;
  const { trip } = await getTripDetails(params.tripId);
  const { participants } = await getTripParticipants(tripId);
  const { activities } = await getTripActivities(tripId);
  const { links } = await getTripLinks(tripId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <TripProvider initialValue={{ trip, participants, activities, links }}>
        <div className="space-y-8">
          {/* Header */}
          <TripDetails />

          {/* Activities  */}
          <main className="flex flex-col gap-6 px-4 md:flex-row md:gap-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold">Activities</span>
                <NewActivity />
              </div>
              <TripActivities />
            </div>

            <Separator className="w-full md:hidden" />

            <div className="space-y-6 md:w-80">
              {/* Important Links */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Important links</h2>
                <TripLinks />
              </div>
              <Separator className="w-full" />

              {/* Guests */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Guests</h2>
                <TripGuests />
              </div>
            </div>
          </main>
        </div>
      </TripProvider>
    </div>
  );
}
