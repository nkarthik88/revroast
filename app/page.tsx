import PageClient from "./PageClient";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <PageClient />
    </Suspense>
  );
}
