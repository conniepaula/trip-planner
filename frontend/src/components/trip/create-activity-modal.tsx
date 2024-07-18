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
  title: z.string().min(5, "Activity title must have at least 5 characters."),
  occurs_at: z.coerce.date(),
});

type CreateActivityFormValues = z.infer<typeof createActivityFormSchema>;

export default function CreateActivityModal(props: CreateActivityModalProps) {
  const { closeCreateActivityModal } = props;
  const { addActivity, trip } = useTrip();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateActivityFormValues>({
    resolver: zodResolver(createActivityFormSchema),
  });

  const onSubmit = async (data: CreateActivityFormValues) => {
    const activityFormData = new FormData();
    activityFormData.append("title", data.title);
    activityFormData.append("occurs_at", String(data.occurs_at));
    activityFormData.append("trip_id", String(trip.id));

    try {
      const { activityId } = await createActivity(
        activityFormData,
        String(trip.id),
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
            id="activity-title"
            label="Activity title"
            error={errors.title?.message}
            placeholder="What's the activity?"
            icon={Tag}
            {...register("title")}
          />
          {/* // TODO: Add a custom date and time selector with date validation */}
          <Input
            id="activity-occurs-at"
            label="Date and time"
            error={errors.occurs_at?.message}
            type="datetime-local"
            placeholder="Select date and time"
            icon={Calendar}
            {...register("occurs_at")}
          />
        </div>
        <Button type="submit" size="full">
          Create activity
        </Button>
      </form>
    </Modal>
  );
}
