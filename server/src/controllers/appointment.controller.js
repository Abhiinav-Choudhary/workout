import Appointment from "../models/appointmentModel.js";


// Create appointment
export const createAppointment = async (req, res) => {
  try {

    const appointment = new Appointment(req.body);

    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// Get all appointments
export const getAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    );

    res.json({
      success: true,
      appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {

    const { id } = req.params;

    await Appointment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Appointment deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};