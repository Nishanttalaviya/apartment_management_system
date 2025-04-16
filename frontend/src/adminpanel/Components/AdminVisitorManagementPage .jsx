// import { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";

// const AdminVisitorManagementPage = () => {
//   const API_BASE_URL = "http://localhost:4545/api/visitors"; // Replace with your backend URL
//   const [pendingApprovals, setPendingApprovals] = useState([]);
//   const [visitorLog, setVisitorLog] = useState([]);
//   const [newVisitor, setNewVisitor] = useState({
//     visitorName: "",
//     apartmentnumber: "",
//     purpose: "",
//     contact: "",
//     indatetime: "",
//     outdatetime: "",
//     status: "Pending",
//   });

//   // Fetch all visitors from the backend
//   useEffect(() => {
//     const fetchVisitors = async () => {
//       try {
//         const response = await fetch(API_BASE_URL);
//         if (!response.ok) {
//           throw new Error("Failed to fetch visitors");
//         }
//         const data = await response.json();

//         // Filter data for pending approvals and visitor log
//         const pending = data.filter((visitor) => visitor.status === "Pending");
//         const log = data.filter(
//           (visitor) =>
//             visitor.status === "Pending Check-In" ||
//             visitor.status === "Checked-In" ||
//             visitor.status === "Exited"
//         );

//         setPendingApprovals(pending);
//         setVisitorLog(log);
//       } catch (error) {
//         console.error("Error fetching visitors:", error);
//       }
//     };

//     fetchVisitors();
//   }, []);

//   // Function to get Indian datetime
//   const getIndianDateTime = () => {
//     const date = new Date();
//     const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (UTC+5:30)
//     const indianDate = new Date(date.getTime() + offset);

//     return indianDate.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:mm"
//   };

//   const handleApprove = async (visitorid) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/${visitorid}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: "Pending Check-In" }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to approve visitor");
//       }

//       // Refetch data to update the UI
//       const updatedResponse = await fetch(API_BASE_URL);
//       const updatedData = await updatedResponse.json();

//       const pending = updatedData.filter(
//         (visitor) => visitor.status === "Pending"
//       );
//       const log = updatedData.filter(
//         (visitor) =>
//           visitor.status === "Pending Check-In" ||
//           visitor.status === "Checked-In" ||
//           visitor.status === "Exited"
//       );

//       setPendingApprovals(pending);
//       setVisitorLog(log);
//     } catch (error) {
//       console.error("Error approving visitor:", error);
//     }
//   };

//   const handleReject = async (visitorid) => {
//     const isConfirmed = window.confirm(
//       "Are you sure you want to reject this visitor?"
//     );
//     if (!isConfirmed) {
//       return; // Exit if the user cancels the confirmation
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/${visitorid}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to reject visitor");
//       }

//       // Refetch data to update the UI
//       const updatedResponse = await fetch(API_BASE_URL);
//       const updatedData = await updatedResponse.json();

//       const pending = updatedData.filter(
//         (visitor) => visitor.status === "Pending"
//       );
//       const log = updatedData.filter(
//         (visitor) =>
//           visitor.status === "Pending Check-In" ||
//           visitor.status === "Checked-In" ||
//           visitor.status === "Exited"
//       );

//       setPendingApprovals(pending);
//       setVisitorLog(log);
//     } catch (error) {
//       console.error("Error rejecting visitor:", error);
//     }
//   };

//   const handleCheckIn = async (visitorid) => {
//     try {
//       const checkInTime = getIndianDateTime(); // Use Indian datetime
//       const response = await fetch(`${API_BASE_URL}/${visitorid}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status: "Checked-In",
//           indatetime: checkInTime,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to check-in visitor");
//       }

//       // Refetch data to update the UI
//       const updatedResponse = await fetch(API_BASE_URL);
//       const updatedData = await updatedResponse.json();

//       const pending = updatedData.filter(
//         (visitor) => visitor.status === "Pending"
//       );
//       const log = updatedData.filter(
//         (visitor) =>
//           visitor.status === "Pending Check-In" ||
//           visitor.status === "Checked-In" ||
//           visitor.status === "Exited"
//       );

//       setPendingApprovals(pending);
//       setVisitorLog(log);
//     } catch (error) {
//       console.error("Error checking in visitor:", error);
//     }
//   };

