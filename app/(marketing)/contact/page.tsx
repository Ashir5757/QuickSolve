import { ContactSection } from "@/components/contact-section";

export default function Page() {
    return (
        <main className="relative flex size-full min-h-screen w-full items-center justify-center p-4 bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-primary/.2),transparent)]"
        >
            <ContactSection />
        </main>
    );
}
