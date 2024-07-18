import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

import Modal from "../ui/modal";
import { useTrip } from "@/contexts/trip-context";
import Input from "../ui/input";
import DatePickerInput from "../ui/date-picker-input";
import { updateTrip } from "@/utils/update-trip";
import Button from "../ui/button";

interface ChangeDetailsModalProps {
  closeChangeDetailsModal: () => void;
}

const detailsFormSchema = z.object({
  destination: z
    .string()
    .min(2, "Destination must have at least 2 characters."),
  date: z.object({
    from: z.date({ message: "Invalid trip start date." }),
    to: z.date({ message: "Invalid trip end date." }),
  }),
});

type DetailsFormValues = z.infer<typeof detailsFormSchema>;

export default function ChangeDetailsModal(props: ChangeDetailsModalProps) {
  const { closeChangeDetailsModal } = props;
  const { trip, updateTripDetails } = useTrip();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      destination: trip.destination,
      date: { from: trip.starts_at, to: trip.ends_at } as DateRange,
    },
  });

  const changeDetails = async (data: DetailsFormValues) => {
    const formData = new FormData();
    formData.append("destination", data.destination);
    formData.append("starts_at", String(data.date.from));
    formData.append("ends_at", String(data.date.to));

    try {
      await updateTrip(formData, trip.id);
      updateTripDetails(data.destination, data.date.from, data.date.to);
    } catch (err) {
      // TODO: Add toast
      console.log(err);
    }
  };

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title closeModal={closeChangeDetailsModal}>
          <h2 className="text-lg font-semibold">Change trip details</h2>
        </Modal.Title>
        <Modal.Description>
          All activities outside of the new date range will be
          <strong className="font-medium text-foreground">
            {" "}
            permanently deleted
          </strong>
          .
        </Modal.Description>
      </Modal.Header>
      <form onSubmit={handleSubmit(changeDetails)} className="space-y-3">
        <div className="space-y-2">
          <Input
            id="destination"
            label="Trip destination"
            error={errors.destination?.message}
            placeholder="Where are you going?"
            icon={MapPin}
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
                error={errors.date?.message}
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
        </div>
        <Button type="submit" size="full">
          Update details
        </Button>
      </form>
    </Modal>
  );
}
