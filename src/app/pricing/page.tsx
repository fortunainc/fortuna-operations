'use client';

import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function PricingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Verified Draw Reporting
        </h1>
        <p className="text-lg text-text-muted mb-6">
          Capital decision support through documentation alignment and reduced release risk
        </p>
        <div className="bg-accent-primary/10 border border-accent-primary/20 rounded-lg p-4">
          <p className="text-sm text-text-primary font-medium">
            Many inspection vendors provide basic photo documentation. Fortuna Draw Group provides 
            verification and alignment to support confident capital release.
          </p>
        </div>
      </div>

      {/* Speed Signal */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Inspections scheduled quickly across Southern California
        </div>
        <p className="text-sm text-text-muted mt-2">
          Reports delivered within 24–48 hours once documentation is received
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Core Draw Verification */}
        <Card className="border-2 border-accent-primary relative">
          <div className="absolute -top-3 left-4">
            <Badge variant="success">Primary Offering</Badge>
          </div>
          <div className="pt-4">
            <CardHeader title="Core Draw Verification" />
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-text-primary">$400 - $500</p>
              <p className="text-sm text-text-muted mt-1">per draw inspection</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">On-site inspection</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Photo documentation</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">% completion estimate</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Budget vs progress cross-check</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Invoice/receipt review</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Documentation alignment</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Risk flags</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Structured executive summary</span>
              </div>
            </div>
            <Button variant="primary" fullWidth className="w-full">
              Request Inspection Coverage
            </Button>
          </div>
        </Card>

        {/* Priority / Enhanced Verification */}
        <Card className="border-2 border-accent-primary relative bg-accent-primary/5">
          <div className="absolute -top-3 left-4">
            <Badge variant="success">Premium</Badge>
          </div>
          <div className="pt-4">
            <CardHeader title="Priority Verification" />
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-text-primary">$750 - $900+</p>
              <p className="text-sm text-text-muted mt-1">enhanced verification</p>
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-text-primary mb-3">Everything in Core, PLUS:</p>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary"><strong>24-hour turnaround</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Deeper discrepancy analysis</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Enhanced documentation review</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary"><strong>Priority scheduling</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-text-primary">Higher-confidence reporting</span>
              </div>
            </div>
            <Button variant="primary" fullWidth className="w-full">
              Schedule Priority Inspection
            </Button>
          </div>
        </Card>

        {/* Multifamily Pricing */}
        <Card>
          <div className="pt-4">
            <CardHeader title="Multifamily Projects" />
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-text-primary">Tiered</p>
              <p className="text-sm text-text-muted mt-1">based on unit count</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-surface-elevated rounded-lg">
                <span className="text-sm text-text-primary">2–4 units</span>
                <span className="text-sm font-semibold text-text-primary">$500 – $700</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-elevated rounded-lg">
                <span className="text-sm text-text-primary">5–10 units</span>
                <span className="text-sm font-semibold text-text-primary">$700 – $1,000</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-elevated rounded-lg">
                <span className="text-sm text-text-primary">10+ units</span>
                <span className="text-sm font-semibold text-text-primary">Custom Pricing</span>
              </div>
            </div>
            <Button variant="secondary" fullWidth className="w-full">
              Request Quote
            </Button>
          </div>
        </Card>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
        <Button variant="primary" size="lg">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Request Sample Report
        </Button>
        <Button variant="secondary" size="lg">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Schedule a Call
        </Button>
      </div>

      {/* Differentiation */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-surface-elevated">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Why Verification Matters
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Basic photo documentation cannot confirm whether work actually matches invoices. 
              Fortuna Draw Group provides verification through budget vs progress alignment, 
              documentation review, and risk flag identification—reducing the likelihood of 
              funding misalignment and supporting confident capital release decisions.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}