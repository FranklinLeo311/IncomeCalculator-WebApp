// src/components/loanDetails/data.ts
export const BORROWERS = [
  { id: "b_1", name: "Marvin McKinney" },
  { id: "b_2", name: "Martha McKinney" },
  { id: "b_3", name: "Other Borrower" }
];

// wage array (hard-coded from your payload)
export const WAGE_DATA = [
  {
    borrowerwageid: "6995",
    borrowerId: "b_1",
    employer_name: "IMB",
    DateOfHire: "11-04-2025",
    ActiveEmploymentFlag: "0",
    PaidThruDate: null,
    NoOfMonthsEmployed: "0.00",
    DateOfTermination: null,
    Totalincome: "0.00",
    gap: "0.00"
  },
  {
    borrowerwageid: "6993",
    borrowerId: "b_1",
    employer_name: "New Employer",
    DateOfHire: "11-03-2025",
    ActiveEmploymentFlag: "0",
    PaidThruDate: null,
    NoOfMonthsEmployed: "0.00",
    DateOfTermination: null,
    Totalincome: "3.75",
    gap: "0.00"
  },
  {
    borrowerwageid: "6994",
    borrowerId: "b_2",
    employer_name: "Loan DNA",
    DateOfHire: "01-01-1900",
    ActiveEmploymentFlag: "0",
    PaidThruDate: null,
    NoOfMonthsEmployed: "0.00",
    DateOfTermination: null,
    Totalincome: "0.00",
    gap: "0.00"
  }
];

// self-employed / business returns (hard-coded)
export const SELFEMPLOYED = [
  {
    selfemployed_id: "1149",
    borrowerId: "b_1",
    business_name: "New Business",
    employedfrom: "2025-11-04",
    Is_Active_employment_flag: "0",
    SelfEmploymentVerifiedThruDate: "1900-01-01",
    EmployedTo: "1900-01-01",
    Months_SelfEmployed: "0.00",
    Schedules: "0",
    Totalincome: "0.00"
  },
  {
    selfemployed_id: "1150",
    borrowerId: "b_1",
    business_name: "Business One",
    employedfrom: "1900-01-01",
    Is_Active_employment_flag: "0",
    SelfEmploymentVerifiedThruDate: "1900-01-01",
    EmployedTo: "1900-01-01",
    Months_SelfEmployed: "0.00",
    Schedules: "0",
    Totalincome: "0.00"
  }
];
