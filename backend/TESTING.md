# Testing the CourtSync Backend

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start MongoDB Locally

Make sure MongoDB is running. If you have MongoDB installed:

```bash
mongod
# or if using MongoDB as a service:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo service mongod start
```

Or use MongoDB Atlas (cloud):

- Create a cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Set `MONGODB_URI` environment variable:

  ```bash
  # Windows (PowerShell)
  $env:MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/courtsync"

  # Windows (Command Prompt)
  set MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/courtsync

  # macOS/Linux
  export MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/courtsync"
  ```

### 3. Start the Dev Server

```bash
npm run dev
```

You should see:

```
✓ Connected to MongoDB
✓ Server running on http://localhost:5000
✓ API endpoints available at http://localhost:5000/api
✓ Health check: http://localhost:5000/health
```

## Testing the API

### Option A: REST Client Extension (Recommended)

1. Install **REST Client** extension in VS Code (by Huachao Mao)
2. Open [tests/api.rest](api.rest)
3. Click **Send Request** above any endpoint
4. Check the response in the side panel

### Option B: cURL

```bash
# Health check
curl http://localhost:5000/health

# Get all courts
curl http://localhost:5000/api/courts

# Create a court (requires admin token - update the token first)
curl -X POST http://localhost:5000/api/courts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "City Court",
    "type": "INDOOR",
    "hourlyRate": 800,
    "image": "https://example.com/court.jpg"
  }'
```

### Option C: Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new collection
3. Add requests using the endpoints documented in [tests/api.rest](api.rest)
4. Set variables for `baseUrl`, `adminToken`, `userToken`

## Auth Tokens

For testing protected endpoints, you'll need valid JWT tokens. The middleware currently **accepts any Bearer token** and extracts user info from it.

For real testing, you need to:

1. Implement `authenticate()` middleware to validate JWT tokens
2. Generate real tokens using your auth endpoint
3. Replace token values in [tests/api.rest](api.rest)

Current placeholder tokens:

- **Admin**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (has `role: "ADMIN"`)
- **User**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (has `role: "USER"`)

## API Endpoints

### Courts

- `GET /api/courts` - List all courts
- `GET /api/courts?type=INDOOR` - Filter by type
- `GET /api/courts/:id` - Get court details
- `POST /api/courts` - Create court (admin)
- `PUT /api/courts/:id` - Update court (admin)
- `DELETE /api/courts/:id` - Delete court (admin)

### Time Slots

- `GET /api/courts/:courtId/slots?date=YYYY-MM-DD` - Get all slots (booked + free)
- `GET /api/courts/:courtId/slots/available?date=YYYY-MM-DD` - Get only available slots

### Bookings

- `POST /api/bookings` - Create booking (user)
- `GET /api/bookings/my` - My bookings (user)
- `GET /api/bookings/my?status=PENDING` - Filter my bookings
- `GET /api/bookings/:id` - Get booking details (user)
- `GET /api/bookings` - All bookings (admin)
- `PATCH /api/bookings/:id/status` - Update status (admin)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (user)

## Common Test Workflows

### 1. Create a Court and Book It

```
1. POST /courts (create court, copy the ID from response)
2. GET /courts/:id/slots/available?date=2026-03-05 (check availability)
3. POST /bookings (create booking with available slots)
4. GET /bookings/my (view your booking)
5. PATCH /bookings/:id/cancel (cancel if needed)
```

### 2. Admin Approves a Booking

```
1. GET /bookings (view all pending bookings)
2. PATCH /bookings/:id/status { status: "CONFIRMED" } (approve)
3. GET /bookings/:id (verify status changed)
```

### 3. Check Slot Availability

```
1. Create a court
2. Create a booking (will block those slots)
3. Check /slots/available for same date (those slots should be gone)
```

## Troubleshooting

### Error: Cannot POST /api/bookings

- Routes are mounted at `/api` — check the full path
- Ensure server is running (check console output)

### Error: "Validation failed"

- Check your request body matches the schema
- All required fields: `courtId`, `date` (YYYY-MM-DD), `slots` (HH:00 format)

### Error: "Court not found"

- Create a court first, then use its ID
- Court must exist in database

### Error: "Cannot read property 'role' of undefined"

- Auth middleware needs a Bearer token
- Add `Authorization: Bearer <token>` header to protected routes

### MongoDB connection refused

- Ensure MongoDB is running (`mongodb://localhost:27017`)
- OR set `MONGODB_URI` env variable for Atlas

## Build & Deploy

```bash
# Build to JavaScript
npm run build

# Output is in dist/ folder
# Start production server
npm start
```

## Next Steps (for other team members)

- **Auth Team**: Implement JWT token generation in `/auth/register` and `/auth/login`
- **Payment Team**: Add payment endpoints and calculate `totalPrice` dynamically
- **Chat Team**: Integrate WebSocket for real-time messaging
- **Admin Team**: Add dashboard analytics and reporting
