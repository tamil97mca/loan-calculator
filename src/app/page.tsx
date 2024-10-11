'use client';

import { useState } from 'react';
import LoanCalculator from './components/LoanCalculator';
import AmortizationTable from './components/AmortizationTable';

export default function Home() {

  const date = new Date();
  const paymentStartDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

  const [loanDetails, setLoanDetails] = useState({
    principalAmount: 100000,
    totalInterest: 0,
    totalPayableAmount: 0,
    monthlyEmiAmount: 0,
    interestType: 'Fixed',
    rateOfInterest: 5,
    numberOfInstallments: 12,
    // paymentStartDate: new Date().toISOString().split('T')[0],
    paymentStartDate: paymentStartDate

  });

  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
        Loan Calculator
      </h1>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-8">
            <LoanCalculator
              loanDetails={loanDetails}
              setLoanDetails={setLoanDetails}
              setAmortizationSchedule={setAmortizationSchedule}
            />
          </div>
          <div className="md:w-1/2 bg-indigo-50 p-8">
            <AmortizationTable amortizationSchedule={amortizationSchedule} />
          </div>
        </div>
      </div>
    </div>
  );
}
