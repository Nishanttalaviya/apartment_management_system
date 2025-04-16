import { useState } from "react";

const AdminMaintenancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Example maintenance fee data (replace with API data)
  const maintenanceData = [
    { apt: "101", status: "Paid", amount: "$300", dueDate: "2025-01-01" },
    { apt: "102", status: "Pending", amount: "$300", dueDate: "2025-04-01" },
    { apt: "103", status: "Overdue", amount: "$300", dueDate: "2025-01-01" },
    { apt: "104", status: "Paid", amount: "$300", dueDate: "2025-01-01" },
  ];

  const filteredMaintenance = maintenanceData.filter(
    (fee) =>
      fee.apt.includes(searchTerm) ||
      fee.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsPaid = (apt) => {
    alert(`Marked maintenance fee for Apartment ${apt} as Paid.`);
  };

  const handleSendReminder = (apt) => {
    alert(`Reminder sent for maintenance fee in Apartment ${apt}`);
  };

  return (
    <main className="content mt-4 py-5 px-5 bg-light">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="fw-bold mb-2">Admin Maintenance Page</h2>
          <p className="text-muted">
            Manage the maintenance fees and payment statuses for all apartments.
          </p>
        </div>

        {/* Maintenance Fees Table */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 d-flex justify-content-between">
                <h5 className="mb-0 fw-bold">Maintenance Fees</h5>
                <input
                  type="text"
                  className="form-control form-control-sm w-25"
                  placeholder="Search by Apartment or Status"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="card-body">
                <table className="table table-striped table-hover table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Apartment</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaintenance.length > 0 ? (
                      filteredMaintenance.map((fee, index) => (
                        <tr key={index}>
                          <td>{fee.apt}</td>
                          <td>
                            <span
                              className={`badge ${
                                fee.status === "Paid"
                                  ? "bg-success"
                                  : fee.status === "Overdue"
                                  ? "bg-danger"
                                  : "bg-warning"
                              }`}
                            >
                              {fee.status}
                            </span>
                          </td>
                          <td>{fee.dueDate}</td>
                          <td>{fee.amount}</td>
                          <td>
                            {fee.status !== "Paid" && (
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleMarkAsPaid(fee.apt)}
                              >
                                Mark as Paid
                              </button>
                            )}
                            {fee.status === "Pending" ||
                            fee.status === "Overdue" ? (
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleSendReminder(fee.apt)}
                              >
                                Send Reminder
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities Section */}
        {/* <div className="row mb-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Recent Activities</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {[
                    "New maintenance fee paid by Apartment 101",
                    "Reminder sent for Maintenance fee in Apartment 102",
                    "Maintenance fee overdue for Apartment 103",
                  ].map((activity, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {activity}
                      <span className="text-muted">2 hrs ago</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </main>
  );
};

export default AdminMaintenancePage;
