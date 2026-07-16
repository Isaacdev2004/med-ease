import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  moduleName?: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[RouteErrorBoundary${this.props.moduleName ? `: ${this.props.moduleName}` : ''}]`,
      error,
      info.componentStack,
    );
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                {this.props.moduleName
                  ? `The ${this.props.moduleName} module encountered an error. Other parts of the application remain available.`
                  : 'This section encountered an error. Other parts of the application remain available.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={this.handleRetry}>Try again</Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
