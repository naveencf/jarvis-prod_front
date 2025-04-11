// utils/salaryUtils.js

export const calculateEMPPF = (user) => {
  if (!user || typeof user.salary !== "number") return 0;

  let salary = user.salary;
  let basicSalary = salary * 0.6;
  let basicsal = (basicSalary < 12300 ? salary * 0.8 : basicSalary).toFixed(0);
  let EmployeePF = parseFloat(
    (basicsal <= 14999 ? basicsal * 0.12 : 1800).toFixed(0)
  );

  let EmployeerESIC = 0;

  if (
    salary <= 21000 &&
    user.emergency_contact_person_name2 === "pf_and_esic"
  ) {
    EmployeerESIC = parseFloat(((salary * 3.25) / 100).toFixed(0));
  }

  const EMPPF =
    user.emergency_contact_person_name2 === "pf_and_esic"
      ? EmployeePF * 12 + (salary <= 21000 ? EmployeerESIC * 12 : 0)
      : 0;

  return EMPPF;
};
