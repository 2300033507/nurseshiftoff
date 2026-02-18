export default function StatusBadge({ priority }) {
    // Ensure priority is uppercase to match keys (e.g. "High" -> "HIGH")
    const level = priority ? priority.toUpperCase() : 'LOW';

    // Define styles for each priority level
    const styles = {
        HIGH: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
        MEDIUM: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
        LOW: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
        RESOLVED: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
        DEFAULT: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" }
    };

    // Select style or fallback to default
    const s = styles[level] || styles.DEFAULT;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
            {level}
        </span>
    );
}