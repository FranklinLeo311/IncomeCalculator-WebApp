import { handleGetApi } from "./api";

const roundNumber = (number, decimals) => {
  try {
    let newnumber = new Number(number + "").toFixed(parseInt(decimals));

    if (newnumber.indexOf(".") < 0) {
      newnumber = newnumber + ".";

      for (i = 0; i < decimals; i++) {
        newnumber = newnumber + "" + "0";
      }
    } else {
      let nNum = newnumber.split(".");

      for (let i = nNum[1].length; i < decimals; i++) {
        newnumber = newnumber + "" + "0";
      }
    }

    return parseFloat(newnumber);
  } catch (e) {
    console.error("Error form roundNumber ===> ", e);
  }
};

const cleanValue = (sVal = "", allowNegative) => {
  try {
    sVal = sVal
      .toString()
      .replaceAll("$", "")
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll(",", "")
      .replace(/\s+/g, " ")
      .replaceAll("%", "");

    if (!allowNegative) {
      sVal = sVal.replaceAll("-", "");
    }

    if (sVal == "") sVal = 0;
  } catch (e) {
    console.error("Error form cleanValue ===> ", e);
  }

  return sVal;
};

const removeDuplicates = (array, property) => {
  const uniqueValues = {};
  return array.filter((obj) => {
    if (!uniqueValues[obj[property]]) {
      uniqueValues[obj[property]] = true;
      return true;
    }
    return false;
  });
};

// const sortByKeyNumber = (arr, key, asc = true) => {
//   return arr.sort((a, b) => {
//     const numA = Number(a[key]),
//       numB = Number(b[key]);

//     return asc ? numA - numB : numB - numA;
//   });
// };
const sortByKeyNumber = (arr, key, asc = true) => {
  return arr.sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (typeof valA === "number" && typeof valB === "number") {
      return asc ? valA - valB : valB - valA;
    }

    return asc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
};

const groupByKey = (input, key) => {
  let data = input.reduce((acc, currentValue) => {
    let groupKey = currentValue[key];

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    acc[groupKey].push(currentValue);

    return acc;
  }, {});

  return data;
};

const handleStructuredClone = (data) => JSON.parse(JSON.stringify(data));

const parsedObj = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      try {
        return [key, JSON.parse(value)];
      } catch (e) {
        // In case value is not a valid JSON string, return as-is
        return [key, value];
      }
    })
  );
function capitalizeFirstLetter(str) {
  if (!str) return ""; // handle empty or undefined string
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const isEmailAlreadyExists = async (userId) => {
  try {
    const outJSON = await handleGetApi("sign-in/check-user-exist", {
      userId,
    });
    if (outJSON) {
      const { isExist = false } = JSON.parse(response.outJSON);
      return isExist;
    }
  } catch (error) {
    console.error("Error in checkEmailExist ===> ", error);
    return false;
  }
};

export {
  roundNumber,
  cleanValue,
  removeDuplicates,
  sortByKeyNumber,
  groupByKey,
  handleStructuredClone,
  parsedObj,
  capitalizeFirstLetter,
  isEmailAlreadyExists,
};
