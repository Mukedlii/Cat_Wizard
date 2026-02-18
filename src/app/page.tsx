import { ClientReady } from "@/app/components/ClientReady";
import { Gallery } from "@/app/components/Gallery";

export default function Page() {
  return (
    <main style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>
      <ClientReady />
      <Gallery />
    </main>
  );
}
