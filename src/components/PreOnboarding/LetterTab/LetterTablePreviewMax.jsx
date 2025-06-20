import React from "react";

const LetterTablePreviewMaxSalaryInHand = ({ UserDetails }) => {
  const salary = UserDetails?.ctc;
  // const basicSalary = salary > 21000 ? salary * 0.6 : "";
  const basicSalary = salary < 20500 ? salary * 0.8 : salary * 0.6;
  const HRA = basicSalary * 0.3;
  const AdvanceBonus = basicSalary * 0.2;
  const monthlyEncashment = parseFloat(((basicSalary / 26) * 3).toFixed(0));
  const specialAllowance =
    Number(salary) -
    Number(basicSalary) -
    Number(HRA) -
    Number(AdvanceBonus) -
    Number(monthlyEncashment);

  const TotalEarnings =
    Number(basicSalary) +
    Number(HRA) +
    Number(AdvanceBonus) +
    Number(monthlyEncashment) +
    Number(specialAllowance);
  const PT =
    salary >= 18500 && salary <= 25000
      ? 125
      : salary >= 25001 && salary <= 34999
      ? 167
      : salary >= 35000
      ? 208
      : 0;
  const TotalCTC = salary;
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
              {/* <td>Special Allowance</td> */}
              <td>Special Allowance</td>
              <td>INR {specialAllowance}</td>
              <td>INR {specialAllowance * 12}</td>
            </tr>

            <tr>
              {/* <td>Total Earning</td> */}
              <td>Net Pay Before Tax</td>
              <td>INR {TotalEarnings}</td>
              <td>INR {TotalEarnings * 12}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
export default LetterTablePreviewMaxSalaryInHand;
