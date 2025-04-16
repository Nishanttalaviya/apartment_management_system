import { useState, useEffect, useCallback } from "react";

const Maintenance = () => {
  const [pendingMaintenance, setPendingMaintenance] = useState([]);
  const [paidMaintenance, setPaidMaintenance] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const API_BASE = "http://localhost:4545/api/maintenance";

  const fetchMaintenanceData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to view maintenance records");
      }

      let memberId;
      try {
        const decoded = jwt_decode(token);
        memberId = decoded.memberid;
      } catch (decodeError) {
        console.warn("Couldn't decode token, using /me endpoint", decodeError);
      }

      const endpoint = memberId ? `/member/${memberId}` : "/member/me";
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load maintenance data: ${response.status}`);
      }

      const data = await response.json();

      setPendingMaintenance(data.filter((r) => r.status === "Pending"));
      setPaidMaintenance(data.filter((r) => r.status === "Paid"));
      setError(null);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
      setPendingMaintenance([]);
      setPaidMaintenance([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenanceData();
  }, [fetchMaintenanceData]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (maintenanceRecord) => {
    try {
      setPaymentProcessing(true);
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Math.round(maintenanceRecord.amount * 100), // Ensure integer paise
          currency: "INR",
          maintenanceId: maintenanceRecord.maintenanceid,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Order creation failed:", responseData);
        throw new Error(responseData.error || "Failed to create payment order");
      }

      const options = {
        key: "rzp_test_jQOReseIWUxIfd", // Fallback to a default value
        amount: responseData.amount,
        currency: responseData.currency,
        name: "Apartment Maintenance",
        description: `Payment for maintenance ${maintenanceRecord.maintenanceid}`,
        order_id: responseData.id,
        handler: async function (response) {
          try {
            const verificationResponse = await fetch(
              `${API_BASE}/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  maintenanceId: maintenanceRecord.maintenanceid,
                }),
              }
            );

            const verificationData = await verificationResponse.json();

            if (!verificationResponse.ok || !verificationData.success) {
              throw new Error(
                verificationData.error || "Payment verification failed"
              );
            }

            alert("Payment successful!");
            fetchMaintenanceData();
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(`Payment verification failed: ${error.message}`);
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: "Member Name", // Consider getting from user data
          email: "member@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}`);
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 px-5 py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-dark mb-1">Maintenance Dashboard</h1>
          <p className="text-muted mb-0">
            Keep track of your pending and paid maintenance payments easily.
          </p>
        </div>
        <div className="input-group w-25 shadow-sm">
          <input
            type="text"
            className="form-control rounded-start"
            placeholder="Search by Flat, Amount, or Status"
            aria-label="Search"
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Pending Maintenance */}
      <div className="mb-5">
        <h2 className="fw-bold text-primary mb-3">Pending Maintenance</h2>
        <div
          className="table-responsive shadow-sm rounded bg-white p-3"
          style={{ border: "1px solid #ddd" }}
        >
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>SR NO</th>
                <th>Amount Due</th>
                <th>Payment Status</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingMaintenance.map((record, index) => (
                <tr key={record.maintenanceid}>
                  <td>{index + 1}</td>
                  <td className="text-danger fw-bold">₹{record.amount}</td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {record.status}
                    </span>
                  </td>
                  <td className="text-muted">
                    {new Date(record.duedate).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm text-white"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #052C65, #0056b3)",
                        borderRadius: "8px",
                      }}
                      onClick={() => handlePayment(record)} // ✅ Added
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paid Maintenance */}
      <div>
        <h2 className="fw-bold text-success mb-3">Paid Maintenance</h2>
        <div
          className="table-responsive shadow-sm rounded bg-white p-3"
          style={{ border: "1px solid #ddd" }}
        >
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>SR NO</th>
                <th>Amount Paid</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paidMaintenance.map((record, index) => (
                <tr key={record.maintenanceid}>
                  <td>{index + 1}</td>
                  <td className="text-success fw-bold">₹{record.amount}</td>
                  <td>
                    <span className="badge bg-success">{record.status}</span>
                  </td>
                  <td className="text-muted">
                    {new Date(record.duedate).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm text-white"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #052C65, #0056b3)",
                        borderRadius: "8px",
                      }}
                      onClick={() => handlePayment(record)}
                      disabled={paymentProcessing}
                    >
                      {paymentProcessing ? "Processing..." : "Pay Now"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
