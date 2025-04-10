const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in .env file");
}
if (!WS_BASE_URL) {
  throw new Error("VITE_WS_BASE_URL is not defined in .env file");
}

export const apiRoutes = {
  help: `${API_BASE_URL}/api-support/api/v1/ticket/paginated?limit=10&offset=0`,
  helpTicket: `${API_BASE_URL}/api-support/api/v1/ticket`,
  helpTicketCreate: `${API_BASE_URL}/api-support/api/v1/ticket/`,
  paymentMethods: `${API_BASE_URL}/api-payment/api/v1/payment_type/list`
};

export const socketRoutes = {
  ticketWS: `${WS_BASE_URL}/api-support/api/v1/ws/ticket/`
};
