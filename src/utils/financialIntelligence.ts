import { SavedProject } from '@/hooks/useFinancialStore';
import { LoanInput } from './loanCalculations';
import { TaxResult } from './taxCalculations';

export interface FinancialInsight {
  type: 'opportunity' | 'warning' | 'achievement';
  title: string;
  message: string;
  impact?: string;
  category: 'debt' | 'tax' | 'investment' | 'retirement';
}

export function analyzeFinancialHealth(
  projects: SavedProject[], 
  t?: (key: string, values?: Record<string, string | number>) => string
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  
  const loanProjects = projects.filter(p => p.type === 'loan');
  const taxProjects = projects.filter(p => p.type === 'tax');
  const investmentProjects = projects.filter(p => p.type === 'roi');

  // 1. Debt vs Savings Intelligence
  loanProjects.forEach(loan => {
    const inp = loan.input as unknown as LoanInput;
    
    // Check for high-interest debt vs low-yield potential
    if (inp.interestRate > 5) {
      const highInterestInsight: FinancialInsight = {
        type: 'warning',
        category: 'debt',
        title: t ? t('debt_strategy_title', { name: loan.name }) : `Interest Strategy for ${loan.name}`,
        message: t ? t('debt_strategy_msg', { rate: inp.interestRate }) : `High interest debt detected.`,
        impact: t ? t('debt_strategy_impact') : 'Interest savings'
      };
      insights.push(highInterestInsight);
    }
  });

  // 2. Tax Efficiency Intelligence
  taxProjects.forEach(tax => {
    const res = tax.result as unknown as TaxResult;
    if (res.taxToPay > 0 && res.effectiveRate > 10) {
      insights.push({
        type: 'opportunity',
        category: 'tax',
        title: t ? t('tax_opp_title') : 'Tax Strategy',
        message: t ? t('tax_opp_msg', { rate: res.brackets.find(b => b.taxableAmount > 0)?.rate || 0 }) : 'Tax saving opportunity.',
        impact: t ? t('tax_opp_impact') : 'Tax reduction'
      });
    }
  });

  // 3. Holistic Cross-Sync Logic
  if (loanProjects.length > 0 && investmentProjects.length > 0) {
     const maxLoanRate = Math.max(...loanProjects.map(p => (p.input as Record<string, unknown>).interestRate as number));
     const avgInvestReturn = investmentProjects.length > 0 ? (investmentProjects[0].input as Record<string, unknown>).annualReturn as number : 0;

     if (maxLoanRate > avgInvestReturn) {
       insights.push({
         type: 'warning',
         category: 'investment',
         title: t ? t('invest_warn_title') : 'Capital Allocation',
         message: t ? t('invest_warn_msg') : 'Debt interest is higher than returns.',
         impact: t ? t('invest_warn_impact') : 'Wealth growth'
       });
     }
  }

  // 5. Refinance Intelligence
  loanProjects.forEach(loan => {
    const res = loan.result as unknown as Record<string, number | undefined>;
    if (res.refinanceWarningYear) {
      insights.push({
        type: 'opportunity',
        category: 'debt',
        title: t ? t('refinance_title', { name: loan.name }) : `Refinance ${loan.name}`,
        message: t ? t('refinance_msg') : 'Approaching rate jump.',
        impact: t ? t('refinance_impact') : 'Reduce payments'
      });
    }
  });

  // 6. Emergency Fund Intelligence (from Stress Test)
  loanProjects.forEach(loan => {
    const inp = loan.input as unknown as Record<string, unknown>;
    if (inp.stressTest === 'income-shock') {
      insights.push({
        type: 'warning',
        category: 'debt',
        title: t ? t('emergency_title') : 'Contingency Plan',
        message: t ? t('emergency_msg') : 'Build an emergency fund.',
        impact: t ? t('emergency_impact') : 'Stability'
      });
    }
  });

  // 7. Default Greeting if no projects
  if (projects.length === 0) {
    insights.push({
      type: 'achievement',
      category: 'retirement',
      title: t ? t('default_title') : 'Start Planning',
      message: t ? t('default_msg') : 'Analyze your wealth today.',
    });
  }

  return insights;
}
