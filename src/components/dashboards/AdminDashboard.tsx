
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard: React.FC = () => {
  const [fileUploading, setFileUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setFileUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setFileUploading(false);
      setFileName("");
      toast({
        title: "Exam paper uploaded",
        description: "The exam paper has been successfully uploaded",
      });
    }, 1500);
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
                  <Input id="exam-title" placeholder="Enter exam title" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter subject" required />
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
                      }
                    }}
                    required 
                  />
                  {fileName && (
                    <p className="text-sm text-exam-muted">
                      Selected file: {fileName}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-exam-primary hover:bg-exam-primary/90"
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
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Mathematics Practice Paper {item}</h3>
                      <p className="text-sm text-exam-muted">
                        Uploaded on April {item}, 2025
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
