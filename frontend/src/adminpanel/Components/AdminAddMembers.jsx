import { useEffect, useState } from "react";

const AdminAddMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [newMember, setNewMember] = useState({
    name: "",
    apartmentnumber: "",
    contact: "",
    email: "",
    wing: "",
    family_members: "",
    joiningdate: "", // Initialize as empty string
  });
  const [editMember, setEditMember] = useState(null);
  const apiUrl = "http://localhost:4545/api/members/";

  useEffect(() => {
    fetch("http://localhost:4545/api/members/")
      .then((response) => response.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";

    const date = new Date(dateTimeString);

    // Extract date and time components
    const day = String(date.getDate()).padStart(2, "0"); // dd
    const month = String(date.getMonth() + 1).padStart(2, "0"); // mm
    const year = date.getFullYear(); // yyyy
    const hours = String(date.getHours()).padStart(2, "0"); // hh
    const minutes = String(date.getMinutes()).padStart(2, "0"); // mm

    // Format as dd/mm/yyyy hh:mm
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

const handleAddMember = async () => {
  // Validate all required fields
  const requiredFields = [
    "name",
    "apartmentnumber",
    "contact",
    "email",
    "wing",
    "joiningdate",
  ];
  const missingFields = requiredFields.filter(
    (field) => !newMember[field]?.trim()
  );

  if (missingFields.length > 0) {
    alert(`Missing required fields: ${missingFields.join(", ")}`);
    return;
  }

  try {
    const payload = {
      name: newMember.name.trim(),
      apartmentnumber: newMember.apartmentnumber.trim(),
      contact: newMember.contact.trim(),
      email: newMember.email.trim(),
      wing: newMember.wing.trim(),
      family_members: newMember.family_members?.trim() || "0",
      joiningdate: new Date(newMember.joiningdate).toISOString(),
      status: "Active",
    };

    const response = await fetch("http://localhost:4545/api/members/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error && data.error.includes("duplicate key")) {
        throw new Error("A member with these details already exists");
      }
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    // Update state
    setMembers((prev) => [...prev, data]);
    setNewMember({
      name: "",
      apartmentnumber: "",
      contact: "",
      email: "",
      wing: "",
      family_members: "",
      joiningdate: "",
    });

    alert("Member added successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  }
};
  const handleSaveEdit = async () => {
    if (!editMember || !editMember.memberid) {
      console.error("Error: Member ID is missing or undefined.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}${editMember.memberid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editMember),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }

      const updatedMember = await response.json();

      setMembers((prev) =>
        prev.map((member) =>
          member.memberid === editMember.memberid ? updatedMember : member
        )
      );

      setEditMember(null);
      alert("Member updated successfully");
    } catch (error) {
      console.error("Error updating member:", error);
      alert(`Error updating member: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editMember) {
      setEditMember((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewMember((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTogglestatus = async (memberId, currentstatus) => {
    if (!memberId) {
      console.error("Error: memberId is undefined");
      return;
    }

    // Confirmation dialog before updating status
    const confirmUpdate = window.confirm(
      `Are you sure you want to change the status to ${
        currentstatus === "Active" ? "Inactive" : "Active"
      }?`
    );

    if (!confirmUpdate) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      const newStatus = currentstatus === "Active" ? "Inactive" : "Active";
      const response = await fetch(`${apiUrl}${memberId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setMembers((prev) =>
        prev.map((member) =>
          member.memberid === memberId
            ? { ...member, status: newStatus }
            : member
        )
      );
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditMember(null); // Exit edit mode without saving
  };

  const filteredMembers = members.filter(
    (member) =>
      (filterStatus === "All" || member.status === filterStatus) &&
      ((member.name &&
        member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.apartment && member.apartment.includes(searchTerm)) ||
        (member.email &&
          member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.contact && member.contact.includes(searchTerm)))
  );

  return (
    <main className="content px-5 py-5 bg-light">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold mb-2">Add Members</h2>
          <p className="text-muted">Add new members to the Apartment.</p>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark py-3 text-white">
            <h5 className="mb-0 fw-bold">
              {editMember ? "Edit Member" : "Add Member"}
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {Object.keys(newMember).map((key) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  {key === "joiningdate" ? (
                    <input
                      type="datetime-local"
                      name={key}
                      className="form-control"
                      value={editMember ? editMember[key] : newMember[key]}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      className="form-control"
                      value={editMember ? editMember[key] : newMember[key]}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
              ))}
              <div className="col-12 text-end">
                {editMember ? (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={handleSaveEdit}
                    >
                      Save Changes
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={handleAddMember}>
                    Add Member
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between">
            <h5 className="mb-0 fw-bold">Members List</h5>
            <select
              className="form-select form-select-sm w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="text"
              className="form-control form-control-sm w-25"
              placeholder="Search by Name or Apartment"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="card-body">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>SR NO</th>
                  <th>Name</th>
                  <th>Apartment</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Wing</th>
                  <th>Family Members</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member, index) => (
                    <tr key={member.id || index}>
                      <td>{index + 1}</td>
                      <td>{member.name}</td>
                      <td>{member.apartmentnumber}</td>
                      <td>{member.contact}</td>
                      <td>{member.email}</td>
                      <td>{member.wing}</td>
                      <td>{member.family_members}</td>
                      <td>{formatDateTime(member.joiningdate)}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${
                            member.status === "Active"
                              ? "btn-success"
                              : "btn-danger"
                          }`}
                          onClick={() =>
                            handleTogglestatus(member.memberid, member.status)
                          }
                        >
                          {member.status}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => setEditMember(member)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-3">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminAddMembers;
