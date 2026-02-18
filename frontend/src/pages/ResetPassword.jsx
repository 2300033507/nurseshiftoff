import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Lock } from 'lucide-react';
import { resetPassword } from '../api/auth';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords don't match");
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            await resetPassword(token, password);
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to reset password. Link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <Card title="Set New Password" icon={Lock}>
                    {message && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg mb-4">{message}</div>}
                    {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">New Password</label>
                            <input
                                type="password"
                                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                            <input
                                type="password"
                                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