//   const handleCheckOut = async (visitorid) => {
//     try {
//       const checkOutTime = getIndianDateTime(); // Use Indian datetime
//       const response = await fetch(`${API_BASE_URL}/${visitorid}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status: "Exited",
//           outdatetime: checkOutTime,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to check-out visitor");
//       }

//       // Refetch data to update the UI
//       const updatedResponse = await fetch(API_BASE_URL);
//       const updatedData = await updatedResponse.json();

//       const pending = updatedData.filter(
//         (visitor) => visitor.status === "Pending"
//       );
//       const log = updatedData.filter(
//         (visitor) =>
//           visitor.status === "Pending Check-In" ||
//           visitor.status === "Checked-In" ||
//           visitor.status === "Exited"
//       );

//       setPendingApprovals(pending);
//       setVisitorLog(log);
//     } catch (error) {
//       console.error("Error checking out visitor:", error);
//     }
//   };

//   const handleAddVisitor = async () => {
//     if (
//       !newVisitor.visitorName ||
//       !newVisitor.contact ||
//       !newVisitor.apartmentnumber ||
//       !newVisitor.purpose ||
//       !newVisitor.indatetime
//     ) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     try {
//       // Format the datetime before sending to the backend
//       const formattedVisitor = {
//         ...newVisitor,
//         indatetime: new Date(newVisitor.indatetime).toISOString().slice(0, 16), // Format as "YYYY-MM-DDTHH:mm"
//       };

//       const response = await fetch(API_BASE_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formattedVisitor),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add visitor");
//       }

//       // Refetch data to update the UI
//       const updatedResponse = await fetch(API_BASE_URL);
//       const updatedData = await updatedResponse.json();

//       const pending = updatedData.filter(
//         (visitor) => visitor.status === "Pending"
//       );
//       const log = updatedData.filter(
//         (visitor) =>
//           visitor.status === "Pending Check-In" ||
//           visitor.status === "Checked-In" ||
//           visitor.status === "Exited"
//       );

//       setPendingApprovals(pending);
//       setVisitorLog(log);

//       // Clear the form
//       setNewVisitor({
//         visitorName: "",
//         contact: "",
//         apartmentnumber: "", // Reset apartmentnumber
//         purpose: "",
//         indatetime: "",
//       });
//     } catch (error) {
//       console.error("Error adding visitor:", error);
//     }
//   };

//   // Columns for Pending Approvals DataTable
//   const pendingApprovalsColumns = [
//     {
//       name: "ID",
//       selector: (row) => row.visitorid,
//       sortable: true,
//     },
//     {
//       name: "Visitor",
//       selector: (row) => row.visitorname,
//       sortable: true,
//     },
//     {
//       name: "Contact",
//       selector: (row) => row.contact,
//       sortable: true,
//     },
//     {
//       name: "Apartment No.",
//       selector: (row) => row.apartmentnumber,
//       sortable: true,
//     },
//     {
//       name: "Purpose",
//       selector: (row) => row.purpose,
//       sortable: true,
//     },
//     {
//       name: "Visit Date & Time",
//       selector: (row) =>
//         row.indatetime
//           ? new Date(row.indatetime).toLocaleString("en-IN")
//           : "Not Checked-In",
//       sortable: true,
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <>
//           <button
//             className="btn btn-success me-2"
//             onClick={() => handleApprove(row.visitorid)}
//             disabled={row.status !== "Pending"}
//           >
//             Approve
//           </button>
//           <button
//             className="btn btn-danger"
//             onClick={() => handleReject(row.visitorid)}
//             disabled={row.status !== "Pending"}
//           >
//             Reject
//           </button>
//         </>
//       ),
//     },
//   ];

