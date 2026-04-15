import StudentOnboardingForm from "@/components/student-onboarding-form"
export default function StudentOnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col  bg-background text-center">
      <div>
        <StudentOnboardingForm />
      </div>
    </div>
  )
}