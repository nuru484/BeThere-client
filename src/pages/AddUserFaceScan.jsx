// src/pages/AddUserFaceScan.jsx
import { useAddFaceScan } from "@/hooks/useFaceScanApi";
import ScanUserFace from "@/components/ScanUserFace";
import toast from "react-hot-toast";

export default function AddUserFaceScan() {
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
          faceScan: result.descriptor,
        });
      } catch (err) {
        console.log(err);
        toast.error(err.message);
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
          disabled={isPending}
        />
        {isPending && (
          <div className="mt-4 text-center font-medium text-gray-700">
            Registring face...
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
