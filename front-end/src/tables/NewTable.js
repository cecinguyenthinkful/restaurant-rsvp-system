import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

/**
 * Component for creating a new table.
 * @param {Function} loadDashboard - Function to load the dashboard
 * @returns {JSX.Element}
 */
export default function NewTable({ loadDashboard }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
  });

  // Update state when input changes
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.name === "capacity" ? Number(target.value) : target.value,
    });
  }

  // Submit form
  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();

    // Validate form fields and create table
    if (validateFields()) {
      createTable(formData, abortController.signal)
        .then(loadDashboard)
        .then(() => history.push(`/dashboard`))
        .catch(setError);
    }

    return () => abortController.abort();
  }

  // Validate form fields
  function validateFields() {
    let foundError = null;

    if (formData.table_name === "" || formData.capacity === "") {
      foundError = {
        message: "Table Name & Capacity is required to create table",
      };
    } else if (formData.table_name.length < 2) {
      foundError = {
        message: "Table Name must contain at least two characters",
      };
    }

    setError(foundError);
    return foundError === null;
  }

  return (
    <div style={{ fontFamily: "Rubik" }}>
      <h2 className="font-weight-bold d-flex justify-content-center mt-4">New Table</h2>
      <div className="d-flex justify-content-center mt-4">
        <form className="font-weight-bold mt-2 w-75">
          {error && <ErrorAlert error={error} />}

          {/* Table Name Input */}
          <label htmlFor="table_name">Table Name</label>
          <input
            name="table_name"
            id="table_name"
            className="form-control mb-3 border-dark"
            type="text"
            minLength="2"
            onChange={handleChange}
            value={formData.table_name}
            required
          />

          {/* Capacity Input */}
          <label htmlFor="capacity">Capacity</label>
          <input
            name="capacity"
            id="capacity"
            className="form-control mb-3 border-dark"
            type="number"
            min="1"
            onChange={handleChange}
            value={formData.capacity}
            required
            style={{ color: "black" }}
          />

          {/* Submit and Cancel Buttons */}
          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-dark border-dark m-1"
              style={{ color: "white" }}
            >
              Submit
            </button>
            <button
              className="btn btn-danger m-1"
              type="button"
              onClick={history.goBack}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
