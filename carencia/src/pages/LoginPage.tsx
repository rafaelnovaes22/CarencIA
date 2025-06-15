import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Facebook, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../lib/types';

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, loginWithFacebook } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            await login(data);
            toast.success('Login realizado com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao fazer login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Login com Google realizado com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao fazer login com Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithFacebook();
            toast.success('Login com Facebook realizado com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao fazer login com Facebook');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <Car className="h-10 w-10 text-primary-500" />
                        <span className="text-3xl font-heading font-bold text-gray-900">CarencIA</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
                        <CardDescription>
                            Bem-vindo de volta! Entre para continuar.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Social Login */}
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <Chrome className="h-5 w-5" />
                                Continuar com Google
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={handleFacebookLogin}
                                disabled={isLoading}
                            >
                                <Facebook className="h-5 w-5" />
                                Continuar com Facebook
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Ou continue com</span>
                            </div>
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    id="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="seu@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Senha
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Sua senha"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Lembrar de mim
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                        Esqueceu a senha?
                                    </a>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                Entrar
                            </Button>
                        </form>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Não tem uma conta?{' '}
                                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                                    Cadastre-se
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        Ao continuar, você concorda com nossos{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-500">
                            Termos de Uso
                        </a>{' '}
                        e{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-500">
                            Política de Privacidade
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 