import React from "react";

const LetterTabPdf1WithPF = ({ UserDetails }) => {
  const salary = UserDetails?.ctc;
  const basicSalary = salary * 0.6;
  const HRA = basicSalary * 0.3;
  const AdvanceBonus = basicSalary * 0.2;
  const monthlyEncashment = parseFloat(((basicSalary / 26) * 3).toFixed(0));
  const specialAllowance =
    salary - basicSalary - HRA - AdvanceBonus - monthlyEncashment;
  const EmployeePF = parseFloat(
    (basicSalary < 14000 ? basicSalary * 0.12 : 1800).toFixed(0)
  );
  const TotalEarnings =
    basicSalary + HRA + AdvanceBonus + monthlyEncashment + specialAllowance;

  const TotalCTC = salary + EmployeePF;
  return (
    <>
      <div className="ol-table">
        <p className="underlined bold">Renumeration Structure & Break-up </p>
        <table>
          <thead>
            <tr>
              <th>EARNINGS</th>
              <th>MONTHLY</th>
              <th>ANNUALY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Salary</td>
              <td>INR {basicSalary}</td>
              <td>INR {basicSalary * 12}</td>
            </tr>
            <tr>
              <td>HRA</td>
              <td>INR {HRA}</td>
              <td>INR {HRA * 12}</td>
            </tr>
            <tr>
              <td>Advance Bonus</td>
              <td>INR {AdvanceBonus}</td>
              <td>INR {AdvanceBonus * 12}</td>
            </tr>
            <tr>
              <td>Monthly Leave Encashment</td>
              <td>INR {monthlyEncashment}</td>
              <td>INR {monthlyEncashment * 12}</td>
            </tr>
            <tr>
              <td>Special Allowance</td>
              <td>INR {specialAllowance}</td>
              <td>INR {specialAllowance * 12}</td>
            </tr>
            <tr>
              <td>Total Earning</td>
              <td>INR {TotalEarnings}</td>
              <td>INR {TotalEarnings * 12}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>DEDUCTIONS</th>
              <th>MONTHLY</th>
              <th>ANNUALY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PF Employee</td>
              <td>INR {EmployeePF}</td>
              <td>INR {EmployeePF * 12}</td>
            </tr>
            <tr>
              <td>Net Pay Before Tax</td>
              <td>INR {TotalEarnings - EmployeePF}</td>
              <td>INR {TotalEarnings * 12 - EmployeePF * 12}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>Contribution</th>
              <th>MONTHLY</th>
              <th>ANNUALY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* <td>ESIC</td>
              <td>INR</td>
              <td>INR </td> */}
            </tr>
            <tr>
              <td>PF Employer</td>
              <td>INR {EmployeePF}</td>
              <td>INR {EmployeePF * 12}</td>
            </tr>
            <tr>
              <td>Total CTC</td>
              <td>INR {TotalCTC}</td>
              <td>INR {TotalCTC * 12}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LetterTabPdf1WithPF;
