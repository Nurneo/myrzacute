import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in App Component Tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center bg-card text-foreground select-none">
          <div className="p-4 rounded-3xl bg-red-500/10 text-red-500 mb-4 border-[3px] border-red-500/30 animate-pulse">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-2">Oops! Something went wrong</h2>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            An unexpected error occurred. Click below to refresh the page.
          </p>
          <button
            onClick={this.handleReset}
            className="py-3 px-6 rounded-2xl bg-primary text-primary-foreground font-bold border-[3px] border-border hover:opacity-90 transition-all flex items-center gap-2 shadow-md active:scale-95"
          >
            <RotateCcw size={18} />
            <span>Reload App</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
