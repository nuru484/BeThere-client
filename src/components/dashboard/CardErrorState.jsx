// src/components/dashboard/CardErrorState.jsx
import { AlertCircle, RefreshCw } from "lucide-react";
import PropTypes from "prop-types";

const CardErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="relative mb-3">
        <div className="bg-destructive/10 p-3 rounded-xl border border-destructive/20">
          <AlertCircle className="w-5 h-5 text-destructive" strokeWidth={1.5} />
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-lg hover:bg-foreground/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <RefreshCw className="w-3 h-3 transition-transform group-hover:rotate-180 duration-300" />
          Retry
        </button>
      )}
    </div>
  );
};

CardErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

export default CardErrorState;
