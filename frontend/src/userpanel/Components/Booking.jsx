import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Booking() {
  const [formData, setFormData] = useState({
    hall: "Hall A", // Changed from hallType to match backend
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  const [bookings, setBookings] = useState([]);
  const [showBookingList, setShowBookingList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }

      const response = await fetch(
        "http://localhost:4545/api/bookings/my-bookings",
        {
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
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Validate time slot
    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
      setLoading(false);
      return;
    }

    const bookingData = {
      hall: formData.hall,
      date: formData.date,
      timeSlot: `${formData.startTime}-${formData.endTime}`,
      purpose: formData.purpose,
    };

    try {
      const response = await fetch("http://localhost:4545/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const result = await response.json();
      console.log("Booking Created:", result);

      // Reset form and refresh bookings
      setFormData({
        hall: "Hall A",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
      });

      await fetchBookings();
      setShowBookingList(true); // Show the booking list after successful booking
    } catch (error) {
      console.error("Error creating booking:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:4545/api/bookings/${bookingId}`,
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
        throw new Error("Failed to delete booking");
      }

      await fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error deleting booking:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-5">
        {/* Title and Subtitle */}
        <div>
          <h1 className="fw-bold text-dark mb-1" style={{ color: "#00003E" }}>
            Community Hall Booking
          </h1>
          <p className="text-muted mb-0">
            Easily manage and book halls for your events
          </p>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="row mt-4">
          {/* Sidebar Navigation */}
          <div className="col-md-3 mb-4">
            <div className="card shadow rounded-4 p-3">
              <div className="d-grid gap-2 navigation-buttons">
                <button
                  className={`btn ${
                    !showBookingList ? "btn-primary" : "btn-light border"
                  } rounded-3 py-2`}
                  onClick={() => setShowBookingList(false)}
                  disabled={loading}
                  style={{
                    backgroundColor: !showBookingList ? "#052C65" : "white",
                    color: !showBookingList ? "white" : "#052C65",
                  }}
                >
                  {loading && !showBookingList ? "Loading..." : "Booking Form"}
                </button>
                <button
                  className={`btn ${
                    showBookingList ? "btn-primary" : "btn-light border"
                  } rounded-3 py-2`}
                  onClick={() => setShowBookingList(true)}
                  disabled={loading}
                  style={{
                    backgroundColor: showBookingList ? "#052C65" : "white",
                    color: showBookingList ? "white" : "#052C65",
                  }}
                >
                  {loading && showBookingList ? "Loading..." : "My Bookings"}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            {showBookingList ? (
              // Booking List View
              <div className="card shadow rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-bold mb-0" style={{ color: "#00003E" }}>
                    My Bookings
                  </h2>
                  <button
                    className="btn btn-outline-primary"
                    onClick={fetchBookings}
                    disabled={loading}
                  >
                    Refresh
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="alert alert-info">
                    You dont have any bookings yet.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>Booking ID</th>
                          <th>Date</th>
                          <th>Hall</th>
                          <th>Time Slot</th>
                          <th>Purpose</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.bookingid}>
                            <td>{booking.bookingid}</td>
                            <td>{formatDate(booking.date)}</td>
                            <td>{booking.hall}</td>
                            <td>{booking.timeslot}</td>
                            <td>{booking.purpose}</td>
                            <td>
                              <span
                                className={`badge ${
                                  booking.status === "Approved"
                                    ? "bg-success"
                                    : booking.status === "Rejected"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteBooking(booking.bookingid)
                                }
                                disabled={
                                  loading || booking.status === "Approved"
                                }
                                title={
                                  booking.status === "Approved"
                                    ? "Approved bookings cannot be deleted"
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
              // Booking Form View
              <div className="card shadow rounded-4 p-4">
                <h2 className="fw-bold mb-4" style={{ color: "#00003E" }}>
                  Hall Booking Form
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="hall" className="form-label">
                      Hall Type
                    </label>
                    <select
                      id="hall"
                      name="hall"
                      className="form-control"
                      value={formData.hall}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="Hall A">Hall A (Capacity: 50)</option>
                      <option value="Hall B">Hall B (Capacity: 100)</option>
                      <option value="Hall C">Hall C (Capacity: 150)</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      min={new Date().toISOString().split("T")[0]} // Disable past dates
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="startTime" className="form-label">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        className="form-control"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="endTime" className="form-label">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        className="form-control"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="purpose" className="form-label">
                      Purpose
                    </label>
                    <textarea
                      id="purpose"
                      name="purpose"
                      className="form-control"
                      placeholder="Enter purpose here"
                      rows="4"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-dark w-40"
                      disabled={loading}
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #052C65, #0056b3)",
                      }}
                    >
                      {loading ? "Processing..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
