import axios from "axios";

export const TICKET_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
};

export const ACTION_SIGNAL = {
  PAY: "pay",
  CANCEL: "cancel",
  DELETE: "delete",
};

export const TYPE_LABELS = {
  flight: "Máy bay",
  hotel: "Khách sạn",
  car: "Ô tô",
  tour: "Tour",
};

const TICKETS_STORAGE_KEY = "myTickets";

const STATUS_CYCLE = [
  TICKET_STATUS.PENDING,
  TICKET_STATUS.PAID,
  TICKET_STATUS.CANCELLED,
];

// ĐỌC / GHI danh sách vé trong localStorage
export function getTickets() {
  try {
    const saved = localStorage.getItem(TICKETS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveTickets(tickets) {
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
}

// Thêm vé mới (đặt từ trang chi tiết)
export function addTicket(newTicket) {
  const currentTickets = getTickets();
  const withoutDuplicate = currentTickets.filter(
    (ticket) => ticket.id !== newTicket.id,
  );
  const updatedTickets = [newTicket, ...withoutDuplicate];
  saveTickets(updatedTickets);
  return updatedTickets;
}

// Tạo vé demo từ API (chỉ dùng lần đầu khi chưa có vé)
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
    detail: car.specs
      ? `${car.specs.seats} chỗ | ${car.specs.fuel} | ${car.specs.transmission}`
      : "",
    price: car.priceFrom,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  }));
}

export function createInitialTours(tours) {
  return tours.map((tour, index) => ({
    id: `tour-${tour.id}`,
    type: "tour",
    image: tour.image,
    title: tour.name,
    subtitle: tour.location,
    detail: tour.duration ? `Thời lượng: ${tour.duration}` : "",
    price: tour.priceFrom,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  }));
}

export async function loadDemoTicketsFromApi() {
  const [flightsRes, hotelsRes, carsRes, toursRes] = await Promise.all([
    axios.get("http://localhost:9999/flights"),
    axios.get("http://localhost:9999/hotels"),
    axios.get("http://localhost:9999/cars"),
    axios.get("http://localhost:9999/tours"),
  ]);

  return [
    ...createInitialTickets(flightsRes.data),
    ...createInitialHotels(hotelsRes.data),
    ...createInitialCars(carsRes.data),
    ...createInitialTours(toursRes.data),
  ];
}

export async function initTicketsIfEmpty() {
  const savedTickets = getTickets();
  if (savedTickets.length > 0) {
    return savedTickets;
  }

  const demoTickets = await loadDemoTicketsFromApi();
  saveTickets(demoTickets);
  return demoTickets;
}

// Chuyển item từ trang chi tiết thành 1 vé "chờ thanh toán"
export function mapItemToPendingTicket(type, item) {
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

// Lọc và đếm vé theo tab
export function filterTicketsByStatus(tickets, status) {
  return tickets.filter((ticket) => ticket.status === status);
}

export function countTicketsByStatus(tickets) {
  return {
    pending: filterTicketsByStatus(tickets, TICKET_STATUS.PENDING).length,
    paid: filterTicketsByStatus(tickets, TICKET_STATUS.PAID).length,
    cancelled: filterTicketsByStatus(tickets, TICKET_STATUS.CANCELLED).length,
  };
}

// Xử lý nút bấm: thanh toán / hủy / xóa
export function applyActionSignal(tickets, ticketId, signal) {
  let updatedTickets = tickets;

  if (signal === ACTION_SIGNAL.DELETE) {
    updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
  } else {
    let nextStatus = null;

    if (signal === ACTION_SIGNAL.PAY) {
      nextStatus = TICKET_STATUS.PAID;
    }

    if (signal === ACTION_SIGNAL.CANCEL) {
      nextStatus = TICKET_STATUS.CANCELLED;
    }

    if (nextStatus) {
      updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket,
      );
    }
  }

  saveTickets(updatedTickets);
  return updatedTickets;
}
