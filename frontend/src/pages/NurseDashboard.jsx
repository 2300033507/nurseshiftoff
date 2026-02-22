import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, User, ArrowRight, Clock, Check, X, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getAllAppointments, updateAppointmentStatus } from '../api/appointment';

export default function NurseDashboard() {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch patients
            const patientRes = await axios.get('http://localhost:5000/api/patient');
            setPatients(patientRes.data);

            // Fetch appointments
            const aptRes = await getAllAppointments();
            setAppointments(aptRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateAppointmentStatus(id, status);
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        }
    };

    const pendingAppointments = appointments.filter(a => a.status === 'Pending');
    const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed');

    // Helper to check if patient should be shown (Admitted OR has confirmed appointment)
    const isPatientAdmitted = (patient) => {
        return patient.admissionStatus === 'Admitted' ||
            confirmedAppointments.some(a => a.patientId === patient.userId);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header className="mb-4">
                <h2 className="text-3xl font-bold text-slate-800">Nurse Dashboard</h2>
                <p className="text-slate-500 mt-2">Manage patient handoffs and view requests.</p>
            </header>

            {/* Appointment Requests Section */}
            {pendingAppointments.length > 0 && (
                <Card title="Appointment Requests" icon={Clock} className="border-orange-200 bg-orange-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingAppointments.map(apt => (
                            <div key={apt.id} className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-slate-800">{apt.Patient?.username || 'Unknown'}</h4>
                                    <span className="text-xs text-slate-500">{new Date(apt.requestedDate).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{apt.reason}</p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleStatusUpdate(apt.id, 'Confirmed')}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-xs py-1.5"
                                    >
                                        <Check size={14} className="mr-1 inline" /> Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate(apt.id, 'Cancelled')}
                                        className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs py-1.5"
                                    >
                                        <X size={14} className="mr-1 inline" /> Decline
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Patient List Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-700">Admitted Patients</h3>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.filter(isPatientAdmitted).map(patient => {
                            const activeApt = confirmedAppointments.find(a => a.patientId === patient.userId);

                            return (
                                <Card key={patient.id} title={patient.name} icon={User}>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Dept:</span>
                                            <span className="font-medium">{patient.department}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Rm:</span>
                                            <span className="font-medium">{patient.roomNumber || 'N/A'}</span>
                                        </div>

                                        <div className="flex gap-2 mt-2">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.triageLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                                                patient.triageLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {patient.triageLevel}
                                            </div>
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                                                {patient.admissionStatus}
                                            </div>
                                        </div>

                                        {/* High Risk Alerts */}
                                        {(patient.missedMedications > 0 || patient.fallRisk === 'High' || patient.lastBMHours >= 96 || patient.mealIntake === '<25%' || patient.isDrowsy) && (
                                            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 mb-2 uppercase">
                                                    <AlertTriangle size={14} /> High-Risk Alerts
                                                </div>
                                                <ul className="text-sm text-red-800 space-y-1 pl-4 list-disc font-medium">
                                                    {patient.missedMedications > 0 && <li>{patient.missedMedications} missed medication{patient.missedMedications > 1 ? 's' : ''}</li>}
                                                    {patient.fallRisk === 'High' && <li>High Fall Risk</li>}
                                                    {patient.lastBMHours >= 96 && <li>No BM in {patient.lastBMHours} hours</li>}
                                                    {patient.mealIntake === '<25%' && <li>Ate {patient.mealIntake} of meals</li>}
                                                    {patient.isDrowsy && <li>Patient is drowsy</li>}
                                                </ul>
                                            </div>
                                        )}

                                        {activeApt && (
                                            <div className="mt-3 pt-3 border-t border-slate-100">
                                                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Appointment Details</div>
                                                <div className="text-sm text-slate-700">
                                                    <span className="font-medium">Date: </span>
                                                    {activeApt.requestedDate ? new Date(activeApt.requestedDate).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div className="text-sm text-slate-700 mt-1">
                                                    <span className="font-medium">Reason: </span>
                                                    {activeApt.reason}
                                                </div>
                                            </div>
                                        )}

                                        <Link to={`/handoff/${patient.id}`} className="block mt-4">
                                            <Button className="w-full flex items-center justify-center gap-2">
                                                Start Handoff <ArrowRight size={16} />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {patients.length === 0 && !loading && (
                    <div className="text-center py-12 text-slate-500">
                        No patients found.
                    </div>
                )}
            </div>
        </div>
    );
}