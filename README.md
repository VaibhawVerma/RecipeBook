# RecipeBook - MERN Application

RecipeBook is a modern, feature-rich web application that allows users to discover, create, and share recipes.
The project showcases a complete development and deployment workflow, from user authentication to cloud-based image hosting and external API integration. It's built with the MERN stack.

## Key Features

-   **Secure User Authentication:** Full JWT-based authentication with password hashing, including registration, login, and protected routes.
-   **Complete Recipe CRUD:** Users can create, read, update, and delete their own recipes.
-   **Cloud Image Uploads:** Seamless image uploads for recipes, managed by Cloudinary with client-side compression for optimal performance.
-   **Dynamic Discovery:** A powerful "Discover" page featuring:
    -   **Live Search** with autocomplete suggestions.
    -   **Category Filtering** and **Pagination**.
    -   **External API Integration** with TheMealDB to supplement search results.
-   **Community Interaction:**
    -   Interactive **5-star rating** system.
    -   **Commenting** on recipe pages.
    -   Public **User Profiles** showcasing all recipes created by a user.
    -   **Favorites/Bookmarking** system to save recipes.
-   **Responsive UI:** A clean, modern, and fully responsive user interface built with **Tailwind CSS**.

## Tech Stack

#### Frontend
-   **React.js** (with Hooks & Context API)
-   **React Router**
-   **Tailwind CSS**
-   **Axios**

#### Backend
-   **Node.js**
-   **Express.js**
-   **MongoDB** (with Mongoose)
-   **JSON Web Tokens (JWT)**
-   **Cloudinary** (for Image Storage)
-   **Multer** (for File Handling)
