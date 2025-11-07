import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchLoanListing } from "../../service/LoanListService";
// import './shared/styles/LoanListing.css';
import {DataTable} from "../../shared/accessories/DataTable";

ModuleRegistry.registerModules([AllCommunityModule]);
const LoanListPage = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const getTextContent = (element: Element, tagName: string) => {
    const el = element.getElementsByTagName(tagName)[0];
    return el ? el.textContent : '';
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
const startTime = performance.now()
    try {
      const filterData = {
        loan_id: '',
        ca_Loan_id: '',
        seller_loan_id: '',
        borrower_name: '',
        tenantid: 7,
      };

      const xmlData = await fetchLoanListing(filterData);
console.log(`API call took: ${(performance.now() - startTime).toFixed(2)}ms`);
const parseStart = performance.now();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml');

      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        setError('Error parsing XML data');
        console.error('XML parsing error:', parserError.textContent);
        return;
      }

      const loans = xmlDoc.getElementsByTagName('loan');
      const loanData = Array.from(loans).map((loan) => {
        const borrowers = loan.getElementsByTagName('Borrower')[0];
        const firstName = borrowers ? getTextContent(borrowers, 'first_name') : '';
        const lastName = borrowers ? getTextContent(borrowers, 'last_name') : '';
        
        const caLoanId = getTextContent(loan, 'ca_Loan_id');
        let decodedCaLoanId = caLoanId;
        
        if (caLoanId) {
          try {
            decodedCaLoanId = decodeURIComponent(caLoanId);
          } catch (e) {
            console.warn('Failed to decode ca_Loan_id:', caLoanId, e);
            decodedCaLoanId = caLoanId;
          }
        }

        return {
          loan_id: getTextContent(loan, 'loan_id'),
          ca_Loan_id: decodedCaLoanId,
          borrower_name: `${firstName} ${lastName}`.trim(),
          status: getTextContent(loan, 'STATUS'),
          submission_date: getTextContent(loan, 'submission_date'),
          completion_date: getTextContent(loan, 'completion_date') || 'N/A',
          completed_by: getTextContent(loan, 'assignee'),
          assigned_user: getTextContent(loan, 'assignee_id'),
        };
      });
console.log(`Parsing took: ${(performance.now() - parseStart).toFixed(2)}ms`);
      console.log(`Total time: ${(performance.now() - startTime).toFixed(2)}ms`);

      setRowData(loanData);
    } catch (error) {
      setError('Error fetching data: ' + error.message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columnDefs = [
    { headerName: 'Loan ID', field: 'loan_id' },
    { headerName: 'Alternate Loan ID', field: 'ca_Loan_id' },
    { headerName: 'Borrower Name', field: 'borrower_name' },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Submission Date', field: 'submission_date' },
    { headerName: 'Completion Date', field: 'completion_date' },
    { headerName: 'Completed By', field: 'completed_by' },
    { headerName: 'Assigned User', field: 'assigned_user' },
  ];

  useEffect(() => {
    fetchData();
    console.log('test')
  }, []);

  return (
    <div>
      <h1>Loan Data</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        {/* <AgGridReact
          theme="legacy"  
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          domLayout='autoHeight'
          paginationPageSize={20}
        /> */}
        <DataTable data={rowData} column={columnDefs} pagination={true} isEditable={true}/>
      </div>
    </div>
  );
};

export default LoanListPage;