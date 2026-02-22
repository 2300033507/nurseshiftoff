import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { LogIn } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    if (user) {
        if (user.role === 'Nurse') return <Navigate to="/nurse" replace />;
        if (user.role === 'Doctor') return <Navigate to="/doctor" replace />;
        if (user.role === 'Patient') return <Navigate to="/patient" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'Nurse') navigate('/nurse');
            else if (user.role === 'Doctor') navigate('/doctor');
            else if (user.role === 'Patient') navigate('/patient');
            else navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <Card title="Login to AI Nursing App" icon={LogIn}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 w-full p-2 border rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                className="mt-1 w-full p-2 border rounded-md"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                                Forgot Password?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                        <div className="text-center text-sm">
                            Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
