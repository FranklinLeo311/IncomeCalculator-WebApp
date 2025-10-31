import { loansGetFhaTerm } from "./calcLibrary";

const performAPR = ({ rateDetails }) => {
  //searchInputs

  let {
      // Need to get from DB - Start
      upFrontMIPFactor = 0,
      fhaCaseDate = undefined,
      miPercent = 0,
      miAmount = 0,

      firstPaymentDate,
      disbursementDate,
      // Need to get from DB - End
      interestRate = 0, // added by arul on 7-1-2025
      productName = "",
      rateBands = [],
      creditCharge = 0,
      loanAmount,
      term,
      productCategory,
      purchasePrice,
      appraisedValue,
      occupancy,
      propertyType,
      amortizationType,
      lockPeriodDays = 30,
      armDetails,
      aprInput,
      finalRate, // added by Gopal for adjustment calculation
    } = rateDetails,
    tilPrePay = creditCharge;
  interestRate = finalRate;

  const parsedArmDetails =
    typeof armDetails === "string"
      ? JSON.parse(armDetails || "{}")
      : armDetails || {};
  const parsedAprInput =
    typeof aprInput === "string"
      ? JSON.parse(aprInput || "{}")
      : aprInput || {};

  const {
    armGrossMargin = 0,
    armIndexValue = 0,
    armTerm = "",
    capTerm = "",
  } = parsedArmDetails;
  if (!firstPaymentDate || !disbursementDate) {
    const dates = calculateDisbursementAndFirstPayment(lockPeriodDays);
    firstPaymentDate = dates.firstPaymentDate;
    disbursementDate = dates.disbursementDate;
  }

  const {
    miPayYear, // Determines how many years MI will be paid
    miPercentAfterCancel,
    lesserOfPercent,
  } = parsedAprInput;

  firstPaymentDate = new Date(firstPaymentDate);
  disbursementDate = new Date(disbursementDate);

  let isCredit = rateDetails["creditCharge"] < 0,
    ratesArray = [];

  if (Number(amortizationType) & 1) {
    ratesArray = [
      {
        startTerm: 1,
        endTerm: term,
        totalTerm: term,
        noteRate: interestRate / 100,
      },
    ];
  } else if (Number(amortizationType) & 2) {
    const decoded = decodeARMInput([armTerm, capTerm]);

    ratesArray = generateRateSchedule({
      initialRate: interestRate / 100,
      totalTerm: term,
      armGrossMargin,
      armIndexValue,
      ...decoded,
    });
  }

  let { cashFlow } = calculateCashFlows({
    loanAmount,
    term,
    firstPaymentDate: structuredClone(firstPaymentDate),
    ratesArray,
    miAmount,
  });

  const {
    Amount: monthlyPayment,
    intRate: movingRate,
    intRate: noteRate,
  } = cashFlow[0];

  const zeroFlow = tilPrePay - loanAmount,
    { oddFactor } = calculateOddFactor(
      structuredClone({
        disbursementDate,
        firstPaymentDate,
      })
    );

  if (zeroFlow >= 0) {
    throw new Error("Invalid zeroFlow");
  }

  const apr = handleCalculateARP({
    cashFlow,
    productCategory,
    purchasePrice,
    appraisedValue,
    loanAmount,
    upFrontMIPFactor,
    term,
    fhaCaseDate,
    miPercent,
    miAmount,
    monthlyPayment,
    movingRate: movingRate,
    occupancy,
    propertyType,
    amortizationType,
    zeroFlow,
    oddFactor,
    noteRate: noteRate,
    miPayYear,
    miPercentAfterCancel,
    lesserOfPercent,
  });

  return { apr, amortizationSchedule: cashFlow };
};

function calculateDisbursementAndFirstPayment(lockPeriodDays) {
  // Step 1: Calculate Disbursement Date
  const disbursementDate = new Date();
  disbursementDate.setDate(disbursementDate.getDate() + lockPeriodDays);

  // Step 2: Calculate First Payment Date = 1st day of the next month
  const firstPaymentDate = new Date(
    disbursementDate.getFullYear(),
    disbursementDate.getMonth() + 1,
    1
  );

  return {
    disbursementDate,
    firstPaymentDate,
  };
}

