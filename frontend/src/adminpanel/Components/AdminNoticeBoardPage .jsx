import { useState, useEffect } from "react";

const AdminNoticeBoardPage = () => {
  const API_BASE_URL = "http://localhost:4545/api/notices";
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editNotice, setEditNotice] = useState(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    createdDate: "", // Ensure this matches the backend field name
    status: "Active",
  });

  // Fetch all notices from the backend
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch notices");
        }
        const data = await response.json();
        setNotices(data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  // Add a new notice
  const handleAddNotice = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNotice),
      });

      if (!response.ok) {
        throw new Error("Failed to add notice");
      }

      const data = await response.json();
      setNotices([...notices, data]); // Update the state with the new notice
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  // Edit a notice
  const handleEditNotice = (notice) => {
    setEditNotice(notice);
    setNewNotice({
      title: notice.title,
      description: notice.description,
      createdDate: notice.createdDate, // Ensure this matches the backend field name
      status: notice.status,
    });
    handleShow(); // Open the modal
  };

  // Save changes to an edited notice
  const handleSaveNotice = async () => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to save changes to this notice?"
    );

    // Proceed only if the user confirms
    if (isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/${editNotice.noticeid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNotice),
        });

        if (!response.ok) {
          throw new Error("Failed to update notice");
        }

        const data = await response.json();
        setNotices(
          notices.map((notice) =>
            notice.noticeid === editNotice.noticeid ? data : notice
          )
        ); // Update the state with the edited notice
        handleClose(); // Close the modal
      } catch (error) {
        console.error("Error updating notice:", error);
      }
    }
  };
  // Delete a notice
  const handleDeleteNotice = async (noticeid) => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    // Proceed only if the user confirms
    if (isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/${noticeid}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete notice");
        }

        // Update the state by removing the deleted notice
        setNotices(notices.filter((notice) => notice.noticeid !== noticeid));
      } catch (error) {
        console.error("Error deleting notice:", error);
      }
    }
  };

  // Modal handlers
  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setEditNotice(null);
    setNewNotice({
      title: "",
      description: "",
      createdDate: "", // Ensure this matches the backend field name
      status: "Active",
    });
  };

  return (
    <div className="container-fluid mt-4 py-5 px-5 bg-light">
      <h3 className="fw-bold">Admin - Manage Notices</h3>
      <p className="text-muted">
        Manage the notices for your community. Create, edit, and delete notices
        in real-time.
      </p>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={handleShow}>
          Add New Notice
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.noticeid}>
                <td>{notice.title}</td>
                <td>{notice.description}</td>
                <td>{notice.createddate}</td>
                <td>
                  {" "}
                  <span
                    className={`badge ${
                      notice.status === "Active" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {notice.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditNotice(notice)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDeleteNotice(notice.noticeid)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Notice */}
      {showModal && (
        <div
          className={`modal show fade`}
          style={{
            display: "block",
            backdropFilter: "blur(10px)", // Blur effect
            transition: "opacity 0.3s ease-in-out",
          }}
          onClick={handleClose} // Close when clicking outside
        >
          <div
            className="modal-dialog"
            style={{
              transform: "translateY(0)",
              animation: "slideIn 0.3s ease-in-out",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div
              className="modal-content"
              style={{
                opacity: showModal ? 1 : 0.95, // Slight transparency for effect
                background: "rgba(255, 255, 255, 0.85)", // Light background with opacity
                backdropFilter: "blur(20px)", // Enhanced blur
                borderRadius: "10px",
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
              }}
            >
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                  {editNotice ? "Edit Notice" : "Add Notice"}
                </h5>
                <button
                  className="btn"
                  onClick={handleClose}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className="bi bi-x-lg"
                    style={{ color: "white", fontSize: "1.5rem" }}
                  ></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newNotice.title}
                    onChange={(e) =>
                      setNewNotice({ ...newNotice, title: e.target.value })
                    }
                    placeholder="Enter notice title"
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={newNotice.description}
                    onChange={(e) =>
                      setNewNotice({
                        ...newNotice,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter notice description"
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={newNotice.createdDate}
                    onChange={(e) =>
                      setNewNotice({
                        ...newNotice,
                        createdDate: e.target.value,
                      })
                    }
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newNotice.status}
                    onChange={(e) =>
                      setNewNotice({ ...newNotice, status: e.target.value })
                    }
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleClose}
                  style={{
                    borderRadius: "5px",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={editNotice ? handleSaveNotice : handleAddNotice}
                  style={{
                    borderRadius: "5px",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {editNotice ? "Save Changes" : "Add Notice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNoticeBoardPage;
