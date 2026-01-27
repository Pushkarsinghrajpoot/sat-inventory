"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DashboardLayout title="Error">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-6">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <Button 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="mr-2"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/contracts"}
              >
                Back to Contracts
              </Button>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
