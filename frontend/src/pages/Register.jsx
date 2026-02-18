import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Patient'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <Card title="Register New Account" icon={UserPlus}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Username</label>
                            <input
                                name="username"
                                type="text"
                                className="mt-1 w-full p-2 border rounded-md"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                className="mt-1 w-full p-2 border rounded-md"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                name="password"
                                type="password"
                                className="mt-1 w-full p-2 border rounded-md"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Role</label>
                            <select
                                name="role"
                                className="mt-1 w-full p-2 border rounded-md"
                                onChange={handleChange}
                                value={formData.role}
                            >
                                <option value="Patient">Patient</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Doctor">Doctor</option>
                            </select>
                        </div>



                        <Button type="submit" className="w-full">Register</Button>
                        <div className="text-center text-sm">
                            Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
