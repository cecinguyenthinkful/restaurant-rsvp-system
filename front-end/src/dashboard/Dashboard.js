import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

import ListReservations from "../reservations/ListReservations";
import ListTables from "../tables/ListTables";

function Dashboard({ date, reservations, tables, loadDashboard }) {
  const history = useHistory();

  // Filter reservations based on status and create ListReservations components
  const reservationsMap = () => {
    return reservations.map(
      (reservation) =>
        reservation.status !== "finished" &&
        reservation.status !== "cancelled" && (
          <ListReservations
            key={reservation.reservation_id}
            reservation={reservation}
            loadDashboard={loadDashboard}
          />
        )
    );
  };

  // Create ListTables components for each table
  const tablesJSX = () => {
    return tables.map((table) => (
      <ListTables
        key={table.table_id}
        table={table}
        loadDashboard={loadDashboard}
      />
    ));
  };

  // Handle button click events to navigate through dates
  function handleClick({ target }) {
    let newDate;
    let useDate;

    // Determine the date to use based on the button clicked
    if (!date) {
      useDate = today();
    } else {
      useDate = date;
    }

    if (target.name === "previous") {
      newDate = previous(useDate);
    } else if (target.name === "next") {
      newDate = next(useDate);
    } else {
      newDate = today();
    }

    // Redirect to the dashboard with the new date query parameter
    history.push(`/dashboard?date=${newDate}`);
  }

  return (
    <div className="w-80 ml-3 pr-4 pt-4" style={{ fontFamily: "Rubik" }}>
      <main>
        <h1 className="font-weight-bold d-flex justify-content-center mt-5 mb-4">
          RESTAURANT DASHBOARD
        </h1>

        <div className="d-flex justify-content-center mb-4">
          {/* Buttons for navigating to Previous, Today, and Next dates */}
          <button
            className="btn-xs rounded btn-light btn-outline-dark m-1 p-1"
            type="button"
            name="previous"
            onClick={handleClick}
          >
            Previous
          </button>
          <button
            className="btn-xs rounded btn-success btn-outline-success m-1 text-white"
            type="button"
            name="today"
            onClick={handleClick}
          >
            Today
          </button>
          <button
            className="btn-xs rounded btn-light btn-outline-dark m-1"
            type="button"
            name="next"
            onClick={handleClick}
          >
            Next
          </button>
        </div>
        
        {/* Display the selected date for reservations */}
        <h3 className="mb-4 font-weight-bold text-start">
          RESERVATIONS FOR {date}
        </h3>

        {/* Table to display reservations */}
        <table className="table text-wrap text-center table-hover">
          {/* Table headers */}
          <thead className="thead-dark">
            <tr className="text-center">
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">People</th>
              <th scope="col">Status</th>
              <th scope="col">Edit</th>
              <th scope="col">Cancel</th>
              <th scope="col">Seat</th>
            </tr>
          </thead>

          {/* Display reservations */}
          <tbody>{reservationsMap()}</tbody>
        </table>
        <br />
        <br />
        <h3 className="mb-4 font-weight-bold">TABLES</h3>

        {/* Table to display tables */}
        <table className="table table-hover m-1 text-nowrap mb-4">
          {/* Table headers */}
          <thead className="thead-dark">
            <tr className="text-center">
              <th scope="col">Table ID</th>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Status</th>
              {/* <th scope="col">Reservation ID</th> */}
              <th scope="col">Finish</th>
            </tr>
          </thead>

          {/* Display tables */}
          <tbody>{tablesJSX()}</tbody>
        </table>
      </main>
    </div>
  );
}

export default Dashboard;
