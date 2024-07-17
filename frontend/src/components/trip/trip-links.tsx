"use client";

import { Link2, Plus } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/button";
import { useTrip } from "@/contexts/trip-context";
import NewLinkModal from "./new-link-modal";
import InfoCard from "./info-card";

export default function TripLinks() {
  const { links } = useTrip();
  const [isNewLinkModalOpen, setIsNewLinkModalOpen] = useState<boolean>(false);

  const openCreateLinkModal = () => {
    setIsNewLinkModalOpen(true);
  };

  const closeCreateLinkModal = () => {
    setIsNewLinkModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {links.length > 0 ? (
        <div className="space-y-6">
          {links.map((link) => (
            <InfoCard key={link.id}>
              <InfoCard.ContentContainer>
                <InfoCard.Title>{link.title}</InfoCard.Title>
                <InfoCard.Link href={link.url} />
              </InfoCard.ContentContainer>
              <InfoCard.IconContainer>
                <Link2 className="size-5 text-zinc-400" />
              </InfoCard.IconContainer>
            </InfoCard>
          ))}
        </div>
      ) : (
        <span className="block text-xs text-zinc-400">
          No links have added to this trip.
        </span>
      )}
      <Button
        onClick={openCreateLinkModal}
        variant="neutral"
        size="full"
        className="w-full"
      >
        <Plus className="size-5 text-zinc-500" />
        Add new link
      </Button>
      {isNewLinkModalOpen && (
        <NewLinkModal closeNewLinkModal={closeCreateLinkModal} />
      )}
    </div>
  );
}
