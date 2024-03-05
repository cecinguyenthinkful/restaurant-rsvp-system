import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the reservation/:reservation_id/seat page.
 * Allows seating a reservation and updating the seated table via API.
 * @returns {JSX.Element} Header and seat form
 */
function SeatReservation({ tables, setTables }) {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [tableId, setTableId] = useState("");
  const [currentReservation, setCurrentReservation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    // Fetches the list of tables and the current reservation
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);

    readReservation(reservation_id, abortController.signal)
      .then((reservation) => {
        setCurrentReservation(reservation);
      })
      .catch(setError);

    return () => abortController.abort();
  }, [reservation_id, setTables]);

  // Handles changes in the selected table
  const changeHandler = ({ target: { value } }) => {
    setTableId(value);
  };

  // Submits the form to seat the reservation at the selected table
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tableId) {
      setError("Please select a table");
      return;
    }

    const abortController = new AbortController();

    try {
      const updatedReservation = await updateTable(
        tableId,
        reservation_id,
        abortController.signal
      );

      setCurrentReservation(updatedReservation);

      // Updates the status of the selected table to 'occupied'
      const updatedTables = tables.map((table) => {
        if (table.table_id === +tableId) {
          return { ...table, status: "occupied" };
        }
        return table;
      });

      setTables(updatedTables);

      history.push(`/dashboard?date=${updatedReservation.reservation_date}`);
    } catch (error) {
      setError(error.message || error);
    } finally {
      abortController.abort();
    }
  };

  // Handles cancellation and navigates back
  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  // Generates options for table selection
  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {`${table.table_name} - ${table.capacity}`}
    </option>
  ));

  return (
    <div>
      <h1 className="text-center my-4">Seat Reservation #{reservation_id}</h1>
      {error && <ErrorAlert error={error} />}
      <form onSubmit={handleSubmit}>
        <div className="form-row justify-content-center">
          <div className="form-group col-4">
            <label htmlFor="seat_reservation"></label>
            <select
              id="table_id"
              name="table_id"
              onChange={changeHandler}
              required
              className="form-control"
            >
              <option value="">Select a table</option>
              {tableOptions}
            </select>
          </div>
        </div>

        <div className="row justify-content-md-center">
          <button className="btn btn-success m-1" type="submit">
            Submit
          </button>
          <button className="btn btn-danger m-1" type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SeatReservation;
