import { PricingSection } from "@/components/pricing-section";

export default function Page() {
	return (
		<div className="relative min-h-screen place-content-center p-4 bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-primary/.2),transparent)]">
			<PricingSection />
		</div>
	);
}