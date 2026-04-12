import { HeroSection } from "@/components/hero";
import { LogosSection } from "@/components/logos-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FeatureSection } from "@/components/feature-section";


export default function Page() {

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
            <main className="grow">
                <HeroSection />
                <LogosSection />
            </main>
             <section className="min-h-screen place-content-center p-4">
                <FeatureSection />
            </section>
            <div className="min-h-screen place-content-center">
                <TestimonialsSection />
            </div>
           
        </div>
    );
}