//   // Columns for Visitor Log DataTable
//   const visitorLogColumns = [
//     {
//       name: "ID",
//       selector: (row) => row.visitorid,
//       sortable: true,
//     },
//     {
//       name: "Visitor",
//       selector: (row) => row.visitorname,
//       sortable: true,
//     },
//     {
//       name: "Contact",
//       selector: (row) => row.contact,
//       sortable: true,
//     },
//     {
//       name: "Resident",
//       selector: (row) => row.apartmentnumber,
//       sortable: true,
//     },
//     {
//       name: "Purpose",
//       selector: (row) => row.purpose,
//       sortable: true,
//     },
//     {
//       name: "Check-In Date & Time",
//       selector: (row) =>
//         row.indatetime
//           ? new Date(row.indatetime).toLocaleString("en-IN")
//           : "Not Checked-In",
//       sortable: true,
//     },
//     {
//       name: "Check-Out Date & Time",
//       selector: (row) =>
//         row.outdatetime
//           ? new Date(row.outdatetime).toLocaleString("en-IN")
//           : "Not Checked-Out",
//       sortable: true,
//     },
//     {
//       name: "Status",
//       cell: (row) => (
//         <span
//           className={`badge bg-${
//             row.status === "Checked-In"
//               ? "success"
//               : row.status === "Exited"
//               ? "secondary"
//               : "warning"
//           }`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <>
//           {row.status === "Pending Check-In" && (
//             <button
//               className="btn btn-primary me-2"
//               onClick={() => handleCheckIn(row.visitorid)}
//               disabled={row.status !== "Pending Check-In"}
//             >
//               Check-In
//             </button>
//           )}
//           {row.status === "Checked-In" && (
//             <button
//               className="btn btn-secondary"
//               onClick={() => handleCheckOut(row.visitorid)}
//               disabled={row.status !== "Checked-In"}
//             >
//               Check-Out
//             </button>
//           )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="container-fluid mt-4 py-5 px-5 bg-light">
//       <h3 className="fw-bold">Admin - Visitor Management</h3>
//       <p className="text-muted">
//         Manage visitor requests, check-ins, and check-outs for residents.
//       </p>

//       {/* Pending Approvals Section */}
//       <div className="mt-4">
//         <h5 className="fw-bold">Pending Approvals</h5>
//         <DataTable
//           columns={pendingApprovalsColumns}
//           data={pendingApprovals}
//           pagination
//           highlightOnHover
//           responsive
//         />
//       </div>

//       {/* Visitor Log Section */}
//       <div className="mt-4">
//         <h5 className="fw-bold">Visitor Log</h5>
//         <DataTable
//           columns={visitorLogColumns}
//           data={visitorLog}
//           pagination
//           highlightOnHover
//           responsive
//         />
//       </div>

//       {/* Add Visitor Section */}
//       <div className="mt-4">
//         <h5 className="fw-bold">Add Visitor</h5>
//         <div className="row g-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Visitor Name"
//             value={newVisitor.visitorName}
//             required
//             onChange={(e) =>
//               setNewVisitor({ ...newVisitor, visitorName: e.target.value })
//             }
//           />
//           <input
//             type="number"
//             min={10}
//             className="form-control"
//             placeholder="Contact Number"
//             value={newVisitor.contact}
//             required
//             onChange={(e) =>
//               setNewVisitor({ ...newVisitor, contact: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Apartment Number"
//             value={newVisitor.apartmentnumber}
//             required
//             onChange={(e) =>
//               setNewVisitor({ ...newVisitor, apartmentnumber: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Purpose"
//             value={newVisitor.purpose}
//             required
//             onChange={(e) =>
//               setNewVisitor({ ...newVisitor, purpose: e.target.value })
//             }
//           />
//           <input
//             type="datetime-local"
//             className="form-control"
//             value={newVisitor.indatetime}
//             required
//             onChange={(e) =>
//               setNewVisitor({ ...newVisitor, indatetime: e.target.value })
//             }
//           />
//           <button className="btn btn-primary" onClick={handleAddVisitor}>
//             Add Visitor
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminVisitorManagementPage;

import { useEffect, useState } from "react";

