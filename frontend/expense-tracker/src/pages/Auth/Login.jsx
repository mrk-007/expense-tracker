import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Wallet } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL, API_PATHS } from '../../utils/apiPaths';
import { useUser } from '../../context/UserContext';
import calcHeroImage from '../../assets/images/Calc.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [tab, setTab] = useState('signin');
  const [loading, setLoading] = useState(false);

  const [signIn, setSignIn] = useState({ email: '', password: '' });
  const [signInErrors, setSignInErrors] = useState({});
  const [showSignInPwd, setShowSignInPwd] = useState(false);

  const [signUp, setSignUp] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [signUpErrors, setSignUpErrors] = useState({});
  const [showSignUpPwd, setShowSignUpPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const validateSignIn = () => {
    const errors = {};
    if (!signIn.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(signIn.email)) errors.email = 'Enter a valid email';
    if (!signIn.password) errors.password = 'Password is required';
    return errors;
  };

  const validateSignUp = () => {
    const errors = {};
    if (!signUp.fullName.trim()) errors.fullName = 'Full name is required';
    if (!signUp.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(signUp.email)) errors.email = 'Enter a valid email';
    if (!signUp.password) errors.password = 'Password is required';
    else if (signUp.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (signUp.password !== signUp.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const errors = validateSignIn();
    if (Object.keys(errors).length) { setSignInErrors(errors); return; }
    setSignInErrors({});
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}${API_PATHS.AUTH.LOGIN}`, signIn);
      const { token, user } = res.data;
      login(user, token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errors = validateSignUp();
    if (Object.keys(errors).length) { setSignUpErrors(errors); return; }
    setSignUpErrors({});
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}${API_PATHS.AUTH.REGISTER}`, {
        fullName: signUp.fullName,
        email: signUp.email,
        password: signUp.password,
      });
      const { token, user } = res.data;
      login(user, token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (error) =>
    `w-full h-11 px-4 rounded-[10px] border text-[13.5px] text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
      error
        ? 'border-red-300 bg-red-50 focus:ring-red-200'
        : 'border-gray-200 bg-gray-50 focus:ring-[#6ED3E5] focus:border-[#1FB6D5]'
    }`;

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#F8F9FB]">
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16 py-12 bg-white">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6ED3E5] to-[#169CB8] flex items-center justify-center shadow-md">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="text-[15px] font-bold text-[#111827]">ExpenseTracker</span>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-8 w-fit gap-1">
          <button
            onClick={() => setTab('signin')}
            className={`px-5 py-2 rounded-[10px] text-[13px] font-semibold transition-all duration-200 ${
              tab === 'signin'
                ? 'bg-white text-[#1FB6D5] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`px-5 py-2 rounded-[10px] text-[13px] font-semibold transition-all duration-200 ${
              tab === 'signup'
                ? 'bg-white text-[#1FB6D5] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4" noValidate>
            <div>
              <h2 className="text-[26px] font-bold text-[#111827]">Welcome back</h2>
              <p className="text-[13px] text-[#9CA3AF] mt-1">Sign in to manage your finances</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#374151]">Email</label>
              <input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={signIn.email}
                onChange={(e) => { setSignIn({ ...signIn, email: e.target.value }); setSignInErrors({ ...signInErrors, email: '' }); }}
                className={inputClass(signInErrors.email)}
              />
              {signInErrors.email && <span className="text-[11px] text-red-500">{signInErrors.email}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#374151]">Password</label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showSignInPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={signIn.password}
                  onChange={(e) => { setSignIn({ ...signIn, password: e.target.value }); setSignInErrors({ ...signInErrors, password: '' }); }}
                  className={`${inputClass(signInErrors.password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1FB6D5]"
                >
                  {showSignInPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {signInErrors.password && <span className="text-[11px] text-red-500">{signInErrors.password}</span>}
            </div>

            <button
              id="signin-btn"
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-[12px] bg-gradient-to-r from-[#1FB6D5] to-[#169CB8] text-white text-[13.5px] font-semibold shadow-md shadow-cyan-200 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-[12.5px] text-center text-[#9CA3AF]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="text-[#1FB6D5] font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        )}

        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4" noValidate>
            <div>
              <h2 className="text-[26px] font-bold text-[#111827]">Create account</h2>
              <p className="text-[13px] text-[#9CA3AF] mt-1">Join us and take control of your finances</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#374151]">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                value={signUp.fullName}
                onChange={(e) => { setSignUp({ ...signUp, fullName: e.target.value }); setSignUpErrors({ ...signUpErrors, fullName: '' }); }}
                className={inputClass(signUpErrors.fullName)}
              />
              {signUpErrors.fullName && <span className="text-[11px] text-red-500">{signUpErrors.fullName}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#374151]">Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={signUp.email}
                onChange={(e) => { setSignUp({ ...signUp, email: e.target.value }); setSignUpErrors({ ...signUpErrors, email: '' }); }}
                className={inputClass(signUpErrors.email)}
              />
              {signUpErrors.email && <span className="text-[11px] text-red-500">{signUpErrors.email}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#374151]">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showSignUpPwd ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={signUp.password}
                  onChange={(e) => { setSignUp({ ...signUp, password: e.target.value }); setSignUpErrors({ ...signUpErrors, password: '' }); }}
                  className={`${inputClass(signUpErrors.password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1FB6D5]"
                >
                  {showSignUpPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {signUpErrors.password && <span className="text-[11px] text-red-500">{signUpErrors.password}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#374151]">Confirm Password</label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPwd ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={signUp.confirmPassword}
                  onChange={(e) => { setSignUp({ ...signUp, confirmPassword: e.target.value }); setSignUpErrors({ ...signUpErrors, confirmPassword: '' }); }}
                  className={`${inputClass(signUpErrors.confirmPassword)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1FB6D5]"
                >
                  {showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {signUpErrors.confirmPassword && <span className="text-[11px] text-red-500">{signUpErrors.confirmPassword}</span>}
            </div>

            <button
              id="signup-btn"
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-[12px] bg-gradient-to-r from-[#1FB6D5] to-[#169CB8] text-white text-[13.5px] font-semibold shadow-md shadow-cyan-200 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-[12.5px] text-center text-[#9CA3AF]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('signin')}
                className="text-[#1FB6D5] font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>

      <div className="relative w-full lg:w-[55%] min-h-[280px] lg:min-h-screen overflow-hidden bg-[#1F1947]">
        <img
          src={calcHeroImage}
          alt="Expense tracker hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-black/20 to-black/40" />

        <div className="relative z-10 flex h-full min-h-[280px] lg:min-h-screen items-end lg:items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-[520px] rounded-[28px] border border-white/15 bg-white/12 p-5 sm:p-7 text-white shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/18">
              <Wallet size={28} className="text-white" />
            </div>
            <h3 className="text-[26px] sm:text-[32px] font-bold leading-tight">
              Track Every Penny
            </h3>
            <p className="mt-3 max-w-lg text-[14px] sm:text-[15px] leading-6 text-white/85">
              Get full control of your income and expenses with beautiful charts and real-time insights.
            </p>

            <div className="mt-6 grid gap-3 sm:gap-4">
              {[
                { icon: '📊', text: 'Visual charts for income & expenses' },
                { icon: '🔒', text: 'Secure JWT authentication' },
                { icon: '📥', text: 'Export transactions as CSV' },
                { icon: '😊', text: 'Custom emoji categories' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/14 px-4 py-3 backdrop-blur-sm">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-[13px] sm:text-[14px] font-medium text-white/95">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
