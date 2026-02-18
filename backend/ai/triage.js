const assessSeverity = (symptoms, reportedSeverity) => {
    const criticalKeywords = ['chest pain', 'severe bleeding', 'unconscious', 'difficulty breathing', 'stroke', 'heart attack'];
    const moderateKeywords = ['fever', 'fracture', 'burn', 'vomiting', 'dizziness'];

    let aiSeverity = 'Low';

    // Check for critical keywords
    const lowerSymptoms = symptoms.toLowerCase();
    const isCritical = criticalKeywords.some(keyword => lowerSymptoms.includes(keyword));

    if (isCritical || reportedSeverity >= 8) {
        aiSeverity = 'Critical';
    } else {
        const isModerate = moderateKeywords.some(keyword => lowerSymptoms.includes(keyword));
        if (isModerate || (reportedSeverity >= 5 && reportedSeverity < 8)) {
            aiSeverity = 'Moderate';
        }
    }

    return aiSeverity;
};

module.exports = { assessSeverity };
