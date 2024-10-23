# API Endpoints

## Overview

This document provides an overview of the API endpoints available in the project, along with their response times based on the schema.

---

# **User API Documentation**

### **1. Get User Reservations**

-  **URL:** `/api/user/reservation`
-  **Method:** `GET`
-  **Description:** Retrieves all reservations for the authenticated user, including the associated showtime details.

#### **Request Headers:**

-  **Content-Type:** `application/json`
-  **Cookies:**
   -  `token` (for session management)

#### **Middleware Used:**

-  **`isUser`**: Ensures the user is authenticated and valid.

#### **Response Example:**

```json
{
	"ID": "res123",
	"userID": "user456",
	"showtimeID": "show789",
	"seats": 2,
	"createdAt": "2024-10-15T12:00:00.000Z",
	"updatedAt": "2024-10-16T15:00:00.000Z",
	"showtime": {
		"ID": "show789",
		"movieID": "movie101",
		"startTime": "2024-10-18T14:30:00.000Z",
		"endTime": "2024-10-18T17:00:00.000Z",
		"seatsAvailable": 98,
		"createdAt": "2024-10-01T09:00:00.000Z",
		"updatedAt": "2024-10-15T11:00:00.000Z"
	}
}
```

#### **Error Response:**

```json
{
	"error": "No reservations"
}
```

---

### **2. Create a Reservation**

-  **URL:** `/api/user/reservation`
-  **Method:** `POST`
-  **Description:** Creates a new reservation for a given showtime.

#### **Request Headers:**

-  **Content-Type:** `application/json`
-  **Cookies:**
   -  `token` (for session management)

#### **Request Body Example:**

```json
{
	"showtimeID": "show789",
	"seats": 3
}
```

#### **Middleware Used:**

-  **`isUser`**: Ensures the user is authenticated.
-  **`authenticateReservationDetails`**: Validates the presence of `showtimeID` and `seats` in the request body.

#### **Response Example:**

```json
{
	"message": "Reservation created successfully",
	"reservation": {
		"ID": "res123",
		"userID": "user456",
		"showtimeID": "show789",
		"seats": 3,
		"createdAt": "2024-10-15T12:00:00.000Z",
		"showtime": {
			"ID": "show789",
			"startTime": "2024-10-18T14:30:00.000Z",
			"endTime": "2024-10-18T17:00:00.000Z"
		}
	}
}
```

#### **Error Responses:**

-  **Invalid Showtime:**
   ```json
   {
   	"error": "Invalid Showtime"
   }
   ```
-  **Not Enough Seats Available:**
   ```json
   {
   	"error": "Not enough available seats"
   }
   ```
-  **Duplicate Reservation:**
   ```json
   {
   	"error": "Reservation already exists"
   }
   ```

---

### **3. Delete a Reservation**

-  **URL:** `/api/user/reservation/:reservationID`
-  **Method:** `DELETE`
-  **Description:** Deletes an existing reservation and updates the available seat count.

#### **Request Headers:**

-  **Content-Type:** `application/json`
-  **Cookies:**
   -  `token` (for session management)

#### **Middleware Used:**

-  **`isUser`**: Ensures the user is authenticated.
-  **`reservationMiddleware`**: Validates that the reservation exists and belongs to the user.

#### **Response Example:**

```json
{
	"message": "Reservation deleted and seats updated successfully"
}
```

#### **Error Response:**

```json
{
	"error": "Reservation not found"
}
```

---

## **Middleware Logic Explained**

### **1. `isUser` Middleware**

This middleware ensures that the user is authenticated by verifying the JWT token stored in cookies.  
If the token is valid, it retrieves the user’s data from the database and attaches it to the request (`req.user`).

#### **Error Cases:**

-  **Token not found:**
   ```json
   {
   	"error": "Token not found"
   }
   ```
-  **Invalid Token:**
   ```json
   {
   	"error": "Invalid token"
   }
   ```
-  **User not found:**
   ```json
   {
   	"error": "User not found"
   }
   ```

---

### **2. `authenticateReservationDetails` Middleware**

This middleware validates that the request body contains both `showtimeID` and `seats`.  
It also ensures that the provided `showtimeID` exists in the database.

#### **Error Cases:**

-  **Missing Details:**
   ```json
   {
   	"error": "Please provide showtimeID and number of seats"
   }
   ```
-  **Showtime not found:**
   ```json
   {
   	"error": "Showtime not found"
   }
   ```

---

### **3. `reservationMiddleware` Middleware**

This middleware ensures that the reservation exists and belongs to the authenticated user.  
It checks if the `reservationID` from the URL path is valid and if it matches the user's ID.

