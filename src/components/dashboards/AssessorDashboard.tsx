
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const AssessorDashboard: React.FC = () => {
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setFeedbackSubmitting(false);
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been successfully sent to the student",
      });
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Assessor Dashboard</h1>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Assessments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="pt-6">
          <div className="space-y-6">
            {[
              { student: "John Doe", exam: "Mathematics Practice Paper 1", date: "April 1, 2025" },
              { student: "Sarah Williams", exam: "Mathematics Practice Paper 2", date: "April 2, 2025" },
              { student: "Michael Brown", exam: "Mathematics Practice Paper 1", date: "April 3, 2025" },
            ].map((submission, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{submission.exam}</CardTitle>
                  <CardDescription>
                    Submitted by {submission.student} on {submission.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-exam-muted">
                      Time in queue: {index + 1} {index === 0 ? "day" : "days"}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Pending Review
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      View Exam Paper
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Student Answer
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-exam-primary hover:bg-exam-primary/90">
                    Start Assessment
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mathematics Practice Paper 3</CardTitle>
                <CardDescription>
                  Submitted by Robert Johnson on March 30, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-exam-muted">
                    Assessed on: April 2, 2025
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Assessment Complete
                  </span>
                </div>
                
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-medium">Strengths</label>
                    <Textarea 
                      placeholder="What did the student do well?"
                      defaultValue="Good understanding of derivatives and their applications. Clear workings shown throughout."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Areas for Improvement</label>
                    <Textarea 
                      placeholder="What could the student improve?"
                      defaultValue="Need to work on integrating functions with substitution. Several errors in questions 8-10."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Additional Comments</label>
                    <Textarea 
                      placeholder="Any other feedback for the student"
                      defaultValue="Overall good effort. Review chapter 7 on integration techniques and try the practice problems at the end of the chapter."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="submit" 
                      className="bg-exam-primary hover:bg-exam-primary/90"
                      disabled={feedbackSubmitting}
                    >
                      {feedbackSubmitting ? "Updating..." : "Update Feedback"}
                    </Button>
                    <Button variant="outline">
                      Download Student Answer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Analytics</CardTitle>
              <CardDescription>
                Overview of your assessment activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h3 className="text-3xl font-bold text-exam-primary mb-2">12</h3>
                  <p className="text-exam-muted">Assessments Completed</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h3 className="text-3xl font-bold text-green-600 mb-2">4.8</h3>
                  <p className="text-exam-muted">Average Rating</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <h3 className="text-3xl font-bold text-purple-600 mb-2">3</h3>
                  <p className="text-exam-muted">Pending Reviews</p>
                </div>
              </div>
              
              <h3 className="font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: "Assessed Mathematics Paper 3", student: "Robert Johnson", time: "2 days ago" },
                  { action: "Assessed Chemistry Paper 2", student: "Emily Davis", time: "3 days ago" },
                  { action: "Updated feedback", student: "Michael Brown", time: "5 days ago" },
                ].map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-exam-muted">
                        {activity.student} • {activity.time}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
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

export default AssessorDashboard;
