"use client";

import { useTrip } from "@/contexts/trip-context";
import ActivityCard from "./activity-card";

export default function TripActivities() {
  const { activities } = useTrip();

  return (
    <div className="space-y-8">
      {activities.map((activitiesInDate) => (
        <ActivityCard
          key={String(activitiesInDate.date)}
          {...activitiesInDate}
        />
      ))}
    </div>
  );
}
