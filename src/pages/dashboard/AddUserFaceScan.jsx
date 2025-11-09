// src/pages/AddUserFaceScan.jsx
import { useCallback, useRef } from "react";
import { useAddFaceScan } from "@/hooks/useFaceScanApi";
import FaceScanner from "@/components/FaceScanner";
import toast from "react-hot-toast";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";

export default function AddUserFaceScan() {
  const hasSubmittedRef = useRef(false);
  const {
    mutate: addFaceScan,
    isPending,
    isSuccess,
    isError,
    error,
  } = useAddFaceScan();

  const handleScanComplete = useCallback(
    (result) => {
      if (result.success && !hasSubmittedRef.current) {
        hasSubmittedRef.current = true;

        addFaceScan(
          {
            faceScan: result.descriptor,
          },
          {
            onSuccess: (response) => {
              toast.success(
                response?.message || "Face registered successfully!"
              );
            },
            onError: (err) => {
              console.log(err);
              toast.error(err?.message || "Failed to register face.");
              hasSubmittedRef.current = false;
            },
          }
        );
      }
    },
    [addFaceScan]
  );

  const { message } = extractApiErrorMessage(error);

  const getExternalStatus = () => {
    if (isPending) {
      return {
        message: "Registering face...",
        type: "loading",
      };
    }
    if (isSuccess) {
      return {
        message: "Face registered successfully!",
        type: "success",
      };
    }
    if (isError) {
      return {
        message: message || "Failed to register face.",
        type: "error",
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Face Registration
      </h1>
      <div className="w-full max-w-2xl">
        <div className="mb-4 text-sm text-yellow-600 bg-yellow-100 p-3 rounded">
          Note: You can only register one face scan. After adding your face
          scan, you will need to contact admin to reset your face scan before
          you can add a new one.
        </div>
        <FaceScanner
          buttonText="Register Face"
          onScanComplete={handleScanComplete}
          disabled={isPending}
          externalStatus={getExternalStatus()}
        />
      </div>
    </div>
  );
}