#### **Error Cases:**

-  **Missing Reservation ID:**
   ```json
   {
   	"error": "Please provide reservationID"
   }
   ```
-  **Reservation Not Found:**
   ```json
   {
   	"error": "Reservation not found"
   }
   ```
-  **Unauthorized Access:**
   ```json
   {
   	"error": "Reservation does not belong to the user"
   }
   ```

---

# **Movie API Documentation**

### **1. Get List of Movies**

-  **URL:** `/api/movies`
-  **Method:** `GET`
-  **Description:** Retrieves a paginated list of movies.

#### **Query Parameters:**

-  `limit` (optional): Number of movies per page (e.g., `10`)
-  `page` (optional): The page number to retrieve (e.g., `1`)

#### **Request Example:**

`GET /api/movies?limit=10&page=1`

#### **Response Example:**

```json
[
	{
		"ID": "movie123",
		"name": "Inception",
		"description": "A mind-bending thriller",
		"duration": 148,
		"director": "Christopher Nolan",
		"releaseDate": "2010-07-16T00:00:00.000Z",
		"posterImageURL": "https://example.com/inception.jpg",
		"createdAt": "2024-10-01T09:00:00.000Z",
		"updatedAt": "2024-10-15T11:00:00.000Z"
	}
]
```

---

### **2. Get Showtimes for a Movie**

-  **URL:** `/api/movies/:movieID/showtime`
-  **Method:** `GET`
-  **Description:** Retrieves all showtimes for a specific movie.

#### **Path Parameters:**

-  `movieID`: The ID of the movie (e.g., `movie123`)

#### **Request Example:**

`GET /api/movies/movie123/showtime`

#### **Response Example:**

```json
[
	{
		"ID": "showtime789",
		"startTime": "2024-10-18T14:30:00.000Z",
		"endTime": "2024-10-18T17:00:00.000Z",
		"seatsAvailable": 100,
		"createdAt": "2024-10-01T09:00:00.000Z",
		"updatedAt": "2024-10-15T11:00:00.000Z"
	}
]
```

#### **Error Response:**

```json
{
	"message": "Movie not found"
}
```

---

### **3. Get Available Seats for a Showtime**

-  **URL:** `/api/movies/:movieID/showtime/:showtimeID/seats`
-  **Method:** `GET`
-  **Description:** Retrieves the number of available seats for a specific showtime of a movie.

#### **Path Parameters:**

-  `movieID`: The ID of the movie (e.g., `movie123`)
-  `showtimeID`: The ID of the showtime (e.g., `showtime789`)

#### **Request Example:**

`GET /api/movies/movie123/showtime/showtime789/seats`

#### **Response Example:**

```json
{
	"seatsAvailable": 100
}
```

#### **Error Responses:**

-  **Showtime not found:**
   ```json
   {
   	"error": "Showtime not found"
   }
   ```
-  **Showtime not found for this movie:**
   ```json
   {
   	"error": "Showtime not found for this movie"
   }
   ```

---

### **4. Get Movies by Genre**

-  **URL:** `/api/movies/sort/genre`
-  **Method:** `GET`
-  **Description:** Retrieves all movies of a specific genre.

#### **Query Parameters:**

-  `genre`: Name of the genre (e.g., `"Sci-Fi"`)

#### **Request Example:**

`GET /api/movies/sort/genre?genre=Sci-Fi`

#### **Response Example:**

```json
[
	{
		"ID": "movie123",
		"name": "Interstellar",
		"description": "A journey through space and time",
		"duration": 169,
		"director": "Christopher Nolan",
		"releaseDate": "2014-11-07T00:00:00.000Z",
		"posterImageURL": "https://example.com/interstellar.jpg",
		"createdAt": "2024-10-01T09:00:00.000Z",
		"updatedAt": "2024-10-15T11:00:00.000Z"
	}
]
```

#### **Error Response:**

```json
{
	"error": "Genre not found"
}
```

---

# **Auth API Documentation**

## **1. User Registration**

-  **URL:** `/api/auth/register`
-  **Method:** `POST`
-  **Description:** Registers a new user, hashes their password, and returns a session token.

### **Request Headers:**

-  **Content-Type:** `application/json`

### **Request Body Example:**

```json
{
	"name": "John Doe",
	"email": "john.doe@example.com",
	"password": "password123"
}
```

### **Middleware Used:**

-  **`authenticateRegistrationDetails`**: Validates that all required fields are provided and checks for input errors using Joi.

### **Response Example:**

