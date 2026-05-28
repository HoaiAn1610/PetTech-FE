import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { authService } from '@/api/authService';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const VerifyOtpPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error('Mã OTP phải có 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyTwoFactor(code);
      // Assume verifyTwoFactor returns AuthResponse and maybe user info
      // In a real scenario, you might need to fetch the user profile here
      // For this demo, let's mock a user based on context or response
      const mockUser = {
        id: '1',
        name: 'Verified User',
        email: 'user@example.com',
        role: 'PetOwner' as any
      };
      
      setUser(mockUser);
      toast.success('Xác thực thành công!');
      navigate('/clinic');
    } catch (error: any) {
       if (error.response?.status === 429) {
        toast.error('Quá nhiều yêu cầu. Vui lòng chờ 1 phút.');
      } else {
        toast.error('Mã xác thực không chính xác.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
             <div className="rounded-full p-3 bg-green-100 text-green-600">
                <ShieldCheck size={32} />
             </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Xác thực 2 lớp (2FA)</CardTitle>
          <CardDescription className="text-center">
            Nhập mã 6 chữ số từ ứng dụng xác thực của bạn
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-center">
              <Label htmlFor="otp">Mã xác thực</Label>
              <Input 
                id="otp" 
                type="text" 
                placeholder="000000" 
                required 
                className="text-center text-2xl tracking-[1em] h-14"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
                autoFocus
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                'Xác nhận'
              )}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/login')} disabled={isLoading}>
                Quay lại đăng nhập
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default VerifyOtpPage;
