
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-exam-primary to-exam-accent py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ExamVerse Connect
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            The ultimate platform for practice exam papers, assessments, and feedback
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-exam-primary hover:bg-white/90"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="exam-section bg-white">
        <div className="exam-container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Card */}
            <Card className="exam-card">
              <CardHeader>
                <CardTitle className="text-exam-primary">For Admins</CardTitle>
                <CardDescription>
                  Upload and manage practice exam papers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Easily create and distribute practice exams. Organize by subject,
                  difficulty, and track student progress.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Admin"
                  className="h-32 w-32 object-cover"
                />
              </CardFooter>
            </Card>

            {/* Student Card */}
            <Card className="exam-card">
              <CardHeader>
                <CardTitle className="text-exam-primary">For Students</CardTitle>
                <CardDescription>
                  Access practice exams and submit answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Practice with real exam papers, submit your answers, and receive
                  detailed feedback to improve your understanding.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Student"
                  className="h-32 w-32 object-cover"
                />
              </CardFooter>
            </Card>

            {/* Assessor Card */}
            <Card className="exam-card">
              <CardHeader>
                <CardTitle className="text-exam-primary">For Assessors</CardTitle>
                <CardDescription>
                  Review and provide feedback on student answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Efficiently review student submissions, provide constructive
                  feedback, and track improvement over time.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Assessor"
                  className="h-32 w-32 object-cover"
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="exam-section bg-exam-light">
        <div className="exam-container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-exam-primary mb-2">500+</h3>
              <p className="text-exam-dark">Practice Exams</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-exam-primary mb-2">10,000+</h3>
              <p className="text-exam-dark">Students</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-exam-primary mb-2">95%</h3>
              <p className="text-exam-dark">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="exam-section bg-exam-primary text-white">
        <div className="exam-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students and educators on ExamVerse Connect today
          </p>
          <Button
            size="lg"
            className="bg-white text-exam-primary hover:bg-white/90"
            onClick={() => navigate("/login")}
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
