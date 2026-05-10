"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { uploadProblem } from "@/app/actions/problems";
import { getStudentGradeAction } from "@/app/actions/get-grade";
import { toast } from "sonner";

const formSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  grade: z.string().min(1, "Please select a grade"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function StudentProblemUpload({ onSuccess }: { onSuccess?: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      grade: "",
      description: "",
    },
  });

  const selectedGrade = watch("grade");

  useEffect(() => {
    async function fetchGrade() {
      try {
        const fetchedGrade = await getStudentGradeAction();
        if (fetchedGrade) {
          setValue("grade", fetchedGrade);
        }
      } catch (error) {
        console.error("Failed to load grade:", error);
      }
    }
    fetchGrade();
  }, [setValue]);

  async function onSubmit(values: FormData) {
    setIsUploading(true);
    const toastId = toast.loading("Uploading images and saving your problem...");

    try {
      const imageUrls: string[] = [];
      const BUCKET_NAME = "problems";

      for (const file of uploadedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      const result = await uploadProblem({
        ...values,
        images: imageUrls,
      });

      if (result.success) {
        toast.success("Problem posted successfully!", { id: toastId });

        reset();
        setUploadedFiles([]);
        setFileProgresses({});

        onSuccess?.();
      } else {
        toast.error("Database error. Please try again.", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 300);
    });
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
  };

  return (
    <div className="w-full">
      <Card className="w-full max-w-lg shadow-lg border-t-4 border-t-primary rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Post a New Problem</h2>
              <p className="text-sm text-muted-foreground">Fill in the details so a tutor can help you.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Subject</Label>
                    <Input
                      {...register("subject")}
                      placeholder="e.g. Physics, Math, Chemistry"
                      className={errors.subject ? "border-destructive" : ""}
                    />
                    {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <Label className="mb-2 block">Class</Label>
                    <Select value={selectedGrade} onValueChange={(val) => setValue("grade", val)}>
                      <SelectTrigger className={`w-full ${errors.grade ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="9th">9th Grade</SelectItem>
                          <SelectItem value="10th">10th Grade</SelectItem>
                          <SelectItem value="11th">11th Grade</SelectItem>
                          <SelectItem value="12th">12th Grade</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="mb-2 block">Problem Description</Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Explain your problem clearly so a tutor can help you..."
                    className={`h-[100px] resize-none ${errors.description ? "border-destructive" : ""}`}
                  />
                </div>

                {/* Upload Box */}
                <div>
                  <Label className="mb-2 block">Problem Picture</Label>

                  <div className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="mb-2 bg-muted rounded-full p-3">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="text-sm font-medium">Upload a problem image</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or <span className="text-primary font-medium">click to browse</span> (4MB max)
                    </p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>
                </div>

                {/* File List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3 mt-4 max-h-64 overflow-y-auto pr-2">
                    {uploadedFiles.map((file, index) => {
                      const imageUrl = URL.createObjectURL(file);

                      return (
                        <div key={file.name + index} className="border border-border rounded-lg p-2 flex flex-col">
                          <div className="flex items-center gap-2">

                            <div className="w-18 h-14 bg-muted rounded-sm overflow-hidden">
                              <img src={imageUrl} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div className="flex gap-2">
                                  <span className="text-sm truncate max-w-[180px]">{file.name}</span>
                                  <span className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
                                </div>

                                <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex items-center gap-2 mt-1">
                                <div className="h-2 bg-muted rounded-full flex-1">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${fileProgresses[file.name] || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(fileProgresses[file.name] || 0)}%
                                </span>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { reset(); setUploadedFiles([]); }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Post Problem"}
                </Button>
              </div>

            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}