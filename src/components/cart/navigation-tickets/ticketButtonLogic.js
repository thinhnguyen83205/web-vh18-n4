export const TICKET_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
};

// Tín hiệu từ nút bấm → đổi trạng thái vé
export const ACTION_SIGNAL = {
  PAY: "pay",
  CANCEL: "cancel",
  DELETE: "delete",
};

const STATUS_CYCLE = [
  TICKET_STATUS.PENDING,
  TICKET_STATUS.PAID,
  TICKET_STATUS.CANCELLED,
];

export function createInitialTickets(flights) {
  return flights.map((flight, index) => ({
    id: flight.id,
    image: flight.image,
    from: flight.fromFull || flight.from,
    to: flight.toFull || flight.to,
    airline: flight.airline,
    date: "23/05/2026",
    time: flight.schedules?.[0] ?? "",
    price: flight.priceFrom,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  }));
}

// Đếm số vé từng tab — gọi lại sau mỗi tín hiệu 
export function countTicketsByStatus(tickets) {
  return {
    pending: tickets.filter((t) => t.status === TICKET_STATUS.PENDING).length,
    paid: tickets.filter((t) => t.status === TICKET_STATUS.PAID).length,
    cancelled: tickets.filter((t) => t.status === TICKET_STATUS.CANCELLED).length,
  };
}

// Nhận tín hiệu → cập nhật vé → tab tự đếm lại khi render 
export function applyActionSignal(tickets, ticketId, signal) {
  let nextStatus = null;

  if (signal === ACTION_SIGNAL.PAY) {
    nextStatus = TICKET_STATUS.PAID;
  }

  if (signal === ACTION_SIGNAL.CANCEL) {
    nextStatus = TICKET_STATUS.CANCELLED;
  }

  if (signal === ACTION_SIGNAL.DELETE) {
    return tickets.filter((ticket) => ticket.id !== ticketId);
  }

  if (!nextStatus) {
    return tickets;
  }

  return tickets.map((ticket) =>
    ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket,
  );
}
