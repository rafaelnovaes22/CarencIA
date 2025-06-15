import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Facebook, Chrome, Eye, EyeOff, User, Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm, UserType } from '../lib/types';

const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    userType: z.enum(['buyer', 'dealership']),
    phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
});

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { register: registerUser, loginWithGoogle, loginWithFacebook } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState<UserType>('buyer');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            userType: 'buyer'
        }
    });

    const userType = watch('userType');

    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam === 'buyer' || typeParam === 'dealership') {
            setSelectedUserType(typeParam);
            setValue('userType', typeParam);
        }
    }, [searchParams, setValue]);

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        try {
            await registerUser(data);
            toast.success('Conta criada com sucesso!');
            navigate('/onboarding');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar conta');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Conta criada com Google!');
            navigate('/onboarding');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar conta com Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookRegister = async () => {
        setIsLoading(true);
        try {
            await loginWithFacebook();
            toast.success('Conta criada com Facebook!');
            navigate('/onboarding');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar conta com Facebook');
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
                        <CardTitle className="text-2xl">Criar sua conta</CardTitle>
                        <CardDescription>
                            Junte-se à CarencIA e encontre o carro perfeito
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* User Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Você é:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedUserType('buyer');
                                        setValue('userType', 'buyer');
                                    }}
                                    className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${userType === 'buyer'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <User className="h-6 w-6" />
                                    <span className="text-sm font-medium">Comprador</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedUserType('dealership');
                                        setValue('userType', 'dealership');
                                    }}
                                    className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${userType === 'dealership'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Building className="h-6 w-6" />
                                    <span className="text-sm font-medium">Concessionária</span>
                                </button>
                            </div>
                        </div>

                        {/* Social Register */}
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={handleGoogleRegister}
                                disabled={isLoading}
                            >
                                <Chrome className="h-5 w-5" />
                                Continuar com Google
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={handleFacebookRegister}
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
                                <span className="bg-white px-2 text-gray-500">Ou cadastre-se com</span>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input {...register('userType')} type="hidden" />

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome completo
                                </label>
                                <input
                                    {...register('fullName')}
                                    type="text"
                                    id="fullName"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Seu nome completo"
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                                )}
                            </div>

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
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefone (opcional)
                                </label>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    id="phone"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="(11) 99999-9999"
                                />
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
                                        placeholder="Mínimo 6 caracteres"
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

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar senha
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('confirmPassword')}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Confirme sua senha"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                Criar conta
                            </Button>
                        </form>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Já tem uma conta?{' '}
                                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                    Faça login
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        Ao criar uma conta, você concorda com nossos{' '}
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

export default RegisterPage; 