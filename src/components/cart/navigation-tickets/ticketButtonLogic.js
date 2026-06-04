export const TICKET_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
};

// Tín hiệu từ nút bấm ==> đổi trạng thái vé
export const ACTION_SIGNAL = {
  PAY: "pay",
  CANCEL: "cancel",
  DELETE: "delete",
};

// Trạng thái vé
const STATUS_CYCLE = [
  TICKET_STATUS.PENDING,
  TICKET_STATUS.PAID,
  TICKET_STATUS.CANCELLED,
];

// Tạo danh sách vé từ dữ liệu API
export function createInitialTickets(flights) {
  return flights.map((flight, index) => ({
    id: `flight-${flight.id}`,
    type: "flight",
    image: flight.image,
    title: `${flight.fromFull || flight.from} ✈ ${flight.toFull || flight.to}`,
    subtitle: flight.airline,
    detail: flight.schedules?.[0] ?? "",
    price: flight.priceFrom,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  }));
}

export function createInitialHotels(hotels) {
  return hotels.map((hotel, index) => ({
    id: `hotel-${hotel.id}`,
    type: "hotel",
    image: hotel.image,
    title: hotel.name,
    subtitle: hotel.location,
    detail: hotel.rating ? `Đánh giá: ${hotel.rating}` : "",
    price: hotel.priceFrom,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  }));
}

export function createInitialCars(cars) {
  return cars.map((car, index) => ({
    id: `car-${car.id}`,
    type: "car",
    image: car.image,
    title: car.name,
    subtitle: car.location,
    detail: car.specs ? `${car.specs.seats} chỗ | ${car.specs.fuel} | ${car.specs.transmission}` : "",
    price: car.priceFrom,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  }));
}

// Key cho vé đang chờ thanh toán
const PENDING_BOOKING_KEY = "pendingBooking";

// Lưu vé đang chờ thanh toán
export function savePendingBooking(ticket) {
  sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(ticket));
}

// Lấy vé đang chờ thanh toán
export function consumePendingBooking() {
  const raw = sessionStorage.getItem(PENDING_BOOKING_KEY);
  if (!raw) {
    return null;
  }
  sessionStorage.removeItem(PENDING_BOOKING_KEY);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Map item to pending ticket
export function mapItemToPendingTicket(type, item) {
  // Map flight to pending ticket
  if (type === "flight") {
    return {
      id: `flight-${item.id}`,
      type: "flight",
      image: item.image,
      title: `${item.fromFull || item.from} ✈ ${item.toFull || item.to}`,
      subtitle: item.airline,
      detail: item.schedules?.[0] ?? item.duration ?? "",
      price: item.priceFrom,
      status: TICKET_STATUS.PENDING,
    };
  }

  if (type === "hotel") {
    return {
      id: `hotel-${item.id}`,
      type: "hotel",
      image: item.image,
      title: item.name,
      subtitle: item.location,
      detail: item.rating ? `Đánh giá: ${item.rating}` : "",
      price: item.priceFrom,
      status: TICKET_STATUS.PENDING,
    };
  }
  
  if (type === "car") {
    return {
      id: `car-${item.id}`,
      type: "car",
      image: item.image,
      title: item.name,
      subtitle: item.location,
      detail: item.specs
        ? `${item.specs.seats} chỗ | ${item.specs.fuel} | ${item.specs.transmission}`
        : "",
      price: item.priceFrom,
      status: TICKET_STATUS.PENDING,
    };
  }

  // Map tour to pending ticket
  return {
    id: `tour-${item.id}`,
    type: "tour",
    image: item.image,
    title: item.name,
    subtitle: item.location,
    detail: item.duration ? `Thời lượng: ${item.duration}` : "",
    price: item.priceFrom,
    status: TICKET_STATUS.PENDING,
  };
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
