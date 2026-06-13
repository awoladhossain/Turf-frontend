# TurfSync Frontend Integration Tasks

This todo list tracks the remaining backend API endpoints that need to be integrated into the TurfSync frontend.

---

## 🔒 Authentication Service (`services/auth.service.ts`)

- [x] **Refresh Tokens** (`POST /api/auth/refresh`)
  - [x] Implement `refreshTokens` in `AuthService`
  - [x] Setup Axios request/response interceptor to handle auto-refreshing expired access tokens using the refresh token.
- [x] **Logout User** (`POST /api/auth/logout`)
  - [x] Implement `logout` in `AuthService` (needs to send the `refreshToken` in the request body)
  - [x] Update `useAuth` hook to trigger the API call when logging out.
- [x] **Logout All Devices** (`POST /api/auth/logout-all`)
  - [x] Implement `logoutAll` in `AuthService`

---

## 📅 Booking Service (`services/booking.service.ts`)

Create a new `booking.service.ts` to manage all booking activities.

- [x] **Create Booking** (`POST /api/bookings`)
  - [x] Implement `createBooking(dto: CreateBookingDto)`
- [x] **Get My Bookings** (`GET /api/bookings/my`)
  - [x] Implement `getMyBookings()`
- [x] **Get Booking Details** (`GET /api/bookings/:id`)
  - [x] Implement `getBookingById(id: string)`
- [x] **Cancel Booking** (`PATCH /api/bookings/:id/cancel`)
  - [x] Implement `cancelBooking(id: string)`
- [x] **Get All Bookings (Admin)** (`GET /api/bookings/admin/all`)
  - [x] Implement `getAllBookingsAdmin(page: number, limit: number)`

---

## 💳 Payment Service (`services/payment.service.ts`)

Create a new `payment.service.ts` to manage transactions and Stripe processing.

- [x] **Create Payment Intent** (`POST /api/payment/create-payment-intent`)
  - [x] Implement `createPaymentIntent(bookingId: string)`
- [x] **Verify Payment Status** (`POST /api/payment/booking/:bookingId`)
  - [x] Implement `verifyPaymentStatus(bookingId: string)`
- [x] **Refund Payment** (`POST /api/payment/refund/:bookingId`)
  - [x] Implement `refundPayment(bookingId: string)`

---

## 🩺 System Health Service (`services/health.service.ts`)

- [x] **Health Status** (`GET /api/health`)
  - [x] Implement `getHealthStatus()` to monitor database and redis connectivity.
