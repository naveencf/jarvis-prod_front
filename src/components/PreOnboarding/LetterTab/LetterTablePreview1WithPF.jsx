import React from "react";

const LetterTablePreview1WithPF = ({ UserDetails }) => {
  const salary = UserDetails?.ctc;
  const basicSalary = salary * 0.6;

  const basicsal = (basicSalary < 12300 ? salary * 0.8 : basicSalary).toFixed(
    0
  );

  const HRA = basicsal * 0.3;

  const AdvanceBonus = (basicsal * 0.2).toFixed(0);

  const addbasicAdvance = Number(basicsal) + Number(AdvanceBonus);
  console.log(addbasicAdvance, "advance");

  const monthlyEncashment = ((basicsal / 26) * 3).toFixed(0);

  // const monthEncashWithoutFormu =
  // basicsal > 13000 ? Number(salary) - Number(addbasicAdvance) : 0;

  const monthEncash =
    salary >= 20500
      ? Number(monthlyEncashment)
      : Number(salary) - Number(addbasicAdvance);

  console.log(monthEncash, "monthencash");

  const specialAllowance =
    Number(salary) -
    Number(basicsal) -
    Number(HRA) -
    Number(AdvanceBonus) -
    Number(monthlyEncashment);

  const EmployeePF = parseFloat(
    (basicsal < 14000
      ? (Number(basicsal) + Number(specialAllowance)) * 0.12
      : 1800
    ).toFixed(0)
  );

  const TotalEarnings =
    salary >= 20500
      ? Number(basicsal) +
        Number(HRA) +
        Number(AdvanceBonus) +
        Number(monthEncash) +
        Number(specialAllowance)
      : Number(basicsal) + Number(AdvanceBonus) + Number(monthEncash);

  const TotalCTC =
    salary >= 21000
      ? Number(salary) + Number(EmployeePF)
      : Number(salary) + Number(EmployeePF);
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
              <td>INR {basicsal}</td>
              <td>INR {basicsal * 12}</td>
            </tr>
            {salary >= 20500 && (
              <tr>
                <td>HRA</td>
                <td>INR {HRA}</td>
                <td>INR {HRA * 12}</td>
              </tr>
            )}
            <tr>
              <td>Advance Bonus</td>
              <td>INR {AdvanceBonus}</td>
              <td>INR {AdvanceBonus * 12}</td>
            </tr>
            <tr>
              <td>Monthly Leave Encashment</td>
              <td>INR {monthEncash}</td>
              <td>INR {monthEncash * 12}</td>
            </tr>
            {salary >= 20500 && (
              <tr>
                <td>Special Allowance</td>
                <td>INR {specialAllowance}</td>
                <td>INR {specialAllowance * 12}</td>
              </tr>
            )}
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

export default LetterTablePreview1WithPF;
