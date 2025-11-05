import { useState, useCallback } from "react";
import Button from './shared/accessories/Button';
import DatePickerField from "./shared/accessories/DatePicker";
import InputField from "./shared/accessories/InputField";
import MultiSelectDropdown from "./shared/accessories/MultiSelectDropdown";
import SingleDropdown from "./shared/accessories/SingleDropdown";
import ToggleComponent from "./shared/accessories/Toggle";
import { DataTable } from "./shared/accessories/DataTable";

// Sample data
const sampleOptions = [
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
];

const multiSelectOptions = [
  { label: "Category A", value: 1 },
  { label: "Category B", value: 2 },
  { label: "Category C", value: 4 },
];

const tableColumns = [
  { headerName: "ID", field: "id", width: 100 },
  { headerName: "Name", field: "name", width: 150 },
  { headerName: "Status", field: "status", width: 120 },
];

const tableData = [
  { id: 1, name: "John Doe", status: "Active" },
  { id: 2, name: "Jane Smith", status: "Inactive" },
  { id: 3, name: "Bob Johnson", status: "Active" },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amount: string;
  percentage: string;
  singleSelect: number | null;
  multiSelect: number | null;
  effectiveDate: string;
  isActive: boolean;
}

const App = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    percentage: "",
    singleSelect: null,
    multiSelect: null,
    effectiveDate: "",
    isActive: false,
  });

  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    singleSelect: "",
  });

  const handleInputChange = useCallback(({ name, value }: { name: string; value: any }) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  }, [validationErrors]);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "firstName":
      case "lastName":
        return !value ? `${name} is required` : "";
      case "email":
        return !value ? "Email is required" : 
               !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
      case "singleSelect":
        return value === null ? "Please select an option" : "";
      default:
        return "";
    }
  };

  const handleSubmit = () => {
    const errors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      email: validateField("email", formData.email),
      singleSelect: validateField("singleSelect", formData.singleSelect),
    };

    setValidationErrors(errors);

    const hasErrors = Object.values(errors).some(error => error !== "");
    
    if (!hasErrors) {
      console.log("Form submitted:", formData);
      alert("Form submitted successfully!");
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      amount: "",
      percentage: "",
      singleSelect: null,
      multiSelect: null,
      effectiveDate: "",
      isActive: false,
    });
    setValidationErrors({
      firstName: "",
      lastName: "",
      email: "",
      singleSelect: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Component Showcase
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive demonstration of all UI components with modern design and reusable state management
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Form Components */}
          <div className="space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  inValid={validationErrors.firstName}
                  placeholder="Enter first name"
                  size="middle"
                />
                
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  inValid={validationErrors.lastName}
                  placeholder="Enter last name"
                  size="middle"
                />
                
                <InputField
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  inValid={validationErrors.email}
                  placeholder="Enter email address"
                  size="middle"
                />
                
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  formatType="phone"
                  placeholder="Enter phone number"
                  size="middle"
                />
              </div>
            </div>

            {/* Financial Information Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Financial Information
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  formatType="$"
                  placeholder="0.00"
                  decimalPoints={2}
                  size="lg"
                />
                
                <InputField
                  label="Percentage123"
                  name="percentage"
                  value={formData.percentage} 
                  onChange={handleInputChange}
                  formatType="%"
                  placeholder="0.00%"
                  decimalPoints={2}
                  size="lg"
                  className="mb-0 FranklinGothicMedium !text-base"
                />
              </div>
            </div>

            {/* Selection Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Selection Options
                </h2>
              </div>
              
              <div className="space-y-6">
                <SingleDropdown
                  label="Single Selection"
                  options={sampleOptions}
                  name="singleSelect"
                  value={formData.singleSelect}
                  onChange={handleInputChange}
                  inValid={validationErrors.singleSelect}
                  placeholder="Select an option"
                  size="lg"
                />
                
                <MultiSelectDropdown
                  label="Multi Selection"
                  options={multiSelectOptions}
                  name="multiSelect"
                  value={formData.multiSelect}
                  onChange={handleInputChange}
                  placeholder="Select categories"
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Additional Components */}
          <div className="space-y-8">
            {/* Date & Toggle Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Settings & Date
                </h2>
              </div>
              
              <div className="space-y-8">
                {/* <DatePickerField
                  label="Effective Date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  minDate={new Date()}
                  placement="left-start"
                /> */}
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-semibold text-gray-800">Account Status</h3>
                    <p className="text-sm text-gray-600">Toggle to activate/deactivate</p>
                  </div>
                  <ToggleComponent
                    labelA="Inactive"
                    labelB="Active"
                    checked={formData.isActive}
                    onChange={(checked) => handleInputChange({ name: "isActive", value: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Actions
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  label="Submit Form"
                  className="w-full h-12 text-lg font-semibold"
                />
                
                <Button
                  type="secondary"
                  onClick={handleReset}
                  label="Reset Form"
                  className="w-full h-12 text-lg font-semibold"
                />
                
                <Button
                  type="tertiary"
                  onClick={() => console.log("Form data:", formData)}
                  label="Log Data"
                  className="w-full h-12 text-lg font-semibold"
                />
                
                <Button
                  type="danger"
                  onClick={() => alert("Danger action triggered!")}
                  label="Danger Action"
                  className="w-full h-12 text-lg font-semibold"
                />
              </div>
            </div>

            {/* Data Table Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Data Table
                </h2>
              </div>
              
              <div className="h-96 border border-gray-200 rounded-xl overflow-hidden">
                <DataTable
                  data={tableData}
                  column={tableColumns}
                  pagination={true}
                  defaultPageSize={10}
                  domLayout="normal"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Form Summary
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <pre className="text-sm text-gray-700 overflow-x-auto font-mono leading-relaxed">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Built with React, TypeScript, Carbon Design System & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;