"use client";

import { useState } from "react";
// Import the client-side 'api' object from your utility file
import { api } from "@/app/api/trpc-client"; 
import { Clock, Eye, BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Import types to remove "Implicit Any" errors
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProblemWithUser = RouterOutput["problem"]["getAll"]["problems"][number];
type ProblemStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export default function BrowseRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<ProblemStatus | undefined>(
    "OPEN"
  );
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  // Fetch problems with TRPC
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.problem.getAll.useInfiniteQuery(
      {
        limit: 20,
        status: selectedStatus,
      },
      {
        // Explicitly type lastPage to fix ts(7006)
        getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage.nextCursor,
      }
    );

  // Fetch stats for the header
  const { data: stats } = api.problem.getStats.useQuery();

  // Explicitly type page to fix ts(7006)
  const problems = data?.pages.flatMap((page: { problems: ProblemWithUser[] }) => page.problems) ?? [];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Change 'any' to 'ProblemWithUser'
  const ProblemCard = ({ problem }: { problem: ProblemWithUser }) => (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-11 w-11 ring-2 ring-gray-100">
              <AvatarImage
                src={problem.student.user.imageUrl || undefined}
                alt={`${problem.student.user.firstName} ${problem.student.user.lastName}`}
              />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                {problem.student.user.firstName?.[0]}
                {problem.student.user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {problem.subject} - Grade {problem.grade}
              </h3>
              <p className="text-sm text-gray-600">
                {problem.student.user.firstName} {problem.student.user.lastName} •{" "}
                {formatTimeAgo(problem.createdAt)}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={
              problem.status === "OPEN"
                ? "bg-green-50 text-green-700 border-green-200"
                : problem.status === "IN_PROGRESS"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }
          >
            {problem.status === "OPEN"
              ? "Available"
              : problem.status === "IN_PROGRESS"
              ? "In Progress"
              : "Resolved"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-gray-700 line-clamp-2 leading-relaxed">
          {problem.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>{problem.subject}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <GraduationCap className="h-4 w-4" />
            <span>Grade {problem.grade}</span>
          </div>
          {problem.images.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Eye className="h-4 w-4" />
              <span>{problem.images.length} image{problem.images.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t bg-gray-50/50">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              onClick={() => setSelectedProblem(problem.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <ProblemDetailModal problemId={problem.id} />
          </DialogContent>
        </Dialog>

        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          Accept Request
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Browse Requests
              </h1>
              <p className="text-gray-600 text-sm">
                Review student problems and start teaching sessions
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Available
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.open ?? 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Active
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.inProgress ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <Tabs
          defaultValue="OPEN"
          className="space-y-5"
          onValueChange={(value) =>
            setSelectedStatus(value as ProblemStatus | undefined)
          }
        >
          <TabsList className="bg-white border">
            <TabsTrigger
              value="OPEN"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              Available ({stats?.open ?? 0})
            </TabsTrigger>
            <TabsTrigger
              value="IN_PROGRESS"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              In Progress ({stats?.inProgress ?? 0})
            </TabsTrigger>
            <TabsTrigger
              value="RESOLVED"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              Resolved ({stats?.resolved ?? 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus || "OPEN"} className="space-y-4">
            {isLoading ? (
              <>
                <LoadingSkeleton />
                <LoadingSkeleton />
              </>
            ) : problems.length === 0 ? (
              <Card className="py-12">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">No requests found</h3>
                </div>
              </Card>
            ) : (
              <>
                {problems.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}

                {hasNextPage && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full max-w-md"
                    >
                      {isFetchingNextPage ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProblemDetailModal({ problemId }: { problemId: string }) {
  const { data: problem, isLoading } = api.problem.getById.useQuery({
    id: problemId,
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!problem) return <div>Problem not found</div>;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gray-900">
          {problem.subject} - Grade {problem.grade}
        </DialogTitle>
        <DialogDescription>
          <div className="flex items-center gap-3 mt-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={problem.student.user.imageUrl || undefined} />
              <AvatarFallback>
                {problem.student.user.firstName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {problem.student.user.firstName} {problem.student.user.lastName}
              </p>
              <p className="text-xs text-gray-500">
                Posted {new Date(problem.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 mt-4">
        <div className="flex gap-2">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            {problem.subject}
          </Badge>
          <Badge variant="outline">Grade {problem.grade}</Badge>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {problem.description}
          </p>
        </div>

        {problem.images.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Attached Images ({problem.images.length})
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {problem.images.map((imageUrl: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border"
                >
                  <Image
                    src={imageUrl}
                    alt={`Problem image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            Accept Request & Start Session
          </Button>
        </div>
      </div>
    </>
  );
}