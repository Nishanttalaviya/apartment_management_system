import { useState, useEffect } from "react";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = "http://localhost:4545/api/members/";

  // Fetch data from backend with JWT token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShow = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apartmentnumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.wing?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container-fluid px-5 py-5 mt-5 bg-light text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-5 py-5 mt-5 bg-light">
        <div className="alert alert-danger">
          Error: {error}. Please <a href="/login">login</a> again.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-5 py-5 mt-5 bg-light">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold text-dark mb-1">Apartment Residents</h1>
          <p className="text-muted mb-0">
            Manage and explore resident details easily.
          </p>
        </div>

        <div className="input-group" style={{ width: "30%" }}>
          <input
            type="text"
            className="form-control rounded"
            placeholder="Search by Name, Flat, or Wing"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User Cards */}
      <div className="container">
        <div className="row g-4">
          {filteredUsers.map((user) => (
            <div className="col-md-3" key={user.memberid}>
              <div
                className="card border-0 shadow h-100"
                style={{
                  borderRadius: "12px",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold text-primary">
                    {user.name}
                  </h5>
                  <p className="card-text text-muted mb-2">
                    <strong>Flat:</strong> {user.apartmentnumber}
                  </p>
                  <p className="card-text text-muted mb-3">
                    <strong>Wing:</strong> {user.wing}
                  </p>
                  <p className="card-text text-muted mb-4">
                    <strong>Mobile:</strong> {user.contact}
                  </p>
                  <button
                    className="btn btn-primary btn-sm w-75 text-white"
                    onClick={() => handleShow(user)}
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #052C65, #0056b3)",
                    }}
                  >
                    Know More
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center text-muted">
              <p>No users found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={handleClose}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content shadow-lg"
              style={{ borderRadius: "15px" }}
            >
              <div
                className="modal-header text-white"
                style={{ backgroundColor: "#052C65" }}
              >
                <h5 className="modal-title">{selectedUser.name}</h5>
                <button
                  type="button"
                  className="btn-close bg-light"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-2">
                  <strong>Member ID:</strong> {selectedUser.memberid}
                </p>
                <p className="mb-2">
                  <strong>Flat No:</strong> {selectedUser.apartmentnumber}
                </p>
                <p className="mb-2">
                  <strong>Wing:</strong> {selectedUser.wing}
                </p>
                <p className="mb-2">
                  <strong>Mobile No:</strong> {selectedUser.contact}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong> {selectedUser.status}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleClose}
                  style={{ borderRadius: "10px" }}
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
}

export default Home;
