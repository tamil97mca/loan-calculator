import { Key, ReactElement, JSXElementConstructor, ReactFragment, PromiseLikeOfReactNode, ReactPortal } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export default function AmortizationTable({ amortizationSchedule }: any) {
  const totalInterestPaid =
    amortizationSchedule?.reduce((sum: any, row: { interestPaid: any; }) => sum + row.interestPaid, 0) || 0;
  const totalPrincipalRepaid =
    amortizationSchedule?.reduce((sum: any, row: { principalRepaid: any; }) => sum + row.principalRepaid, 0) ||
    0;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Amortization Schedule</h2>
      {amortizationSchedule && amortizationSchedule.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Installment</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Opening Balance</TableHead>
              <TableHead>Interest Paid</TableHead>
              <TableHead>Principal Repaid</TableHead>
              <TableHead>Closing Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amortizationSchedule.map((row: { installmentNumber: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined; dueDate: { toLocaleDateString: (arg0: string, arg1: { day: string; month: string; year: string; }) => string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined; }; openingBalance: number; interestPaid: number; principalRepaid: number; closingBalance: number; }) => {
              // Ensure installmentNumber is valid for the key prop.
              const validKey = typeof row.installmentNumber === 'number' || typeof row.installmentNumber === 'string'
                ? row.installmentNumber
                : '';

              return (
                <TableRow key={validKey}>
                  <TableCell>{row.installmentNumber}</TableCell>
                  <TableCell>{row.dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                  <TableCell>{row.openingBalance.toFixed(2)}</TableCell>
                  <TableCell>{row.interestPaid.toFixed(2)}</TableCell>
                  <TableCell>{row.principalRepaid.toFixed(2)}</TableCell>
                  <TableCell>{row.closingBalance.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
            <TableRow className="font-bold">
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>{totalInterestPaid.toFixed(2)}</TableCell>
              <TableCell>{totalPrincipalRepaid.toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>

        </Table>
      ) : (
        <p className="text-gray-500 italic">
          No amortization schedule available. Please calculate the loan first.
        </p>
      )}
    </div>
  );
}
