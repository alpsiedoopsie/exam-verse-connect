
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/utils/fileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard: React.FC = () => {
  const [fileUploading, setFileUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Fetch exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setExams(data || []);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast({
          title: "Error",
          description: "Failed to load exam papers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [toast]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !examTitle || !subject) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      });
      return;
    }

    setFileUploading(true);
    
    try {
      // 1. Upload the file to storage
      const uploadResult = await uploadFile(
        selectedFile, 
        "exam_papers", 
        `exams/${currentUser?.id || "unknown"}`
      );

      if (!uploadResult.success || !uploadResult.filePath) {
        throw new Error(uploadResult.error || "File upload failed");
      }

      // 2. Create the exam record in the database
      const { data, error } = await supabase
        .from('exams')
        .insert({
          title: examTitle,
          subject: subject,
          description: `${subject} exam - ${examTitle}`,
          file_path: uploadResult.filePath,
          created_by: currentUser?.id || "unknown",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 3. Add the new exam to the state
      setExams([data, ...exams]);
      
      // 4. Reset form
      setExamTitle("");
      setSubject("");
      setFileName("");
      setSelectedFile(null);
      
      // 5. Show success message
      toast({
        title: "Exam paper uploaded",
        description: "The exam paper has been successfully uploaded",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setFileUploading(false);
    }
  };

  const handleExamDelete = async (examId: string) => {
    try {
      const examToDelete = exams.find(exam => exam.id === examId);
      if (!examToDelete) return;

      // Delete from database
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);

      if (error) throw error;

      // Delete from storage if file_path exists
      if (examToDelete.file_path) {
        await supabase.storage
          .from('exam_papers')
          .remove([examToDelete.file_path]);
      }

      // Update state
      setExams(exams.filter(exam => exam.id !== examId));
      
      toast({
        title: "Exam deleted",
        description: "The exam has been successfully deleted",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the exam",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Exams</TabsTrigger>
          <TabsTrigger value="manage">Manage Exams</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Exam Paper</CardTitle>
              <CardDescription>
                Upload new practice exam papers for students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-title">Exam Title</Label>
                  <Input 
                    id="exam-title" 
                    placeholder="Enter exam title" 
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Enter subject" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload PDF</Label>
                  <Input 
                    id="file-upload" 
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
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={fileUploading}
                >
                  {fileUploading ? "Uploading..." : "Upload Exam Paper"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Exam Papers</CardTitle>
              <CardDescription>
                View, edit, or delete existing exam papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : exams.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No exam papers found</p>
              ) : (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div 
                      key={exam.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{exam.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exam.subject} - Created on {new Date(exam.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={async () => {
                            if (!exam.file_path) {
                              toast({
                                title: "No file found",
                                description: "This exam doesn't have an associated file",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            try {
                              const url = await supabase.storage
                                .from('exam_papers')
                                .createSignedUrl(exam.file_path, 60 * 60);
                                
                              if (url.error) throw url.error;
                              window.open(url.data.signedUrl, '_blank');
                            } catch (error) {
                              console.error("Error downloading file:", error);
                              toast({
                                title: "Download failed",
                                description: "Failed to download the exam paper",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Download
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleExamDelete(exam.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>
                View and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "John Doe", email: "john@example.com", role: "Student" },
                  { name: "Jane Smith", email: "jane@example.com", role: "Assessor" },
                  { name: "Robert Johnson", email: "robert@example.com", role: "Student" },
                ].map((user, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-exam-muted">
                        {user.email} - {user.role}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
