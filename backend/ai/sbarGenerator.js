const generateSBAR = (notes, patient) => {
    // Simple rule-based parser
    // In a real app, this would use an LLM

    const lowerNotes = notes.toLowerCase();

    // Situation: Current status, vitals, immediate concerns
    const situationKeywords = ['bp', 'blood pressure', 'temp', 'fever', 'pain', 'alert', 'breathing', 'critical', 'stable'];
    // Background: History, admission reason (from patient context)
    // Assessment: Analysis, changes, labs
    const assessmentKeywords = ['increased', 'decreased', 'worsened', 'improved', 'lab', 'result', 'scan'];
    // Recommendation: Plan, to-do, meds
    const recommendationKeywords = ['give', 'monitor', 'check', 'administer', 'call', 'consult', 'plan'];

    const sentences = notes.split('.').map(s => s.trim()).filter(s => s.length > 0);

    let sbar = {
        situation: [],
        background: [],
        assessment: [],
        recommendation: []
    };

    // 1. Background is mostly from Context, but we can look for history keywords
    if (patient) {
        sbar.background.push(`Patient admitted for ${patient.diagnosis || patient.symptoms}.`);
        sbar.background.push(`History: ${patient.symptoms}`);
    }

    // 2. Classify sentences
    sentences.forEach(sentence => {
        const lower = sentence.toLowerCase();
        let classified = false;

        // Recommendation Check (High priority)
        if (recommendationKeywords.some(k => lower.includes(k))) {
            sbar.recommendation.push(sentence);
            classified = true;
        }

        // Assessment Check
        if (!classified && assessmentKeywords.some(k => lower.includes(k))) {
            sbar.assessment.push(sentence);
            classified = true;
        }

        // Situation Check (Default fall-through for vital signs etc)
        if (!classified || situationKeywords.some(k => lower.includes(k))) {
            // If it explicitly mentions vitals, it's situation
            if (situationKeywords.some(k => lower.includes(k))) {
                sbar.situation.push(sentence);
                classified = true;
            } else if (!classified) {
                // Unclassified generally goes to Situation or Assessment. 
                // Let's put short statments in Situation
                sbar.situation.push(sentence);
            }
        }
    });

    return {
        situation: sbar.situation.join('. ') + '.',
        background: sbar.background.join('. ') + '.',
        assessment: sbar.assessment.join('. ') + '.',
        recommendation: sbar.recommendation.join('. ') + '.'
    };
};

module.exports = { generateSBAR };
