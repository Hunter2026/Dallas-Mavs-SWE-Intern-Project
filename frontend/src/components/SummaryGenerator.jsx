import React, { useEffect, useState, useRef } from 'react';
import { Typography, Paper, CircularProgress } from '@mui/material';
// === API Base URL Configuration ===
import API_BASE_URL from '../apiConfig.js';

// === Summary Generator Component ===
const SummaryGenerator = ({ report, scrollOnGenerate = false }) => {
    const [summary, setSummary] = useState(report?.summary || ''); // Stores generated summary
    const [loading, setLoading] = useState(false); // Tracks loading state
    const summaryRef = useRef(null); // Ref to scroll to summary section

    // === Generate summary when report changes or scroll flag is set ===
    useEffect(() => {
        const generateSummary = async () => {
            // If summary already exists in the report, use it
            if (report?.summary) {
                setSummary(report.summary);
                return;
            }

            // Validate required report data before sending request
            if (!report?.createdAt || !report?.playerId) {
                console.warn("Missing createdAt or playerId. Skipping summary generation.");
                return;
            }

            setLoading(true); // Show spinner

            try {
                // === API Call: POST report to generate summary ===
                const res = await fetch("/summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(report),
                });

                const data = await res.json();
                const newSummary = data.summary;

                setSummary(newSummary);
                setLoading(false);

                // === Auto-scroll to summary section if enabled ===
                if (scrollOnGenerate && summaryRef.current) {
                    setTimeout(() => {
                        summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100); // Delay allows render to complete first
                }

                // === Save updated summary in localStorage ===
                const key = `report_player_${report.playerId}`;
                let existingReports = [];

                try {
                    const raw = localStorage.getItem(key);
                    existingReports = JSON.parse(raw) || [];
                } catch {
                    existingReports = [];
                }

                // Update the relevant report entry with the new summary
                const updatedReports = existingReports.map(r =>
                    r.createdAt === report.createdAt ? { ...r, summary: newSummary } : r
                );

                localStorage.setItem(key, JSON.stringify(updatedReports));
            } catch (err) {
                console.error("Error generating summary:", err);
                setLoading(false); // Hide spinner on failure
            }
        };

        generateSummary();
    }, [
        report?.createdAt,
        report?.playerId,
        report?.summary,
        scrollOnGenerate
    ]);

    return (
        <div ref={summaryRef}>
            {/* === Loading Spinner While Summary is Being Fetched === */}
            {loading && (
                <Paper elevation={2} sx={{ mt: 3, p: 2, textAlign: 'center' }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Generating Report...
                    </Typography>
                </Paper>
            )}

            {/* === Render Summary Box When Ready === */}
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
