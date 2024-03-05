import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Search from "../dashboard/Search";
import NewReservation from "../reservations/NewReservation";
import SeatReservation from "../reservations/SeatReservation";
import NewTable from "../tables/NewTable";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time";
import { listReservations, listTables } from "../utils/api";

function Routes() {
  // State and variables initialization
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);
  const [edit] = useState(true);
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  // Load dashboard data on initial render and when date changes
  useEffect(loadDashboard, [date]);

  // Load dashboard function
  function loadDashboard() {
    const abortController = new AbortController();

    // Clear errors before fetching data
    setReservationsError(null);
    setTablesError(null);

    // Fetch reservations and tables data for the dashboard
    listReservations({ date: date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then((tables) =>
        tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id)
      )
      .then(setTables)
      .catch(setTablesError);

    // Cleanup function to abort the controller
    return () => abortController.abort();
  }

  return (
    <Switch>
      {/* Routes */}
      <Route exact path="/">
        <Redirect to={`/dashboard`} />
      </Route>

      {/* Reservation Routes */}
      <Route exact path="/reservations">
        <Redirect to={`/dashboard`} />
      </Route>
      <Route path="/reservations/new">
        <NewReservation loadDashboard={loadDashboard} />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <NewReservation loadDashboard={loadDashboard} edit={edit} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation
          date={date}
          tables={tables}
          setTables={setTables}
          loadDashboard={loadDashboard}
        />
      </Route>

      {/* Table Routes */}
      <Route path="/tables/new">
        <NewTable loadDashboard={loadDashboard} />
      </Route>

      {/* Dashboard Route */}
      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
        />
      </Route>

      {/* Other Routes */}
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