```json
{
	"message": "User created successfully",
	"user": {
		"ID": "user456",
		"name": "John Doe",
		"email": "john.doe@example.com",
		"createdAt": "2024-10-16T10:30:00.000Z"
	}
}
```

### **Error Responses:**

-  **User Already Exists:**
   ```json
   {
   	"error": "User already exists"
   }
   ```
-  **Validation Error:**
   ```json
   {
   	"error": "Invalid input"
   }
   ```

---

## **2. User Login**

-  **URL:** `/api/auth/login`
-  **Method:** `POST`
-  **Description:** Authenticates a user using email and password, returning a session token.

### **Request Headers:**

-  **Content-Type:** `application/json`

### **Request Body Example:**

```json
{
	"email": "john.doe@example.com",
	"password": "password123"
}
```

### **Middleware Used:**

-  **`authenticateLoginDetails`**: Ensures that both `email` and `password` are provided and valid using Joi.

### **Response Example:**

```json
{
	"message": "Login Successful"
}
```

### **Error Responses:**

-  **User Not Found:**
   ```json
   {
   	"error": "User Not Found"
   }
   ```
-  **Invalid Password:**
   ```json
   {
   	"error": "Invalid password"
   }
   ```

---

## **3. User Logout**

-  **URL:** `/api/auth/logout`
-  **Method:** `POST`
-  **Description:** Logs out the user by clearing the session token from cookies.

### **Request Headers:**

-  **Content-Type:** `application/json`
-  **Cookies:**
   -  `token` (JWT token for session)

### **Middleware Used:**

-  **`authenticateLogoutDetails`**: Verifies the presence of a valid token in cookies.

### **Response Example:**

```json
{
	"message": "Logout Successful",
	"user": {
		"ID": "user456",
		"email": "john.doe@example.com"
	}
}
```

### **Error Response:**

-  **Token Absent:**
   ```json
   {
   	"error": "Token Absent"
   }
   ```

---

## **Middleware Logic Explained**

### **1. `authenticateRegistrationDetails`**

-  **Purpose:** Validates the registration details and ensures the request body contains `name`, `email`, and `password`.
-  **Validation:** Uses Joi to enforce input rules (e.g., valid email format).

#### **Error Response:**

```json
{
	"error": "Invalid input"
}
```

---

### **2. `authenticateLoginDetails`**

-  **Purpose:** Ensures both `email` and `password` are provided during login and validates them with Joi.

#### **Error Response:**

```json
{
	"error": "Please provide email and password"
}
```

---

### **3. `authenticateLogoutDetails`**

-  **Purpose:** Verifies that a valid token is present in cookies during logout.
-  **Validation:** Uses JWT to decode and verify the token.

#### **Error Cases:**

-  **Token Not Found:**
   ```json
   {
   	"error": "Token Absent"
   }
   ```
-  **Invalid Token:**
   ```json
   {
   	"error": "Invalid token"
   }
   ```

Here is a detailed Markdown documentation for your `admin` routes that you can directly place in your `endpoint.md` file:

---

# **Admin Endpoints Documentation**

### **1. Get All Reservations**

-  **URL:** `/api/admin/reservations`
-  **Method:** `GET`
-  **Description:** Retrieves a list of all reservations along with their related showtimes, movies, and users.

#### **Middleware:**

-  **`isAdmin`**: Ensures the request is authorized by checking if the user is an admin.

#### **Response Example:**

```json
[
	{
		"ID": "res123",
		"user": { "ID": "user456", "name": "Alice" },
		"showtime": {
			"ID": "show123",
			"startTime": "2024-10-23T17:00:00Z",
			"movie": { "ID": "mov789", "name": "Inception" }
		},
		"seats": 2,
		"createdAt": "2024-10-15T14:30:00Z"
	}
]
```

---

### **2. Add a Movie**

-  **URL:** `/api/admin/movies`
-  **Method:** `POST`
-  **Description:** Adds a new movie to the database.

#### **Request Headers:**

-  **Content-Type:** `multipart/form-data`
-  **Cookies:**
   -  `token` (for session management)

#### **Request Body Example:**

```json
{
  "name": "Inception",
  "description": "A mind-bending thriller",
  "duration": 148,
  "genres": ["Sci-Fi", "Thriller"],
  "director": "Christopher Nolan",
  "releaseDate": "2010-07-16",
  "posterImageURL": (Image File)
}
```

#### **Middleware:**

-  **`isAdmin`**: Verifies the user is an admin.
-  **`uploadImageMiddleware`**: Handles the image upload to Cloudinary.
-  **`authenticateMovieDetails`**: Validates the movie data using `joi`.

#### **Response Example:**

