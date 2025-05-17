import React from 'react';

// Define roles and ceilings in ascending order of development for calculating projection gaps
const roles = ['Developmental', 'Bench', 'Role Player', 'Starter'];
const ceilings = [
    'Fringe Roster',
    'Rotation Player',
    'Starter',
    'High-Level Starter',
    'All-Star',
    'All-NBA',
    'Hall of Famer',
];

// Function to extract keywords from free-form text (used in strengths and weaknesses)
const extractKeywords = (text, type) => {
    const keywords = {
        strengths: ['versatile', 'shooter', 'defender', 'motor', 'explosive', 'leader', 'playmaker', 'rebounder'],
        weaknesses: ['inconsistent', 'raw', 'injury', 'turnover', 'slow', 'undersized', 'streaky', 'foul trouble'],
    };

    const found = [];
    const lowerText = text.toLowerCase();

    // Check for presence of each keyword
    keywords[type].forEach((word) => {
        if (lowerText.includes(word)) {
            found.push(word);
        }
    });
    return found;
};

// Extract meaningful summary phrase from strengths
const extractStrengthPhrase = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('drive') || lower.includes('rim')) {
        return 'noted for elite driving ability';
    }
    if (lower.includes('quick first step')) {
        return 'possesses a quick first step';
    }
    if (lower.includes('shoot')) {
        return 'has advanced shooting mechanics';
    }
    if (lower.includes('defense') && lower.includes('versatile')) {
        return 'defends multiple positions effectively';
    }

    return null; // No match
};

// Extract meaningful summary phrase from weaknesses
const extractWeaknessPhrase = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('turnover')) {
        return 'struggles with turnovers under pressure';
    }
    if (lower.includes('cost') || lower.includes('mistake')) {
        return 'has made costly mistakes in big moments';
    }
    if (lower.includes('decision') && lower.includes('poor')) {
        return 'needs to improve decision-making';
    }
    if (lower.includes('defense')) {
        return 'has lapses in defensive consistency';
    }

    return null; // No match
};

// Main summary generator component
const SummaryGenerator = ({ report }) => {
    // Don't render anything if no report provided
    if (!report) return null;

    // Destructure report fields
    const {
        role,
        ceiling,
        ratings,
        strengths,
        weaknesses,
        comparison,
        fit,
        range,
    } = report;

    // Identify top traits (rated 8 or above)
    const topTraits = Object.entries(ratings)
        .filter(([_, val]) => val >= 8)
        .map(([trait]) => trait);

    // Identify weak traits (rated 4 or below)
    const weakTraits = Object.entries(ratings)
        .filter(([_, val]) => val <= 4)
        .map(([trait]) => trait);

    // Extract keyword hits and meaningful phrases from free-form text
    const strengthKeywords = extractKeywords(strengths, 'strengths');
    const weaknessKeywords = extractKeywords(weaknesses, 'weaknesses');
    const strengthPhrase = extractStrengthPhrase(strengths);
    const weaknessPhrase = extractWeaknessPhrase(weaknesses);

    // Determine role-ceiling gap (developmental potential)
    const roleIndex = roles.indexOf(role);
    const ceilingIndex = ceilings.indexOf(ceiling);
    const gap = ceilingIndex - roleIndex;

    // Build the textual summary
    let summary = '';

    if (topTraits.length) {
        summary += `Strong traits include ${topTraits.join(', ')}. `;
    }

    if (strengthKeywords.length) {
        summary += `Described as ${strengthKeywords.join(', ')}. `;
    }

    if (strengthPhrase) {
        summary += `Also ${strengthPhrase}. `;
    }

    if (weakTraits.length) {
        summary += `Needs development in ${weakTraits.join(', ')}. `;
    }

    if (weaknessKeywords.length) {
        summary += `Concerns include ${weaknessKeywords.join(', ')}. `;
    }

    if (weaknessPhrase) {
        summary += `However, ${weaknessPhrase}. `;
    }

    // Interpret gap level
    if (gap >= 3) {
        summary += `High variance prospect with significant upside beyond current role. `;
    } else if (gap === 2) {
        summary += `Moderate gap between role and ceiling with growth potential. `;
    } else {
        summary += `Projection aligns closely with current role. `;
    }

    // Final contextual information (comparison, fit, draft range)
    summary += `Compared to ${comparison || 'N/A'}, fits best with ${fit || 'N/A'}, and is expected to be drafted in the ${range} range.`;

    // Render the generated summary
    return (
        <div style={{ marginTop: '1rem', background: '#eef4ff', padding: '1rem', borderRadius: '6px' }}>
            <h4>Scouting Summary</h4>
            <p>{summary}</p>
        </div>
    );
};

export default SummaryGenerator;
