import CreateTripForm from "@/components/home/create-trip-form";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="w-full max-w-3xl space-y-10 px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl">plann.er</span>
          <p className="text-lg text-zinc-300">
            Invite your friends and organise <br className="block sm:hidden" />
            your next trip!
          </p>
        </div>

        <CreateTripForm />

        <p className="text-sm text-zinc-500">
          By using plann.er, you agree with our{" "}
          <br className="block sm:hidden" />
          <a href="#" className="text-zinc-300 underline">
            terms and privacy policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
