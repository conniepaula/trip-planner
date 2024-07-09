"use client";
import {
  MapPin,
  Calendar,
  ArrowRight,
  UserRoundPlus,
  Settings2,
  X,
  AtSign,
  Plus,
} from "lucide-react";
import { FormEvent, useState } from "react";

export default function Home() {
  const [isGuestInputOpen, setIsGuestInputOpen] = useState<boolean>(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState<boolean>(false);
  const [emailsToInvite, setEmailsToInvite] = useState<Array<string>>([
    "test@test.com",
  ]);

  const openGuestInput = () => {
    setIsGuestInputOpen(true);
  };

  const closeGuestInput = () => {
    setIsGuestInputOpen(false);
  };

  const openGuestModal = () => {
    setIsGuestModalOpen(true);
  };

  const closeGuestModal = () => {
    setIsGuestModalOpen(false);
  };

  const addEmailToInvites = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if (!email) return;

    if (emailsToInvite.includes(email)) return;

    setEmailsToInvite((prev) => [...prev, email]);

    event.currentTarget.reset();
  };

  const removeEmailFromInvites = (emailToRemove: string) => {
    const updatedEmailList = emailsToInvite.filter(
      (guestEmail) => guestEmail !== emailToRemove,
    );
    setEmailsToInvite(updatedEmailList);
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="w-full max-w-3xl space-y-10 px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl">plann.er</span>
          <p className="text-lg text-zinc-300">
            Invite your friends and organise your next trip!
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex h-16 items-center gap-3 rounded-xl bg-zinc-900 px-4 shadow-sm">
            <div className="flex flex-1 items-center gap-2">
              <MapPin className="size-5 text-zinc-400" />
              <input
                disabled={isGuestInputOpen}
                type="text"
                placeholder="Where are you going?"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-zinc-400" />
              <input
                disabled={isGuestInputOpen}
                type="text"
                placeholder="When is your trip?"
                className="bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>
            <div className="h-6 w-px bg-zinc-800" />

            {isGuestInputOpen ? (
              <button
                onClick={closeGuestInput}
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-5 py-2 font-medium text-zinc-200 hover:bg-zinc-700 hover:transition-colors"
              >
                Change details
                <Settings2 className="size-5" />
              </button>
            ) : (
              <button
                onClick={openGuestInput}
                className="flex items-center gap-2 rounded-lg bg-rose-300 px-5 py-2 font-medium text-rose-950 hover:bg-rose-400 hover:transition-colors"
              >
                Continue
                <ArrowRight className="size-5" />
              </button>
            )}
          </div>
          {isGuestInputOpen && (
            <div className="flex h-16 items-center gap-3 rounded-xl bg-zinc-900 px-4 shadow-sm">
              <button
                type="button"
                onClick={openGuestModal}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <UserRoundPlus className="size-5 text-zinc-400" />
                <span className="flex-1 text-lg text-zinc-400">
                  Who is coming?
                </span>
              </button>

              <div className="h-6 w-px bg-zinc-800" />

              <button
                onClick={openGuestInput}
                className="flex items-center gap-2 rounded-lg bg-rose-300 px-5 py-2 font-medium text-rose-950 hover:bg-rose-400 hover:transition-colors"
              >
                Confirm trip
                <ArrowRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-500">
          By using plann.er, you agree with our{" "}
          <a href="#" className="text-zinc-300 underline">
            terms and privacy policy
          </a>
          .
        </p>
      </div>
      {isGuestModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Invite guests</h2>
                <button type="button" onClick={closeGuestModal}>
                  <X className="size-5 text-zinc-400" />
                </button>
              </div>
              <p className="text-sm text-zinc-400">
                Guest will have to confirm trip through their emails.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {emailsToInvite.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 rounded-md bg-zinc-800 px-2.5 py-1.5"
                >
                  <span className="text-zinc-300">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeEmailFromInvites(email)}
                  >
                    <X className="size-4 text-zinc-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-zinc-800" />

            <form
              onSubmit={addEmailToInvites}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5"
            >
              <div className="flex flex-1 items-center gap-2 px-2">
                <AtSign className="size-5 text-zinc-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Type guest email"
                  className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-rose-300 px-5 py-2 font-medium text-rose-950 hover:bg-rose-400 hover:transition-colors"
              >
                Invite
                <Plus className="size-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
