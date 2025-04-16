import { useState, useEffect } from "react";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch complaints from the database
  useEffect(() => {
    fetch("http://localhost:4545/api/complaints/all") // Adjust API URL
      .then((response) => response.json())
      .then((data) => setComplaints(data))
      .catch((error) => console.error("Error fetching complaints:", error));
  }, []);

  // Open modal with complaint details
  const handleShow = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  // Resolve complaint and update status in the database
  const resolveComplaint = async (complaintid) => {
    if (!complaintid) {
      console.error("Complaint ID is missing");
      return;
    }

    // Confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to resolve this complaint?"
    );
    if (!isConfirmed) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      const response = await fetch(
        `http://localhost:4545/api/complaints/${complaintid}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Resolved",
            resolveddate: new Date().toISOString(), // Add resolvedDate
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Complaint resolved successfully:", data);

      // Update the local state to reflect the resolved status
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.complaintid === complaintid
            ? {
                ...complaint,
                status: "Resolved",
                resolveddate: data.resolveddate,
              } // Update status and resolvedDate
            : complaint
        )
      );
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  // Filter complaints based on search query
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus =
      filterStatus === "All" || complaint.status === filterStatus;
    const matchesSearch =
      complaint.apartmentnumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      complaint.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container-fluid mt-4 py-5 px-5 bg-light p-4">
      <div className="row mb-4">
        <h2 className="fw-bold">Complaints Management</h2>
        <p className="text-muted">
          Manage the complaints and statuses for all apartments.
        </p>
        <div className="d-flex gap-3 mb-3 justify-content-between">
          <h5 className="fw-bold">Complaint Management</h5>
          <select
            className="form-select form-select-sm w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
          <input
            type="text"
            className="form-control form-control-sm w-25"
            placeholder="Search by Apartment NO. , Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Complaint ID</th>
            <th>Apartment Number</th>
            <th>Resident Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Resolved Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint) => (
            <tr key={complaint.complaintid}>
              <td>{complaint.complaintid}</td>
              <td>{complaint.apartmentnumber}</td>
              <td>{complaint.name}</td>
              <td>{complaint.description}</td>
              <td>{complaint.status}</td>
              <td>{complaint.createddate}</td>
              <td>{complaint.resolveddate || "Not Resolved"}</td>
              <td>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => handleShow(complaint)}
                    >
                      View Details
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-success w-100 mb-2"
                      onClick={() => resolveComplaint(complaint.complaintid)}
                      disabled={complaint.status !== "Pending"}
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedComplaint && (
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{
            display: showModal ? "block" : "none",
            backdropFilter: "blur(5px)",
          }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="complaintModalLabel"
          aria-hidden={!showModal}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            style={{
              transform: showModal ? "translateY(0)" : "translateY(-100px)",
              opacity: showModal ? 1 : 0,
              transition: "transform 1s ease-out, opacity 0.4s ease-out",
            }}
          >
            <div className="modal-content shadow-lg rounded-3 border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title" id="complaintModalLabel">
                  Complaint Details - {selectedComplaint.complaintid}
                </h5>
                <button
                  type="button"
                  className="btn p-0 border-0 text-white"
                  aria-label="Close"
                  onClick={handleClose}
                  style={{ background: "none", fontSize: "1.5rem" }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Complaint ID:</strong> {selectedComplaint.complaintid}
                </p>
                <p>
                  <strong>Description:</strong> {selectedComplaint.description}
                </p>
                <p>
                  <strong>Status:</strong> {selectedComplaint.status}
                </p>
                <p>
                  <strong>Created Date:</strong> {selectedComplaint.createddate}
                </p>
                <p>
                  <strong>Resolved Date:</strong>{" "}
                  {selectedComplaint.resolveddate || "Not Resolved"}
                </p>
                <p>
                  <strong>Attachments:</strong>{" "}
                  {selectedComplaint.attachments ? (
                    <a href={selectedComplaint.attachments} target="_blank">
                      View Attachments
                    </a>
                  ) : (
                    "No Attachments"
                  )}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
