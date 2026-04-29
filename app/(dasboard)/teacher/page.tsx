"use client";

import { useState, useEffect } from "react";
import { getAllStudents } from "@/app/actions/get-students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Video, GraduationCap } from "lucide-react";

export default function TeacherDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  return (

      <div className="p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Console</h1>
          <p className="text-muted-foreground">Monitor students and prepare for upcoming requests.</p>
        </header>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Registered Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" /> 
            Available Students
          </h2>
          
          {loading ? (
            <p className="text-muted-foreground animate-pulse">Fetching from Supabase...</p>
          ) : (
            <div className="grid gap-4">
              {students.length > 0 ? (
                students.map((student) => (
                  <Card key={student.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.user?.name?.[0] || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">{student.user?.name}</p>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            <span>{student.grade || "No Grade Set"}</span>
                            <span>•</span>
                            <span className="text-primary font-medium">Credits: {student.credits}</span>
                          </div>
                        </div>
                      </div>
                      <Button className="gap-2" onClick={() => window.location.href = `/meeting/session-${student.id}`}>
                        <Video className="h-4 w-4" />
                        Invite to Class
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No students found in the database.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
 
  );
}