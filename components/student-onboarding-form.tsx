"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

// Import your server action
import { completeStudentOnboarding } from "@/app/actions/onboarding";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  currentClass: z.string().min(1, "Please select your current class."),
  studyGroup: z.string().min(1, "Please select a study group."),
  academicGoals: z.string().optional(),
  studyRoutine: z.enum(["daily", "weekends", "exams"]),
});

const STUDY_GROUPS_BY_CLASS: Record<string, { label: string; value: string }[]> = {
  "pre-9th": [
    { label: "Science", value: "science" },
    { label: "Arts/General", value: "arts" },
  ],
  "9th": [
    { label: "Science (Biology)", value: "science-bio" },
    { label: "Science (Computer)", value: "science-computer" },
    { label: "Humanities / Arts", value: "arts" },
  ],
  "10th": [
    { label: "Science (Biology)", value: "science-bio" },
    { label: "Science (Computer)", value: "science-computer" },
    { label: "Humanities / Arts", value: "arts" },
  ],
  "11th": [
    { label: "Pre-Medical", value: "pre-medical" },
    { label: "Pre-Engineering", value: "pre-engineering" },
    { label: "ICS (Computer Science)", value: "ics" },
    { label: "I.Com (Commerce)", value: "icom" },
    { label: "Humanities / Arts", value: "arts" },
  ],
  "12th": [
    { label: "Pre-Medical", value: "pre-medical" },
    { label: "Pre-Engineering", value: "pre-engineering" },
    { label: "ICS (Computer Science)", value: "ics" },
    { label: "I.Com (Commerce)", value: "icom" },
    { label: "Humanities / Arts", value: "arts" },
  ],
};

export default function StudentOnboardingForm() {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      studyRoutine: "daily",
      academicGoals: "",
    },
  });

  const selectedClass = form.watch("currentClass");
  const availableGroups = selectedClass ? STUDY_GROUPS_BY_CLASS[selectedClass] : [];

  useEffect(() => {
    if (selectedClass) {
      form.setValue("studyGroup", "");
    }
  }, [selectedClass, form]);


async function onSubmit(data: z.infer<typeof formSchema>) {
  setIsSubmitting(true);
  try {
    const result = await completeStudentOnboarding(data);
    
    if (result.success) {
      // 1. CRITICAL: Force Clerk to refresh the local session token
      await user?.reload(); 

      // 2. Use a hard redirect to ensure the middleware sees the fresh token
      window.location.href = "/dashboard/student";
    } else {
      alert("Failed to save profile. Please try again.");
    }
  } catch (error) {
    console.error("Onboarding error:", error);
  } finally {
    setIsSubmitting(false);
  }
}

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl bg-card border rounded-2xl shadow-sm p-6 sm:p-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Student Onboarding
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete your profile to get personalized study materials and tutor recommendations.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Section 1: Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
            <p className="mt-1 text-sm text-muted-foreground pr-4">
              Your basic account information. Your email is securely synced.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel>First name</FieldLabel>
                  <Input {...field} placeholder="Ashir" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel>Last name</FieldLabel>
                  <Input {...field} placeholder="Abbasi" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="sm:col-span-2">
              <Field className="gap-2">
                <FieldLabel>Email address</FieldLabel>
                <Input
                  type="email"
                  defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  className="bg-muted/50"
                />
              </Field>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Section 2: Academic Profile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <h2 className="text-lg font-semibold text-foreground">Academic Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground pr-4">
              Tell us about your current studies so we can personalize your dashboard and study materials.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Controller
              name="currentClass"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel>Current Class</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-9th">Pre-9th</SelectItem>
                      <SelectItem value="9th">9th Grade</SelectItem>
                      <SelectItem value="10th">10th Grade (Matric)</SelectItem>
                      <SelectItem value="11th">11th Grade (HSSC-I)</SelectItem>
                      <SelectItem value="12th">12th Grade (HSSC-II)</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="studyGroup"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel>Study Group</FieldLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!selectedClass}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder={selectedClass ? "Select your group" : "Select a class first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="sm:col-span-2">
              <Controller
                name="academicGoals"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel>What are your main study goals?</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="e.g. I want to improve my math score and prepare for final exams..."
                      rows={4}
                    />
                    <FieldDescription>
                      This helps tutors understand how to best assist you.
                    </FieldDescription>
                  </Field>
                )}
              />
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-700 hover:bg-blue-800">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Onboarding"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}