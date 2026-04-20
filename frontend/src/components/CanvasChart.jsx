import { useEffect, useRef } from "react";

export default function CanvasChart({ questionId, chartData }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);

    const optionNames = Object.keys(chartData || {}).filter(
        (opt) => opt !== "None of the Above"
    );

    useEffect(() => {
        if (!containerRef.current || optionNames.length === 0) return;

        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        if (!window.CanvasJS) {
            console.error("CanvasJS not loaded on window");
            return;
        }

        const COLORS = ["#00C896", "#3B6FE0", "#F59E0B", "#EF4444", "#8064A2"];

        const dataSeries = optionNames.map((opt, i) => {
            const points = (chartData[opt] || []).map((pt) => ({
                x: pt.x instanceof Date && !isNaN(pt.x) ? pt.x : new Date(),
                y: pt.y,
            }));

            const lastY = points.length > 0 ? points[points.length - 1].y : 0;

            // ✅ Only mark the last point with a dot — no inline label
            if (points.length > 0) {
                points[points.length - 1] = {
                    ...points[points.length - 1],
                    markerSize: 8,
                    markerColor: COLORS[i % COLORS.length],
                    markerBorderColor: "#fff",
                    markerBorderThickness: 2,
                };
            }

            return {
                type: "stepLine",
                name: opt,
                showInLegend: true,
                legendText: `${opt}: ${lastY}%`,  // ✅ show current % in legend
                legendMarkerType: "circle",
                color: COLORS[i % COLORS.length],
                lineThickness: 2,
                markerSize: 0,
                markerType: "circle",
                dataPoints: points,
            };
        });

        const chart = new window.CanvasJS.Chart(containerRef.current, {
            animationEnabled: true,
            backgroundColor: "#ffffff",
            title: { text: "" },

            legend: {
                cursor: "pointer",
                fontSize: 13,
                fontWeight: "bold",
                horizontalAlign: "center",
                verticalAlign: "top",
                markerMargin: 6,
            },

            toolTip: {
                shared: true,
                borderThickness: 0,
                cornerRadius: 6,
                fontSize: 13,
                contentFormatter: (e) => {
                    const time = window.CanvasJS.formatDate(
                        e.entries[0].dataPoint.x, "HH:mm"
                    );
                    let html = `<div style="padding:6px 10px">
                        <strong style="color:#333">${time}</strong><br/>`;
                    e.entries.forEach((entry) => {
                        html += `<span style="color:${entry.dataSeries.color}">●</span>
                            <span style="color:#555"> ${entry.dataSeries.name}:
                            <strong>${entry.dataPoint.y}%</strong></span><br/>`;
                    });
                    html += `</div>`;
                    return html;
                },
            },

            axisX: {
                lineThickness: 0,
                tickLength: 0,
                labelFontSize: 12,
                labelFontColor: "#999",
                valueFormatString: "HH:mm",
                gridThickness: 0,
                margin: 10,
            },

            axisY: {
                lineThickness: 0,
                tickLength: 0,
                labelFontSize: 12,
                labelFontColor: "#999",
                suffix: "%",
                gridThickness: 1,
                gridDashType: "dot",
                gridColor: "#e0e0e0",
                minimum: 0,
                maximum: 100,
                interval: 10,
            },

            axisY2: {
                lineThickness: 0,
                tickLength: 0,
                labelFontSize: 12,
                labelFontColor: "#999",
                suffix: "%",
                gridThickness: 0,
                minimum: 0,
                maximum: 100,
                interval: 10,
            },

            data: dataSeries,
        });

        chart.render();
        chartRef.current = chart;

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [questionId, JSON.stringify(chartData)]);

    if (optionNames.length === 0) {
        return (
            <div style={{
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#aaa",
                fontSize: 13,
                background: "#f9f9f9",
                borderRadius: 8,
            }}>
                No graph data yet
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "280px",
                borderRadius: 10,
                background: "#fff",
                padding: "8px 0",
            }}
        />
    );
}