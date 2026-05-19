import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';

/**
 * Custom hook to handle login logic, validation, and rate-limiting
 */
export function useLogin(isAdminFlow: boolean = false) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Rate-limiting cooldown countdown (in seconds)
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer for Rate Limiting (429)
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const validateEmail = (val: string) => {
    if (!val) {
      setEmailError('Email là bắt buộc.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError('Email không đúng định dạng.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError('Mật khẩu là bắt buộc.');
      return false;
    }
    if (val.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    // Stop submission if user is currently ratelimited
    if (cooldown > 0) {
      setGeneralError(`Bạn đã vượt quá giới hạn đăng nhập. Vui lòng đợi ${cooldown} giây.`);
      return;
    }

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({ Email: email, Password: password }, isAdminFlow);
      
      if (result && result.RequiresTwoFactor) {
        // Redirect to TOTP/OTP verification screen, pass current context via router state
        navigate('/totp-verify', { 
          state: { 
            email, 
            isAdminFlow 
          } 
        });
      } else {
        // Success: Redirect based on user role stored in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const role = user.role;
          if (role === 'SuperAdmin' || role === 'PlatformStaff') {
            navigate('/admin');
          } else if (role === 'PetOwner') {
            navigate('/owner');
          } else {
            navigate('/clinic');
          }
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      console.error('Login request failed:', err);
      const axiosError = err as AxiosError<{ message?: string }>;
      
      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;

        if (status === 429) {
          // Rate-limiting hit: lock down form submissions for 60 seconds
          setCooldown(60);
          setGeneralError('Hệ thống phát hiện tần suất đăng nhập quá cao (Rate Limit). Vui lòng đợi 1 phút.');
        } else if (status === 400 || status === 401) {
          // Validation/Credentials error
          setGeneralError(data?.message || 'Email hoặc mật khẩu không hợp lệ. Vui lòng kiểm tra lại.');
        } else {
          // Other HTTP errors (500, etc.)
          setGeneralError(data?.message || `Đã xảy ra lỗi hệ thống (${status}). Vui lòng thử lại sau.`);
        }
      } else {
        // Network/Server Offline issues
        setGeneralError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    generalError,
    isLoading,
    cooldown,
    validateEmail,
    validatePassword,
    handleLoginSubmit,
  };
}
