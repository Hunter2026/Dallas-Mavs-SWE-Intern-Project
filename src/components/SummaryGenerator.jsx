import React from 'react';
import { Typography, Paper } from '@mui/material';

// === Ordered role and ceiling tiers used to determine projection gap ===
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

// === Extract keywords from freeform strengths or weaknesses text ===
// It returns a list of matched keywords based on pre-defined sets
const extractKeywords = (text, type) => {
    const keywords = {
        strengths: [
            'versatile', 'shooter', 'defender', 'motor', 'explosive', 'leader', 'playmaker', 'rebounder',
            'finisher', 'athletic', 'court vision', 'high iq', 'toughness', 'spacing', 'quickness',
            'transition', 'length', 'switchable', 'clutch', 'discipline'
        ],
        weaknesses: [
            'inconsistent', 'raw', 'injury', 'turnover', 'slow', 'undersized', 'streaky', 'foul trouble',
            'poor handle', 'lazy', 'low motor', 'defensive lapses', 'inefficient', 'decision-making',
            'ball security', 'shot selection', 'disengaged', 'passive', 'limited', 'mechanics'
        ],
    };

    const found = [];
    const lowerText = text.toLowerCase();
    keywords[type].forEach((word) => {
        if (lowerText.includes(word)) {
            found.push(word);
        }
    });
    return found;
};

// === Detect standout strength phrases for custom summary highlights ===
const extractStrengthPhrase = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('drive') || lower.includes('rim attack')) return 'noted for elite driving ability';
    if (lower.includes('quick first step')) return 'possesses a quick first step';
    if (lower.includes('shoot') || lower.includes('jumper')) return 'has advanced shooting mechanics';
    if (lower.includes('defense') && lower.includes('versatile')) return 'defends multiple positions effectively';
    if (lower.includes('playmaking') || lower.includes('vision')) return 'has advanced playmaking skills';
    if (lower.includes('rebound') || lower.includes('boards')) return 'dominates the glass as a rebounder';
    if (lower.includes('transition') || lower.includes('fast break')) return 'excels in transition opportunities';
    if (lower.includes('leadership')) return 'commands leadership presence on the floor';

    return null;
};

// === Detect standout weakness phrases for custom summary highlights ===
const extractWeaknessPhrase = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('turnover') || lower.includes('ball control')) return 'struggles with turnovers under pressure';
    if (lower.includes('mistake') || lower.includes('costly')) return 'has made costly mistakes in key moments';
    if (lower.includes('poor decision') || lower.includes('bad read')) return 'needs to improve decision-making';
    if (lower.includes('defense') && lower.includes('inconsistent')) return 'has lapses in defensive consistency';
    if (lower.includes('offense') && lower.includes('disappears')) return 'tends to disappear offensively in stretches';
    if (lower.includes('patience') || lower.includes('rushed')) return 'needs more patience in half-court sets';
    if (lower.includes('mechanics') && lower.includes('shot')) return 'requires refinement in shooting mechanics';
    if (lower.includes('effort') || lower.includes('motor')) return 'shows inconsistent effort on both ends';
    if (lower.includes('injury') || lower.includes('health')) return 'has durability concerns that affect stock';

    return null;
};

const SummaryGenerator = ({ report }) => {
    if (!report) return null; // Return nothing if no report data provided

    // === Destructure values from the report object ===
    const { role, ceiling, ratings, strengths, weaknesses, comparison, fit, range } = report;

    // === Identify top (8-10) and weak (0-4) trait ratings ===
    const topTraits = Object.entries(ratings).filter(([_, val]) => val >= 8).map(([trait]) => trait);
    const weakTraits = Object.entries(ratings).filter(([_, val]) => val <= 4).map(([trait]) => trait);

    // === Extract keyword hits and custom phrases ===
    const strengthKeywords = extractKeywords(strengths, 'strengths');
    const weaknessKeywords = extractKeywords(weaknesses, 'weaknesses');
    const strengthPhrase = extractStrengthPhrase(strengths);
    const weaknessPhrase = extractWeaknessPhrase(weaknesses);

    // === Determine projection gap between current role and ceiling ===
    const roleIndex = roles.indexOf(role);
    const ceilingIndex = ceilings.indexOf(ceiling);
    const gap = ceilingIndex - roleIndex;

    // === Start building summary string ===
    let summary = '';

    if (topTraits.length) {
        summary += `This prospect displays notable strengths in ${topTraits.join(', ')}. `;
    }

    if (strengthPhrase) {
        summary += `${strengthPhrase.charAt(0).toUpperCase() + strengthPhrase.slice(1)}. `;
    }

    if (strengthKeywords.length) {
        summary += `They’re known for attributes like ${strengthKeywords.join(', ')}, contributing to their two-way impact. `;
    }

    if (weakTraits.length) {
        summary += `However, development is needed in ${weakTraits.join(', ')}. `;
    }

    if (weaknessKeywords.length) {
        summary += `Concerns include ${weaknessKeywords.join(', ')}, which could affect consistency or efficiency. `;
    }

    if (weaknessPhrase) {
        summary += `${weaknessPhrase.charAt(0).toUpperCase() + weaknessPhrase.slice(1)}. `;
    }

    // === Projection confidence based on role-to-ceiling gap ===
    if (gap >= 3) {
        summary += `This is a high-variance prospect with significant upside beyond their current role. `;
    } else if (gap === 2) {
        summary += `There’s a moderate gap between role and ceiling, indicating room for meaningful growth. `;
    } else {
        summary += `Projection closely matches the current role, suggesting a well-defined archetype. `;
    }

    // === Add comparison and draft projection context ===
    summary += `Compared to ${comparison || 'N/A'}, fits best with ${fit || 'N/A'}, and is expected to be drafted in the ${range} range.`;

    // === Render the summary using Material UI Paper container ===
    return (
        <Paper elevation={2} sx={{ mt: 3, p: 2, backgroundColor: '#eef4ff', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Scouting Summary</Typography>
            <Typography variant="body1">{summary}</Typography>
        </Paper>
    );
};

export default SummaryGenerator;