const calculateOddFactor = ({ disbursementDate, firstPaymentDate }) => {
  let FirstPayDateObj = firstPaymentDate,
    currentDate = disbursementDate;
  FirstPayDateObj.setMonth(FirstPayDateObj.getMonth() - 1);
  currentDate.setHours(0, 0, 0, 0);

  let diffTime = FirstPayDateObj.getTime() - currentDate.getTime(),
    diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)),
    oddDays = diffDays < 0 ? 0 : diffDays;

  let oddFactor = oddDays / 30 || 0;

  return { oddDays, oddFactor };
};

const getFirstDateFormDisbursement = ({ sDate }) => {
  let FirstPayDate;
  sDate = new Date(sDate);

  let varDate;
  if (sDate.getMonth() === 11) varDate = `1/1/${sDate.getFullYear() + 1}`;
  else varDate = `${sDate.getMonth() + 2}/1/${new Date(sDate).getFullYear()}`;

  if (
    new Date(sDate.getFullYear(), sDate.getMonth() + 1, 1) -
      new Date(sDate.getFullYear(), sDate.getMonth(), 1) <
    new Date(varDate) - new Date(sDate.getFullYear(), sDate.getMonth(), 1) + 1
  ) {
    FirstPayDate = new Date(sDate.getFullYear(), sDate.getMonth() + 2, 1);
  }

  return FirstPayDate;
};

const roundValue = ({ value = 0, roundOf = 2 }) => {
  return parseFloat(value.toFixed(roundOf));
};

const roundRate = ({ value = 0 }) => {
  return parseFloat(value.toFixed(6));
};

const roundMonthRate = ({ value = 0 }) => {
  return parseFloat(value.toFixed(8));
};

const calculateFirstDate = ({ dateString, isFormat, addMonth = 1 }) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  let month = date.getMonth() + addMonth,
    year = date.getFullYear();
  month = month <= 9 ? "0" + month : month;
  const currentDate = `${month}/01/${year}`,
    returnDate = isFormat ? currentDate : new Date(currentDate);

  return returnDate;
};

const roundNearestEighth = ({ targetRate }) => {
  const rates = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    intRate = Math.floor(targetRate * 100),
    dblRemainder = targetRate * 100 - intRate;

  return (intRate + rates.find((rate) => dblRemainder < rate)) * 0.01;
};

function decodeARMInput([armTerm, capTerm]) {
  const [fixedYearsStr, adjMonthsStr] = armTerm.split("/");
  const [initialCapStr, periodicCapStr, lifetimeCapStr] = capTerm.split("/");

  return {
    fixedPeriodMonths: parseInt(fixedYearsStr, 10) * 12,
    adjustmentInterval: parseInt(adjMonthsStr, 10),
    initialCap: parseInt(initialCapStr, 10) / 100,
    periodicCap: parseInt(periodicCapStr, 10) / 100,
    lifetimeCap: parseInt(lifetimeCapStr, 10) / 100,
  };
}