```json
{
	"ID": "mov123",
	"name": "Inception",
	"duration": 148,
	"releaseDate": "2010-07-16",
	"posterImageURL": "https://cloudinary.com/inception.jpg"
}
```

---

### **3. Update a Movie**

-  **URL:** `/api/admin/movies/:movieID`
-  **Method:** `PUT`
-  **Description:** Updates details of an existing movie.

#### **Request Headers:**

-  **Content-Type:** `multipart/form-data`

#### **Request Body Example:**

```json
{
	"name": "Inception - Director's Cut",
	"description": "Extended version",
	"genres": ["Sci-Fi", "Thriller"],
	"duration": 152,
	"releaseDate": "2010-07-16"
}
```

#### **Middleware:**

-  **`isAdmin`**: Confirms the user is an admin.
-  **`uploadImageMiddleware`**: Optionally updates the movie poster.
-  **`authenticateMovieDetails`**: Validates the updated details.

#### **Response Example:**

```json
{
	"ID": "mov123",
	"name": "Inception - Director's Cut",
	"duration": 152,
	"releaseDate": "2010-07-16",
	"genres": ["Sci-Fi", "Thriller"]
}
```

---

### **4. Delete a Movie**

-  **URL:** `/api/admin/movies/:movieID`
-  **Method:** `DELETE`
-  **Description:** Deletes a movie from the database.

#### **Middleware:**

-  **`isAdmin`**: Ensures the user is authorized.

#### **Response Example:**

```json
{
	"message": "Movie deleted successfully"
}
```

---

### **5. Add a Showtime**

-  **URL:** `/api/admin/movies/:movieID/showtime`
-  **Method:** `POST`
-  **Description:** Adds a new showtime for a specific movie.

#### **Request Body Example:**

```json
{
	"startTime": "2024-10-25T10:00:00Z",
	"endTime": "2024-10-25T12:30:00Z",
	"seatsAvailable": 100
}
```

#### **Middleware:**

-  **`isAdmin`**: Checks if the user is an admin.

#### **Response Example:**

```json
{
	"ID": "show123",
	"startTime": "2024-10-25T10:00:00Z",
	"endTime": "2024-10-25T12:30:00Z",
	"seatsAvailable": 100,
	"movieID": "mov789"
}
```

---

### **6. Update a Showtime**

-  **URL:** `/api/admin/movies/:movieID/showtime/:showtimeID`
-  **Method:** `PUT`
-  **Description:** Updates an existing showtime.

#### **Request Body Example:**

```json
{
	"startTime": "2024-10-25T11:00:00Z",
	"endTime": "2024-10-25T13:30:00Z",
	"seatsAvailable": 80
}
```

#### **Middleware:**

-  **`isAdmin`**: Ensures admin access.

#### **Response Example:**

```json
{
	"ID": "show123",
	"startTime": "2024-10-25T11:00:00Z",
	"endTime": "2024-10-25T13:30:00Z",
	"seatsAvailable": 80
}
```

---

### **7. Delete a Showtime**

-  **URL:** `/api/admin/movies/:movieID/showtime/:showtimeID`
-  **Method:** `DELETE`
-  **Description:** Deletes a specific showtime.

#### **Middleware:**

-  **`isAdmin`**: Ensures admin privileges.

#### **Response Example:**

```json
{
	"message": "Showtime deleted successfully"
}
```

---

### **8. Promote User to Admin**

-  **URL:** `/api/admin/promote/:userID`
-  **Method:** `PATCH`
-  **Description:** Promotes a regular user to admin.

#### **Middleware:**

-  **`isAdmin`**: Confirms the request is made by an admin.

#### **Response Example:**

```json
{
	"ID": "user456",
	"name": "Alice",
	"role": "ADMIN"
}
```

---

### **Middleware Details**

1. **`isAdmin` Middleware**

   -  **Purpose:**  
      Ensures only admin users can access the routes.
   -  **How it works:**
      -  Verifies the presence of a valid JWT token.
      -  Checks if the user role is `ADMIN`.
      -  If unauthorized, returns an error.

2. **`authenticateMovieDetails` Middleware**

   -  **Purpose:**  
      Validates and sanitizes movie details in the request.
   -  **How it works:**
      -  Uses `joi` to enforce schema validation.
      -  Ensures fields like `name`, `duration`, and `releaseDate` are correctly formatted.

3. **`uploadImageMiddleware`**
   -  **Purpose:**  
      Uploads poster images to Cloudinary.
   -  **How it works:**
      -  Uses `multer` for handling file uploads.
      -  Uploads the image to Cloudinary and stores the secure URL in `req.body.posterImageURL`.
