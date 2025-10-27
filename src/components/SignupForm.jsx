import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  IdCard,
  AlertCircle,
  Phone,
} from 'lucide-react';
import schema from '@/validation/signupValidation';
import PropTypes from 'prop-types';

const SignupForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <div className="bg-gray-100 border border-emerald-200 rounded-2xl p-8 m-4 md:m-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Create your account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Fill in your information to get started
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  {...register('firstName')}
                  placeholder="First Name"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition duration-200`}
                />
                {errors.firstName && (
                  <span className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <User
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  {...register('lastName')}
                  placeholder="Last Name"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition duration-200`}
                />
                {errors.lastName && (
                  <span className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            {/* <div className="relative">
              <input
                type="file"
                {...register('profilePicture')}
                accept="image/*"
                className={`w-full pl-3 pr-3 py-2 rounded-lg border ${
                  errors.profilePicture ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition duration-200`}
              />
              {errors.profilePicture && (
                <span className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.profilePicture.message}
                </span>
              )}
            </div> */}
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
              Account Information
            </h3>
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="email"
                {...register('email')}
                placeholder="Email"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition duration-200`}
              />
              {errors.email && (
                <span className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="relative">
              <Phone className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="tel"
                {...register('phoneNumber')}
                placeholder="Phone Number"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition duration-200`}
              />
              {errors.phoneNumber && (
                <span className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 border-b pb-2">
              Set Password
            </h3>
            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Password"
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition duration-200`}
              />
              {showPassword ? (
                <EyeOff
                  className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-gray-600 transition duration-200"
                  size={20}
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <Eye
                  className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-gray-600 transition duration-200"
                  size={20}
                  onClick={togglePasswordVisibility}
                />
              )}
              {errors.password && (
                <span className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password.message}
                </span>
              )}
            </div>


          </div>

          
            <div className="relative">
              <IdCard
                className="absolute top-3 left-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                {...register('identification')}
                placeholder="Identification"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  errors.identification ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition duration-200`}
              />
              {errors.identification && (
                <span className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.identification.message}
                </span>
              )}
            </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-500 hover:underline transition duration-200"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

SignupForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default SignupForm;


  