// Generates the rate schedule for the ARM loan
function generateRateSchedule({
  initialRate, // starting note rate (6%)
  totalTerm, // total loan term in months (30 years)
  armGrossMargin, // margin (2.5%)
  armIndexValue, // current index value (3.5%)
  fixedPeriodMonths,
  adjustmentInterval,
  initialCap,
  periodicCap,
  lifetimeCap,
}) {
  const schedule = [];

  let currentRate = initialRate;
  let startTerm = 1;
  const maxRate = initialRate + lifetimeCap;

  const targetRate = roundNearestEighth({
    targetRate: armGrossMargin + armIndexValue,
  });

  // Fixed period - rate does not change
  schedule.push({
    startTerm,
    endTerm: fixedPeriodMonths,
    totalTerm,
    noteRate: currentRate,
  });

  startTerm = fixedPeriodMonths + 1;

  // After fixed period, adjust rate every adjustmentInterval months
  for (let month = startTerm; month <= totalTerm; month += adjustmentInterval) {
    // First adjustment uses initial cap, subsequent use periodic cap
    const curArmRateAdj = month === startTerm ? initialCap : periodicCap;

    currentRate = updateARMRate({
      rate: currentRate,
      curArmRateAdj,
      armGrossMargin,
      armIndexValue,
      armLifeCap: maxRate,
      targetRate,
    });

    schedule.push({
      startTerm: month,
      endTerm: Math.min(month + adjustmentInterval - 1, totalTerm),
      totalTerm,
      noteRate: currentRate,
    });
  }

  return schedule;
}

const updateARMRate = ({
  rate,
  curArmRateAdj,
  armGrossMargin,
  armIndexValue,
  armLifeCap,
  targetRate,
}) => {
  let newRate = 0;
  targetRate =
    targetRate ||
    roundNearestEighth({ targetRate: armGrossMargin + armIndexValue });

  if (rate == targetRate) {
    newRate = rate;
  } else if (rate > targetRate) {
    newRate = rate - curArmRateAdj;
    if (newRate < targetRate) {
      newRate = targetRate;
    }
  } else {
    newRate = rate + curArmRateAdj;
    if (newRate > targetRate) {
      newRate = targetRate;
    }
    if (newRate > armLifeCap) {
      newRate = armLifeCap;
    }
  }

  return newRate;
};

