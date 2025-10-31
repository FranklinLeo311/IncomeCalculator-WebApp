import moment from "moment";
import { cleanValue } from "./commonFunctions";

const formatCurrency = (value, decimalCount = 2) => {
  try {
    let num = parseFloat(
        (value || "").toString().replace("$", "").replace(",", "")
      )
        ?.toFixed(decimalCount)
        .toString(),
      numParts = num.split("."),
      dollars = numParts[0],
      cents = numParts[1] || "",
      sign = num == (num = Math.abs(num));

    dollars = dollars.replace(/\$|\,/g, "");

    if (isNaN(dollars)) dollars = "0";

    dollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    let val =
      "$" +
      ((sign ? "" : "-") +
        dollars +
        (decimalCount ? (cents ? "." + cents : ".00") : ""));

    val = val.replaceAll("--", "");

    if (["$-0.00", "$-0"].includes(val)) val = "$0.00";

    return val;
  } catch (error) {
    console.error("Error form formatCurrency ===> ", error);
  }
};

const formatCellPhone = (PhoneNo) => {
  try {
    PhoneNo = PhoneNo?.toString() || "";
    if (PhoneNo != "") {
      PhoneNo = PhoneNo.replaceAll("(", "")
        .replaceAll(")", "")
        .replaceAll(" ", "");

      if (Number(PhoneNo) && PhoneNo.length === 10) {
        PhoneNo = PhoneNo.replace(/D/g, "");

        if (PhoneNo.length < 10) {
          return PhoneNo;
        }

        let p = /^([\d]{3})([\d]{3})([\d]{4,})$/.exec(PhoneNo);

        PhoneNo = "(" + p[1] + ") " + p[2] + "-" + p[3];

        return PhoneNo;
      }
    }
  } catch (error) {
    console.error("Error form formatCellPhone ===> ", error);
  }

  return PhoneNo;
};

const formatSSN = (SSN) => {
  SSN = SSN?.toString().replaceAll("-", "");

  if (SSN.length == "9" && !isNaN(SSN)) {
    const a = SSN.substring(0, 3),
      b = SSN.substring(3, 5),
      c = SSN.substring(5, 9);

    return `${a}-${b}-${c}`;
  } else if (isNaN(SSN)) {
    return "";
  }
};

const formatPercentage = (value, prefix = 4) => {
  const floatValue = parseFloat(value || 0);
  return !isNaN(floatValue) ? floatValue.toFixed(prefix) + "%" : "";
};

const formatCreditCharge = (value) => {
  const isCredit = Number(value) < 0,
    creditCharge = isCredit
      ? `(${formatCurrency(value)})`
      : formatCurrency(value) ?? "";

  return { isCredit, creditCharge };
};

function formatDate(dateInput, formatPattern = "MM/DD/YYYY") {
  let date;

  if (!dateInput) {
    date = moment();
  } else {
    const inputStr = String(dateInput).trim();

    // Split by slash and check the parts
    const parts = inputStr.split("/");

    let needsYear = false;

    if (parts.length === 2) {
      // Only MM/DD format
      needsYear = true;
    } else if (parts.length === 3) {
      // MM/DD/YYYY or MM/DD/ format
      const yearPart = parts[2].trim();
      if (yearPart === "" || yearPart.length === 0) {
        needsYear = true;
      }
    }

    if (needsYear) {
      const currentYear = moment().year();
      const month = parts[0];
      const day = parts[1];
      dateInput = `${month}/${day}/${currentYear}`;
    }

    date = moment(dateInput);
  }

  if (!date.isValid()) return "";

  return date.format(formatPattern);
}

function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12

  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();
  const hoursStr = hours < 10 ? "0" + hours : hours.toString();

  return `${hoursStr}:${minutesStr} ${amPm}`;
}

function getNearestPastDateTime(items) {
  const now = new Date();

  const pastItems = items
    .map((item) => ({
      ...item,
      date: new Date(item.label), // Convert label string to Date
    }))
    .filter((item) => item.date <= now) // Keep only past dates
    .sort((a, b) => b.date - a.date); // Closest past = latest date before now
  const reversedItems = structuredClone(items).reverse();

  return pastItems.length > 0
    ? pastItems[0]
    : reversedItems.length > 0
    ? reversedItems[0]
    : { value: 0 };
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export {
  formatCurrency,
  formatCellPhone,
  formatSSN,
  formatPercentage,
  formatDate,
  formatCreditCharge,
  formatTime,
  getNearestPastDateTime,
  formatBytes,
};
