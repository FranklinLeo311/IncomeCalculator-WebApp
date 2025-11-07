import axios from 'axios';

// const apiBaseUrl = "https://uat-api.loandna.com/";
const apiBaseUrl = 'http://localhost:23107/api'
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFsYXRoaSBLIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiTUtyaXNobmFuQGxvYW5ETkEuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI2OSIsIm5iZiI6IjE3NjI0Mjk3MDMiLCJleHAiOiIxNzYyNTE2MTAzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTWFuYWdlciIsIlBlcm1pc3Npb24iOlsiVXNlciBNYW5hZ2VtZW50IiwiRnVsbCBBY2Nlc3MiLCJSZXBvcnRzIiwiRG9jdW1lbnQgVXBsb2FkIl19.zU0Np5Ds48WWUM185y8ldrfqgUpoSR6dFGSFXuVHAes";

export const fetchLoanListing = async (filterData: { loan_id: string; ca_Loan_id: string; seller_loan_id: string; borrower_name: string; tenantid: number; }) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/Landing`,
    //   `${apiBaseUrl}api/GetDashboard?currentPage=1&pageSize=20`,
      {
        filter: filterData
      },
      {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching loan listing:", error);
    throw error;
  }
};