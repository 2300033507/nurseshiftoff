import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Bell, Plus, X, Stethoscope } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { createAppointment, getMyAppointments } from '../api/appointment';
import { getMe } from '../api/patient';

export default function PatientPortal() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showCareTeamModal, setShowCareTeamModal] = useState(false);
    const [newAppointment, setNewAppointment] = useState({ reason: '', requestedDate: '' });
    const [patientProfile, setPatientProfile] = useState(null);

    useEffect(() => {
        fetchAppointments();
        fetchProfile();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await getMyAppointments();
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching appointments", error);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await getMe();
            setPatientProfile(res.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAppointment(newAppointment);
            setShowRequestModal(false);
            setNewAppointment({ reason: '', requestedDate: '' });
            fetchAppointments();
            alert("Appointment request sent!");
        } catch (error) {
            console.error("Error requesting appointment", error);
            alert("Failed to request appointment");
        }
    };

    const handleCallNurse = () => {
        alert("Nurse station notified! Help is on the way.");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header / Welcome Section */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-2">
                    <User size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Welcome, {user?.username}</h2>
                {/* Room status removed as requested */}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    onClick={() => setShowRequestModal(true)}
                    className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
                >
                    <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                        <Calendar size={32} />
                    </div>
                    <span className="font-medium text-slate-700 text-lg">Appointments</span>
                </div>

                <div
                    onClick={() => setShowCareTeamModal(true)}
                    className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
                >
                    <div className="p-4 rounded-full bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
                        <User size={32} />
                    </div>
                    <span className="font-medium text-slate-700 text-lg">Care Team</span>
                </div>
            </div>

            {/* Call Nurse Section */}
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Need Assistance?</h3>
                    <p className="text-slate-500 mt-1">Tap the button below to notify the nurse station.</p>
                </div>

                <button
                    onClick={handleCallNurse}
                    className="w-full max-w-md mx-auto py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    <Bell size={24} />
                    Call Nurse
                </button>
            </div>

            {/* Upcoming Appointments List */}
            <Card title="My Appointments" icon={Calendar}>
                <div className="space-y-3">
                    {appointments.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">No appointments scheduled.</p>
                    ) : (
                        appointments.map(apt => (
                            <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-slate-800">
                                        {new Date(apt.requestedDate).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-slate-500">{apt.reason}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                        apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-slate-200 text-slate-700'
                                    }`}>
                                    {apt.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">Request Appointment</h3>
                            <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="e.g., Checkup, Pain consult..."
                                    value={newAppointment.reason}
                                    onChange={e => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={newAppointment.requestedDate}
                                    onChange={e => setNewAppointment({ ...newAppointment, requestedDate: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Submit Request</Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Care Team Modal */}
            {showCareTeamModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">My Care Team</h3>
                            <button onClick={() => setShowCareTeamModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        {patientProfile?.Doctor ? (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                    <Stethoscope size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{patientProfile.Doctor.name}</h4>
                                    <p className="text-blue-600 font-medium">{patientProfile.Doctor.specialization}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <p>No doctor currently assigned.</p>
                            </div>
                        )}

                        <div className="p-4 bg-slate-50 rounded-xl">
                            <h5 className="font-medium text-slate-700 mb-2">Nursing Station</h5>
                            <p className="text-sm text-slate-500">Available 24/7 for assistance.</p>
                            <Button onClick={handleCallNurse} className="mt-2 w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
                                Call Station
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}