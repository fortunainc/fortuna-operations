'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { generateDailySummary, callAIService, type DailySummaryInput, type DailySummaryOutput } from '@/lib/aiServices';

export default function CEODailySummary() {
  const [summary, setSummary] = useState<DailySummaryOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    try {
      // In production, this would fetch real data from your backend
      const input: DailySummaryInput = {
        inspectionsToday: 2,
        inspectionsThisWeek: 5,
        overdueInvoices: { count: 1, totalAmount: 4200 },
        projectsAtRisk: 1,
        drawsNeedingAttention: 1,
        pendingApprovals: 2,
        reportsPending: 0,
      };
      
      const result = await callAIService<DailySummaryOutput>(input, 'dailySummary');
      setSummary(result);
    } catch (error) {
      console.error('Failed to load CEO summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-text-muted">Loading summary...</p>
        </div>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-text-muted">Unable to load summary</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">CEO</span>
        </div>
        <h3 className="text-lg font-semibold text-text-primary">Daily Summary</h3>
      </div>

      {/* One-line summary */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-blue-100">
        <p className="text-sm font-medium text-text-primary">{summary.summary}</p>
      </div>

      {/* Detailed breakdown */}
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-lg">📅</span>
          <div>
            <p className="text-xs text-text-muted font-medium">INSPECTIONS</p>
            <p className="text-sm text-text-primary">{summary.details.inspections}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-lg">💰</span>
          <div>
            <p className="text-xs text-text-muted font-medium">FINANCIALS</p>
            <p className="text-sm text-text-primary">{summary.details.financials}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-xs text-text-muted font-medium">RISKS</p>
            <p className="text-sm text-text-primary">{summary.details.risks}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-xs text-text-muted font-medium">ACTIONS</p>
            <p className="text-sm text-text-primary">{summary.details.actions}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}