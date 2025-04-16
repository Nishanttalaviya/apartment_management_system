const p1 = require("../DbConnections/postgresdb");
const c1 = p1.connectionObj();

// Get all vehicles with member details
const getAllVehicles = async (req, res) => {
  try {
    const query = `
      SELECT 
        v.vehicleid,
        v.apartmentnumber,
        m.name,
        v.vehiclenumber,
        v.vehicletype
      FROM 
        vehicleinfo v
      JOIN 
        members m ON v.apartmentnumber = m.apartmentnumber;
    `;

    const result = await c1.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const result = await c1.query(
      "SELECT * FROM VehicleInfo WHERE vehicleId = $1",
      [vehicleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new vehicle with auto-incrementing ID
const createVehicle = async (req, res) => {
  const { apartmentNumber, vehicleNumber, vehicleType } = req.body;

  try {
    // Fetch the last inserted vehicleId
    const lastIdResult = await c1.query(
      "SELECT vehicleId FROM VehicleInfo ORDER BY vehicleId DESC LIMIT 1"
    );

    let newId;
    if (lastIdResult.rows.length === 0) {
      newId = "V1"; // First entry
    } else {
      const lastVehicleId = lastIdResult.rows[0].vehicleid; // Example: "V3"
      const lastNumber = parseInt(lastVehicleId.substring(1)); // Extract number part
      newId = `V${lastNumber + 1}`; // Increment and format new ID
    }

    const query = `
      INSERT INTO VehicleInfo (vehicleId, apartmentNumber, vehicleNumber, vehicleType)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [newId, apartmentNumber, vehicleNumber, vehicleType];

    const result = await c1.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a vehicle
const updateVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { apartmentNumber, vehicleNumber, vehicleType } = req.body;

    const result = await c1.query(
      "UPDATE VehicleInfo SET vehicleNumber = $1, vehicleType = $2 WHERE vehicleId = $3 RETURNING *",
      [vehicleNumber, vehicleType, vehicleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const result = await c1.query(
      "DELETE FROM VehicleInfo WHERE vehicleId = $1 RETURNING *",
      [vehicleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
