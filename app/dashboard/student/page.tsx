"use client";

// Added useEffect to the import
import { useState, useEffect } from "react"; 
import { getAvailableTeachers } from "@/app/actions/get-teachers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeachers() {
      try {
        const data = await getAvailableTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  return (
    
      <div className="p-6 space-y-8">
        <h1 className="text-3xl font-bold">Find a Tutor</h1>
        
        {loading ? (
          <p className="text-muted-foreground animate-pulse">Connecting to database...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    {/* Accessing user.name from the Prisma include */}
                    <CardTitle>{teacher.user?.name || "Anonymous Teacher"}</CardTitle>
                    <Badge variant="secondary">{teacher.subject}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm italic mb-4 text-muted-foreground">
                      {teacher.bio || "No bio provided."}
                    </p>
                    <div className="flex items-center justify-between mb-4 text-sm font-semibold">
                       <span>Rating: {teacher.rating} ⭐</span>
                       <span>PKR {teacher.hourlyRate.toString()} / hr</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => window.location.href = `/meeting/${teacher.id}`}
                    >
                      Request Class
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">No teachers are currently online.</p>
            )}
          </div>
        )}
      </div>
   
  );
}