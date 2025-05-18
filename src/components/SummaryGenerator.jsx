import React from 'react';
import { Typography, Paper } from '@mui/material';

// Ordered role and ceiling levels for computing projection gap
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

// Keyword extraction for strengths and weaknesses
const extractKeywords = (text, type) => {
    const keywords = {
        strengths: ['versatile', 'shooter', 'defender', 'motor', 'explosive', 'leader', 'playmaker', 'rebounder'],
        weaknesses: ['inconsistent', 'raw', 'injury', 'turnover', 'slow', 'undersized', 'streaky', 'foul trouble'],
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

// Look for standout phrases from strengths
const extractStrengthPhrase = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('drive') || lower.includes('rim')) return 'noted for elite driving ability';
    if (lower.includes('quick first step')) return 'possesses a quick first step';
    if (lower.includes('shoot')) return 'has advanced shooting mechanics';
    if (lower.includes('defense') && lower.includes('versatile')) return 'defends multiple positions effectively';
    if (lower.includes('playmake')) return 'has advanced playmaking skills';
    if (lower.includes('rebound')) return 'has advanced rebounding skills';
    return null;
};

// Look for standout phrases from weaknesses
const extractWeaknessPhrase = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('turnover')) return 'struggles with turnovers under pressure';
    if (lower.includes('cost') || lower.includes('mistake')) return 'has made costly mistakes in big moments';
    if (lower.includes('decision') && lower.includes('poor')) return 'needs to improve decision-making';
    if (lower.includes('defense')) return 'has lapses in defensive consistency';
    if (lower.includes('offense')) return 'has lapses in offensive consistency';
    if (lower.includes('patience')) return 'needs to improve patience with or without basketball';
    return null;
};

const SummaryGenerator = ({ report }) => {
    // Exit early if report not available
    if (!report) return null;

    // Destructure fields from the report
    const { role, ceiling, ratings, strengths, weaknesses, comparison, fit, range } = report;

    // Identify traits scored highly and poorly
    const topTraits = Object.entries(ratings).filter(([_, val]) => val >= 8).map(([trait]) => trait);
    const weakTraits = Object.entries(ratings).filter(([_, val]) => val <= 4).map(([trait]) => trait);

    // Collect keywords and key phrases
    const strengthKeywords = extractKeywords(strengths, 'strengths');
    const weaknessKeywords = extractKeywords(weaknesses, 'weaknesses');
    const strengthPhrase = extractStrengthPhrase(strengths);
    const weaknessPhrase = extractWeaknessPhrase(weaknesses);

    // Compute gap between current role and projected ceiling
    const roleIndex = roles.indexOf(role);
    const ceilingIndex = ceilings.indexOf(ceiling);
    const gap = ceilingIndex - roleIndex;

    // Assemble summary string
    let summary = '';

    if (topTraits.length) summary += `Strong traits include ${topTraits.join(', ')}. `;
    if (strengthKeywords.length) summary += `Described as ${strengthKeywords.join(', ')}. `;
    if (strengthPhrase) summary += `Also ${strengthPhrase}. `;
    if (weakTraits.length) summary += `Needs development in ${weakTraits.join(', ')}. `;
    if (weaknessKeywords.length) summary += `Concerns include ${weaknessKeywords.join(', ')}. `;
    if (weaknessPhrase) summary += `Furthermore, ${weaknessPhrase}. `;

    // Projected developmental potential
    if (gap >= 3) summary += `High variance prospect with significant upside beyond current role. `;
    else if (gap === 2) summary += `Moderate gap between role and ceiling with growth potential. `;
    else summary += `Projection aligns closely with current role. `;

    // Final projection context
    summary += `Compared to ${comparison || 'N/A'}, fits best with ${fit || 'N/A'}, and is expected to be drafted in the ${range} range.`;

    // Styled output using MUI
    return (
        <Paper elevation={2} sx={{ mt: 3, p: 2, backgroundColor: '#eef4ff', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Scouting Summary</Typography>
            <Typography variant="body1">{summary}</Typography>
        </Paper>
    );
};

export default SummaryGenerator;
