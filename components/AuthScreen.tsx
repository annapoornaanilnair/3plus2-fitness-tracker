import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

type AuthMode = 'signin' | 'signup' | 'magic-link' | 'reset';

export const AuthScreen: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { signIn, signUp, signInWithMagicLink } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (mode === 'signin') {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message || 'Failed to sign in');
                }
            } else if (mode === 'signup') {
                const { error } = await signUp(email, password);
                if (error) {
                    setError(error.message || 'Failed to sign up. Check if your email is approved.');
                } else {
                    setSuccess('Account created! Check your email to verify.');
                }
            } else if (mode === 'magic-link') {
                const { error } = await signInWithMagicLink(email);
                if (error) {
                    setError(error.message || 'Failed to send magic link');
                } else {
                    setSuccess('Check your email for the login link!');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] via-[#F5F1EB] to-[#FFE8E0] p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-20 text-4xl opacity-20"
                >
                    ✨
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-40 right-32 text-3xl opacity-20"
                >
                    💪
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 10, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-32 left-40 text-4xl opacity-20"
                >
                    🌸
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -10, 0],
                    }}
                    transition={{
                        duration: 6.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute bottom-20 right-20 text-3xl opacity-20"
                >
                    ⭐
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                    }}
                    className="absolute top-1/2 left-16 text-3xl opacity-15"
                >
                    🎯
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, 12, 0],
                        rotate: [0, -8, 0],
                    }}
                    transition={{
                        duration: 6.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2.5
                    }}
                    className="absolute top-1/3 right-24 text-4xl opacity-15"
                >
                    💫
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-2 border-white/50">
                    <CardHeader className="space-y-4">
                        <motion.div
                            className="flex justify-center"
                            animate={{
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="relative">
                                <img src="/logo.png" alt="3+2 Fitness" className="w-24 h-24 object-contain" />
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <Sparkles className="w-6 h-6 text-yellow-400" />
                                </motion.div>
                            </div>
                        </motion.div>
                        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#A3C9A8] to-[#EDC4B3] bg-clip-text text-transparent">
                            {mode === 'signin' && 'Welcome Back'}
                            {mode === 'signup' && 'Join 3+2 Fitness'}
                            {mode === 'magic-link' && 'Magic Link Login'}
                            {mode === 'reset' && 'Reset Password'}
                        </CardTitle>
                        <CardDescription className="text-center text-base">
                            {mode === 'signin' && '✨ Sign in to sync your workouts'}
                            {mode === 'signup' && '💪 Create your account (invite-only)'}
                            {mode === 'magic-link' && '🔮 Get a passwordless login link'}
                            {mode === 'reset' && '🔒 Reset your password via email'}
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {success && (
                                <Alert className="border-green-500 text-green-700">
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {(mode === 'signin' || mode === 'signup') && (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        minLength={6}
                                    />
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mode === 'signin' && 'Sign In'}
                                {mode === 'signup' && 'Create Account'}
                                {mode === 'magic-link' && 'Send Magic Link'}
                                {mode === 'reset' && 'Send Reset Link'}
                            </Button>
                        </CardContent>
                    </form>

                    <CardFooter className="flex flex-col space-y-2">
                        <div className="text-sm text-center w-full space-y-2">
                            {mode === 'signin' && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setMode('magic-link')}
                                        className="text-[#A3C9A8] hover:text-[#8BB58F] font-medium transition-colors block w-full"
                                        disabled={loading}
                                    >
                                        ✨ Use magic link instead
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMode('signup')}
                                        className="text-gray-600 hover:text-gray-800 transition-colors block w-full"
                                        disabled={loading}
                                    >
                                        Don't have an account? Sign up
                                    </button>
                                </>
                            )}

                            {mode === 'signup' && (
                                <button
                                    type="button"
                                    onClick={() => setMode('signin')}
                                    className="text-[#A3C9A8] hover:text-[#8BB58F] font-medium transition-colors block w-full"
                                    disabled={loading}
                                >
                                    Already have an account? Sign in
                                </button>
                            )}

                            {mode === 'magic-link' && (
                                <button
                                    type="button"
                                    onClick={() => setMode('signin')}
                                    className="text-[#A3C9A8] hover:text-[#8BB58F] font-medium transition-colors block w-full"
                                    disabled={loading}
                                >
                                    Back to password login
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                            <Heart className="w-3 h-3 text-pink-400" fill="currentColor" />
                            <span>Invite-only for family & friends</span>
                            <Heart className="w-3 h-3 text-pink-400" fill="currentColor" />
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};
