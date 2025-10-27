"use client";
import { useAddFaceScan } from "@/hooks/useFaceScanApi";
import ScanUserFace from "@/components/ScanUserFace";
import { useAuth } from "@/hooks/useAuth";

export default function AddUserFaceScan() {
  const { user } = useAuth();
  const userId = user.id;

  const {
    mutate: addFaceScan,
    isPending,
    isError,
    error,
    isSuccess,
  } = useAddFaceScan();

  const handleScanComplete = async (result) => {
    if (result.success) {
      try {
        addFaceScan({
          userId,
          faceScan: result.fuzzyHash,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Face Registration
      </h1>
      <div className="w-full max-w-2xl">
        {
          <div className="mb-4 text-sm text-yellow-600 bg-yellow-100 p-3 rounded">
            Note: You can only register one face scan. After Adding your face
            scan, you will need to contact admin to reset your face scan before
            you can add a new one.
          </div>
        }
        <ScanUserFace
          buttonText="Register Face"
          onScanComplete={handleScanComplete}
          onStatusUpdate={(status) => isPending && status}
          onError={(err) => error?.message || err}
          disabled={!userId || isPending}
        />
        {isPending && (
          <div className="mt-4 text-center font-medium text-gray-700">
            Sending fuzzy hash to backend...
          </div>
        )}
        {isSuccess && !isPending && (
          <div className="mt-4 text-center font-medium text-green-600">
            Registration successful!
          </div>
        )}
        {isError && (
          <div className="mt-4 text-sm text-red-500 text-center">
            {error?.message || "An error occurred during registration."}
          </div>
        )}
      </div>
    </div>
  );
}
