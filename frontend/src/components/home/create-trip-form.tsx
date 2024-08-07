"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapPin,
  ArrowRight,
  UserRoundPlus,
  Settings2,
  User,
  Mail,
  AtSign,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { endOfDay, format } from "date-fns";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import TripInput from "./trip-input";
import { getDateRangeDisplayText } from "@/utils/get-date-range-display-text";
import { createTrip } from "@/utils/create-trip";
import {
  INITIAL_STATE,
  tripCreationReducer,
} from "@/reducers/trip-creation/reducer";
import {
  setCurrentParticipantAction,
  setFormStepAction,
  setIsConfirmModalOpenAction,
  setIsInviteGuestModalOpenAction,
} from "@/reducers/trip-creation/actions";
import DatePickerInput from "./trip-date-picker";

const participantSchema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  email: z.string().email(),
});

const tripFormSchema = z.object({
  destination: z
    .string()
    .min(2, "Destination must have at least 2 characters."),
  date: z.object({ from: z.date(), to: z.date() }),
  participantsToInvite: z.array(participantSchema).default([]),
  ownerName: z.string().min(3, "Your name must have at least 5 characters"),
  ownerEmail: z.string().email(),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

type TripFormFieldNames = keyof TripFormValues;

const formSteps = [
  { id: 1, fields: ["destination", "date"] },
  { id: 2, fields: ["participantsToInvite"] },
  { id: 3, fields: ["ownerName", "ownerEmail"] },
];

export default function CreateTripForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
  });

  const [tripCreationFormState, dispatch] = useReducer(
    tripCreationReducer,
    INITIAL_STATE,
  );

  const {
    isInviteGuestModalOpen,
    isConfirmModalOpen,
    isDatePickerOpen,
    currentFormStep,
    previousFormStep,
    currentParticipant,
  } = tripCreationFormState;

  const isGuestInputOpen = currentFormStep > 0;

  const router = useRouter();

  const selectedDates = watch("date");
  const dateToDisplay =
    selectedDates?.to && selectedDates?.from
      ? getDateRangeDisplayText(selectedDates.from, selectedDates.to)
      : "When is your trip?";

  const participants = watch("participantsToInvite");

  const handleInvite = () => {
    const parsedData = participantSchema.safeParse(currentParticipant);

    if (!parsedData.success) {
      return;
    }

    if (participants) {
      setValue("participantsToInvite", [...participants, currentParticipant]);
    } else {
      setValue("participantsToInvite", [currentParticipant]);
    }
    dispatch(setCurrentParticipantAction({ name: "", email: "" }));
  };

  const removeEmailFromInvites = (emailToRemove: string) => {
    const updatedEmailList = participants?.filter(
      (guest) => guest.email !== emailToRemove,
    );
    setValue("participantsToInvite", updatedEmailList);
  };

  const onContinueClick = async () => {
    const fields = formSteps[currentFormStep].fields;
    const output = await trigger(fields as Array<TripFormFieldNames>, {
      shouldFocus: true,
    });
    if (!output) return;
    if (currentFormStep < formSteps.length - 1) {
      dispatch(setFormStepAction(currentFormStep + 1, currentFormStep));
    }
  };

  const onChangeDetailsClick = () => {
    if (currentFormStep > 0) {
      dispatch(setFormStepAction(currentFormStep - 1, currentFormStep));
    }
  };

  const openInviteGuestModal = () => {
    dispatch(setIsInviteGuestModalOpenAction(true));
  };

  const closeInviteGuestModal = () => {
    dispatch(setIsInviteGuestModalOpenAction(false));
  };
  const openConfirmModal = () => {
    dispatch(setIsConfirmModalOpenAction(true));
  };

  const closeConfirmModal = () => {
    dispatch(setIsConfirmModalOpenAction(false));
  };

  const onSubmit = async (data: TripFormValues) => {
    const formData = new FormData();
    formData.append("destination", data.destination);
    formData.append("starts_at", String(data.date.from));
    formData.append("ends_at", String(data.date.to));
    formData.append("owner_name", data.ownerName);
    formData.append("owner_email", data.ownerEmail);
    data.participantsToInvite?.forEach((participant) => {
      formData.append("participants_to_invite[]", JSON.stringify(participant));
    });

    try {
      const { tripId } = await createTrip(formData);
      router.replace(`/trips/${tripId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      action={createTrip}
      className="space-y-4"
    >
      <div className="flex flex-col items-start gap-3 rounded-xl bg-zinc-900 px-4 py-3 shadow-sm sm:flex-row sm:items-center">
        <TripInput
          disabled={isGuestInputOpen}
          containerClassName="flex-1"
          icon={MapPin}
          className="flex-1"
          placeholder="Where are you going?"
          {...register("destination")}
        />

        <Controller
          name="date"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePickerInput
              mode="range"
              id="trip-dates"
              label="Trip dates"
              placeholder="When is your trip?"
              // TODO: Figure out how to display date picker errors
              disabled={{ before: new Date() }}
              onSelect={(dateRange) => {
                if (dateRange) {
                  field.onChange({
                    from: dateRange.from,
                    to: dateRange.to ? endOfDay(dateRange.to) : undefined,
                  });
                }
              }}
              selected={field.value}
            />
          )}
        />

        {/* <button
          onClick={openDatePicker}
          disabled={isGuestInputOpen}
          className="flex items-center gap-2 text-left"
        >
          <Calendar className="size-5 text-zinc-400" />
          <span
            className={cn(
              "text-lg",
              selectedDates ? "text-foreground" : "text-zinc-400",
            )}
          >
            {dateToDisplay}
          </span>
        </button> */}

        <div className="hidden h-6 w-px bg-muted sm:block" />

        {isGuestInputOpen ? (
          <Button
            onClick={onChangeDetailsClick}
            variant="neutral"
            className="w-full sm:w-auto"
          >
            Change details
            <Settings2 className="size-5" />
          </Button>
        ) : (
          <Button onClick={onContinueClick} className="w-full sm:w-auto">
            Continue
            <ArrowRight className="size-5" />
          </Button>
        )}
      </div>

      {/* TODO: Add slide down animation */}
      {isGuestInputOpen && (
        <div className="flex flex-col gap-3 rounded-xl bg-zinc-900 px-4 py-3 shadow-sm sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={openInviteGuestModal}
            className="flex flex-1 items-center gap-2 text-left"
          >
            <UserRoundPlus className="size-5 text-zinc-400" />
            <span className="flex-1 text-lg text-zinc-400">
              {participants?.length > 0 ? (
                <span className="text-zinc-5 flex-1 text-lg">{`${participants?.length} guest(s)`}</span>
              ) : (
                <span className="flex-1 text-lg text-zinc-400">
                  Who else is coming?
                </span>
              )}
            </span>
          </button>

          <div className="hidden h-6 w-px bg-muted sm:block" />

          <Button onClick={openConfirmModal}>
            Confirm trip
            <ArrowRight className="size-5" />
          </Button>
        </div>
      )}

      {isInviteGuestModalOpen && (
        <Modal>
          <Modal.Header>
            <Modal.Title closeModal={closeInviteGuestModal}>
              <h2 className="text-lg font-semibold">Invite guests</h2>
            </Modal.Title>
            <Modal.Description>
              Guest will have to confirm trip through their emails.
            </Modal.Description>
          </Modal.Header>
          <div className="flex flex-wrap gap-2">
            {participants?.map((participant) => (
              <div
                key={participant.email}
                className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5"
              >
                <span className="text-zinc-300">{participant.email}</span>
                <button
                  type="button"
                  onClick={() => removeEmailFromInvites(participant.email)}
                >
                  <X className="size-4 text-zinc-400" />
                </button>
              </div>
            ))}
          </div>
          <div className="h-px w-full bg-muted" />
          <div className="flex flex-col items-start gap-3 rounded-xl bg-background px-4 py-3 shadow-sm sm:flex-row sm:items-center">
            <TripInput
              icon={User}
              placeholder="Guest name"
              value={currentParticipant.name}
              onChange={(e) =>
                dispatch(
                  setCurrentParticipantAction({
                    ...currentParticipant,
                    name: e.target.value,
                  }),
                )
              }
            />
            <TripInput
              containerClassName="flex-1"
              icon={AtSign}
              className="flex-1"
              placeholder="Guest email"
              value={currentParticipant.email}
              onChange={(e) =>
                dispatch(
                  setCurrentParticipantAction({
                    ...currentParticipant,
                    email: e.target.value,
                  }),
                )
              }
            />

            <div className="hidden h-6 w-px bg-muted sm:block" />

            <Button
              type="button"
              onClick={handleInvite}
              className="w-full sm:w-auto"
            >
              Invite
              <Plus className="size-5" />
            </Button>
          </div>
        </Modal>
      )}

      {isConfirmModalOpen && (
        <Modal>
          <Modal.Header>
            <Modal.Title closeModal={closeConfirmModal}>
              <h2 className="text-lg font-semibold">Confirm trip creation</h2>
            </Modal.Title>
            <Modal.Description>
              Fill out the form below to confirm your trip to{" "}
              <span className="font-semibold text-foreground">
                {getValues("destination")}
              </span>{" "}
              on{" "}
              <span className="font-semibold text-foreground">
                {format(getValues("date.from"), "MMMM do")}
              </span>
              .
            </Modal.Description>
          </Modal.Header>

          <div className="space-y-3">
            <div className="space-y-2">
              <Input
                id="owner-name"
                label="Your name"
                placeholder="Your full name"
                icon={User}
                error={errors.ownerName?.message}
                {...register("ownerName")}
              />
              <Input
                id="owner-email"
                label="Your personal email"
                placeholder="Your personal email"
                icon={Mail}
                error={errors.ownerEmail?.message}
                {...register("ownerEmail")}
              />
            </div>
            <Button type="submit" size="full">
              Confirm trip creation
            </Button>
          </div>
        </Modal>
      )}
      <div className="space-y-1 text-left">
        {/*  TODO: Add trip dates selection error  */}
        {errors.destination?.message && (
          <span className="ml-1 text-red-500">
            {errors.destination?.message}
          </span>
        )}
      </div>
    </form>
  );
}
