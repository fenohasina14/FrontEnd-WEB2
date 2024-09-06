import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

function Graphique({ data }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartCanvas = chartRef.current;

        if (chartCanvas) {
            if (chartCanvas.chart) {
                chartCanvas.chart.destroy();
            }

            const chart = new Chart(chartCanvas, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Valeur',
                            data: data.datasets[0].data,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                tooltipFormat: 'MMM D, YYYY',
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Valeur'
                            }
                        }
                    }
                }
            });

            chartCanvas.chart = chart;
        }
    }, [data]);

    return (
        <div className="graph-container">
            <canvas ref={chartRef} />
        </div>
    );
}

export default Graphique;
