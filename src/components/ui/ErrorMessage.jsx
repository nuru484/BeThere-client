// src/components/ui/ErrorMessage.jsx
import PropTypes from "prop-types";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorMessage = ({
  error,
  onRetry,
  title = "Something went wrong",
  className = "",
}) => {
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred. Please try again.";
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}
    >
      {/* Icon with subtle animation */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-destructive/10 rounded-full blur-xl opacity-30"></div>
        <div className="relative bg-gradient-to-br from-destructive/5 to-destructive/10 p-4 rounded-2xl border border-destructive/20">
          <AlertCircle className="w-8 h-8 text-destructive" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-md space-y-3">
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {errorMessage}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-8">
        {/* Go back button */}
        <button
          onClick={() => navigate(-1)}
          className="group hover:cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 bg-secondary text-secondary-foreground text-sm font-medium rounded-xl hover:bg-secondary/80 active:bg-secondary/90 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-300" />
          Go back
        </button>

        {/* Retry button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="group hover:cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-foreground/90 active:bg-foreground/95 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)])
    .isRequired,
  onRetry: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default ErrorMessage;
