import type { ReactElement, ReactNode } from "react";
import ErrorBanner from "@/components/Errors/ErrorBanner";
import { getUserErrorMessage } from "@/errors/getErrorMessages";

interface QueryBoundaryProps {
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  data: unknown;
  onRetry: () => void;
  skeleton: ReactNode;
  children: ReactNode;
}

const QueryBoundary = ({
  isLoading,
  isFetching,
  error,
  data,
  onRetry,
  skeleton,
  children,
}: QueryBoundaryProps): ReactElement => {
  if (isLoading || !data) return <>{skeleton}</>;

  if (error) {
    return (
      <ErrorBanner
        message={getUserErrorMessage(error)}
        onRetry={onRetry}
        isRetrying={isFetching}
        variant="fullscreen"
      />
    );
  }

  return <>{children}</>;
};

export default QueryBoundary;