const AdminVisitorManagementPage = () => {
  const API_BASE_URL = "http://localhost:4545/api/visitors"; // Replace with your backend URL
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [visitorLog, setVisitorLog] = useState([]);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: "",
    apartmentnumber: "",
    purpose: "",
    contact: "",
    indatetime: "",
    outdatetime: "",
    status: "Pending",
  });

  // Fetch all visitors from the backend
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch visitors");
        }
        const data = await response.json();

        // Filter data for pending approvals and visitor log
        const pending = data.filter((visitor) => visitor.status === "Pending");
        const log = data.filter(
          (visitor) =>
            visitor.status === "Pending Check-In" ||
            visitor.status === "Checked-In" ||
            visitor.status === "Exited"
        );

        setPendingApprovals(pending);
        setVisitorLog(log);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };

    fetchVisitors();
  }, []);

  // Function to get Indian datetime
  const getIndianDateTime = () => {
    const date = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (UTC+5:30)
    const indianDate = new Date(date.getTime() + offset);

    return indianDate.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:mm"
  };

  const handleApprove = async (visitorid) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${visitorid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "Pending Check-In" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve visitor");
      }

      // Update local state immediately
      setPendingApprovals((prevApprovals) =>
        prevApprovals.filter((visitor) => visitor.visitorid !== visitorid)
      );

      setVisitorLog((prevLog) => {
        const approvedVisitor = pendingApprovals.find(
          (v) => v.visitorid === visitorid
        );
        if (!approvedVisitor) return prevLog;

        return [
          ...prevLog,
          {
            ...approvedVisitor,
            status: "Pending Check-In",
          },
        ];
      });
    } catch (error) {
      console.error("Error approving visitor:", error);
      alert(error.message);
    }
  };

  const handleReject = async (visitorid) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to reject this visitor?"
    );
    if (!isConfirmed) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${visitorid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to reject visitor");
      }

      // Refetch data to update the UI
      const updatedResponse = await fetch(API_BASE_URL);
      const updatedData = await updatedResponse.json();

      const pending = updatedData.filter(
        (visitor) => visitor.status === "Pending"
      );
      const log = updatedData.filter(
        (visitor) =>
          visitor.status === "Pending Check-In" ||
          visitor.status === "Checked-In" ||
          visitor.status === "Exited"
      );

      setPendingApprovals(pending);
      setVisitorLog(log);
    } catch (error) {
      console.error("Error rejecting visitor:", error);
    }
  };

  const handleCheckIn = async (visitorid) => {
    try {
      const checkInTime = getIndianDateTime(); // Use Indian datetime
      const response = await fetch(`${API_BASE_URL}/${visitorid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Checked-In",
          indatetime: checkInTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check-in visitor");
      }

      // Refetch data to update the UI
      const updatedResponse = await fetch(API_BASE_URL);
      const updatedData = await updatedResponse.json();

      const pending = updatedData.filter(
        (visitor) => visitor.status === "Pending"
      );
      const log = updatedData.filter(
        (visitor) =>
          visitor.status === "Pending Check-In" ||
          visitor.status === "Checked-In" ||
          visitor.status === "Exited"
      );

      setPendingApprovals(pending);
      setVisitorLog(log);
    } catch (error) {
      console.error("Error checking in visitor:", error);
    }
  };

  const handleCheckOut = async (visitorid) => {
    try {
      const checkOutTime = getIndianDateTime(); // Use Indian datetime
      const response = await fetch(`${API_BASE_URL}/${visitorid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Exited",
          outdatetime: checkOutTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check-out visitor");
      }

      // Refetch data to update the UI
      const updatedResponse = await fetch(API_BASE_URL);
      const updatedData = await updatedResponse.json();

      const pending = updatedData.filter(
        (visitor) => visitor.status === "Pending"
      );
      const log = updatedData.filter(
        (visitor) =>
          visitor.status === "Pending Check-In" ||
          visitor.status === "Checked-In" ||
          visitor.status === "Exited"
      );

      setPendingApprovals(pending);
      setVisitorLog(log);
    } catch (error) {
      console.error("Error checking out visitor:", error);
    }
  };

  const handleAddVisitor = async () => {
    if (
      !newVisitor.visitorName ||
      !newVisitor.contact ||
      !newVisitor.apartmentnumber ||
      !newVisitor.purpose ||
      !newVisitor.indatetime
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Format the datetime before sending to the backend
      const formattedVisitor = {
        ...newVisitor,
        indatetime: new Date(newVisitor.indatetime).toISOString().slice(0, 16), // Format as "YYYY-MM-DDTHH:mm"
      };

      const response = await fetch(`${API_BASE_URL}/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedVisitor),
      });

      if (!response.ok) {
        throw new Error("Failed to add visitor");
      }

      // Refetch data to update the UI
      const updatedResponse = await fetch(API_BASE_URL);
      const updatedData = await updatedResponse.json();

      const pending = updatedData.filter(
        (visitor) => visitor.status === "Pending"
      );
      const log = updatedData.filter(
        (visitor) =>
          visitor.status === "Pending Check-In" ||
          visitor.status === "Checked-In" ||
          visitor.status === "Exited"
      );

      setPendingApprovals(pending);
      setVisitorLog(log);

      // Clear the form
      setNewVisitor({
        visitorName: "",
        contact: "",
        apartmentnumber: "", // Reset apartmentnumber
        purpose: "",
        indatetime: "",
      });
    } catch (error) {
      console.error("Error adding visitor:", error);
    }
  };

  return (
    <div className="container-fluid mt-4 py-5 px-5 bg-light">
      <h3 className="fw-bold">Admin - Visitor Management</h3>
      <p className="text-muted">
        Manage visitor requests, check-ins, and check-outs for residents.
      </p>

      {/* Pending Approvals Section */}
      <div className="mt-4">
        <h5 className="fw-bold">Pending Approvals</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Visitor</th>
                <th>Contact</th>
                <th>Apartment No.</th>
                <th>Purpose</th>
                <th>Visit Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((visitor) => (
                <tr key={visitor.visitorid}>
                  <td>{visitor.visitorid}</td>
                  <td>{visitor.visitorname}</td>
                  <td>{visitor.contact}</td>
                  <td>{visitor.apartmentnumber}</td>
                  <td>{visitor.purpose}</td>
                  <td>
                    {visitor.indatetime
                      ? new Date(visitor.indatetime).toLocaleString("en-IN") // Format as Indian datetime
                      : "Not Checked-In"}
                  </td>
                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleApprove(visitor.visitorid)}
                      disabled={visitor.status !== "Pending"} // Disable if not Pending
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReject(visitor.visitorid)}
                      disabled={visitor.status !== "Pending"} // Disable if not Pending
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Log Section */}
      <div className="mt-4">
        <h5 className="fw-bold">Visitor Log</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Visitor</th>
                <th>Contact</th>
                <th>Resident</th>
                <th>Purpose</th>
                <th>Check-In Date & Time</th>
                <th>Check-Out Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitorLog.map((visitor) => (
                <tr key={visitor.visitorid}>
                  <td>{visitor.visitorid}</td>
                  <td>{visitor.visitorname}</td>
                  <td>{visitor.contact}</td>
                  <td>{visitor.apartmentnumber}</td>
                  <td>{visitor.purpose}</td>
                  <td>
                    {visitor.indatetime
                      ? new Date(visitor.indatetime).toLocaleString("en-IN") // Format as Indian datetime
                      : "Not Checked-In"}
                  </td>
                  <td>
                    {visitor.outdatetime
                      ? new Date(visitor.outdatetime).toLocaleString("en-IN") // Format as Indian datetime
                      : "Not Checked-Out"}
                  </td>
                  <td>
                    <span
                      className={`badge bg-${
                        visitor.status === "Checked-In"
                          ? "success"
                          : visitor.status === "Exited"
                          ? "secondary"
                          : "warning"
                      }`}
                    >
                      {visitor.status}
                    </span>
                  </td>
                  <td>
                    {visitor.status === "Pending Check-In" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleCheckIn(visitor.visitorid)}
                        disabled={visitor.status !== "Pending Check-In"} // Disable if not Pending Check-In
                      >
                        Check-In
                      </button>
                    )}
                    {visitor.status === "Checked-In" && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleCheckOut(visitor.visitorid)}
                        disabled={visitor.status !== "Checked-In"} // Disable if not Checked-In
                      >
                        Check-Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Visitor Section */}
      <div className="mt-4">
        <h5 className="fw-bold">Add Visitor</h5>
        <div className="row g-3">
          <input
            type="text"
            className="form-control"
            placeholder="Visitor Name"
            value={newVisitor.visitorName}
            required
            onChange={(e) =>
              setNewVisitor({ ...newVisitor, visitorName: e.target.value })
            }
          />
          <input
            type="number"
            min={10}
            className="form-control"
            placeholder="Contact Number"
            value={newVisitor.contact}
            required
            onChange={(e) =>
              setNewVisitor({ ...newVisitor, contact: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Apartment Number"
            value={newVisitor.apartmentnumber}
            required
            onChange={(e) =>
              setNewVisitor({ ...newVisitor, apartmentnumber: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Purpose"
            value={newVisitor.purpose}
            required
            onChange={(e) =>
              setNewVisitor({ ...newVisitor, purpose: e.target.value })
            }
          />
          <input
            type="datetime-local"
            className="form-control"
            value={newVisitor.indatetime}
            required
            onChange={(e) =>
              setNewVisitor({ ...newVisitor, indatetime: e.target.value })
            }
          />
          <button className="btn btn-primary" onClick={handleAddVisitor}>
            Add Visitor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminVisitorManagementPage;
