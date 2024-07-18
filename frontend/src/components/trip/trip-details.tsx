"use client";

import { Calendar, MapPin, Settings2 } from "lucide-react";
import { useState } from "react";

import { useTrip } from "@/contexts/trip-context";
import { getDateRangeDisplayText } from "@/utils/get-date-range-display-text";
import Button from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import ChangeDetailsModal from "./change-details-modal";

export default function TripDetails() {
  const { trip } = useTrip();
  const [isChangeDetailsModalOpen, setIsChangeDetailsModalOpen] =
    useState<boolean>(false);

  const openChangeDetailsModal = () => {
    setIsChangeDetailsModalOpen(true);
  };

  const closeChangeDetailsModal = () => {
    setIsChangeDetailsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-start gap-3 rounded-xl bg-zinc-900 px-4 py-3 shadow-sm sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 sm:flex-1">
        <MapPin className="size-5 text-zinc-400" />
        <span className="md:text-lg">{trip.destination}</span>
      </div>
      <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="md:text-lg">
            {getDateRangeDisplayText(trip.starts_at, trip.ends_at)}
          </span>
        </div>
        <Separator direction="vertical" className="hidden h-8 sm:block" />
        <Button
          onClick={openChangeDetailsModal}
          variant="neutral"
          className="w-full sm:w-auto"
        >
          <span className="not-sr-only sm:sr-only md:not-sr-only">
            Change details
          </span>
          <Settings2 className="size-5" />
        </Button>
      </div>
      {isChangeDetailsModalOpen && (
        <ChangeDetailsModal closeChangeDetailsModal={closeChangeDetailsModal} />
      )}
    </div>
  );
}
