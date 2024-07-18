"use client";

import { Link2, Pencil, Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import { createLink } from "@/utils/create-link";
import { useTrip } from "@/contexts/trip-context";

const createLinkFormSchema = z.object({
  title: z.string().min(2, "Link title must have at least three characters."),
  url: z.string().url("Incorrect URL format."),
});

type CreateLinkFormValues = z.infer<typeof createLinkFormSchema>;

interface NewLinkModalProps {
  closeNewLinkModal: () => void;
}
export default function NewLinkModal(props: NewLinkModalProps) {
  const { closeNewLinkModal } = props;
  const { tripId } = useParams();
  const { addLink } = useTrip();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkFormValues>({
    resolver: zodResolver(createLinkFormSchema),
    defaultValues: { title: "", url: "" },
  });

  const createNewLink = async (data: CreateLinkFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("url", data.url);

    try {
      const { linkId } = await createLink(formData, String(tripId));
      addLink(linkId, data.title, data.url);
      reset();
    } catch (err) {
      // TODO: Add toast component
      alert("Error creating link");
    }
  };

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title closeModal={closeNewLinkModal}>
          <h2 className="text-lg font-semibold">Create link</h2>
        </Modal.Title>
        <Modal.Description>Add trip related link.</Modal.Description>
      </Modal.Header>
      <div>
        <form onSubmit={handleSubmit(createNewLink)} className="space-y-3">
          <div className="space-y-2">
            <Input
              id="title"
              label="Link title"
              error={errors.title?.message}
              icon={Pencil}
              placeholder="Link title"
              {...register("title")}
            />
            <Input
              id="url"
              label="Link URL"
              error={errors.url?.message}
              icon={Link2}
              placeholder="Link URL"
              {...register("url")}
            />
          </div>
          <Button type="submit" size="full">
            Add new link
            <Plus className="size-5" />
          </Button>
        </form>
      </div>
    </Modal>
  );
}
