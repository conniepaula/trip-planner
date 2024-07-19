import { useParams } from "next/navigation";
import {
  AtSign,
  CircleCheck,
  CircleDashed,
  CircleX,
  Plus,
  User,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTrip } from "@/contexts/trip-context";
import Modal from "@/components/ui/modal";
import TripInput from "@/components/home/trip-input";
import Button from "@/components/ui/button";
import { inviteParticipant } from "@/utils/invite-participant";
import { deleteParticipant } from "@/utils/delete-participant";
import InfoCard from "./info-card";
import { toast } from "sonner";

const inviteGuestFormSchema = z.object({
  name: z.string().min(2, "Guest name must have at least two characters."),
  email: z.string().email("Incorrect email format."),
});

type InviteGuestFormValues = z.infer<typeof inviteGuestFormSchema>;

interface GuestManagementModalProps {
  closeGuestManagementModal: () => void;
}

export default function GuestManagementModal(props: GuestManagementModalProps) {
  const { closeGuestManagementModal } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<InviteGuestFormValues>({
    resolver: zodResolver(inviteGuestFormSchema),
    defaultValues: { name: "", email: "" },
  });

  const { tripId } = useParams();
  const { participants, addParticipant, removeParticipant } = useTrip();

  const createNewGuest = async (data: InviteGuestFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    try {
      const { participantId } = await inviteParticipant(
        formData,
        String(tripId),
      );
      addParticipant(participantId, data.name, data.email);
      reset();
      toast.success("Guest added successfully.");
    } catch (err) {
      toast.error("There was an error adding the new guest. Please try again.");
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      const { participantId } = await deleteParticipant(id);
      removeParticipant(participantId);
      toast.success("Guest deleted successfully.");
    } catch (err) {
      toast.success(`Error deleting participant ${id}.`);
    }
  };

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title closeModal={closeGuestManagementModal}>
          <h2 className="text-lg font-semibold">Manage guests</h2>
        </Modal.Title>
        <Modal.Description>Add or remove guests from trip.</Modal.Description>
      </Modal.Header>
      <div className="space-y-3">
        <div className="space-y-3 px-4 py-3">
          {participants.map((guest) => (
            <InfoCard key={guest.id}>
              <InfoCard.ContentContainer>
                <InfoCard.Title>{guest.name}</InfoCard.Title>
                <InfoCard.Description>{guest.email}</InfoCard.Description>
              </InfoCard.ContentContainer>
              <InfoCard.IconContainer className="flex items-center gap-2">
                {guest.is_confirmed ? (
                  <CircleCheck className="size-5 text-green-500" />
                ) : (
                  <CircleDashed className="size-5 text-zinc-400" />
                )}
                <button onClick={() => deleteGuest(guest.id)}>
                  <span className="sr-only">Delete guest</span>
                  <CircleX className="size-5 text-red-600 hover:text-red-500 hover:transition-colors" />
                </button>
              </InfoCard.IconContainer>
            </InfoCard>
          ))}
        </div>
        <form
          onSubmit={handleSubmit(createNewGuest)}
          className="flex flex-col items-start gap-3 rounded-xl border border-muted bg-background px-4 py-3 shadow-sm sm:flex-row sm:items-center"
        >
          <TripInput
            icon={User}
            placeholder="Guest name"
            {...register("name")}
          />
          <TripInput
            containerClassName="flex-1"
            icon={AtSign}
            className="flex-1"
            placeholder="Guest email"
            {...register("email")}
          />

          <div className="hidden h-6 w-px bg-muted sm:block" />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Invite
            <Plus className="size-5" />
          </Button>
        </form>
      </div>
    </Modal>
  );
}
