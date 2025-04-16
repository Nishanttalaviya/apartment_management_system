import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    image: null,
  });

  const [complaints, setComplaints] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewMode, setViewMode] = useState("form");
  const [imageLoading, setImageLoading] = useState({});
  const [authToken] = useState(localStorage.getItem("token") || "");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload and compression
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to process image. Please try again.");
    }
  };

  // Get proper image URL from backend
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:4545/uploads/complaints/${imagePath}`;
  };

  // Handle image loading errors
  const handleImageError = (id) => (e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder-image.jpg";
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  // Fetch all complaints for the member
  const fetchMemberComplaints = async () => {
    try {
      const response = await fetch("http://localhost:4545/api/complaints", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const processedComplaints = data.map((complaint) => ({
        ...complaint,
        imageurl: getImageUrl(complaint.imageurl),
      }));

      setComplaints(processedComplaints);
      setError(null);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Failed to load complaints. Please try again.");
    }
  };

  // Fetch details of a specific complaint
  const fetchComplaintDetails = async (complaintId) => {
    try {
      const response = await fetch(
        `http://localhost:4545/api/complaints/${complaintId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setSelectedComplaint({
        ...data,
        imageurl: getImageUrl(data.imageurl),
      });
      setViewMode("detail");
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      setError("Failed to load complaint details. Please try again.");
    }
  };

  // Update complaint status
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:4545/api/complaints/${complaintId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      await fetchMemberComplaints();
      if (selectedComplaint?.complaintid === complaintId) {
        setSelectedComplaint((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update complaint status.");
    }
  };

  // Delete a complaint
  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:4545/api/complaints/${complaintId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      await fetchMemberComplaints();
      if (selectedComplaint?.complaintid === complaintId) {
        setViewMode("list");
        setSelectedComplaint(null);
      }
      alert("Complaint deleted successfully!");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      setError("Failed to delete complaint.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.date || !formData.description) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);
      formDataToSend.append("createdDate", formData.date);

      if (formData.image) {
        if (formData.image instanceof File) {
          formDataToSend.append("image", formData.image);
        } else if (typeof formData.image === "string") {
          const blob = await fetch(formData.image).then((r) => r.blob());
          formDataToSend.append("image", blob, "complaint.jpg");
        }
      }

      const response = await fetch("http://localhost:4545/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit complaint");
      }

      alert("Complaint submitted successfully!");
      setFormData({ date: "", description: "", image: null });

      if (viewMode === "list") {
        await fetchMemberComplaints();
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const badgeClasses = {
      Resolved: "badge bg-success",
      "In Progress": "badge bg-warning text-dark",
      Pending: "badge bg-info",
      Rejected: "badge bg-danger",
    };
    return (
      <span className={`${badgeClasses[status] || "badge bg-secondary"} p-2`}>
        {status}
      </span>
    );
  };

  // Fetch complaints when view mode changes
  useEffect(() => {
    if (viewMode === "list" || viewMode === "detail") {
      fetchMemberComplaints();
    }
  }, [viewMode]);

  return (
    <div className="container-fluid bg-light min-vh-100 px-5 py-5">
      {/* Error message display */}
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-dark mb-1">Complaint Management</h1>
          <p className="text-muted mb-0">
            {viewMode === "form" && "Submit your complaints easily."}
            {viewMode === "list" && "View and manage your complaints."}
            {viewMode === "detail" && "Complaint details."}
          </p>
        </div>
        {viewMode !== "form" && (
          <button
            className="btn btn-primary"
            onClick={() => setViewMode("form")}
          >
            New Complaint
          </button>
        )}
      </div>

      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-md-3">
          <div
            className="p-4 rounded-4 shadow"
            style={{
              backgroundColor: "#F5F5F5",
              border: "1px solid #E0E0E0",
            }}
          >
            <div className="d-grid gap-3">
              <button
                className={`btn ${
                  viewMode === "form" ? "btn-primary" : "btn-light border"
                } rounded-3 py-2`}
                onClick={() => setViewMode("form")}
                style={{
                  backgroundColor: viewMode === "form" ? "#052C65" : "white",
                  color: viewMode === "form" ? "white" : "#052C65",
                  fontWeight: "bold",
                }}
              >
                Complaint Form
              </button>
              <button
                className={`btn ${
                  viewMode === "list" ? "btn-primary" : "btn-light border"
                } rounded-3 py-2`}
                onClick={() => setViewMode("list")}
                style={{
                  backgroundColor: viewMode === "list" ? "#052C65" : "white",
                  color: viewMode === "list" ? "white" : "#052C65",
                  fontWeight: "bold",
                }}
              >
                Complaint List
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          {viewMode === "list" ? (
            // Complaint List View
            <div
              className="shadow-sm rounded bg-white p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <h2 className="fw-bold mb-4" style={{ color: "#00003E" }}>
                My Complaints
              </h2>
              {complaints.length === 0 ? (
                <p className="text-muted">No complaints submitted yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((complaint) => (
                        <tr key={complaint.complaintid}>
                          <td>{complaint.complaintid}</td>
                          <td>{formatDate(complaint.createddate)}</td>
                          <td>
                            {complaint.description.length > 50
                              ? `${complaint.description.substring(0, 50)}...`
                              : complaint.description}
                          </td>
                          <td>
                            {complaint.imageurl && (
                              <img
                                src={complaint.imageurl}
                                alt="Complaint"
                                onError={handleImageError(
                                  complaint.complaintid
                                )}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                                onLoad={() =>
                                  setImageLoading((prev) => ({
                                    ...prev,
                                    [complaint.complaintid]: false,
                                  }))
                                }
                              />
                            )}
                          </td>
                          <td>{getStatusBadge(complaint.status)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-info me-2"
                              onClick={() =>
                                fetchComplaintDetails(complaint.complaintid)
                              }
                            >
                              View
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleDeleteComplaint(complaint.complaintid)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : viewMode === "detail" ? (
            // Complaint Detail View
            <div
              className="shadow-sm rounded bg-white p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <button
                className="btn btn-secondary mb-3"
                onClick={() => setViewMode("list")}
              >
                Back to List
              </button>
              <h2 className="fw-bold mb-4" style={{ color: "#00003E" }}>
                Complaint Details
              </h2>

              {selectedComplaint && (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Complaint ID:</strong>{" "}
                        {selectedComplaint.complaintid}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {formatDate(selectedComplaint.createddate)}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(selectedComplaint.status)}
                      </p>
                      {selectedComplaint.status !== "Resolved" && (
                        <div className="mt-2">
                          <label className="me-2">Update Status:</label>
                          <select
                            className="form-select d-inline-block w-auto"
                            value={selectedComplaint.status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                selectedComplaint.complaintid,
                                e.target.value
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="mt-2">{selectedComplaint.description}</p>
                  </div>

                  {selectedComplaint.imageurl && (
                    <div className="mb-3">
                      <strong>Image:</strong>
                      <div className="mt-2">
                        <img
                          src={selectedComplaint.imageurl}
                          alt="Complaint"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                          }}
                          onError={handleImageError(
                            selectedComplaint.complaintid
                          )}
                          onLoad={() =>
                            setImageLoading((prev) => ({
                              ...prev,
                              [selectedComplaint.complaintid]: false,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-danger mt-3"
                    onClick={() =>
                      handleDeleteComplaint(selectedComplaint.complaintid)
                    }
                  >
                    Delete Complaint
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Complaint Form View
            <div
              className="shadow-sm rounded bg-white p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <h2 className="fw-bold mb-4" style={{ color: "#00003E" }}>
                Complaint Form
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Complaint Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Type Description Here"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{
                          width: "100px",
                          height: "auto",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-dark w-40"
                    disabled={isSubmitting}
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #052C65, #0056b3)",
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
