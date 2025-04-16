import { useState, useEffect } from "react";

const NoticeBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notices, setNotices] = useState([]);

  // Fetch notices from the backend
  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:4545/api/notices");
      if (!response.ok) {
        throw new Error("Failed to fetch notices");
      }
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  // Fetch notices when the component mounts
  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle "Know More" button click
  const handleShow = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  // Handle modal close
  const handleClose = () => {
    setShowModal(false);
    setSelectedNotice(null);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 px-5 py-5">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-dark mb-1" style={{ color: "#00003E" }}>
            Notice Board
          </h1>
          <p className="text-muted mb-0">
            Stay updated with the latest notices.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          {/* Notices Section */}
          <div
            className="shadow-sm rounded bg-white p-4"
            style={{ border: "1px solid #ddd" }}
          >
            <h2 className="fw-bold mb-4" style={{ color: "#00003E" }}>
              Latest Notices
            </h2>
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>View More</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice) => (
                    <tr key={notice.noticeid}>
                      <td>
                        {new Date(notice.createddate).toLocaleDateString()}
                      </td>
                      <td>{notice.title}</td>
                      <td>{notice.description.substring(0, 30)}...</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm rounded-3"
                          onClick={() => handleShow(notice)}
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #052C65, #0056b3)",
                          }}
                        >
                          Know More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Notice Details */}
      {showModal && selectedNotice && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="bg-white rounded-4 shadow-lg"
            style={{
              width: "700px",
              maxWidth: "90%",
              padding: "24px",
              border: "1px solid #e0e0e0",
            }}
          >
            {/* Modal Header */}
            <div className="mb-4">
              <h5
                className="fw-bold"
                style={{
                  color: "#00003E",
                  fontSize: "1.5rem",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "12px",
                }}
              >
                Notice Details - {selectedNotice.noticeId}
              </h5>
            </div>

            {/* Modal Body - Structured like the image */}
            <div className="modal-body">
              <div className="mb-3">
                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <strong style={{ width: "120px" }}>Title:</strong>
                  <span>{selectedNotice.title}</span>
                </div>

                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <strong style={{ width: "120px" }}>Description:</strong>
                  <span>{selectedNotice.description}</span>
                </div>

                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <strong style={{ width: "120px" }}>Status:</strong>
                  <span>{selectedNotice.status || "Active"}</span>
                </div>

                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <strong style={{ width: "120px" }}>Attachments:</strong>
                  <span>{selectedNotice.attachments || "No Attachments"}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="modal-footer"
              style={{
                borderTop: "1px solid #f0f0f0",
                paddingTop: "16px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-primary rounded-3"
                onClick={handleClose}
                style={{
                  backgroundColor: "#052C65",
                  color: "white",
                  padding: "8px 24px",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
