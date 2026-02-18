import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Check, X, Clock } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getAllAppointments, updateAppointmentStatus } from '../api/appointment';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await getAllAppointments();
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching appointments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateAppointmentStatus(id, status);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        }
    };

    const pendingAppointments = appointments.filter(a => a.status === 'Pending');
    const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed');

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Doctor Dashboard</h2>
                <p className="text-slate-500 mt-2">Welcome back, Dr. {user?.username || 'Smith'}.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Requests */}
                <Card title="Appointment Requests" icon={Clock} className="border-orange-200 bg-orange-50/30">
                    <div className="space-y-4">
                        {pendingAppointments.length === 0 ? (
                            <p className="text-slate-400 text-center py-4">No pending requests.</p>
                        ) : (
                            pendingAppointments.map(apt => (
                                <div key={apt.id} className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-slate-800">{apt.Patient?.username || 'Unknown Patient'}</h4>
                                            <p className="text-sm text-slate-500">Requested: {new Date(apt.requestedDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Pending</span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-4">Reason: {apt.reason}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleStatusUpdate(apt.id, 'Confirmed')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-xs py-2"
                                        >
                                            <Check size={14} className="mr-1 inline" /> Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(apt.id, 'Cancelled')}
                                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs py-2"
                                        >
                                            <X size={14} className="mr-1 inline" /> Decline
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Upcoming Schedule */}
                <Card title="Upcoming Appointments" icon={Calendar}>
                    <div className="space-y-3">
                        {upcomingAppointments.length === 0 ? (
                            <p className="text-slate-400 text-center py-4">No upcoming appointments.</p>
                        ) : (
                            upcomingAppointments.map(apt => (
                                <div key={apt.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-800">{apt.Patient?.username}</h4>
                                        <p className="text-sm text-slate-500">
                                            {new Date(apt.requestedDate).toLocaleDateString()} • {apt.reason}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}