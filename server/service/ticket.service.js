const db = require("../models");
const { v4: uuidv4 } = require('uuid');
const Bus = db.bus
const Ticket = db.Ticket
const bookTickets = async (busId, userId, numberOfTickets)=> {
  try {
    const bus = await Bus.findByPk(busId);
    if (!bus) throw new Error('Bus not found');

    const { upperSectionSeats, lowerSectionSeats, upperSectionBookedSeats, lowerSectionBookedSeats } = bus;
    const totalAvailableSeats = upperSectionSeats - upperSectionBookedSeats + lowerSectionSeats - lowerSectionBookedSeats;

    if (numberOfTickets > totalAvailableSeats) throw new Error('Not enough available seats');

    const bookedTickets = [];

    for (let i = 0; i < numberOfTickets; i++) {
      const section = i < upperSectionSeats ? 'upper' : 'lower';
      const seatNumber = i < upperSectionSeats ? upperSectionBookedSeats + i + 1 : lowerSectionBookedSeats + (i - upperSectionSeats) + 1;

      const ticket = await Ticket.create({
        busId,
        userId,
        section,
        seatNumber,
        status: 'open',
      });

      bookedTickets.push(ticket);
    }

    return bookedTickets;
  } catch (error) {
    console.error(`Error booking tickets: ${error.message}`);
    throw new Error('Error booking tickets');
  }
  }

const getAllCloseTicket = async (filter, options) => {
  try {
    const closeTickets = await Ticket.findAll({
      where: { status: 'closed', ...filter },
      ...options,
    });
    return closeTickets;
  } catch (error) {
    console.error('Error getting close tickets:', error);
    throw new Error('Error getting close tickets');
  }
};

const getAllOpenTicket = async () => {
  try {
    const openTickets = await Ticket.findAll({
      where: { status: 'open' },
    });
    return openTickets;
  } catch (error) {
    console.error('Error getting open tickets:', error);
    throw new Error('Error getting open tickets');
  }
};

const getTicketDetailsByUserId = async (userId) => {
  try {
    const userTickets = await Ticket.findAll({
      where: { userId },
    });
    return userTickets;
  } catch (error) {
    console.error('Error getting user tickets:', error);
    throw new Error('Error getting user tickets');
  }
};

const getTicketStatus = async (ticketId) => {
  try {
    const status = await Ticket.findOne({
      attributes: ['status'],
      where: { id: ticketId },
    });
    return status;
  } catch (error) {
    console.error('Error getting ticket status:', error);
    throw new Error('Error getting ticket status');
  }
};

const updateTicketById = async (ticketId, updateParams) => {
  try {
    const [updatedRows] = await Ticket.update(updateParams, {
      where: { id: ticketId },
    });
    return updatedRows > 0;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw new Error('Error updating ticket');
  }
};

const deleteTicketById = async (ticketId) => {
  try {
    const deletedRows = await Ticket.destroy({
      where: { id: ticketId },
    });
    return deletedRows > 0;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw new Error('Error deleting ticket');
  }
};

module.exports = {
  bookTickets,
  getAllCloseTicket,
  getAllOpenTicket,
  getTicketDetailsByUserId,
  getTicketStatus,
  updateTicketById,
  deleteTicketById,
};
