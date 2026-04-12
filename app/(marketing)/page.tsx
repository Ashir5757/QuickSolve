import { HeroSection } from "@/components/hero";
import { LogosSection } from "@/components/logos-section";
import { TestimonialsSection } from "@/components/testimonials-section";


export default function Page() {

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
            <main className="grow">
                <HeroSection />
                <LogosSection />
            </main>
            <div className="min-h-screen place-content-center">
                <TestimonialsSection />
            </div>
        </div>
    );
}