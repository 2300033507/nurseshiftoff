import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mic, FileText, Sparkles, Save, ArrowLeft } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { generateHandoffPreview, saveHandoff, getHandoffHistory } from '../api/handoff';

export default function ShiftSignOff() {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [notes, setNotes] = useState("");
    const [sbar, setSbar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Fetch patient details (reuse list endpoint or generic fetch for now)
        // Ideally we have GET /api/patient/:id, but we can filter from list or add endpoint
        // For speed, let's assume we can hit the list or just add a quick fetch
        const fetchData = async () => {
            try {
                // Quick hack: fetch all and find (since we didn't make get /:id)
                // Or better: update backend/routes/patient.js to support findByPk, 
                // but let's stick to what we have or just use the list endpoint.
                // Actually, let's just use the list endpoint and filter in frontend for MVP 
                // if the list is small. 
                const res = await axios.get('http://localhost:5000/api/patient');
                const p = res.data.find(p => p.id == patientId);
                setPatient(p);

                const historyRes = await getHandoffHistory(patientId);
                setHistory(historyRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [patientId]);

    const handleGenerate = async () => {
        if (!notes) return;
        setLoading(true);
        try {
            const res = await generateHandoffPreview(patientId, notes);
            setSbar(res.data.sbar);
        } catch (error) {
            console.error("Error generating SBAR", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!sbar) return;
        setSaving(true);
        try {
            await saveHandoff({
                patientId,
                nurseName: "Nurse Vicky", // Hardcoded for demo
                shiftType: "Day", // Hardcoded for demo
                shiftNotes: notes,
                generatedSBAR: sbar
            });
            alert("Handoff saved!");
            navigate('/nurse');
        } catch (error) {
            console.error("Error saving handoff", error);
            alert("Failed to save handoff");
        } finally {
            setSaving(false);
        }
    };

    if (!patient) return <div className="p-6">Loading patient...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <header className="flex items-center gap-4 mb-4">
                <Button variant="ghost" onClick={() => navigate('/nurse')}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Shift Sign-Off: {patient.name}</h2>
                    <p className="text-slate-500">Room {patient.roomNumber} • {patient.diagnosis}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: History */}
                <div className="space-y-6">
                    <Card title="Handoff History" icon={FileText}>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {history.length === 0 ? (
                                <p className="text-slate-400 text-sm">No previous handoffs.</p>
                            ) : (
                                history.map(h => (
                                    <div key={h.id} className="p-3 border rounded-lg bg-slate-50 text-sm">
                                        <div className="font-medium flex justify-between">
                                            <span>{h.nurseName} ({h.shiftType})</span>
                                            <span className="text-slate-400">{new Date(h.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="mt-1 text-slate-600 line-clamp-3">{h.shiftNotes}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Middle: Input */}
                <div className="lg:col-span-1">
                    <Card title="Current Shift Notes" icon={Mic} className="h-full">
                        <div className="flex flex-col h-full">
                            <textarea
                                className="w-full flex-1 min-h-[300px] p-4 rounded-lg border border-slate-200 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none resize-none transition-all text-slate-700"
                                placeholder="Dictate or type notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <div className="mt-4">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={loading || !notes}
                                    className="w-full"
                                >
                                    {loading ? 'Processing...' : 'Generate SBAR'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: SBAR Preview */}
                <div className="lg:col-span-1">
                    <Card title="SBAR Preview" icon={Sparkles} className="h-full">
                        {sbar ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <h4 className="font-bold text-blue-800 text-sm">Situation</h4>
                                    <p className="text-blue-900 text-sm">{sbar.situation}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <h4 className="font-bold text-slate-800 text-sm">Background</h4>
                                    <p className="text-slate-900 text-sm">{sbar.background}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <h4 className="font-bold text-orange-800 text-sm">Assessment</h4>
                                    <p className="text-orange-900 text-sm">{sbar.assessment}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <h4 className="font-bold text-green-800 text-sm">Recommendation</h4>
                                    <p className="text-green-900 text-sm">{sbar.recommendation}</p>
                                </div>

                                <Button onClick={handleSave} disabled={saving} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                                    {saving ? 'Saving...' : 'Finalize & Save Handoff'}
                                </Button>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">
                                <p>Generate preview to see SBAR.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
