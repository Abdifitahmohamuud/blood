# Blood Donation Management System - Backend

REST API built with Node.js, Express and MongoDB (Mongoose).

Base URL: `http://localhost:5000/api` (adjust PORT/host as needed)

Table of contents
- Authentication
- Users (Donors)
- Hospitals
- Admins
- Blood Requests
- Examples & Fetch snippets
- Bootstrapping notes
- Responses & Error codes

---

Authentication (how to use)

- After signup/login the API returns a JWT. Send it on protected requests via the `Authorization` header:

	`Authorization: Bearer <token>`

- The JWT payload contains `{ id, role }` where `role` is `user`, `hospital`, or `admin`.

Authentication endpoints

1) User (Donor) Signup

- POST `/api/auth/user/signup`
- Description: Public endpoint to register a donor and receive a token.
- Body (application/json):

```json
{
	"fullName": "Jane Doe",
	"email": "jane@example.com",
	"phone": "0712345678",
	"password": "secret",
	"bloodType": "O+",
	"location": "Hodan District of Mogadishu",
	"availability": true
}
```
- Response: `201 Created` with `{ success: true, data: user, token }`.

2) User Login

- POST `/api/auth/user/login`
- Body: `{ "email": "jane@example.com", "password": "secret" }`
- Response: `200 OK` with `{ success:true, data: user, token }`.

3) Hospital Signup (admin-only)

- POST `/api/auth/hospital/signup`
- Description: Create a hospital account. This endpoint requires an admin token in current code.
- Headers: `Authorization: Bearer <admin-token>`
- Body:

```json
{
	"name": "City Hospital",
	"email": "hospital@example.com",
	"phone": "0711111111",
	"password": "secret",
	"address": "123 Main St",
	"location": "Hodan District of Mogadishu"
}
```

- Response: `201 Created` with `{ success:true, data: hospital, token }`.

4) Hospital Login

- POST `/api/auth/hospital/login`
- Body: `{ "email": "hospital@example.com", "password": "secret" }`
- Response: `200 OK` with `{ success:true, data: hospital, token }`.

5) Admin Signup (protected in code)

- POST `/api/auth/admin/signup`
- Description: Create an admin account. In this repository the route is protected by admin role, so creating the first admin may require manual DB insertion (see Bootstrapping notes).
- Headers: `Authorization: Bearer <admin-token>` (unless bootstrapping)
- Body:

```json
{
	"name": "Site Admin",
	"email": "admin@example.com",
	"password": "secret"
}
```

- Response: `201 Created` with `{ success:true, data: admin, token }`.

6) Admin Login

- POST `/api/auth/admin/login`
- Body: `{ "email": "admin@example.com", "password": "secret" }`
- Response: `200 OK` with `{ success:true, data: admin, token }`.

---

Users (Donors) endpoints

- All `users` management endpoints are admin-only in current code. For public donor self-signup use `POST /api/auth/user/signup` and login via auth.

- GET `/api/users`
	- Description: List all users (admin only).
	- Headers: `Authorization: Bearer <admin-token>`

- POST `/api/users`
	- Description: Create a user (admin only). Use `auth/user/signup` for public signup.
	- Headers: `Authorization: Bearer <admin-token>`
	- Body: same as user signup body above.

- GET `/api/users/:id`
	- Description: Get user by id (admin only).
	- Headers: `Authorization: Bearer <admin-token>`

- PUT `/api/users/:id`
	- Description: Update user record (admin only). Send JSON with updated fields (e.g., `availability`, `location`, `phone`).
	- Headers: `Authorization: Bearer <admin-token>`

- DELETE `/api/users/:id`
	- Description: Delete user (admin only).
	- Headers: `Authorization: Bearer <admin-token>`

- GET `/api/users/:id/nearby-requests`
	- Description: For a donor to fetch nearby hospital requests. Protected for `user` role.
	- Headers: `Authorization: Bearer <user-token>`
	- Query params: `?location=LocationString` (optional; falls back to user's saved `location`), `?bloodType=A+` (optional)

---

Hospitals endpoints

- In this code hospitals are managed by admins. Hospitals themselves can login and create `requests`.

- GET `/api/hospitals`
	- Admin only. Headers: `Authorization: Bearer <admin-token>`

- GET `/api/hospitals/:id`
	- Admin only. Headers: `Authorization: Bearer <admin-token>`

- PUT `/api/hospitals/:id`
	- Admin only. Update hospital fields. Headers: `Authorization: Bearer <admin-token>`

- DELETE `/api/hospitals/:id`
	- Admin only. Headers: `Authorization: Bearer <admin-token>`

---

Admins endpoints

- Admin management routes are mounted at `/api/admins` and are admin-only.

- GET `/api/admins` — list admins (admin-only).
- POST `/api/admins` — create admin (admin-only).
- GET `/api/admins/:id` — get admin (admin-only).
- PUT `/api/admins/:id` — update admin (admin-only).
- DELETE `/api/admins/:id` — delete admin (admin-only).

---

Blood Requests

- POST `/api/requests`
	- Description: Hospital creates a blood request. Protected: hospital role.
	- Headers: `Authorization: Bearer <hospital-token>`
	- Body example:

```json
{
	"bloodType": "A+",
	"patientCondition": "critical",
	"quantity": 2
}
```

	- Behavior: creates a request using the hospital's stored `location` and returns donors that match `location` and `bloodType`.

- GET/PUT/DELETE `/api/requests/:id` — typical CRUD; protected by hospital role for modifications.

---

Headers and common examples

- Always set `Content-Type: application/json` for JSON bodies.
- Authorization: `Authorization: Bearer <token>` for protected routes.

Example usage

```js
// Hospital login then create a request
fetch('http://localhost:5000/api/auth/hospital/login', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email: 'h@example.com', password: 'pass' })
}).then(r => r.json()).then(({ token }) => {
	return fetch('http://localhost:5000/api/requests', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
		body: JSON.stringify({ bloodType: 'A+', patientCondition: 'critical', quantity: 1 })
	})
}).then(r => r.json()).then(console.log)
```

Bootstrapping notes

- Because admin signup is protected in this code, create the first admin directly in the database (Mongo shell or GUI) or temporarily allow open admin signup to bootstrap the system.

Responses & Error codes

- `200 OK` — successful GET/PUT
- `201 Created` — resource created
- `400 Bad Request` — validation or missing parameters
- `401 Unauthorized` — missing/invalid JWT
- `403 Forbidden` — role not allowed
- `404 Not Found` — resource missing
- `500 Server Error` — unexpected error

Testing & Postman

- Use Postman or HTTPie; set `Content-Type: application/json` and include `Authorization: Bearer <token>` for protected calls.

