import React from "react";
import { finishTable } from "../utils/api";

/**
 * Displays a table's details and option to finish it for new guests.
 * @param {Object} table - Details of the table
 * @param {string} reservation_id - ID of the reservation
 * @param {function} loadDashboard - Function to load the dashboard
 * @returns {JSX.Element}
 */
export default function ListTables({ table, reservation_id, loadDashboard }) {
  // If there's no table data, return null
  if (!table) return null;

  /**
   * Handles finishing the table to seat new guests
   * Sends a request to update the table status
   * @returns {Function} - Aborts ongoing operations
   */
  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      finishTable(table.table_id, reservation_id, abortController.signal)
        .then(loadDashboard);
      return () => abortController.abort();
    }
  }

  return (
    <tr className="text-center" style={{ fontFamily: "Rubik", color: "white" }}>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      {/* Displays the status of the table */}
      <td data-table-id-status={table.table_id}>
        {table.reservation_id ? "Occupied" : "Free"}
      </td>
      <td>
        {/* Shows the "Finish" button if the table is occupied */}
        {table.reservation_id ? (
          <button
            className="btn btn-sm btn-danger"
            data-table-id-finish={table.table_id}
            onClick={handleFinish}
            type="button"
          >
            Finish
          </button>
        ) : "--"}
      </td>
    </tr>
  );
}
