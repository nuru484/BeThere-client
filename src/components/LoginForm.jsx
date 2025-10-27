import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div>
      <div className="bg-gray-100 border border-emerald-200 rounded-2xl p-8 mx-4">
        <p className="text-gray-500 text-center mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Email"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition duration-200`}
            />
            {errors.email && (
              <span className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
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
              <span className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-500">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-gray-900"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-sm text-gray-900 hover:text-gray-800 hover:underline transition duration-200"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <span>Logging in...</span>
            ) : (
              <>
                Login
                <ArrowRight className="ml-2" size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-blue-600 hover:text-blue-500 hover:underline transition duration-200"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default LoginForm;