import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from "../controllers/appointment.controller.js";

const router = express.Router();


// Book appointment
router.post("/book", createAppointment);


// Get all appointments
router.get("/", getAppointments);


// Update status
router.put("/:id", updateAppointmentStatus);


// Delete appointment
router.delete("/:id", deleteAppointment);


export default router;