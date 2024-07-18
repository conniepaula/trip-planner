import Link from "next/link";

import Button from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">
        Page Not Found
      </h2>
      <p className="mt-2 text-center">
        Oops! It looks like you&apos;ve taken a wrong turn on your{" "}
        <br aria-hidden="true" /> trip planning journey.
      </p>
      <Link href="/">
        <Button className="mt-4">Go Back Home</Button>
      </Link>
    </div>
  );
}
