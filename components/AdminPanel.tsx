import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, UserPlus, CheckCircle, XCircle } from 'lucide-react';

type ApprovedUser = {
    id: string;
    email: string;
    approved_at: string;
    used: boolean;
    used_at: string | null;
};

export const AdminPanel: React.FC = () => {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    React.useEffect(() => {
        checkAdminStatus();
        loadApprovedUsers();
    }, [user]);

    const checkAdminStatus = async () => {
        if (!user) return;

        const { data } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (data) {
            setIsAdmin(data.is_admin || false);
        }
    };

    const loadApprovedUsers = async () => {
        const { data } = await supabase
            .from('approved_users')
            .select('*')
            .order('approved_at', { ascending: false });

        if (data) {
            setApprovedUsers(data);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const { error } = await supabase
                .from('approved_users')
                .insert({
                    email: email.toLowerCase(),
                    invited_by: user?.id,
                });

            if (error) {
                if (error.code === '23505') {
                    setError('This email is already approved');
                } else {
                    setError(error.message);
                }
            } else {
                setSuccess(`Invite sent to ${email}`);
                setEmail('');
                loadApprovedUsers();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Admin Panel</CardTitle>
                    <CardDescription>You don't have admin access</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Invite Family & Friends
                    </CardTitle>
                    <CardDescription>
                        Add approved email addresses who can sign up
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="mb-4 border-green-500 text-green-700">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleInvite} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="invite-email">Email Address</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                placeholder="friend@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Invite
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Approved Users ({approvedUsers.length})</CardTitle>
                    <CardDescription>
                        People who can create accounts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {approvedUsers.length === 0 ? (
                            <p className="text-sm text-gray-500">No invited users yet</p>
                        ) : (
                            approvedUsers.map((approvedUser) => (
                                <div
                                    key={approvedUser.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{approvedUser.email}</p>
                                        <p className="text-xs text-gray-500">
                                            Invited {new Date(approvedUser.approved_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        {approvedUser.used ? (
                                            <div className="flex items-center gap-1 text-green-600 text-sm">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Active</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                <XCircle className="h-4 w-4" />
                                                <span>Pending</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
