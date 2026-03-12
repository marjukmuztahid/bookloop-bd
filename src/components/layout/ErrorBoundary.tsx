import React from 'react';
import { GlassButton } from '@/components/ui/GlassButton';

interface State { hasError: boolean; }

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="glass-panel max-w-sm p-8 text-center">
            <p className="mb-2 text-5xl font-extrabold text-[#8A8A8A]">😵</p>
            <h1 className="mb-2 text-xl font-bold text-[#1A1A1A]">Something went wrong</h1>
            <p className="mb-5 text-sm text-[#8A8A8A]">An unexpected error occurred. Please try refreshing the page.</p>
            <GlassButton onClick={() => window.location.reload()}>Refresh Page</GlassButton>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
