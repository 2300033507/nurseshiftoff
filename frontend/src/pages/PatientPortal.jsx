import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Bell, Plus, X, Stethoscope, Sparkles, Wand2, ArrowRight } from 'lucide-react';
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
    const [aiText, setAiText] = useState('');
    const [simplifiedText, setSimplifiedText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

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

    const handleSimplify = () => {
        if (!aiText) return;
        setIsTranslating(true);
        setSimplifiedText('');

        // Simulate AI processing
        setTimeout(() => {
            let result = "";
            const lowerInput = aiText.toLowerCase();

            if (lowerInput.includes('myocardial') || lowerInput.includes('ischemia') || lowerInput.includes('electrocardiogram')) {
                result = "There might be a slight reduction in blood flow to your heart muscle, but no major blockage was seen on the heart monitor.";
            } else if (lowerInput.includes('cephalgia') || lowerInput.includes('photophobia')) {
                result = "You are experiencing a severe headache and sensitivity to bright light.";
            } else if (lowerInput.includes('hypoxemia') || lowerInput.includes('auscultation') || lowerInput.includes('copd')) {
                result = "Your oxygen levels are a bit low, and the doctor heard a whistling sound when listening to your lungs.";
            } else if (lowerInput.includes('arthralgia') || lowerInput.includes('effusion')) {
                result = "You have severe joint pain and fluid buildup in the joint.";
            } else if (lowerInput.includes('tachycardia')) {
                result = "Your heart rate was faster than normal after taking the medicine.";
            } else if (lowerInput.includes('hypertension') || lowerInput.includes('blood pressure')) {
                result = "Your blood pressure is higher than normal.";
            } else if (lowerInput.includes('erythema') || lowerInput.includes('edema')) {
                result = "There is some redness and swelling in the affected area.";
            } else {
                result = "The clinical notes indicate standard observations without immediately critical distress issues.";
            }

            setSimplifiedText(result);
            setIsTranslating(false);
        }, 1200);
    };

    const getDynamicClinicalNotes = () => {
        if (!patientProfile) {
            return "Patient presents with mild erythema and edema in the lower left extremity. Tachycardia observed post medication administration (HR 118). Blood pressure indicates stage 1 hypertension (135/85). Denies nausea or acute distress. Will monitor for 24 hours.";
        }

        const symptoms = patientProfile.symptoms ? patientProfile.symptoms.toLowerCase() : '';
        const dept = patientProfile.department ? patientProfile.department.toLowerCase() : '';

        if (symptoms.includes('chest') || dept === 'cardiology') {
            return "Patient reports acute chest discomfort radiating to left arm. Electrocardiogram indicates sinus tachycardia without ST elevation. Suggests mild myocardial ischemia. Administered sublingual nitroglycerin. Will proceed with echocardiogram to assess left ventricular function.";
        }
        if (symptoms.includes('headache') || dept === 'neurology') {
            return "Patient exhibits persistent cephalgia accompanied by photophobia. Neurological exam reveals no focal deficits. Possible migraine exarcebation vs tension headache. Recommended prophylactic administration of sumatriptan and darkened environment.";
        }
        if (symptoms.includes('breath') || dept === 'pulmonology') {
            return "Patient presents with shortness of breath and mild hypoxemia on room air (SpO2 91%). Auscultation reveals bilateral expiratory wheezes. Impression: Acute exacerbation of chronic obstructive pulmonary disease (COPD). Orders include nebulized albuterol and IV corticosteroids.";
        }
        if (symptoms.includes('bone') || symptoms.includes('joint') || dept === 'orthopedics') {
            return "Patient reports severe arthralgia and limited range of motion in the right knee. Joint effusion present with noticeable erythema. Suspect acute monoarthritis, likely crystal-induced (gout) or septic. Arthrocentesis planned for synovial fluid analysis.";
        }

        return `Patient is currently assigned to ${patientProfile.department || 'General Admission'}. Chief complaint noted as: ${patientProfile.symptoms || 'General malaise'}. Vitals are stable. Mild tachycardia observed post medication. Reports minor erythema in affected region. Continue current care plan.`;
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

            {/* Recent Doctor Notes Section */}
            <Card title="Recent Clinical Notes" icon={Stethoscope} className="border-blue-200 bg-blue-50/20">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 font-medium">
                        These are the unedited notes from your care team's recent observations.
                        If you don't understand the medical terminology, try copying a phrase and pasting it into the AI Language Simplifier below!
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-3 relative">
                        <div className="absolute top-4 right-4 text-xs font-bold text-slate-400">YESTERDAY, 14:00</div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Attending Physician Update
                        </h4>
                        <div className="text-sm text-slate-700 font-mono bg-slate-50 p-3 rounded-lg leading-relaxed select-all cursor-text border border-slate-100 italic">
                            "{getDynamicClinicalNotes()}"
                        </div>
                    </div>
                </div>
            </Card>

            {/* AI Medical Language Simplifier */}
            <Card title="AI Language Simplifier" icon={Sparkles} className="border-indigo-200 bg-indigo-50/30 overflow-hidden relative">
                <div className="absolute top-[-20%] right-[-5%] opacity-5 pointer-events-none">
                    <Sparkles size={180} />
                </div>
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-[80%]">
                            Confusing doctor's notes? Paste clinical terms below and the AI will translate them into simple, easy-to-understand language.
                        </p>
                        <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded shadow-sm">
                            🧾 ➡️ 🙂
                        </span>
                    </div>

                    <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
                        <textarea
                            className="w-full p-4 h-24 outline-none resize-none text-slate-700 placeholder-slate-400 text-sm font-medium"
                            placeholder="Try pasting: 'Tachycardia observed post medication.' OR 'Patient has severe hypertension' OR 'Noticed erythema and edema'"
                            value={aiText}
                            onChange={(e) => setAiText(e.target.value)}
                        />
                        <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-between items-center">
                            <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold"><User size={12} /> Patient-Centered AI</span>
                            <Button
                                onClick={handleSimplify}
                                disabled={!aiText || isTranslating}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white flex items-center gap-2 px-6 text-sm py-2 shadow-indigo-200 shadow-md"
                            >
                                {isTranslating ? (
                                    <span className="animate-pulse">Simplifying...</span>
                                ) : (
                                    <>
                                        Translate to Plain English <Wand2 size={16} />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {simplifiedText && (
                        <div className="mt-4 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl flex items-start gap-4 transition-all duration-500 ease-in-out">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-200">
                                <Sparkles size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1 opacity-80">Simple Translation</h4>
                                <p className="text-emerald-950 font-medium text-lg leading-relaxed">{simplifiedText}</p>
                                <div className="mt-3 pt-3 border-t border-emerald-200/50">
                                    <p className="text-[10px] text-emerald-700 uppercase tracking-wide font-bold opacity-70 flex items-center gap-1">
                                        <Bell size={10} />
                                        Ethical AI Note: This translation is for educational purposes. Always consult your care team for medical advice.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

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

