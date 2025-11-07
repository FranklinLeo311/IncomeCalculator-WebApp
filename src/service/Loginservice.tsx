import axios from 'axios';

// const apiBaseUrl = "https://uat-api.loandna.com/";
const apiBaseUrl = 'http://localhost:23107/api'
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiUmFteWEgTSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InJtdW5pcmF0aG5hbUBjYS11c2EuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI2NyIsIm5iZiI6IjE3NjE1NTAzODgiLCJleHAiOiIxNzYxNjM2Nzg4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTWFzdGVyIEFkbWluIiwiUGVybWlzc2lvbiI6IkZ1bGwgQWNjZXNzIn0.TjEejO21J3iwi1QcKyG3FHUhYE7WovqVI1HYOxLS3yc";

export const handleGetApi = async (apiName: string, params = {}) => {
  try {
    const response = await axios.get(apiName, { params });
    return response.data;
  } catch (error) {
    console.error(`GET ${apiName} failed:`, error);
    throw error;
  }
};
export const handlepostapi=async (apiName: string, requestBody = {}) => {
  
 try {
      const response = await axios.post(`${apiBaseUrl}${apiName}`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data); // Handle the API response here
      return response.data;
    } catch (error) {
      console.error('There was an error!', error);
    }
};
export const forgotPasswordApiCall = async (apiName: any,email: any) => {
  const xmlData = `   
    <forgotpassword>
  <emailid>${email}</emailid>
</forgotpassword>
  `;

  try {
    const response = await axios.post(`${apiBaseUrl}${apiName}`, xmlData, {
      headers: {
        'Content-Type': 'application/xml', // Set content type to XML
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    throw new Error(error.response?.data.Message || error.message); // Handle errors
  }
};