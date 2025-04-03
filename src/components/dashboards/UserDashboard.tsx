
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { uploadFile, getSignedFileUrl } from "@/utils/fileUpload";

const UserDashboard: React.FC = () => {
  const [answerUploading, setAnswerUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [comments, setComments] = useState("");
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState({
    exams: true,
    submissions: true,
    feedback: true
  });
  
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Fetch available exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAvailableExams(data || []);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast({
          title: "Error",
          description: "Failed to load exam papers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(prev => ({ ...prev, exams: false }));
      }
    };

    fetchExams();
  }, [toast]);

  // Fetch user's submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!currentUser) return;

      try {
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            *,
            exams(title, subject)
          `)
          .eq('user_id', currentUser.id)
          .order('submitted_at', { ascending: false });
        
        if (error) throw error;
        setSubmissions(data || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast({
          title: "Error",
          description: "Failed to load your submissions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(prev => ({ ...prev, submissions: false }));
      }
    };

    fetchSubmissions();
  }, [currentUser, toast]);

  // Fetch feedback for user's submissions
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!currentUser) return;

      try {
        // Get user submissions
        const { data: userSubmissions, error: submissionsError } = await supabase
          .from('submissions')
          .select('id')
          .eq('user_id', currentUser.id);
        
        if (submissionsError) throw submissionsError;
        if (!userSubmissions || userSubmissions.length === 0) {
          setIsLoading(prev => ({ ...prev, feedback: false }));
          return;
        }

        // Get feedback for these submissions
        const submissionIds = userSubmissions.map(sub => sub.id);
        const { data, error } = await supabase
          .from('feedback')
          .select(`
            *,
            submissions(
              id,
              exams(title, subject)
            )
          `)
          .in('submission_id', submissionIds)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setFeedback(data || []);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast({
          title: "Error",
          description: "Failed to load feedback",
          variant: "destructive",
        });
      } finally {
        setIsLoading(prev => ({ ...prev, feedback: false }));
      }
    };

    fetchFeedback();
  }, [currentUser, toast]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !selectedExamId) {
      toast({
        title: "Missing information",
        description: "Please select an exam and upload a file",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit answers",
        variant: "destructive",
      });
      return;
    }

    setAnswerUploading(true);
    
    try {
      // 1. Upload the file to storage
      const uploadResult = await uploadFile(
        selectedFile, 
        "submissions", 
        `${currentUser.id}/exams/${selectedExamId}`
      );

      if (!uploadResult.success || !uploadResult.filePath) {
        throw new Error(uploadResult.error || "File upload failed");
      }

      // 2. Create the submission record in the database
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          exam_id: selectedExamId,
          user_id: currentUser.id,
          file_path: uploadResult.filePath,
          status: 'pending'
        })
        .select(`
          *,
          exams(title, subject)
        `)
        .single();

      if (error) {
        throw error;
      }

      // 3. Add the new submission to the state
      setSubmissions([data, ...submissions]);
      
      // 4. Reset form
      setSelectedExamId("");
      setFileName("");
      setSelectedFile(null);
      setComments("");
      
      // 5. Show success message
      toast({
        title: "Answer submitted",
        description: "Your answer has been successfully submitted for review",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setAnswerUploading(false);
    }
  };

  const downloadExamPaper = async (exam: any) => {
    try {
      if (!exam.file_path) {
        toast({
          title: "No file found",
          description: "This exam doesn't have an associated file",
          variant: "destructive",
        });
        return;
      }
      
      const url = await getSignedFileUrl('exam_papers', exam.file_path);
      
      if (!url) {
        throw new Error("Failed to generate download URL");
      }
      
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the exam paper",
        variant: "destructive",
      });
    }
  };

  const downloadSubmission = async (submission: any) => {
    try {
      if (!submission.file_path) {
        toast({
          title: "No file found",
          description: "This submission doesn't have an associated file",
          variant: "destructive",
        });
        return;
      }
      
      const url = await getSignedFileUrl('submissions', submission.file_path);
      
      if (!url) {
        throw new Error("Failed to generate download URL");
      }
      
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the submission",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Exams</TabsTrigger>
          <TabsTrigger value="submitted">My Submissions</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="pt-6">
          {isLoading.exams ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : availableExams.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No exam papers available</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {availableExams.map((exam) => (
                <Card key={exam.id} className="exam-card">
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>
                      {exam.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exam.description || `${exam.subject} practice exam`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {exam.subject}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Published: {new Date(exam.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full">
                      <Button 
                        variant="outline"
                        onClick={() => downloadExamPaper(exam)}
                      >
                        Download
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedExamId(exam.id);
                          document.getElementById('submit-tab')?.click();
                        }}
                      >
                        Submit Answer
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="submitted" className="pt-6" id="submit-tab">
          <Card>
            <CardHeader>
              <CardTitle>Submit Answer</CardTitle>
              <CardDescription>
                Upload your answer to a practice exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-select">Select Exam</Label>
                  <select 
                    id="exam-select" 
                    className="w-full p-2 border rounded-md"
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    required
                  >
                    <option value="">Choose an exam</option>
                    {availableExams.map(exam => (
                      <option key={exam.id} value={exam.id}>
                        {exam.title} - {exam.subject}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="answer-file">Upload Answer (PDF)</Label>
                  <Input 
                    id="answer-file" 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setFileName(files[0].name);
                        setSelectedFile(files[0]);
                      }
                    }}
                    required 
                  />
                  {fileName && (
                    <p className="text-sm text-muted-foreground">
                      Selected file: {fileName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea 
                    id="comments" 
                    placeholder="Any additional information you'd like to share with the assessor"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={answerUploading}
                >
                  {answerUploading ? "Submitting..." : "Submit Answer"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Previous Submissions</h2>
            {isLoading.submissions ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : submissions.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No submissions found</p>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div 
                    key={submission.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{submission.exams?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`text-xs ${
                          submission.status === "graded" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        } px-2 py-1 rounded-full`}
                      >
                        {submission.status === "graded" ? "Graded" : "Under Review"}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadSubmission(submission)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="pt-6">
          {isLoading.feedback ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : feedback.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No feedback available yet</p>
          ) : (
            <div className="space-y-6">
              {feedback.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.submissions?.exams?.title}</CardTitle>
                    <CardDescription>
                      Feedback from assessor on {new Date(item.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {item.strengths && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                        <h3 className="font-medium text-green-800 mb-2">Strengths</h3>
                        <p className="text-green-700">{item.strengths}</p>
                      </div>
                    )}
                    
                    {item.improvements && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                        <h3 className="font-medium text-yellow-800 mb-2">Areas for improvement</h3>
                        <p className="text-yellow-700">{item.improvements}</p>
                      </div>
                    )}
                    
                    {item.comments && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-2">Additional comments</h3>
                        <p className="text-blue-700">{item.comments}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Find the submission associated with this feedback
                        const submission = submissions.find(sub => sub.id === item.submission_id);
                        if (submission) {
                          downloadSubmission(submission);
                        }
                      }}
                    >
                      Download My Answer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
