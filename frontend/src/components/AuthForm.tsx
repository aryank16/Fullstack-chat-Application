import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { SignupData } from '../types/index.ts';

const AuthForm: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { login, signup, isLoading } = useAuth();  // Pull login, signup, and loading state from the Auth context

   // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

   // Handle Signup Submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Build a signup data object matching the expected type
    const signupData: SignupData = {
      firstName,
      lastName,
      email,
      password,
    };

    const success = await signup(signupData);
    if (!success) {
      setError('Email already exists. Please try logging in instead.');
    }
  };

  const handleSubmit = isSignup ? handleSignup : handleLogin;

  return (
    <div className="min-h-screen flex items-center justify-center   py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md bg-black/90 text-white rounded-lg p-10  w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <img src='/public/favicon.png'/>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold ">
            Eraneos Analytics
          </h2>
          <p className="mt-2 text-center text-sm ">
            {isSignup ? 'Create your account' : 'Sign in to access the intelligent chat assistant'}
          </p>
        </div>


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignup && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm px-3 font-medium text-white">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required={isSignup}
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-full focus:outline-none focus:ring-blue-500 focus:border-orange-500 sm:text-sm"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium px-3 ">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required={isSignup}
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-full focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm px-3 font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-full focus:outline-none focus:ring-orange-600 focus:border-orange-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm px-3 font-medium ">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-full focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-black bg-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
          
          <div className="text-center text-sm text-white">
            {isSignup ? (
              <p>Already have an account? <button type="button" onClick={() => setIsSignup(false)} className="text-orange-600   hover:text-white">Sign In</button></p>
            ) : (
              <p >Don't have an account? <button type="button" onClick={() => setIsSignup(true)} className="text-orange-600 hover:text-white">Sign Up</button></p>
            )}
          </div>
        </form>
      </div>
     
    </div>
  );
};

export default AuthForm;
