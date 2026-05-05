'use client';

import { useState, useMemo } from 'react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/data';

interface DrawSchedule {
  drawNumber: number;
  expectedDate: string;
  expectedPercent: number;
  expectedAmount: number;
}

export default function CalculatorPage() {
  const [totalBudget, setTotalBudget] = useState<string>('500000');
  const [projectDuration, setProjectDuration] = useState<string>('180');
  const [numberOfDraws, setNumberOfDraws] = useState<string>('6');
  const [startDate, setStartDate] = useState<string>('2025-02-01');

  const schedule = useMemo(() => {
    const budget = parseFloat(totalBudget) || 0;
    const duration = parseInt(projectDuration) || 1;
    const draws = parseInt(numberOfDraws) || 1;
    
    const interval = Math.floor(duration / draws);
    const basePercent = 100 / draws;
    
    const result: DrawSchedule[] = [];
    
    for (let i = 1; i <= draws; i++) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + (interval * (i - 1)));
      
      // Variable draw percentages (front-loaded for construction)
      const percentMultiplier = i <= draws / 2 ? 1.1 : 0.9;
      const expectedPercent = Math.round(basePercent * percentMultiplier * 10) / 10;
      
      result.push({
        drawNumber: i,
        expectedDate: start.toISOString().split('T')[0],
        expectedPercent: Math.min(expectedPercent, 100 - (result.reduce((s, d) => s + d.expectedPercent, 0))),
        expectedAmount: Math.round(budget * (expectedPercent / 100)),
      });
    }
    
    // Adjust last draw to ensure 100%
    if (result.length > 0) {
      const totalPercent = result.reduce((s, d) => s + d.expectedPercent, 0);
      result[result.length - 1].expectedPercent += (100 - totalPercent);
      result[result.length - 1].expectedAmount = budget - result.slice(0, -1).reduce((s, d) => s + d.expectedAmount, 0);
    }
    
    return result;
  }, [totalBudget, projectDuration, numberOfDraws, startDate]);

  const dailyBurnRate = useMemo(() => {
    const budget = parseFloat(totalBudget) || 0;
    const duration = parseInt(projectDuration) || 1;
    return budget / duration;
  }, [totalBudget, projectDuration]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Draw Schedule Calculator</h1>
          <p className="text-sm text-text-muted mt-1">
            Calculate expected draw schedules based on project parameters
          </p>
        </div>
        <Button variant="secondary">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader title="Project Parameters" />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Total Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                  <input
                    type="text"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-surface-elevated border border-border-subtle rounded-lg pl-7 pr-3 py-2 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20"
                    placeholder="500000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Project Duration (days)
                </label>
                <input
                  type="number"
                  value={projectDuration}
                  onChange={(e) => setProjectDuration(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20"
                  placeholder="180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Number of Draws
                </label>
                <select
                  value={numberOfDraws}
                  onChange={(e) => setNumberOfDraws(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => (
                    <option key={n} value={n}>{n} draws</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Expected Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-border-subtle space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Daily Burn Rate</span>
                <span className="text-sm font-medium text-text-primary">{formatCurrency(dailyBurnRate)}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Draw Interval</span>
                <span className="text-sm font-medium text-text-primary">{Math.floor(parseInt(projectDuration) / parseInt(numberOfDraws))} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Avg Draw Amount</span>
                <span className="text-sm font-medium text-text-primary">{formatCurrency(parseFloat(totalBudget) / parseInt(numberOfDraws))}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Schedule Output */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Generated Draw Schedule" />
            
            {/* Timeline Visualization */}
            <div className="mb-6">
              <div className="flex h-8 rounded-lg overflow-hidden bg-surface-elevated">
                {schedule.map((draw, index) => (
                  <div
                    key={draw.drawNumber}
                    className="flex items-center justify-center text-xs font-medium text-white transition-all duration-300"
                    style={{
                      width: `${draw.expectedPercent}%`,
                      backgroundColor: index % 2 === 0 ? '#6b8cae' : '#8ba4c4',
                    }}
                    title={`Draw ${draw.drawNumber}: ${draw.expectedPercent}%`}
                  >
                    {draw.expectedPercent >= 10 && `${draw.drawNumber}`}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-text-muted">
                <span>Start</span>
                <span>Progress</span>
                <span>Complete</span>
              </div>
            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase">Draw #</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase">Expected Date</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Percent</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Amount</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Cumulative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {schedule.map((draw, index) => {
                    const cumulative = schedule.slice(0, index + 1).reduce((s, d) => s + d.expectedAmount, 0);
                    return (
                      <tr key={draw.drawNumber} className="hover:bg-surface-elevated">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: index % 2 === 0 ? '#6b8cae' : '#8ba4c4' }}
                            />
                            <span className="text-sm font-medium text-text-primary">Draw {draw.drawNumber}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-text-muted">
                          {new Date(draw.expectedDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-3 py-3 text-right text-sm text-text-primary">
                          {draw.expectedPercent.toFixed(1)}%
                        </td>
                        <td className="px-3 py-3 text-right text-sm font-medium text-text-primary">
                          {formatCurrency(draw.expectedAmount)}
                        </td>
                        <td className="px-3 py-3 text-right text-sm text-accent-primary">
                          {formatCurrency(cumulative)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t border-border-subtle bg-surface-elevated">
                  <tr>
                    <td colSpan={3} className="px-3 py-3 text-sm font-semibold text-text-primary">
                      Total
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-semibold text-text-primary">
                      {formatCurrency(parseFloat(totalBudget) || 0)}
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-semibold text-accent-primary">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}