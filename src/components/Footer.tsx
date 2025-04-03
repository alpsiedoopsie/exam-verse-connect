
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-exam-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-white font-bold text-2xl">ExamVerse</span>
              <span className="text-exam-accent font-medium">Connect</span>
            </Link>
            <p className="text-exam-muted mb-4 max-w-md">
              ExamVerse Connect is a comprehensive platform for practice exam papers,
              enabling students to practice, receive feedback, and improve their
              academic performance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-exam-muted hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-exam-muted hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/exams" className="text-exam-muted hover:text-white transition-colors">
                  Exams
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-exam-muted hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-exam-muted">
                Email: support@examverse.example
              </li>
              <li className="text-exam-muted">
                Phone: +1 (123) 456-7890
              </li>
              <li className="text-exam-muted">
                Address: 123 Education Street, Learning City
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-exam-muted text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ExamVerse Connect. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-exam-muted hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-exam-muted hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
