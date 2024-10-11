'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from './ui/select'; // Removed SelectIcon as per previous steps
import { Button } from './ui/button';

export default function LoanCalculator({
  loanDetails,
  setLoanDetails,
  setAmortizationSchedule,
}: any) {
  const [error, setError] = useState('');

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setLoanDetails((prev: any) => ({
      ...prev,
      [name]:
        name === 'principalAmount' ||
        name === 'rateOfInterest' ||
        name === 'numberOfInstallments'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSelectChange = (value: any) => {
    setLoanDetails((prev: any) => ({
      ...prev,
      interestType: value,
    }));
  };

  const calculateLoan = () => {
    setError('');
    const {
      principalAmount,
      interestType,
      rateOfInterest,
      numberOfInstallments,
      paymentStartDate,
    } = loanDetails;

    if (
      !principalAmount ||
      !interestType ||
      !rateOfInterest ||
      !numberOfInstallments ||
      !paymentStartDate
    ) {
      setError('Please fill in all fields');
      return;
    }

    const monthlyInterestRate = rateOfInterest / 12 / 100;
    let totalInterest = 0;
    let totalPayableAmount = 0;
    let monthlyEmiAmount = 0;

    if (interestType === 'Fixed') {
      totalInterest =
        principalAmount * (monthlyInterestRate * numberOfInstallments);
      totalPayableAmount = principalAmount + totalInterest;
      monthlyEmiAmount = totalPayableAmount / numberOfInstallments;
    } else if (interestType === 'Diminishing') {
      monthlyEmiAmount =
        (principalAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfInstallments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfInstallments) - 1);
      totalPayableAmount = monthlyEmiAmount * numberOfInstallments;
      totalInterest = totalPayableAmount - principalAmount;
    } else if (interestType === 'Zero') {
      totalPayableAmount = principalAmount;
      monthlyEmiAmount = totalPayableAmount / numberOfInstallments;
    }

    setLoanDetails((prev: any) => ({
      ...prev,
      totalInterest,
      totalPayableAmount,
      monthlyEmiAmount,
    }));

    generateAmortizationSchedule(
      principalAmount,
      interestType,
      monthlyInterestRate,
      numberOfInstallments,
      monthlyEmiAmount,
      paymentStartDate
    );
  };

  const generateAmortizationSchedule = (
    principalAmount: number,
    interestType: string,
    monthlyInterestRate: number,
    numberOfInstallments: number,
    monthlyEmiAmount: number,
    paymentStartDate: string | number | Date
  ) => {
    let outstandingPrincipal = principalAmount;
    const schedule = [];
    const startDate = new Date(paymentStartDate);

    for (let i = 1; i <= numberOfInstallments; i++) {
      const dueDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + i - 1,
        startDate.getDate()
      );
      let interestPaid, principalRepaid, closingBalance;

      if (interestType === 'Fixed') {
        interestPaid = principalAmount * monthlyInterestRate;
        principalRepaid = monthlyEmiAmount - interestPaid;
      } else if (interestType === 'Diminishing') {
        interestPaid = outstandingPrincipal * monthlyInterestRate;
        principalRepaid = monthlyEmiAmount - interestPaid;
      } else {
        interestPaid = 0;
        principalRepaid = monthlyEmiAmount;
      }

      closingBalance = outstandingPrincipal - principalRepaid;

      schedule.push({
        installmentNumber: i,
        dueDate,
        openingBalance: outstandingPrincipal,
        interestPaid,
        principalRepaid,
        closingBalance,
      });

      outstandingPrincipal = closingBalance;
    }

    setAmortizationSchedule(schedule);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="principalAmount">Principal Amount</Label>
        <Input
          type="number"
          id="principalAmount"
          name="principalAmount"
          value={loanDetails.principalAmount}
          onChange={handleInputChange}
          placeholder="100000"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interestType">Interest Type</Label>
        <Select
          value={loanDetails.interestType}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Interest Type" />
            {/* Icon already included in SelectTrigger */}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fixed">Fixed</SelectItem>
            <SelectItem value="Diminishing">Diminishing</SelectItem>
            <SelectItem value="Zero">Zero</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rateOfInterest">Rate of Interest (%)</Label>
        <Input
          type="number"
          id="rateOfInterest"
          name="rateOfInterest"
          value={loanDetails.rateOfInterest}
          onChange={handleInputChange}
          step="0.01"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="numberOfInstallments">Number of Installments</Label>
        <Input
          type="number"
          id="numberOfInstallments"
          name="numberOfInstallments"
          value={loanDetails.numberOfInstallments}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paymentStartDate">Payment Start Date</Label>
        <Input
          type="date"
          id="paymentStartDate"
          name="paymentStartDate"
          value={loanDetails.paymentStartDate}
          onChange={handleInputChange}
        />
      </div>
      <Button onClick={calculateLoan} className="w-full">
        Calculate EMI
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loanDetails.totalInterest !== undefined && (
        <div className="space-y-2">
          <p className="font-semibold">
            Total Interest: {loanDetails.totalInterest.toFixed(2)}
          </p>
          <p className="font-semibold">
            Total Payable Amount: {loanDetails.totalPayableAmount.toFixed(2)}
          </p>
          <p className="font-semibold">
            Monthly EMI Amount: {loanDetails.monthlyEmiAmount.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