const calculateLoanPayment = ({
  annualInterestRate, // e.g. 6 for 6% annual interest
  totalPayments, // e.g. 360 months for 30 years
  loanAmount, // principal or present value
}) => {
  const monthlyRate = roundMonthRate({ value: annualInterestRate / 12 });
  let monthlyPayment = 0;
  let firstMonthInterest = 0;
  let firstMonthPrincipal = 0;

  if (monthlyRate && totalPayments && loanAmount !== 0) {
    monthlyPayment =
      loanAmount /
      ((1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate);
    firstMonthInterest = loanAmount * monthlyRate;
    firstMonthPrincipal = monthlyPayment - firstMonthInterest;
  }

  return {
    monthlyPayment: roundValue({ value: monthlyPayment }),
    interest: roundValue({ value: firstMonthInterest }),
    principal: roundValue({ value: firstMonthPrincipal }),
  };
};

const loansCalculateMI = (
  LoanBal,
  IntRate,
  MIPFactor,
  UpFrontMIPFactor,
  PI,
  type = ""
) => {
  let finalPay,
    finalBal,
    Num = 1,
    CalAmt,
    tLoanBal = LoanBal,
    cLoanBal = LoanBal;

  while (Num <= 11) {
    CalAmt = parseFloat((cLoanBal * IntRate).toFixed(2));
    CalAmt = parseFloat((CalAmt / 12).toFixed(2));
    CalAmt = CalAmt + cLoanBal;
    cLoanBal = CalAmt - PI;
    tLoanBal = tLoanBal + cLoanBal;
    Num++;
  }

  // Calculate final balance
  CalAmt = parseFloat((cLoanBal * IntRate).toFixed(2));
  CalAmt = parseFloat((CalAmt / 12).toFixed(2));
  CalAmt = CalAmt + cLoanBal - PI;
  finalBal = CalAmt;

  // Annual MI calculation
  cLoanBal = tLoanBal / 12;
  let MIAmt = parseFloat((cLoanBal * MIPFactor).toFixed(2));
  if (type === "FHA")
    MIAmt = parseFloat((MIAmt / (1 + UpFrontMIPFactor * 100)).toFixed(2));
  MIAmt = parseFloat((MIAmt / 12).toFixed(2));

  finalPay = PI + MIAmt;

  return { MIAmt, finalBal, finalPay };
};

const calculateAPR = ({ cashFlow, zeroFlow, oddFactor, noteRate }) => {
  let periodCount = cashFlow.length;
  let guessAmount = 0;
  let loopCount = 0;

  if (Math.abs(zeroFlow) === 0 || periodCount < 10) {
    return { guessAmount, loopCount };
  }

  let NPV;
  let monthlyGuess;
  let incrementSign = 1;
  let incrementFactor = 0.001;
  let loopDirection = 0;
  let nearestNpv = 0.01;
  let prevGuess = 0;
  let sameAprCount = 0;

  try {
    loopCount = 0;
    guessAmount = noteRate; // Based on assumption that APR is always greater than Note rate
    guessAmount = guessAmount <= 0 ? 0.00001 : guessAmount;
    prevGuess = guessAmount;
    monthlyGuess = roundMonthRate({ value: guessAmount / 12 });

    let onePlusGuess = 1 + monthlyGuess;
    let oddMultiple = 1 + oddFactor * monthlyGuess;

    NPV = cashFlow.reduce((acc, cashflow) => {
      return (
        acc +
        cashflow.paymentWithMi /
          parseFloat(
            (
              Math.pow(onePlusGuess, cashflow.paymentNumber) * oddMultiple
            ).toFixed(6)
          )
      );
    }, 0);

    if (NPV === 0) {
      return { guessAmount: 0, loopCount: 0 };
    }

    NPV += zeroFlow;
    incrementFactor = 0.001;
    nearestNpv = 0.01;

    if (NPV < 0) {
      incrementSign = -1;
    }

    loopDirection = NPV > 0 ? 1 : 0;

    while (
      loopCount < 100 &&
      Math.abs(NPV) > 0.5 &&
      sameAprCount <= 5 &&
      ((NPV > 0 && incrementSign === 1) || (NPV < 0 && incrementSign === -1)) &&
      Math.abs(NPV) > nearestNpv
    ) {
      guessAmount += incrementFactor * incrementSign;
      monthlyGuess = roundMonthRate({ value: guessAmount / 12 });

      if (monthlyGuess > 0.2) {
        monthlyGuess = 0.2;
      }

      onePlusGuess = 1 + monthlyGuess;
      oddMultiple = 1 + oddFactor * monthlyGuess;

      NPV = cashFlow.reduce((acc, cashflow) => {
        return (
          acc +
          cashflow.paymentWithMi /
            parseFloat(
              (
                Math.pow(onePlusGuess, cashflow.paymentNumber) * oddMultiple
              ).toFixed(6)
            )
        );
      }, 0);

      NPV += zeroFlow;
      loopCount++;

      if (
        (loopDirection === 1 && NPV < 0) ||
        (loopDirection === 0 && NPV > 0)
      ) {
        loopDirection = loopDirection ? 0 : 1;
        incrementFactor /= 2;
      }
      if (guessAmount.toFixed(6) === prevGuess.toFixed(6)) {
        sameAprCount++;
      } else {
        incrementSign = NPV > 0 ? 1 : -1;
      }

      prevGuess = guessAmount;
    }

    return { guessAmount, loopCount };
  } catch (error) {
    throw new Error(error.message);
  }
};

const cleanValue = ({ value = 0 }) => {
  value = value
    .toString()
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("$", "")
    .replaceAll("%", "")
    .replaceAll(",", "");

  return Number(value);
};

const calculateCashFlows = ({
  loanAmount,
  term,
  firstPaymentDate,
  ratesArray,
  miAmount,
}) => {
  let cashFlow = [];
  let balance = loanAmount;
  let cashflowDate = firstPaymentDate;
  let periodId = 1;

  ratesArray.forEach((rate) => {
    let { startTerm, endTerm, noteRate } = rate,
      termCount = 1,
      movingTerm = endTerm - startTerm + 1,
      remainingTerm = term - startTerm + 1;

    let monthlyRate = roundMonthRate({ value: noteRate / 12 });

    let { monthlyPayment: payment } = calculateLoanPayment({
      annualInterestRate: noteRate,
      totalPayments: remainingTerm,
      loanAmount: balance,
    });

    while (termCount <= movingTerm) {
      cashflowDate.setMonth(cashflowDate.getMonth() + 1);
      let stBalance = balance;
      let monthlyInterest = parseFloat((balance * monthlyRate).toFixed(2));

      if (termCount === term && stBalance + monthlyInterest !== payment) {
        payment = stBalance + monthlyInterest;
      }

      let monthlyPrincipal = payment - monthlyInterest;
      let endBalance = stBalance + monthlyInterest - payment;

      cashFlow.push({
        paymentNumber: periodId,
        cashflowDate: cashflowDate.toISOString().split("T")[0],
        cashflowType: 1,
        stBalance: roundValue({ value: stBalance }),
        Amount: roundValue({ value: payment }),
        Interest: roundValue({ value: monthlyInterest }),
        Principal: roundValue({ value: monthlyPrincipal }),
        intRate: noteRate,
        Balance: roundValue({ value: endBalance }),
        miAmount: miAmount,
        paymentWithMi: roundValue({ value: payment }) + miAmount,
      });

      balance = endBalance;
      termCount++;
      periodId++;
    }
  });

  return { cashFlow };
};

const handleCalculateARP = ({
  cashFlow,
  productCategory,
  appraisedValue,
  purchasePrice,
  loanAmount,
  upFrontMIPFactor,
  term,
  fhaCaseDate,
  miPercent = 0.002,
  miAmount,
  monthlyPayment,
  movingRate,
  occupancy,
  propertyType,
  amortizationType,
  zeroFlow,
  oddFactor,
  noteRate,
  ltvRatio = 0,
  miPayYear,
  miPercentAfterCancel,
  lesserOfPercent,
}) => {
  const valueForLtv =
    appraisedValue > purchasePrice && purchasePrice !== 0
      ? purchasePrice
      : appraisedValue;

  let miCancel = 11, // It will decide whether MI will cancel or not
    lesserOf = 0,
    appVal78 = 0,
    appVal80 = 0,
    wsFunded = "",
    miCancelLtvAmt = 0,
    ltv = valueForLtv ? (loanAmount / valueForLtv) * 100 : 0,
    iLesserOf = purchasePrice || loanAmount * lesserOfPercent;

  if (productCategory === 4) miPayYear = 0; //For VA

  if ((purchasePrice || 0) !== 0 && (purchasePrice || 0) < iLesserOf) {
    lesserOf = purchasePrice || 0;
  } else {
    lesserOf = iLesserOf;
  }
  if (ltvRatio) {
    appVal78 = lesserOf * ltvRatio;
    appVal80 = wsFunded === "" ? appVal78 : lesserOf * ltvRatio;
  } else {
    appVal78 = lesserOf * 0.78;
    appVal80 = wsFunded === "" ? appVal78 : lesserOf * 0.8;
  }

  //For FHA
  if (productCategory === 2) {
    lesserOf = lesserOf * (1 + upFrontMIPFactor);
    appVal78 = appVal78 * (1 + upFrontMIPFactor);
    appVal80 = appVal80 * (1 + upFrontMIPFactor);
    const { miCancel: iMiCancel, miYear: iMiYear } = loansGetFhaTerm(
      term,
      ltv,
      fhaCaseDate
    );
    miCancel = iMiCancel;
    miPayYear = iMiYear;
    miCancelLtvAmt = appVal78;
  } else if (productCategory === 1) {
    //For Conventional
    if (miAmount > 0) {
      miPayYear = term / 12;
      miCancelLtvAmt = appVal80;
      miCancel = 1;
    } else {
      miPayYear = 0;
    }
  } else if (productCategory === 8) {
    //For USDA & RHS
    upFrontMIPFactor = 0;
    miCancelLtvAmt = appVal78;
    miPayYear = term / 12;
  }
  upFrontMIPFactor = upFrontMIPFactor / 100; //Convert to %

  let miYearCount = 1,
    miMonthStartAmt = loanAmount,
    miMonthEndAmt = 0,
    miMonthStart = 0,
    miMonthEnd = 0;

  //MIAmt - update to cashflow
  while (miYearCount <= miPayYear) {
    if ([2, 8].includes(productCategory)) {
      const { MIAmt, finalBal, finalPay } = loansCalculateMI(
        Number(miMonthStartAmt),
        movingRate,
        Number(miPercent),
        upFrontMIPFactor,
        monthlyPayment,
        productCategory === 2 ? "FHA" : "USD"
      );
      miAmount = roundValue({ value: MIAmt / 100 });
      miMonthStartAmt = finalBal;
    }

    miMonthStart = (miYearCount - 1) * 12 + 1;
    miMonthEnd = miYearCount * 12;

    //For Conventional
    if (productCategory === 1) {
      let blHpa = 0;
      if (
        [1, 2].includes(occupancy) &&
        [1, 256, 512, 2048].includes(propertyType)
      ) {
        blHpa = 1;
      }

      if (miMonthStart > 120) {
        miAmount = roundValue({
          value: (loanAmount * miPercentAfterCancel) / 12,
        });
      }
      if (blHpa === 1 && miMonthStart > term * 0.5) {
        miAmount = 0;
        miCancel = 1;
      }
    } else {
      miCancel = 0;
    }
    if (miYearCount > 0) {
      for (
        let index = Math.abs(miMonthStart - 1);
        index <= Math.abs(miMonthEnd - 1) && index < cashFlow.length;
        index++
      ) {
        cashFlow[index]["paymentWithMi"] = cashFlow[index]["Amount"] + miAmount;
        cashFlow[index]["miAmount"] = miAmount;
      }
    }
    miYearCount++;
  }

  if ((miCancel || 0) > 0 && [1].includes(Number(amortizationType))) {
    for (let i = 0; i < cashFlow.length; i++) {
      if (
        cashFlow[i].stBalance < miCancelLtvAmt &&
        (miCancel === 1 || (miCancel === 2 && cashFlow[i].paymentNumber > 60))
      ) {
        cashFlow[i].paymentWithMi = cashFlow[i]["Amount"];
      }
    }
  }

  const { guessAmount } = calculateAPR({
    cashFlow,
    zeroFlow,
    oddFactor,
    noteRate,
  });

  return roundValue({ value: guessAmount * 100, roundOf: 4 }) || 0;
};

const getPercentageValue = ({ totalValue, percentage }) => {
  return totalValue * (percentage % 100);
};

const getValuePercentage = ({ totalValue, amount }) => {
  return (amount / totalValue) * 100;
};

const loanAmtFromPayment = ({ monthPay, annualRate, term, arrPerRates }) => {
  arrPerRates = arrPerRates || [];
  var reduced =
    arrPerRates.length > 0
      ? arrPerRates.reduce(function (total, num) {
          return total + num;
        })
      : 0;
  var a1 =
    (1 - Math.pow(1 + annualRate / 1200, -(12 * term))) / (annualRate / 1200);
  var modsPerYear = reduced / 12;
  var loanAmt = (monthPay * a1) / (1 + modsPerYear * a1);
  return loanAmt;
};

const calculateLTV = ({ loanAmounts, appraisedValue }) => {
  const totalLoanAmount = loanAmounts.reduce(
    (sum, val) => sum + Number(val),
    0
  );
  if (!appraisedValue || appraisedValue === 0) return 0;
  return +((totalLoanAmount / appraisedValue) * 100).toFixed(2);
};

const calculateDTI = (monthlyIncome, monthlyLiabilities, roundOf = 2) => {
  if (monthlyIncome <= 0) {
    throw new Error("Monthly income must be greater than zero.");
  }

  const dti = (monthlyLiabilities / monthlyIncome) * 100;
  return dti.toFixed(roundOf);
};

export { performAPR, calculateDisbursementAndFirstPayment };
