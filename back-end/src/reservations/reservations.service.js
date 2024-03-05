const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecords) => createdRecords[0]);
};

function list(date) {
  return knex("reservations")
    .select("*")
    .where("reservation_date", date)
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_time");
};

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first();
};

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
};

function update(updatedReservation) {
  return knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id })
    .whereNot({ status: "finished" })
    .update(updatedReservation, "*")
    .then((updatedRecord) => updatedRecord[0]);
};

function updateStatus(reservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation.reservation_id })
    .update({ status: reservation.status }, "*")
    .then((records) => records[0]);
};

module.exports = {
  create,
  list,
  read,
  search,
  update,
  updateStatus,
};
