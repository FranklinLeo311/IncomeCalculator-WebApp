import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Tooltip } from "antd";
import AddUserModal from "./addUserModal";
import { handleGetApi, handlePostApi } from "../../shared/utils/api";
import { DataTable, DataTableRef } from "../../shared/accessories/DataTable";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ToggleComponent from "../../shared/accessories/Toggle";

const Users: React.FC = () => {
  interface initialInputDetails {
    userid?: string | number;
    acknowledgment: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    permissions: string;
    status: boolean;
  }

  const initialInputDetails: initialInputDetails = {
    userid: "0",
    password: "",
    acknowledgment: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    permissions: "",
    status: false,
  };

  const [rowData, setRowData] = useState<any[]>([]);
  const [inputDetails, setInputDetails] = useState(initialInputDetails),
    [inputValidation, setInputValidation] = useState<{
      [key: string]: string;
    }>({});

  const [modalDetails, setModalDetails] = useState({
    showAddUserModel: false,
    title: "",
  });
  const [processingStatus, setProcessingStatus] = useState("pageOnLoad"),
    [filterDataDetails, setFilterDataDetails] = useState({
      searchText: "",
    });
  const userGridRef = useRef<DataTableRef>(null);

  const getUserDetails = useLayoutEffect(() => {
    const fetchUsers = async () => {
      try {
        setProcessingStatus("pageOnLoad");
        const response = await handleGetApi("api/ReadUsers", {
          tenantid: 7,
          userid: 67,
        });

        const data = JSON.parse(response);

        const rowData = userData(data.user);

        setRowData(rowData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setRowData([]);
      } finally {
        setProcessingStatus("");
      }
    };
    fetchUsers();
  }, []);

  const userData = (response: any): any[] => {
    if (!response || !Array.isArray(response)) return [];

    return response.map((u: any) => ({
      userid: u.user_id,
      password: u.password,
      acknowledgment: u.acknowledgment,
      tenantId: u.TenantId,
      userName: u.UserName,
      firstName: u.first_name,
      lastName: u.Last_Name,
      email: u.email,
      status: u.status,
      roleName: u.Role,
      role: u.role_id,
      phone: u.mobilenumber || "—",
      permissions: u.permission,
      permissionsName: u.permissionname,
    }));
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target || e;
    if (name === "status") {
      setInputDetails((prev) => ({
        ...prev,
        [name]: value ? 1 : 0,
      }));
      return;
    }
    setInputDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columnDef = useMemo(() => {
    return [
      {
        headerName: "First Name",
        field: "firstName",
        minWidth: 120,
      },

      {
        headerName: "Last Name",
        field: "lastName",
        minWidth: 120,
      },

      {
        headerName: "Email",
        field: "email",
        minWidth: 160,
      },
      {
        headerName: "Phone Number",
        field: "phone",
        minWidth: 120,
      },
      {
        headerName: "Role",
        field: "roleName",
        minWidth: 140,
      },

      {
        headerName: "Permissions",
        field: "permissionsName",
        minWidth: 160,
        cellRenderer: ({ value }: any) => {
          if (!value) return <span>-</span>;

          const permissions =
            typeof value === "string" ? value.split(",") : value;
          const cleanPermissions = permissions
            .map((p: string) => p.trim())
            .filter(Boolean);

          if (cleanPermissions.length === 0) return <span>-</span>;
          if (cleanPermissions.length === 1)
            return <span>{cleanPermissions[0]}</span>;

          return (
            <span className="position-relative">
              <span>{cleanPermissions[0]}</span>
              <Tooltip
                title={
                  <div>
                    {cleanPermissions.map(
                      (permission: string, index: number) => (
                        <div key={index}>• {permission}</div>
                      )
                    )}
                  </div>
                }
              >
                <span className="ml-1 text-[11px] text-gray-500 bg-neutral-600/20 size-5 rounded-lg z-10 inline-flex items-center justify-center">
                  +{cleanPermissions.length - 1}
                </span>
              </Tooltip>
            </span>
          );
        },
      },

      {
        headerName: "Status",
        field: "status",
        minWidth: 120,
        cellRenderer: ({ data }: any) => {
          return (
            <span className="pointer-events-none">
              <ToggleComponent
                labelB="Inactive"
                labelA="Active"
                checked={data.status === "1" ? true : false}
                onChange={() => ""}
                size="small"
                className="text-xs"
              />
            </span>
          );
        },
      },
      {
        field: "action",
        headerName: "Actions",
        minWidth: 30,
        cellRenderer: (params: any) => {
          return (
            <EditOutlined
              className={`cursor-pointer dark:text-white text-[15px]`}
              onClick={() => {
                setModalDetails({
                  ...modalDetails,
                  showAddUserModel: true,
                  title: "Edit User",
                });
                setInputDetails(params.data);
              }}
            />
          );
        },
      },
    ];
  }, []);

  interface ApiResponse {
    status: string;
    message: string;
  }

  const createOrUpdateUser = async (
    userData: initialInputDetails,
    tenantId: string | number,
    userId: string | number
  ): Promise<ApiResponse> => {
    try {
      const isNewUser = !userData.userid || userData.userid === "0";
      const endpoint = isNewUser ? `/api/CreateUser` : `/api/UpdateUser`;

      // "http://localhost:23107/api/CreateUser"

      // Prepare XML payload without extra whitespace
      let xmlPayload = "";

      if (isNewUser) {
        xmlPayload = `<user><tenantid>${tenantId}</tenantid><firstname>${userData.firstName}</firstname><lastname>${userData.lastName}</lastname><mobileno>${userData.phone}</mobileno><email>${userData.email}</email><status>${userData.status}</status><access>${userData.role}</access><permission>${userData.permissions}</permission><clerkid>${userId}</clerkid><flag>newuser</flag></user>`;
      } else {
        xmlPayload = `<user><tenantid>${tenantId}</tenantid><user_id>${userData.userid}</user_id><firstname>${userData.firstName}</firstname><lastname>${userData.lastName}</lastname><mobileno>${userData.phone}</mobileno><email>${userData.email}</email><oldStatus>1</oldStatus><status>${userData.status}</status><access>${userData.role}</access><permission>${userData.permissions}</permission><password>${userData.password}</password><clerkid>${userId}</clerkid><acknowledgment>${userData.acknowledgment}</acknowledgment><flag>newuser</flag></user>`;
      }

      // Send the XML string directly as plain text
      const response = await handlePostApi(
        endpoint,
        xmlPayload,
        "application/xml"
      );

      return {
        status: response.status || "1",
        message: response.message || "Operation successful",
      };
    } catch (error: any) {
      console.error("Error updating user:", error);
      console.error("Response data:", error.response);

      if (error.response) {
        return {
          status: error.response.data?.status || "0",
          message:
            error.response.message ||
            error.response.detail ||
            "An error occurred",
        };
      }
      return {
        status: "0",
        message: `Error: ${error.message}`,
      };
    }
  };
  function handleFormValidation(iInputDetails: any) {
    let requiredFields = [
      "firstName",
      "email",
      "lastName",
      "phone",
      "role",
      "permissions",
    ];
    const errorsTemp: { [key: string]: string } = {};

    requiredFields.forEach((field) => {
      if (!iInputDetails[field]) {
        errorsTemp[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });
    setInputValidation(errorsTemp);
    return Object.keys(errorsTemp).length != 0;
  }

  const handleSubmit = async () => {
    if (handleFormValidation(inputDetails)) return;

    try {
      const tenantId = sessionStorage.getItem("TenantId") || 7;
      const userId = sessionStorage.getItem("UserId") || 0;

      const result = await createOrUpdateUser(inputDetails, tenantId, userId);

      if (result.status === "1" || result.status === "200") {
        // Success
        console.log("Success:", result.message);
        // Close modal, refresh data, etc.
        setModalDetails((prev) => ({ ...prev, showAddUserModel: false }));
        setInputDetails(initialInputDetails);

        getUserDetails;
      } else {
        // Error
        console.error("Error:", result.message);
        // Show error message to user
        alert(result.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <main className="">
      <div className="flex justify-between">
        <span className="flex">
          <h2 className="font-semibold flex items-center text-2xl pb-5 mr-5 text-gray-800 dark:text-white">
            Manage Users
          </h2>
          <Input
            placeholder=" Search"
            prefix={<SearchOutlined />}
            suffix={null}
            allowClear
            size="small"
            onChange={(e) => {
              setFilterDataDetails((prev) => ({
                ...prev,
                searchText: e.target.value,
              }));
            }}
            className="w-60 h-8 shadow-sm"
          />
        </span>
        <Button
          type="primary"
          onClick={() => {
            setModalDetails((prev) => ({
              ...prev,
              showAddUserModel: true,
              title: "Create User",
            }));
          }}
        >
          <PlusOutlined />
          New User
        </Button>
      </div>

      <div className="">
        <DataTable
          domLayout="autoHeight"
          data={rowData}
          column={columnDef}
          loading={processingStatus === "pageOnLoad"}
          pagination
          className=" shadow-xl"
          ref={userGridRef}
          searchText={filterDataDetails["searchText"] || ""}
          defaultColDef={{
            wrapText: true,
            autoHeight: true,
            suppressMovable: false,
          }}
          defaultPageSize={15}
        />
      </div>

      {modalDetails.showAddUserModel && (
        <AddUserModal
          onClose={() => {
            setModalDetails((prev) => ({ ...prev, showAddUserModel: false }));
            setInputDetails(initialInputDetails);
            setInputValidation({});
          }}
          onSubmit={() => {
            handleSubmit();
          }}
          handleChange={handleChange}
          validation={inputValidation}
          userDetails={inputDetails}
          modalDetails={modalDetails}
        />
      )}
    </main>
  );
};

export default Users;
