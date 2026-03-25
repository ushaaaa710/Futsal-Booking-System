// API service — Thin wrapper around fetch for the CourtSync backend.
// All responses follow { success: boolean, message: string, data?: T }

const BASE = "/api";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

function getToken(): string | null {
  try {
    return localStorage.getItem("courtsync_token");
  } catch {
    return null;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // Build default headers including auth token if available
  const token = getToken();
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Destructure to prevent ...options from overwriting the merged headers
  const { headers: optionHeaders, ...restOptions } = options || {};

  const res = await fetch(`${BASE}${path}`, {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...(optionHeaders as Record<string, string>),
    },
  });

  // Handle empty or non-JSON responses gracefully
  const text = await res.text();
  if (!text) {
    throw new Error(
      res.ok ? "Empty response from server" : `Server error (${res.status})`,
    );
  }

  let json: ApiResponse<T>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Server error (${res.status}): ${text.slice(0, 120)}`);
  }

  if (!json.success) {
    throw new Error(json.message || "Request failed");
  }
  return json.data as T;
}

// ──────────────── Courts ────────────────

export interface ApiCourt {
  _id: string;
  name: string;
  type: "INDOOR" | "OUTDOOR";
  hourlyRate: number;
  image: string;
  location: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export const courtApi = {
  getAll: (type?: string) =>
    request<ApiCourt[]>(`/courts${type ? `?type=${type}` : ""}`),

  getById: (id: string) => request<ApiCourt>(`/courts/${id}`),

  create: (data: Partial<ApiCourt>) =>
    request<ApiCourt>("/courts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<ApiCourt>) =>
    request<ApiCourt>(`/courts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<ApiCourt>(`/courts/${id}`, { method: "DELETE" }),

  getSlots: (courtId: string, date: string) =>
    request<ApiTimeSlot[]>(`/courts/${courtId}/slots?date=${date}`),

  getAvailableSlots: (courtId: string, date: string) =>
    request<ApiTimeSlot[]>(`/courts/${courtId}/slots/available?date=${date}`),
};

// ──────────────── Bookings ────────────────

export interface ApiBooking {
  _id: string;
  userId: string;
  courtId: string;
  date: string;
  slots: string[];
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBookings {
  bookings: ApiBooking[];
  total: number;
  page: number;
  totalPages: number;
}

export const bookingApi = {
  create: (data: { courtId: string; date: string; slots: string[] }) =>
    request<ApiBooking>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMy: (status?: string) =>
    request<PaginatedBookings>(
      `/bookings/my${status ? `?status=${status}` : ""}`,
    ),

  getById: (id: string) => request<ApiBooking>(`/bookings/${id}`),

  getAll: (params?: {
    status?: string;
    courtId?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.courtId) qs.set("courtId", params.courtId);
    if (params?.date) qs.set("date", params.date);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return request<PaginatedBookings>(`/bookings${q ? `?${q}` : ""}`);
  },

  updateStatus: (id: string, status: string) =>
    request<ApiBooking>(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  cancel: (id: string) =>
    request<ApiBooking>(`/bookings/${id}/cancel`, { method: "PATCH" }),
};

// ──────────────── Auth ────────────────

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthPayload {
  user: ApiUser;
  token: string;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    request<AuthPayload>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthPayload>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => request<{ user: ApiUser }>("/auth/me"),
};

// ──────────────── Users ────────────────

export const userApi = {
  getAll: () => request<ApiUser[]>("/users"),
  getById: (id: string) => request<ApiUser>(`/users/${id}`),

  updateProfile: (
    id: string,
    data: { name?: string; phone?: string; avatar?: string },
  ) =>
    request<ApiUser>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  topUpWallet: (id: string, amount: number) =>
    request<ApiUser>(`/users/${id}/wallet/topup`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};

// ──────────────── Admin ────────────────

export interface DashboardStats {
  totalBookings: number;
  totalUsers: number;
  totalCourts: number;
  totalRevenue: number;
}

export interface BookingAnalyticsDay {
  _id: string; // date string
  count: number;
}

export const adminApi = {
  getStats: () => request<DashboardStats>("/admin/stats"),

  getBookingAnalytics: (days = 7) =>
    request<BookingAnalyticsDay[]>(`/admin/analytics/bookings?days=${days}`),

  getUsers: () => request<ApiUser[]>("/admin/users"),
};

// ──────────────── Reviews ────────────────

export interface ApiReview {
  _id: string;
  userId: string;
  courtId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export const reviewApi = {
  create: (data: {
    courtId: string;
    bookingId: string;
    rating: number;
    comment?: string;
  }) =>
    request<ApiReview>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getForCourt: (courtId: string) =>
    request<{ reviews: ApiReview[]; averageRating: number; totalReviews: number }>(
      `/reviews/court/${courtId}`,
    ),
};

// ──────────────── Payments ────────────────

export const paymentApi = {
  initiateTopUp: (amount: number, provider: 'esewa' | 'khalti') =>
    request<{ transactionId: string; paymentUrl?: string }>('/payments/topup', {
      method: 'POST',
      body: JSON.stringify({ amount, provider }),
    }),

  verify: (transactionId: string, provider: string) =>
    request<{ success: boolean }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ transactionId, provider }),
    }),
};

// ──────────────── Chat ────────────────

export interface ApiMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const chatApi = {
  /** Get all conversations (latest message per contact) */
  getConversations: () => request<ApiMessage[]>("/chat/conversations"),

  /** Get messages between current user and another user */
  getMessages: (userId: string) =>
    request<ApiMessage[]>(`/chat/messages/${userId}`),

  /** Send a message */
  send: (data: { receiverId: string; content: string; bookingId?: string }) =>
    request<ApiMessage>("/chat/messages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
