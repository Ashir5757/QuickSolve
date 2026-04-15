"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Loader2 } from "lucide-react";

// 1. Zod Validation Schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  fbiseReg: z.string().optional(),
  fbiseRoll: z.string().optional(),
  currentClass: z.string({ required_error: "Please select your current class." }),
  studyGroup: z.string({ required_error: "Please select a study group." }),
  academicGoals: z.string().optional(),
  studyRoutine: z.enum(["daily", "weekends", "exams"], {
    required_error: "Please select your study routine.",
  }),
});

export default function FormLayout02() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Initialize React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      fbiseReg: "",
      fbiseRoll: "",
      academicGoals: "",
      studyRoutine: "daily",
    },
  });

  // 3. Submit Handler
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Check validation data in console
    console.log("Validated Data:", data);

    // TODO: Send data to your database here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    // Redirect on success
    router.push("/dashboard/student");
  }

  // Guard statement to prevent default value warnings
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center p-4 sm:p-10">
      <div className="w-full max-w-5xl bg-card border rounded-2xl shadow-sm p-6 sm:p-12">

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Student Onboarding
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete your profile to get personalized study materials and tutor recommendations.
          </p>
        </div>

        <form id="onboarding-form" onSubmit={form.handleSubmit(onSubmit)}>

          {/* Section 1: Personal Information */}
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
                    <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ali"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Khan"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="sm:col-span-2">
                <Field className="gap-2">
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    type="email"
                    id="email"
                    defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </Field>
              </div>
            </div>
          </div>

          <Separator className="my-10" />

          {/* Section 2: FBISE Auto-Fetch */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h2 className="text-lg font-semibold text-foreground">Board Information</h2>
              <p className="mt-1 text-sm text-muted-foreground pr-4">
                If you belong to the Federal Board, we can automatically pull your academic history to save you time.
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-primary font-medium">
                  <GraduationCap className="w-5 h-5" />
                  FBISE Auto-Fill (Optional)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Controller
                    name="fbiseReg"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-2">
                        <FieldLabel htmlFor={field.name} className="text-foreground">Registration No.</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. 210987654"
                          className="bg-background"
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name="fbiseRoll"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-2">
                        <FieldLabel htmlFor={field.name} className="text-foreground">Previous Roll No.</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. 543210"
                          className="bg-background"
                        />
                      </Field>
                    )}
                  />
                </div>

                <Button type="button" variant="default" className="w-full sm:w-auto shadow-sm">
                  Fetch FBISE Data
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-10" />

          {/* Section 3: Academic Profile */}
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
                    <FieldLabel htmlFor={field.name}>Current Class</FieldLabel>
                    
                    <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
                    <FieldLabel htmlFor={field.name}>Study Group</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select your group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science-bio">Science (Pre-Medical)</SelectItem>
                        <SelectItem value="science-math">Science (Pre-Engineering)</SelectItem>
                        <SelectItem value="ics">ICS (Computer Science)</SelectItem>
                        <SelectItem value="arts">Humanities / Arts</SelectItem>
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
                      <FieldLabel htmlFor={field.name}>What are your main study goals?</FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
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

          {/* Section 4: Study Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h2 className="text-lg font-semibold text-foreground">Study Preferences</h2>
              <p className="mt-1 text-sm text-muted-foreground pr-4">
                Let us know how often you plan to use QuickSolve to manage your notifications.
              </p>
            </div>

            <div className="md:col-span-8">
              <Controller
                name="studyRoutine"
                control={form.control}
                render={({ field, fieldState }) => (
                  <fieldset>
                    <legend className="text-sm font-medium text-foreground">
                      Study Routine
                    </legend>
                    <FieldDescription id="routine-description" className="mt-2 leading-6">
                      How often do you usually study online?
                    </FieldDescription>

                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      name={field.name}
                      className="mt-6 space-y-2"
                    >
                      <div className="flex items-center gap-x-3 bg-muted/30 p-3 rounded-lg border border-transparent hover:border-border transition-colors">
                        <RadioGroupItem id="daily" value="daily" aria-describedby="routine-description" />
                        <FieldLabel htmlFor="daily" className="font-normal cursor-pointer w-full m-0">
                          Daily (Consistent learning)
                        </FieldLabel>
                      </div>
                      <div className="flex items-center gap-x-3 bg-muted/30 p-3 rounded-lg border border-transparent hover:border-border transition-colors">
                        <RadioGroupItem id="weekends" value="weekends" aria-describedby="routine-description" />
                        <FieldLabel htmlFor="weekends" className="font-normal cursor-pointer w-full m-0">
                          Weekends only (Revision)
                        </FieldLabel>
                      </div>
                      <div className="flex items-center gap-x-3 bg-muted/30 p-3 rounded-lg border border-transparent hover:border-border transition-colors">
                        <RadioGroupItem id="exams" value="exams" aria-describedby="routine-description" />
                        <FieldLabel htmlFor="exams" className="font-normal cursor-pointer w-full m-0">
                          Only during exam season
                        </FieldLabel>
                      </div>
                    </RadioGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="mt-2" />
                    )}
                  </fieldset>
                )}
              />
            </div>
          </div>

          <Separator className="my-10" />

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="onboarding-form"
              className="w-full sm:w-auto shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Onboarding"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}