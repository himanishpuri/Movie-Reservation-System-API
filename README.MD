# Project URL

[URL](https://roadmap.sh/projects/movie-reservation-system)

---

## **Overview**

This API provides administrative functionalities to manage movies, showtimes, user roles, and reservations for a movie management system. All routes are secured and accessible only to users with an `ADMIN` role.

## **Technologies Used**

-  **Node.js**: JavaScript runtime for building server-side applications.
-  **Express**: Web framework for Node.js to build APIs.
-  **Prisma**: ORM for interacting with the database.
-  **Cloudinary**: Image hosting and management service for uploading movie posters.
-  **Multer**: Middleware for handling `multipart/form-data`, primarily for file uploads.
-  **Joi**: Schema description language and data validator for JavaScript.
-  **bcrypt:** password hash

## All Endpoints

[ENDPOINT.MD](https://github.com/himanishpuri/Movie-Reservation-System-API/blob/main/ENDPOINT.MD)

## **Installation**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/himanishpuri/Movie-Reservation-System-API.git
   cd Movie-Reservation-System-API
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create an `.env` file, using the variables names from `.env.example`**

4. **Run the Application**

   ```bash
   npm run dev
   ```
