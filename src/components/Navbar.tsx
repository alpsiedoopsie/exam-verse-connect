
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-exam-primary font-bold text-2xl">ExamVerse</span>
          <span className="text-exam-accent font-medium">Connect</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium text-exam-dark hover:text-exam-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/exams"
            className="text-sm font-medium text-exam-dark hover:text-exam-primary transition-colors"
          >
            Exams
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-exam-dark hover:text-exam-primary transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={currentUser.name} />
                    <AvatarFallback className="bg-exam-primary text-white">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              className="bg-exam-primary hover:bg-exam-primary/90"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
