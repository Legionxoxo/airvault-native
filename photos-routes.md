# Photo Routes Documentation

**Base URL:** `http://localhost:8777` (default port, check your environment configuration)

## Upload Photo

**URL:** `/photos/upload`  
**Method:** POST  
**Content-Type:** multipart/form-data

**Parameters:**

-   Files can be uploaded using any field name
-   Supports multiple file upload, but only processes the first file
-   Accepted file types: Images (generates unique filename with IMG prefix)

**Response:**

```json
// Success Response (200)
{
    "success": true,
    "msg": "File uploaded successfully!"
}

// Error Response (400)
{
    "success": false,
    "msg": "No file uploaded."
}
// or
{
    "success": false,
    "msg": "Could not process uploaded file."
}

// Server Error (500)
{
    "success": false,
    "msg": "Failed to upload file."
}
```

**Description:**  
Handles photo upload to a temporary directory and processes it using the `moveUploadedFiles` function. Files are stored temporarily with unique filenames using timestamp and random suffix (format: IMG-{timestamp}-{random}.{ext}).

## List Photos

**URL:** `/photos/list`  
**Method:** POST  
**Content-Type:** application/json

**Parameters:**

```json
{
    "folder_id": "string" // Optional, defaults to empty string for root folder
}
```

**Response:**

```json
{
    "success": boolean,
    "msg": string,
    "photos": object[] // Array of photo objects with URLs
}
```

**Description:**  
Retrieves a list of photos from the specified folder. The response includes photo objects with URLs constructed using the request's protocol and host. Uses the `listPhotos` function to fetch photos based on the folder_id.

## Serve Photo

**URL:** `/photos/serve/:filename`  
**Method:** GET

**Parameters:**

-   `filename` (URL parameter) - The filename of the photo to serve

**Response:**

-   **Success (200):** Returns the image file with appropriate headers
    -   Content-Type: image/jpeg
    -   Cache-Control: public, max-age=31536000 (1 year cache)
-   **Error (404):** Photo not found
-   **Error (500):** Internal server error

**Response Format (Error):**

```json
{
    "success": false,
    "msg": "Photo not found" // or "Error serving photo" or "Internal server error"
}
```

**Description:**  
Serves individual photo files from the photos root directory. Streams the file directly to the client with appropriate caching headers for optimal performance.

## Serve Thumbnail

**URL:** `/photos/serve/thumbnail/:filename`  
**Method:** GET

**Parameters:**

-   `filename` (URL parameter) - The original filename of the photo (thumbnail will be generated with "thumb-" prefix)

**Response:**

-   **Success (200):** Returns the thumbnail image file
    -   Content-Type: image/jpeg
    -   Cache-Control: public, max-age=31536000 (1 year cache)
-   **Error (404):** Thumbnail not found
-   **Error (500):** Internal server error

**Response Format (Error):**

```json
{
    "success": false,
    "msg": "Thumbnail not found" // or "Error serving thumbnail" or "Internal server error"
}
```

**Description:**  
Serves thumbnail versions of photos. Thumbnails are stored in the `thumbnails` subdirectory with the naming convention `thumb-{originalname}.jpg`. The route automatically converts the original filename to the corresponding thumbnail filename.

## Notes

-   All file serving routes (serve and serve/thumbnail) use streaming for efficient file delivery
-   Temporary files are stored in `/temp` directory during upload processing
-   Thumbnails are stored in `/temp/thumbnails` directory
-   Error handling includes proper HTTP status codes and JSON error responses
-   File serving includes caching headers for improved performance
