import { useState, useEffect } from "react";

const AdminVehicleInfoPage = () => {
  const API_BASE_URL = "http://localhost:4545/api/vehicles"; // Replace with your backend URL
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formState, setFormState] = useState({
    vehicleId: "",
    apartmentNumber: "",
    name: "",
    vehicleType: "",
    vehicleNumber: "",
  });

  // Fetch all vehicles from the backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // console.log("Fetching vehicles...");
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await response.json();
        // console.log("Data received:", data);

        // Map backend properties to frontend properties
        const mappedData = data.map((vehicle) => ({
          vehicleId: vehicle.vehicleid,
          apartmentNumber: vehicle.apartmentnumber,
          name: vehicle.name,
          vehicleType: vehicle.vehicletype,
          vehicleNumber: vehicle.vehiclenumber,
        }));

        setVehicles(mappedData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Filter vehicles based on the search query
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.apartmentNumber?.toString().includes(searchQuery) ||
      vehicle.vehicleType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Add Vehicle
  const handleAddVehicle = async () => {
    if (
      !formState.apartmentNumber ||
      !formState.vehicleType ||
      !formState.vehicleNumber
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Failed to add vehicle");
      }

      const newVehicle = await response.json();

      // Ensure the new vehicle is in the correct format
      const formattedVehicle = {
        vehicleId: newVehicle.vehicleid,
        apartmentNumber: newVehicle.apartmentnumber,
        name: newVehicle.name,
        vehicleType: newVehicle.vehicletype,
        vehicleNumber: newVehicle.vehiclenumber,
      };

      // Update the state with the new vehicle
      setVehicles((prevVehicles) => [...prevVehicles, formattedVehicle]);
      setShowModal(false);
      resetFormState();
      alert("Vehicle added successfully!");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle. Please try again.");
    }
  };

  // Handle Edit Vehicle
  const handleEditVehicle = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.vehicleId === vehicleId);
    setFormState(vehicle);
    setSelectedVehicle(vehicleId);
    setIsEdit(true);
    setShowModal(true);
  };

  // Handle Update Vehicle
  const handleUpdateVehicle = async () => {
    if (
      !formState.apartmentNumber ||
      !formState.vehicleType ||
      !formState.vehicleNumber
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedVehicle}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Failed to update vehicle");
      }

      const updatedVehicle = await response.json();

      // Ensure the updated vehicle is in the correct format
      const formattedVehicle = {
        vehicleId: updatedVehicle.vehicleid,
        apartmentNumber: updatedVehicle.apartmentnumber,
        name: updatedVehicle.name,
        vehicleType: updatedVehicle.vehicletype,
        vehicleNumber: updatedVehicle.vehiclenumber,
      };

      // Update the state with the updated vehicle
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.vehicleId === selectedVehicle ? formattedVehicle : vehicle
        )
      );

      setShowModal(false);
      resetFormState();
      alert("Vehicle updated successfully!");
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle. Please try again.");
    }
  };

  // Handle Delete Vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    if (
      window.confirm(`Are you sure you want to delete vehicle ID ${vehicleId}?`)
    ) {
      try {
        const response = await fetch(`${API_BASE_URL}/${vehicleId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete vehicle");
        }

        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.vehicleId !== vehicleId)
        );
        alert(`Deleted Vehicle ID: ${vehicleId}`);
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("Failed to delete vehicle. Please try again.");
      }
    }
  };

  // Reset form state
  const resetFormState = () => {
    setFormState({
      vehicleId: "",
      apartmentNumber: "",
      name: "",
      vehicleType: "",
      vehicleNumber: "",
    });
    setIsEdit(false);
    setSelectedVehicle(null);
  };

  return (
    <div className="container mt-4 py-5 px-5 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="fw-bold mb-2">Vehicle Info Management</h2>
          <p className="text-muted">Manage Vehicle Info of Apartment.</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowModal(true);
              resetFormState();
            }}
          >
            + Add Vehicle
          </button>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Owner, Apartment, or Type"
            style={{ width: "250px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Vehicle ID</th>
              <th>Apartment Number</th>
              <th>Owner Name</th>
              <th>Vehicle Type</th>
              <th>Vehicle Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <tr key={vehicle.vehicleId}>
                  <td>{vehicle.vehicleId}</td>
                  <td>{vehicle.apartmentNumber}</td>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.vehicleType}</td>
                  <td>{vehicle.vehicleNumber}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditVehicle(vehicle.vehicleId)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteVehicle(vehicle.vehicleId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? "Edit Vehicle" : "Add Vehicle"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Conditionally render Vehicle ID and Owner Name in Edit mode */}
                {isEdit && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Vehicle ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formState.vehicleId}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Owner Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formState.name}
                        disabled
                      />
                    </div>
                  </>
                )}
                <div className="mb-3">
                  <label className="form-label">Apartment Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formState.apartmentNumber}
                    disabled={isEdit}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        apartmentNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Vehicle Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formState.vehicleType}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        vehicleType: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Vehicle Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formState.vehicleNumber}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        vehicleNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={isEdit ? handleUpdateVehicle : handleAddVehicle}
                >
                  {isEdit ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVehicleInfoPage;
