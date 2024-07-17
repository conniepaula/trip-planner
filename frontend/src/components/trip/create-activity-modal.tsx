"use client";

import { Calendar, Tag } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { createActivity } from "@/utils/create-activity";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import { useTrip } from "@/contexts/trip-context";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void;
}

const createActivityFormSchema = z.object({
  title: z.string().min(5),
  occurs_at: z.coerce.date(),
});

type CreateActivityFormValues = z.infer<typeof createActivityFormSchema>;

export default function CreateActivityModal(props: CreateActivityModalProps) {
  const { closeCreateActivityModal } = props;
  const { tripId } = useParams();
  const { addActivity } = useTrip();

  const { handleSubmit, register, reset } = useForm<CreateActivityFormValues>({
    resolver: zodResolver(createActivityFormSchema),
  });

  const onSubmit = async (data: CreateActivityFormValues) => {
    const activityFormData = new FormData();
    activityFormData.append("title", data.title);
    activityFormData.append("occurs_at", String(data.occurs_at));
    activityFormData.append("trip_id", String(tripId));

    try {
      const { activityId } = await createActivity(
        activityFormData,
        String(tripId),
      );
      addActivity(activityId, data.title, data.occurs_at);
      reset();
      // closeCreateActivityModal();
    } catch (err) {
      alert("There was an creating the activity.");
    }
  };

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title closeModal={closeCreateActivityModal}>
          <h2 className="text-lg font-semibold">New activity</h2>
        </Modal.Title>
        <Modal.Description>
          Activities are visible to all guests.
        </Modal.Description>
      </Modal.Header>

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Input
            placeholder="What's the activity?"
            icon={Tag}
            {...register("title")}
          />

          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Calendar className="size-5 text-zinc-400" />
            <input
              type="datetime-local"
              placeholder="Select date and time"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
              {...register("occurs_at")}
            />
          </div>
        </div>
        <Button type="submit" size="full">
          Create activity
        </Button>
      </form>
    </Modal>
  );
}
