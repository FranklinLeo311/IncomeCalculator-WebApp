import { useState } from "react";
import { handleGetApi } from "../../../../../shared/utils/api";

const VOE = () => {
  // const response =  handleGetApi("api/getLoanDetails", {loanid:'10224'});
  // console.log(response);
  // const response =  handleGetApi("api/getBorrowerMonthlyIncome", {
  //         loan_Id: '10224',
  //         BorrowerWageId: '908'
  //     });
  // console.log(response);
  const response = handleGetApi("api/getLoanEmployerVOEWrapper", {
    BorrowerWageId: 908,
    VOEId: 888,
    loanid: "10224",
  });
  console.log(response);

  return <div>VOE</div>;
};

export default VOE;
