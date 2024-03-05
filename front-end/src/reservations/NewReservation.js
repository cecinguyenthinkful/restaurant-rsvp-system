import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, readReservation, editReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function NewReservation({
  edit,
  loadDashboard,
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });
  const history = useHistory();
  const { reservation_id } = useParams();
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function getReservation() {
      if (edit) {
        try {
          const reservation = await readReservation(reservation_id, signal);
          setFormData(reservation);
        } catch (error) {
          console.error(error);
          setErrors(error);
        }
      }
    }

    getReservation();

    return function cleanup() {
      abortController.abort();
    };
  }, [edit, reservation_id]);

  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.name === "people" ? Number(target.value) : target.value,
    });
  }

  function onSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    formData.people = Number(formData.people);

    if (edit) {
      editReservation(reservation_id, formData, abortController.signal)
        .then(() => {
          setFormData(formData);
          loadDashboard();
          history.push(`/dashboard?date=${formData.reservation_date}`);
        })
        .catch((error) => {
          console.error(error);
          setErrors(error);
        });
    } else {
      createReservation(formData, abortController.signal)
        .then(() => {
          loadDashboard();
          history.push(`/dashboard?date=${formData.reservation_date}`);
        })
        .catch((error) => {
          console.error(error);
          setErrors(error);
        });
    }

    return () => abortController.abort();
  }

  return (
    <div style={{ fontFamily: "Rubik" }}>
      <h2 className="font-weight-bold d-flex justify-content-center mt-4">
        {edit ? "Edit Reservation" : "New Reservation"}
      </h2>
      <div className="d-flex justify-content-center">
        <ReservationForm
          formData={formData}
          handleChange={handleChange}
          onSubmit={onSubmit}
          errors={errors}
          submitButtonText={edit ? "Update" : "Submit"}
          onCancel={history.goBack}
        />
      </div>
    </div>
  );
}
