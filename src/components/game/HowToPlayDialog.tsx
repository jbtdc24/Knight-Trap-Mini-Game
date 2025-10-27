'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ChartOptions {
    maintainAspectRatio: boolean;
    responsive: boolean;
    plugins: {
        legend: {
            labels: {
                color: string;
            };
        };
        tooltip: {
            callbacks: {
                title: (tooltipItems: any[]) => string;
            };
        };
    };
    scales: {
        y: any;
        x: any;
    };
}

const wrapLabel = (label: string | string[]): string | string[] => {
    if (typeof label !== 'string' || label.length <= 16) {
        return label;
    }
    const words = label.split(' ');
    let lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + word).length > 16 && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    }
    lines.push(currentLine.trim());
    return lines;
};

const tooltipTitleCallback = (tooltipItems: any[]): string => {
    const item = tooltipItems[0];
    let label = item.chart.data.labels[item.dataIndex];
    if (Array.isArray(label)) {
        return label.join(' ');
    } else {
        return label;
    }
};


const chartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: '#E2E8F0',
            },
        },
        tooltip: {
            callbacks: {
                title: tooltipTitleCallback,
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                color: '#94A3B8',
            },
            grid: {
                color: '#374151',
            },
        },
        x: {
            ticks: {
                color: '#94A3B8',
            },
            grid: {
                display: false,
            },
        },
    },
};

