import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

/**
 * Component representing a single reservation in the list.
 *
 * @param {Object} reservation - Reservation data
 * @param {Function} loadDashboard - Function to reload the dashboard data
 * @returns {JSX.Element} - ListReservations component JSX
 */
export default function ListReservations({ reservation, loadDashboard }) {
  // If reservation is missing or finished, do not display
  if (!reservation || reservation.status === "finished") return null;

  // Function to handle cancellation of a reservation
  const handleCancel = async () => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      try {
        await updateReservationStatus(reservation.reservation_id, "cancelled");
        loadDashboard(); // Reload dashboard data after cancellation
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <tr style={{ fontFamily: "Rubik", color: "white" }}>
      {/* Display reservation details */}
      <th scope="row">{reservation.reservation_id}</th>
      <td className="text-center">{reservation.first_name}</td>
      <td className="text-center">{reservation.last_name}</td>
      <td className="text-center">{reservation.mobile_number}</td>
      <td className="text-center">{reservation.reservation_date.substr(0, 10)}</td>
      <td className="text-center">{reservation.reservation_time.substr(0, 5)}</td>
      <td className="text-center">{reservation.people}</td>
      <td className="text-center" data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>

      {/* Display actions for 'booked' reservations */}
      {reservation.status === "booked" && (
        <>
          <td className="text-center">
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-sm btn-primary" type="button">
                Edit
              </button>
            </Link>
          </td>

          <td className="text-center">
            <button
              className="btn btn-sm btn-danger"
              type="button"
              onClick={handleCancel}
              data-reservation-id-cancel={reservation.reservation_id}
            >
              Cancel
            </button>
          </td>

          <td className="text-center">
            <Link to={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-sm btn-success" type="button">
                Seat
              </button>
            </Link>
          </td>
        </>
      )}
    </tr>
  );
}
