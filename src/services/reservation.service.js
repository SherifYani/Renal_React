import api from "./api";

export const getReservations = () => {
  return api.get("/reservations");
};

export const getReservationById = (id) => {
  return api.get(`/reservations/${id}`);
};

export const createReservation = (reservationData) => {
  return api.post("/reservations", reservationData);
};

export const updateReservation = (id, reservationData) => { 
  return api.put(`/reservations/${id}`, reservationData);  
};

export const patchReservation = (id, updates) => {
  return api.patch(`/reservations/${id}`, updates);
};

export const deleteReservation = (id) => {
  return api.delete(`/reservations/${id}`);
};

// Get reservations by equipment ID
export const getReservationsByEquipment = (equipmentId) => {
  return api.get(`/reservations?equipmentId=${equipmentId}`);
};

// Get reservations by status
export const getReservationsByStatus = (status) => {
  return api.get(`/reservations?status=${status}`);
};

// Get upcoming reservations
export const getUpcomingReservations = () => {
  return api.get("/reservations")
    .then(reservations => {
      const now = new Date();
      return reservations.filter(reservation => 
        new Date(reservation.startTime) > now
      ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    });
};

// Get today's reservations
export const getTodaysReservations = () => {
  return api.get("/reservations")
    .then(reservations => {
      const today = new Date().toISOString().split('T')[0];
      return reservations.filter(reservation => 
        reservation.startTime.startsWith(today)
      );
    });
};