export default function HowToPlayDialog({ onClose }: { onClose: () => void }) {
    const multiplierCanvasRef = useRef<HTMLCanvasElement>(null);
    const bombCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let multiplierChartInstance: Chart | null = null;
        let bombChartInstance: Chart | null = null;

        if (multiplierCanvasRef.current) {
            const ctxMultiplier = multiplierCanvasRef.current.getContext('2d');
            if (ctxMultiplier) {
                const multiplierLabels = [
                    '0-1 Knight Captures',
                    '2-3 Knight Captures',
                    '4-5 Knight Captures',
                    '6-7 Knight Captures',
                    '8-9 Knight Captures',
                ].map(wrapLabel);
                
                multiplierChartInstance = new Chart(ctxMultiplier, {
                    type: 'line',
                    data: {
                        labels: multiplierLabels,
                        datasets: [{
                            label: 'Gain Multiplier (e.g., x1, x2)',
                            data: [1, 2, 3, 4, 5],
                            backgroundColor: 'rgba(234, 179, 8, 0.2)',
                            borderColor: 'rgba(234, 179, 8, 1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.1,
                        }],
                    },
                    options: { 
                        ...chartOptions, 
                        scales: { 
                            ...chartOptions.scales, 
                            y: { 
                                ...chartOptions.scales.y, 
                                ticks: { 
                                    ...chartOptions.scales.y.ticks, 
                                    callback: function(value: any) { return 'x' + value; } 
                                } 
                            } 
                        } 
                    } as any,
                });
            }
        }

        if (bombCanvasRef.current) {
            const ctxBomb = bombCanvasRef.current.getContext('2d');
            if (ctxBomb) {
                const bombLabels = [
                    'Start (0 Captures)',
                    '1 Knight Capture',
                    '2 Knight Captures',
                    '3 Knight Captures',
                    '4 Knight Captures',
                ].map(wrapLabel);

                bombChartInstance = new Chart(ctxBomb, {
                    type: 'line',
                    data: {
                        labels: bombLabels,
                        datasets: [{
                            label: 'Bomb Lifespan (Player Moves)',
                            data: [3, 4, 5, 6, 7],
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.1,
                        }],
                    },
                    options: { 
                        ...chartOptions, 
                        scales: { 
                            ...chartOptions.scales, 
                            y: { 
                                ...chartOptions.scales.y, 
                                ticks: { 
                                    ...chartOptions.scales.y.ticks, 
                                    callback: function(value: any) { return value + ' Moves'; } 
                                } 
                            } 
                        } 
                    } as any,
                });
            }
        }

        return () => {
            if (multiplierChartInstance) multiplierChartInstance.destroy();
            if (bombChartInstance) bombChartInstance.destroy();
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-gray-100 p-4 md:p-8 max-h-[95vh] overflow-y-auto rounded-lg shadow-2xl w-full max-w-5xl relative">
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 text-4xl hover:text-white z-10">&times;</button>
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                        Knight Trap: The Ascension
                    </h1>
                    <p className="text-lg md:text-xl text-yellow-400">
                        A Visual Guide to the Mechanics
                    </p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    <section className="md:col-span-2 bg-gray-800 rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">1. The Core Objective</h2>
                        <p className="text-md text-gray-300 mb-6">
                            You control a single White Knight on an 8x8 chessboard. The goal is to survive an endless onslaught from two Shadow Knights. Your score is based on skillful movement and strategic elimination of your pursuers, all while navigating an increasingly hazardous board.
                        </p>
                        <div className="flex flex-col md:flex-row justify-around items-center text-center">
                            <div className="mb-6 md:mb-0">
                                <span className="text-6xl font-black text-white">1 ♘</span>
                                <p className="text-lg text-gray-400 mt-2">White Knight (Player)</p>
                            </div>
                            <div className="text-4xl font-black text-gray-500 mb-6 md:mb-0">+</div>
                            <div>
                                <span className="text-6xl font-black text-red-600">2 ♞</span>
                                <p className="text-lg text-gray-400 mt-2">Shadow Knights (AI)</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-800 rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Point & Multiplier Escalation</h2>
                        <p className="text-sm text-gray-300 mb-4">
                            Scoring is based on two actions, which are amplified by a continuously growing **Gain Multiplier**. This multiplier only affects *future* points, not your total score.
                        </p>
                        <ul className="list-none space-y-2 mb-6">
                            <li><span className="text-md font-bold text-blue-400 p-2 rounded">+10 Points</span> (Base) for a Safe Move</li>
                            <li><span className="text-md font-bold text-yellow-400 p-2 rounded">+25 Points</span> (Base) for a Capture</li>
                        </ul>
                        <p className="text-sm text-gray-300 mb-4">
                            The Gain Multiplier increases by **+x1** for every **two** Shadow Knights captured or destroyed. This linear, checkpoint-based progression makes long-term survival exponentially more rewarding.
                        </p>
                        <div className="h-64">
                            <canvas ref={multiplierCanvasRef}></canvas>
                        </div>
                    </section>

                    <section className="bg-gray-800 rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">3. The Passive Bomb Trail</h2>
                        <p className="text-sm text-gray-300 mb-4">
                            Every knight (both player and AI) leaves a passive bomb on the square they move *from*. These bombs are proximity-activated and have a limited duration.
                        </p>
                        <ul className="list-none space-y-2 mb-6 text-md">
                            <li><span className="font-bold">♘ steps on 💣 →</span> <span className="text-red-500 font-bold">INSTANT LOSS</span></li>
                            <li><span className="font-bold">♞ steps on 💣 →</span> <span className="text-yellow-400 font-bold">+25 PTS & DESTROYED</span></li>
                        </ul>
                        <p className="text-sm text-gray-300 mb-4">
                            The bomb lifespan starts at **3 moves** and increases by **+1 move** for *every single* Shadow Knight captured. This forces the player to constantly adapt to a shrinking safe area.
                        </p>
                        <div className="h-64">
                            <canvas ref={bombCanvasRef}></canvas>
                        </div>
                    </section>

                    <section className="md:col-span-2 bg-gray-800 rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">4. The Shadow Knight AI</h2>
                        <p className="text-md text-gray-300 mb-6">
                            The Shadow Knights are cautious trap-setters. Their primary goal is to **avoid the player** while dropping bombs to limit safe squares. However, they become lethal opportunists if the player makes a mistake.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-yellow-400 mb-3">AI Behavior Flow</h3>
                                <div className="space-y-3">
                                    <div className="border-2 border-blue-400 p-3 rounded-lg text-center bg-gray-900 shadow-md">
                                        <span className="font-bold">AI Turn Starts</span>
                                    </div>
                                    <div className="text-center text-2xl text-blue-400 font-black">↓</div>
                                    <div className="border-2 border-yellow-400 p-3 rounded-lg text-center bg-gray-900 shadow-md">
                                        <span className="font-bold">Is ♘ in L-Move Range?</span>
                                    </div>
                                    <div className="flex justify-around text-center mt-3">
                                        <div>
                                            <span className="text-green-400 font-bold">NO</span>
                                            <div className="text-2xl text-green-400 font-black">↓</div>
                                            <div className="border-2 border-green-400 p-3 rounded-lg text-center bg-gray-900 shadow-md mt-1">
                                                <span>Avoid ♘ & Set Bomb Traps</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-red-500 font-bold">YES</span>
                                            <div className="text-2xl text-red-500 font-black">↓</div>
                                            <div className="border-2 border-red-500 p-3 rounded-lg text-center bg-gray-900 shadow-md mt-1">
                                                <span className="font-bold">Prioritize Capture!</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-red-500 mb-3">Critical Weakness & Respawn</h3>
                                <div className="space-y-4">
                                    <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                                        <h4 className="font-bold text-lg text-red-400">AI is Blind to Bombs</h4>
                                        <p className="text-gray-300">The AI cannot detect or avoid any Passive Bombs. Players must use this weakness to trap and destroy them.</p>
                                    </div>
                                    <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                                        <h4 className="font-bold text-lg text-blue-400">Respawn Cooldown</h4>
                                        <p className="text-gray-300">A destroyed Shadow Knight respawns on a random safe square after the player makes **3 moves**, providing a brief tactical window.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-800 rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">5. Player Input & Guides</h2>
                        <p className="text-sm text-gray-300 mb-6">
                            The controls are simple, but the visual aids are temporary.
                        </p>
                        <ul className="list-none space-y-4">
                            <li className="flex items-start">
                                <span className="text-blue-400 text-2xl font-bold mr-3">►</span>
                                <div>
                                    <h3 className="font-bold text-lg">Tap-to-Move</h3>
                                    <p className="text-gray-400">Tap any square to move. The White Knight does not need to be selected first.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 text-2xl font-bold mr-3">►</span>
                                <div>
                                    <h3 className="font-bold text-lg">Illegal Move Illumination</h3>
                                    <p className="text-gray-400">Attempting an invalid L-move will illuminate the square as an error.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-400 text-2xl font-bold mr-3">►</span>
                                <div>
                                    <h3 className="font-bold text-lg">Valid Move Indicator</h3>
                                    <p className="text-gray-400">Safe, valid moves are highlighted with a glow. This "training wheels" guide permanently **disappears after 5 captures**.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section className="bg-gray-800 rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">6. Inevitable Doom</h2>
                        <p className="text-sm text-gray-300 mb-6">
                            The game ends instantly if any of these three conditions are met.
                        </p>
                        <div className="flex flex-col md:flex-row justify-around text-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex-1 bg-gray-900 p-4 rounded-lg shadow-lg">
                                <span className="text-6xl" role="img" aria-label="trapped icon">🕸️</span>
                                <h3 className="text-lg font-bold mt-2">TRAPPED</h3>
                                <p className="text-gray-400 text-xs">Zero legal, non-bomb moves remain.</p>
                            </div>
                            <div className="flex-1 bg-gray-900 p-4 rounded-lg shadow-lg">
                                <span className="text-6xl" role="img" aria-label="bomb icon">💣</span>
                                <h3 className="text-lg font-bold mt-2">BOMB ACTIVATION</h3>
                                <p className="text-gray-400 text-xs">Player moves onto an active bomb.</p>
                            </div>
                            <div className="flex-1 bg-gray-900 p-4 rounded-lg shadow-lg">
                                <span className="text-6xl" role="img" aria-label="knight icon">♞</span>
                                <h3 className="text-lg font-bold mt-2">CAPTURED</h3>
                                <p className="text-gray-400 text-xs">Shadow Knight lands on the player.</p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}