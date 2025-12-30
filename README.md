# Blood Donation Management System - Backend

REST API built with Node.js, Express, and MongoDB (Mongoose).

This README mirrors the structure you provided — clear endpoint docs, request/response examples, and usage notes for frontend developers.

Table of Contents
- Authentication
- Users (Donors)
- Hospitals
# Blood Donation Management System - Backend

## Overview

REST API built with Node.js, Express and MongoDB (Mongoose). This README mirrors the Voting App sample structure: clear endpoint docs, usage patterns, fetch examples and request/response shapes so frontend developers can integrate quickly.

## Table of Contents
- Authentication
- Users (Donors)
- Hospitals (Admin)
- Blood Requests
- Geospatial (Nearby donors)
- Responses & Error Codes
- Examples & Fetch snippets
- Testing & Postman



## Common response envelope

- Success example:

```json
{ "success": true, "data": /* object or array */, "token": /* optional JWT */ }
```

- Error example:

```json
{ "success": false, "error": "Human-friendly message" }
```

## Authentication (how to use)

- After signup/login the API returns a JWT. Send it on protected requests via the `Authorization` header:

```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### 1) User (Donor) Signup

- `POST /api/auth/user/signup`

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

- Response: `201 Created` with `data` (user) and `token` (role: `user`).

- Example fetch:

```js
fetch('/api/auth/user/signup', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(payload)
}).then(r => r.json()).then(console.log)
```

#### 2) User Login

- `POST /api/auth/user/login`
- Body: `{ "email": "jane@example.com", "password": "secret" }`
- Response: `200 OK` `{ success:true, data: user, token: '...' }`

#### 3) Hospital Signup / Login

- `POST /api/auth/hospital/signup` — Body: `{ "name","email","phone","password","address","location" }` → `201 Created + token` (role `hospital`).
- `POST /api/auth/hospital/login` — Body: `{ "email","password" }` → `200 OK + token`.

## Users (Donors)

- `GET /api/users` — Protected: roles `hospital`, `user` — returns `{ success:true, count, data:[users] }`.
- `POST /api/users` — create user (same body as signup).
- `GET /api/users/:id` — Protected — single user object.
- `PUT /api/users/:id` — Protected — update profile (e.g. `availability`, `location`).
- `DELETE /api/users/:id` — Protected.
- `GET /api/users/:id/nearby-requests` — Protected (user). Query: `location` (string), optional `bloodType`.

Example: `/api/users/123/nearby-requests?location=Hodan%20District%20of%20Mogadishu&bloodType=O+`

Fetch example:

```js
fetch('/api/users/123/nearby-requests?location=Hodan%20District%20of%20Mogadishu', {
	headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log)
```

## Hospitals (Admin)

- `GET /api/hospitals`
- `GET /api/hospitals/:id`
- `PUT /api/hospitals/:id`
- `DELETE /api/hospitals/:id`
- `POST /api/hospitals` (optional admin create).

Protected endpoints require `Authorization: Bearer <token>` from a hospital account.

## Blood Requests

- `POST /api/requests` — Protected (hospital)

	- Body:

	```json
	{
		"bloodType": "A+",
		"patientCondition": "critical",
		"quantity": 2
	}
	```

	- Behavior: creates a request using the hospital's stored `location` (string), then finds donors who have the same `location` string and matching `bloodType` and `availability`. Response includes `donors` and `donorsCount`.

	- Example response (`201`):

	```json
	{
		"success": true,
		"data": { /* blood request object */ },
		"donorsCount": 2,
		"donors": [ /* donor objects */ ]
	}
	```

	- Fetch example:

	```js
	fetch('/api/requests', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${hospitalToken}` },
		body: JSON.stringify({ bloodType: 'A+', patientCondition: 'critical', quantity: 2 })
	}).then(r => r.json()).then(console.log)
	```

- `GET /api/requests`
- `GET /api/requests/:id`
- `PUT /api/requests/:id` (hospital role)
- `DELETE /api/requests/:id` (hospital role)

## Geospatial (Nearby donors)

- Model `location` uses GeoJSON `Point` and a `2dsphere` index.

Server-side example query:

```js
User.find({
	bloodType: requestedType,
	availability: true,
	location: {
		$near: {
			$geometry: { type: 'Point', coordinates: hospital.location.coordinates },
			$maxDistance: distance
		}
	}
})
```

## Responses & Error codes

- `200 OK` — successful GET/PUT
- `201 Created` — resource created
- `400 Bad Request` — validation or missing parameters
- `401 Unauthorized` — missing/invalid JWT
- `403 Forbidden` — role not allowed
- `404 Not Found` — resource missing
- `500 Server Error` — unexpected error

## Examples & frontend tips

- Always set `Content-Type: application/json` for JSON requests.
- Store the token securely; include `Authorization: Bearer <token>` for protected calls.
- Validate inputs on the client to reduce round-trips.

Sample flow (login -> create request):

```js
// 1. Login hospital
fetch('/api/auth/hospital/login', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email: 'h@example.com', password: 'pass' })
}).then(r => r.json()).then(({ token }) => {
	// 2. Create a blood request with token
	fetch('/api/requests', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
		body: JSON.stringify({ bloodType: 'A+', patientCondition: 'critical', quantity: 1 })
	}).then(r => r.json()).then(console.log)
})
```


