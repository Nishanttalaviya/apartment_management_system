import { useEffect, useState } from "react";

const AdminHallBookingPage = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch booking requests from the database
  useEffect(() => {
    fetch("http://localhost:4545/api/bookings") // Adjust API URL
      .then((response) => response.json())
      .then((data) => setBookingRequests(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  // Handle approval of booking requests
  const handleApproval = async (bookingid) => {
    try {
      const response = await fetch(
        `http://localhost:4545/api/bookings/${bookingid}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Approved" }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedBooking = await response.json();

      // Update local state
      setBookingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.bookingid === bookingid
            ? { ...request, status: "Approved" }
            : request
        )
      );

      console.log("Booking approved successfully:", updatedBooking);
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  };

  // Handle rejection of booking requests
  const handleRejection = async (bookingid) => {
    try {
      const response = await fetch(
        `http://localhost:4545/api/bookings/${bookingid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Rejected" }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedBooking = await response.json();

      // Update local state
      setBookingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.bookingid === bookingid
            ? { ...request, status: "Rejected" }
            : request
        )
      );

      console.log("Booking rejected successfully:", updatedBooking);
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };
  // Sample halls data for hall management
  const [halls, setHalls] = useState([
    { id: 1, name: "Hall A", capacity: 100, availability: "Available" },
    { id: 2, name: "Hall B", capacity: 50, availability: "Booked" },
    { id: 3, name: "Hall C", capacity: 150, availability: "Available" },
  ]);

  // Add a new hall
  const addNewHall = () => {
    const newHall = {
      id: halls.length + 1,
      name: `Hall ${String.fromCharCode(65 + halls.length)}`,
      capacity: 50,
      availability: "Available",
    };
    setHalls([...halls, newHall]);
  };

  // Filter bookings based on search term and status
  const filteredbookings = bookingRequests.filter((booking) => {
    const matchesStatus =
      filterStatus === "All" || booking.status === filterStatus;
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hall.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container-fluid bg-light mt-4 py-5 px-5">
      {/* Header */}
      <div className="row">
        <div className="col">
          <h2 className="fw-bold">Admin - Community Hall Management</h2>
          <p className="text-muted">
            Manage the Hall Bookings and statuses for all apartments.
          </p>
        </div>
      </div>
      {/* Booking Requests Section */}
      <div className="mt-4 bg-light rounded p-4">
        <div className="d-flex gap-3 mb-3 justify-content-between">
          <h5 className="fw-bold">Booking Requests</h5>
          <select
            className="form-select form-select-sm w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input
            type="text"
            className="form-control form-control-sm w-25"
            placeholder="Search by Name, Hall, or Purpose"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Hall</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredbookings.map((request) => (
                <tr key={request.bookingid}>
                  <td>{request.bookingid}</td>
                  <td>{request.name}</td>
                  <td>{request.hall}</td>
                  <td>{request.date}</td>
                  <td>{request.timeslot}</td>
                  <td>{request.purpose}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === "Approved"
                          ? "bg-success"
                          : request.status === "Rejected"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleApproval(request.bookingid)}
                      disabled={request.status !== "Pending"}
                    >
                      <i className="bi bi-check-circle"></i> Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRejection(request.bookingid)}
                      disabled={request.status !== "Pending"}
                    >
                      <i className="bi bi-x-circle"></i> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Hall Management Section */}
      <div className="mt-4 bg-light p-4 rounded">
        <h5 className="fw-bold">Manage Halls</h5>
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-primary" onClick={addNewHall}>
            <i className="bi bi-plus-circle"></i> Add New Hall
          </button>
        </div>
        <div className="row">
          {halls.map((hall) => (
            <div className="col-md-4 mb-3" key={hall.id}>
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">{hall.name}</h6>
                  <p className="card-text">Capacity: {hall.capacity}</p>
                  <p className="card-text">Availability: {hall.availability}</p>
                  <button className="btn btn-warning">
                    <i className="bi bi-pencil"></i> Edit Hall
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHallBookingPage;
