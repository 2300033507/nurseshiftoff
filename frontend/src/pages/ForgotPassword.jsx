import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../api/auth';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await forgotPassword(email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (err) {
            setError('Failed to send email. accurate?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <Card title="Reset Password" icon={Mail}>
                    <p className="text-slate-500 mb-4 text-sm">Enter your email address and we'll send you a link to reset your password.</p>

                    {message && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg mb-4">{message}</div>}
                    {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                type="email"
                                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-slate-500 hover:text-slate-700 text-sm inline-flex items-center gap-1">
                                <ArrowLeft size={14} /> Back to Login
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
