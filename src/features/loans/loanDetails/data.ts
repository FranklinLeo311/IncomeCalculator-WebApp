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
    PaidThruDate: "11-04-2025",
    NoOfMonthsEmployed: "0.00",
    DateOfTermination: "11-04-2025",
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


const bankDetails = [
            {
                "AccountId": "2559",
                "loan_id": "3910",
                "borrower_id": "13706",
                "borrowertype_id": "1",
                "BankName": "SBI",
                "IncomeSource": "Sample",
                "AccountHolder": "melvin",
                "AccountNumber": "4543254325",
                "AccountCategoryId": "2",
                "AccountCategory": "Business",
                "AccountTypeId": "2",
                "AccountType": "Checking",
                "NoofMonths": "0",
                "Exclude": "0",
                "reasonforexclude": "",
                "First12MonthAvg": "0.00",
                "Second12MonthAvg": "0.00",
                "_24MonthAvg": "0.00",
                "NoOfMonthAvg": "0.000000",
                "ActiveFlag": "0",
                "AccountCount": "1"
            },
            {
                "AccountId": "2558",
                "loan_id": "3910",
                "borrower_id": "13706",
                "borrowertype_id": "1",
                "BankName": "Indian%20Bank",
                "IncomeSource": "Savings",
                "AccountHolder": "Franklin",
                "AccountNumber": "43534254235",
                "AccountCategoryId": "1",
                "AccountCategory": "Personal",
                "AccountTypeId": "0",
                "AccountType": "",
                "NoofMonths": "0",
                "Exclude": "0",
                "reasonforexclude": "",
                "First12MonthAvg": "0.00",
                "Second12MonthAvg": "0.00",
                "_24MonthAvg": "0.00",
                "NoOfMonthAvg": "0.000000",
                "ActiveFlag": "0",
                "AccountCount": "1"
            }
        ];


        export const  reo =[{"Loan_Id":3910,"REO_Id":2554,"BorrowerType_Id":3,
          "Borrower_Id":13708,"Borrower_Name":"Test new Name","Property_Number":1,
          "Property_Address":"Chennai","Occupancy_Type":2,
          "Occupancy_Name":"Investment Property","Is_Subject_Property":false,
          "Adjusted_Monthly_Rental_Income":3548.58,"Net_Rental_Value":3548.58,
          "Is_Excluded":false,
"Exclude_Comments":"","CombinedReo_Id":0,"IsCombinedReo":false,
"Lease_Gross_Rental_Income":0.00,"Lease_Vacancy_Factor":0.00,
"Total_PITIA":0.00}]