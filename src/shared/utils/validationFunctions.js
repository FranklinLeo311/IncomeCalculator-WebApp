const validateEmail = (text) => {
  try {
    let regex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(text);
  } catch (error) {
    console.error("Error form validateEmail ===> ", error);
  }
};

const validateSSN = (value = "") =>
  value?.toString().replace(/-/g, "")["length"] !== 9;

const isFloat = (n) => Number(n) === n && n % 1 !== 0;

export { validateEmail, validateSSN, isFloat };
