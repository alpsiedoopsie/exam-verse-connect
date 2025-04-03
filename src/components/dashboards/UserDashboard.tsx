
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const UserDashboard: React.FC = () => {
  const [answerUploading, setAnswerUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnswerUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setAnswerUploading(false);
      setFileName("");
      toast({
        title: "Answer submitted",
        description: "Your answer has been successfully submitted for review",
      });
    }, 1500);
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
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="exam-card">
                <CardHeader>
                  <CardTitle>Mathematics Practice Paper {item}</CardTitle>
                  <CardDescription>
                    Calculus and Algebra - 90 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-exam-muted mb-4">
                    This practice exam covers topics in calculus and algebra,
                    including derivatives, integrals, and equation solving.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-exam-accent/20 text-exam-accent px-2 py-1 rounded-full">
                      Difficulty: {item % 3 === 0 ? "Hard" : item % 2 === 0 ? "Medium" : "Easy"}
                    </span>
                    <span className="text-xs text-exam-muted">
                      Published: April {item}, 2025
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center w-full">
                    <Button variant="outline">Download</Button>
                    <Button>Submit Answer</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="submitted" className="pt-6">
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
                    required
                  >
                    <option value="">Choose an exam</option>
                    <option value="1">Mathematics Practice Paper 1</option>
                    <option value="2">Mathematics Practice Paper 2</option>
                    <option value="3">Mathematics Practice Paper 3</option>
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
                
                <div className="space-y-2">
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea 
                    id="comments" 
                    placeholder="Any additional information you'd like to share with the assessor"
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-exam-primary hover:bg-exam-primary/90"
                  disabled={answerUploading}
                >
                  {answerUploading ? "Submitting..." : "Submit Answer"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Previous Submissions</h2>
            <div className="space-y-4">
              {[
                { exam: "Mathematics Practice Paper 1", status: "Graded", date: "April 1, 2025" },
                { exam: "Mathematics Practice Paper 2", status: "Under Review", date: "April 2, 2025" },
              ].map((submission, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{submission.exam}</h3>
                    <p className="text-sm text-exam-muted">
                      Submitted on {submission.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className={`text-xs ${
                        submission.status === "Graded" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      } px-2 py-1 rounded-full`}
                    >
                      {submission.status}
                    </span>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="pt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mathematics Practice Paper 1</CardTitle>
                <CardDescription>
                  Feedback from assessor on April 1, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <h3 className="font-medium text-green-800 mb-2">Excellent work!</h3>
                  <p className="text-green-700">
                    Your approach to calculus problems was excellent. I particularly liked
                    your detailed step-by-step solutions for the integration problems.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Areas for improvement</h3>
                  <p className="text-yellow-700">
                    Work on your algebraic manipulations. In questions 5 and 7, there were 
                    errors in simplifying the expressions. Review the attached notes.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Study recommendation</h3>
                  <p className="text-blue-700">
                    Focus on practicing more complex algebraic simplifications. I recommend
                    working through chapters 4-5 in the textbook for additional practice.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Download Annotated Answer</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
