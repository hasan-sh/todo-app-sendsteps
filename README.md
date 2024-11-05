# Interactive To-Do List Application

This is a full-stack interactive To-Do List application where users can add, edit, mark tasks as completed, delete tasks, and receive AI-based task suggestions.

## Features

- **Task Management**: Add, update, complete, and delete tasks.
- **AI Suggestions**: Get task suggestions based on title and description using a Groq-based AI model (Llama3-70b-8192).
- **Responsive Design**: Built with Material-UI for a seamless user experience across devices.

## Technologies Used

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Node.js, Express, MongoDB
- **AI Integration**: Groq model (Llama3-70b-8192)
- **Testing**: Jest for backend API tests

## Setup and Installation

### Prerequisites/Assumption
- Node.js and npm installed
- MongoDB
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```
2. Install dependencies for both the server and client:
    ```bash
    cd server
    npm install
    cd ../client
    npm install
    ```
3. Configure environment variables:

    - Create a .env file in the server/ dir.
    - Add necessary environment variables such as database credentials and AI API keys.

    > NB: don't forget Groq api key; very easy to get once you sign up!

### Running the App
1. Start the Server:
    ```bash
    cd server
    npm start
    ```

2. Start the Client:
    ```bash
    cd client
    npm start
    ```
3. Access the application at http://localhost:3000.

### API Endpoints
- POST /tasks: Add a new task.
- GET /tasks: Retrieve all tasks.
- PUT /tasks/:id Update a task (e.g., mark as completed).
- DELETE /tasks/:id Delete a task.
- POST /api/suggestions: Get AI-based task suggestions using Groq.

### Testing

```bash
cd server
npm test
```


### Usage Notes

To receive AI suggestions, ensure that autoAiSuggestions is enabled on the client.
Tasks marked as completed are highlighted in a pastel green.

