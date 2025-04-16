import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddVisitorPage = () => {
  const navigate = useNavigate();
  const [visitorRequests, setVisitorRequests] = useState([]);
  const [showVisitorList, setShowVisitorList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newVisitor, setNewVisitor] = useState({
    visitorName: "",
    purpose: "",
    contact: "",
    indatetime: "",
  });

  // Fetch visitor requests from backend
  const fetchVisitorRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:4545/api/visitors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch visitor requests");
      }

      const data = await response.json();
      setVisitorRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load visitor requests when showing the list
  useEffect(() => {
    if (showVisitorList) {
      fetchVisitorRequests();
    }
  }, [showVisitorList]);

  // Add a new visitor request
const handleAddVisitorRequest = async (e) => {
  e.preventDefault();

  // Clear previous errors
  setError(null);

  // Validate form
  if (
    !newVisitor.visitorName ||
    !newVisitor.purpose ||
    !newVisitor.indatetime
  ) {
    setError("Please fill all required fields (marked with *)");
    return;
  }

  setIsLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Debug: Log the member data from localStorage
    const memberData = JSON.parse(localStorage.getItem("member"));
    console.log("Current member data:", memberData);

    const response = await fetch("http://localhost:4545/api/visitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        visitorname: newVisitor.visitorName,
        purpose: newVisitor.purpose,
        contact: newVisitor.contact || null,
        indatetime: new Date(newVisitor.indatetime).toISOString(),
        status: "Pending",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create visitor");
    }

    // Success - reset form and refresh list
    setNewVisitor({
      visitorName: "",
      purpose: "",
      contact: "",
      indatetime: "",
    });

    await fetchVisitorRequests();
    setShowVisitorList(true);
  } catch (error) {
    console.error("Submission error:", error);
    setError(error.message);

    // Special handling for apartment number error
    if (error.message.includes("apartment number")) {
      setError(`${error.message}. Please contact support.`);
    }
  } finally {
    setIsLoading(false);
  }
};

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle visitor deletion
  const handleDeleteVisitor = async (visitorId) => {
    if (
      !window.confirm("Are you sure you want to delete this visitor request?")
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:4545/api/visitors/${visitorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to delete visitor request");
      }

      await fetchVisitorRequests(); // Refresh the list
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="fw-bold text-dark mb-1">Visitor Management</h1>
          <p className="text-muted mb-0">
            Submit and manage your visitor requests.
          </p>
        </div>
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
                  !showVisitorList ? "btn-primary" : "btn-light border"
                } rounded-3 py-2`}
                onClick={() => setShowVisitorList(false)}
                disabled={isLoading}
                style={{
                  backgroundColor: !showVisitorList ? "#052C65" : "white",
                  color: !showVisitorList ? "white" : "#052C65",
                  fontWeight: "bold",
                }}
              >
                {isLoading && !showVisitorList
                  ? "Loading..."
                  : "Add Visitor Request"}
              </button>
              <button
                className={`btn ${
                  showVisitorList ? "btn-primary" : "btn-light border"
                } rounded-3 py-2`}
                onClick={() => setShowVisitorList(true)}
                disabled={isLoading}
                style={{
                  backgroundColor: showVisitorList ? "#052C65" : "white",
                  color: showVisitorList ? "white" : "#052C65",
                  fontWeight: "bold",
                }}
              >
                {isLoading && showVisitorList
                  ? "Loading..."
                  : "Visitor Requests List"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          {showVisitorList ? (
            // Visitor Requests List
            <div
              className="shadow-sm rounded bg-white p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0" style={{ color: "#00003E" }}>
                  My Visitor Requests
                </h2>
                <button
                  className="btn btn-outline-primary"
                  onClick={fetchVisitorRequests}
                  disabled={isLoading}
                >
                  Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : visitorRequests.length === 0 ? (
                <div className="alert alert-info">
                  You havent submitted any visitor requests yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Visitor ID</th>
                        <th>Visitor Name</th>
                        <th>Purpose</th>
                        <th>Contact</th>
                        <th>Visit Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorRequests.map((request) => (
                        <tr key={request.visitorid}>
                          <td>{request.visitorid}</td>
                          <td>{request.visitorname}</td>
                          <td>{request.purpose}</td>
                          <td>{request.contact}</td>
                          <td>{formatDate(request.indatetime)}</td>
                          <td>
                            <span
                              className={`badge ${
                                request.status === "Approved"
                                  ? "bg-success"
                                  : request.status === "Rejected"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteVisitor(request.visitorid)
                              }
                              disabled={
                                isLoading || request.status === "Approved"
                              }
                              title={
                                request.status === "Approved"
                                  ? "Approved requests cannot be deleted"
                                  : ""
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
          ) : (
            // Add Visitor Request Form
            <div
              className="shadow-sm rounded bg-white p-4"
              style={{ border: "1px solid #ddd" }}
            >
              <h2 className="fw-bold mb-4" style={{ color: "#00003E" }}>
                Add Visitor Request
              </h2>
              <form onSubmit={handleAddVisitorRequest}>
                <div className="mb-3">
                  <label className="form-label">Visitor Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newVisitor.visitorName}
                    onChange={(e) =>
                      setNewVisitor({
                        ...newVisitor,
                        visitorName: e.target.value,
                      })
                    }
                    placeholder="Enter visitor's name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purpose *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newVisitor.purpose}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, purpose: e.target.value })
                    }
                    placeholder="Enter purpose of visit"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newVisitor.contact}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, contact: e.target.value })
                    }
                    placeholder="Enter contact number"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Visit Date and Time *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={newVisitor.indatetime}
                    onChange={(e) =>
                      setNewVisitor({
                        ...newVisitor,
                        indatetime: e.target.value,
                      })
                    }
                    required
                    disabled={isLoading}
                    min={new Date().toISOString().slice(0, 16)} // Prevent past dates
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-dark w-40"
                    disabled={isLoading}
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #052C65, #0056b3)",
                    }}
                  >
                    {isLoading ? "Submitting..." : "Submit Request"}
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

export default AddVisitorPage;
