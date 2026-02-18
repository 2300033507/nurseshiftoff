import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Stethoscope, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path
            ? "text-medical-600 bg-medical-50"
            : "text-slate-600 hover:text-medical-600 hover:bg-slate-50";
    };

    const linkBase = "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm";

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-medical-500 p-2 rounded-lg text-white">
                            <Activity size={20} />
                        </div>
                        <span className="font-bold text-xl text-slate-800 tracking-tight">AI CareFlow</span>
                    </div>

                    {user && (
                        <div className="hidden md:flex space-x-2">
                            {user.role === 'Nurse' && (
                                <Link to="/nurse" className={`${linkBase} ${isActive('/nurse')}`}>
                                    <LayoutDashboard size={18} />
                                    Nurse Station
                                </Link>
                            )}
                            {user.role === 'Doctor' && (
                                <Link to="/doctor" className={`${linkBase} ${isActive('/doctor')}`}>
                                    <Stethoscope size={18} />
                                    Doctor View
                                </Link>
                            )}
                            {user.role === 'Patient' && (
                                <Link to="/patient" className={`${linkBase} ${isActive('/patient')}`}>
                                    <User size={18} />
                                    Patient App
                                </Link>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-bold text-slate-800">{user.username}</div>
                                    <div className="text-xs text-slate-500">{user.role}</div>
                                </div>
                                <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 text-sm px-3 py-2">
                                    <LogOut size={16} />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button>Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}