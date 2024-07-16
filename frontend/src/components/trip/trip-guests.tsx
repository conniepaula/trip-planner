"use client";

import { CircleCheck, CircleDashed, UserCog } from "lucide-react";
import { useState } from "react";

import { useTrip } from "@/contexts/trip-context";
import Button from "@/components/ui/button";
import InfoCard from "./info-card";
import GuestManagementModal from "./guest-management-modal";

export default function TripGuests() {
  const { participants } = useTrip();
  const [isManageGuestsModalOpen, setIsManageGuestsModalOpen] =
    useState<boolean>(false);

  const openGuestManagementModal = () => {
    setIsManageGuestsModalOpen(true);
  };

  const closeGuestManagementModal = () => {
    setIsManageGuestsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {participants.map((guest) => (
          <InfoCard key={guest.id}>
            <InfoCard.ContentContainer>
              <InfoCard.Title>{guest.name}</InfoCard.Title>
              <InfoCard.Description>{guest.email}</InfoCard.Description>
            </InfoCard.ContentContainer>
            <InfoCard.IconContainer className="flex items-center">
              {guest.is_confirmed ? (
                <CircleCheck className="size-5 text-green-500" />
              ) : (
                <CircleDashed className="size-5 text-zinc-400" />
              )}
            </InfoCard.IconContainer>
          </InfoCard>
        ))}
      </div>
      <Button
        onClick={openGuestManagementModal}
        variant="neutral"
        size="full"
        className="w-full"
      >
        <UserCog className="size-5 text-zinc-500" />
        Manage Guests
      </Button>
      {isManageGuestsModalOpen && (
        <GuestManagementModal
          closeGuestManagementModal={closeGuestManagementModal}
        />
      )}
    </div>
  );
}
