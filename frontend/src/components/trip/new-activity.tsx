"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import Button from "../ui/button";
import CreateActivityModal from "./create-activity-modal";

export default function NewActivity() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] =
    useState<boolean>(false);

  const openCreateActivityModal = () => {
    setIsCreateActivityModalOpen(true);
  };

  const closeCreateActivityModal = () => {
    setIsCreateActivityModalOpen(false);
  };

  return (
    <>
      <Button onClick={openCreateActivityModal}>
        <Plus className="size-5" />
        <span className="hidden sm:block">New</span>
        <span className="sr-only">Add new activity</span>
      </Button>
      {isCreateActivityModalOpen && (
        <CreateActivityModal
          closeCreateActivityModal={closeCreateActivityModal}
        />
      )}
    </>
  );
}
