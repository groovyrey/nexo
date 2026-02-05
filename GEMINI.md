## Project Overview

This is a Next.js application that provides an AI chatbot assistant called "Nexo". The application uses Firebase for authentication (Google sign-in) and a Hugging Face model (deepseek-ai/DeepSeek-V3.2) for the chat functionality, accessed through the OpenAI client library. The frontend is built with React, Material-UI for components, and Tailwind CSS for styling.

## Building and Running

To get the application running locally, you'll need to have Node.js and npm installed.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the application on [http://localhost:3000](http://localhost:3000).

3.  **Build for production:**
    ```bash
    npm run build
    ```

4.  **Start the production server:**
    ```bash
    npm run start
    ```

5.  **Lint the code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Authentication:** The application uses Firebase Authentication with Google as the provider. The authentication logic is located in `lib/auth.ts`.
*   **API:** The chat API is located at `app/api/nexo/route.ts`. It uses the Hugging Face model `deepseek-ai/DeepSeek-V3.2` via the OpenAI client library.
*   **Styling:** The application uses a combination of Material-UI components and Tailwind CSS.
*   **Linting:** The project uses ESLint for code linting.
*   **Environment Variables:** The application requires a `HF_TOKEN` environment variable for the Hugging Face API.
