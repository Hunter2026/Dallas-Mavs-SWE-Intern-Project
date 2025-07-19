import React, { useEffect, useState, useRef } from 'react';
import { Typography, Paper, CircularProgress } from '@mui/material';

// === SummaryGenerator Component ===
// Displays a generated summary for a scouting report.
// Shows a loading spinner while the summary is being generated.
// Auto-scrolls to the summary when generation is complete.

const SummaryGenerator = ({ report, scrollOnGenerate = false }) => {
    // === Component state ===
    const [summary, setSummary] = useState(report?.summary || ''); // Holds the summary text
    const [loading, setLoading] = useState(false); // Controls visibility of spinner/message
    const summaryRef = useRef(null); // Used to scroll into view when done

    // === Effect: Generate summary on mount or when report changes ===
    useEffect(() => {
        const generateSummary = async () => {
            // === Guard: Ensure report has necessary identifiers ===
            if (!report?.createdAt || !report?.playerId) {
                console.warn("Missing createdAt or playerId. Skipping summary generation.");
                return;
            }

            setLoading(true); // Show spinner/message

            try {
                // === If cached summary exists, use it and simulate loading ===
                if (report?.summary) {
                    setTimeout(() => {
                        setSummary(report.summary);
                        setLoading(false);
                        if (scrollOnGenerate && summaryRef.current) {
                            summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 500); // Short delay for user feedback
                    return;
                }

                // === Otherwise, fetch new summary from API ===
                const res = await fetch("/summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(report),
                });

                const data = await res.json();
                const newSummary = data.summary;

                setSummary(newSummary);
                setLoading(false);

                // === Scroll to summary after generation ===
                setTimeout(() => {
                    if (scrollOnGenerate && summaryRef.current) {
                        summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 150);

                // === Save the generated summary to localStorage ===
                const key = `report_player_${report.playerId}`;
                const raw = localStorage.getItem(key);
                let existingReports = [];

                try {
                    existingReports = JSON.parse(raw) || [];
                } catch {
                    existingReports = [];
                }

                const updatedReports = existingReports.map(r =>
                    r.createdAt === report.createdAt ? { ...r, summary: newSummary } : r
                );

                localStorage.setItem(key, JSON.stringify(updatedReports));
            } catch (err) {
                console.error("Error generating summary:", err);
                setLoading(false);
            }
        };

        generateSummary();
    }, [report?.createdAt, report?.playerId, report?.summary, scrollOnGenerate]);

    return (
        <div ref={summaryRef}>
            {/* === Show spinner and message while summary is loading === */}
            {loading && (
                <Paper elevation={2} sx={{ mt: 3, p: 3, textAlign: 'center' }}>
                    <CircularProgress size={30} />
                    <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                        Generating Summary...
                    </Typography>
                </Paper>
            )}

            {/* === Display generated summary once loading is complete === */}
            {!loading && summary && (
                <Paper elevation={2} sx={{ mt: 3, p: 2, backgroundColor: '#eef4ff', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Scouting Summary</Typography>
                    <Typography variant="body1">{summary}</Typography>
                </Paper>
            )}
        </div>
    );
};

export default SummaryGenerator;
