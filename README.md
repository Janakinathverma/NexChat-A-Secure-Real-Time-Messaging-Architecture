# NexChat: A Secure Real-Time Messaging Architecture

NexChat is a high-performance, full-stack real-time communication platform built using the MERN stack. Designed with scalability and security in mind, it leverages WebSockets for instantaneous data transfer and Docker for streamlined containerization and deployment.

## 🚀 Key Features

  - **Real-Time Messaging:** Instantaneous communication powered by **Socket.io**.
  - **Secure Authentication:** Robust user login and registration system.
  - **Dynamic UI:** Responsive and interactive frontend built with **React**.
  - **Scalable Architecture:** Containerized using **Docker** for consistent environments across development and production.
  - **Efficient State Management:** Optimized data handling for a seamless user experience.

## 🛠️ Tech Stack

  - **Frontend:** React.js
  - **Backend:** Node.js, Express.js
  - **Database:** MongoDB
  - **Real-Time Engine:** Socket.io
  - **DevOps:** Docker, Docker Compose
  - **Package Management:** Yarn / NPM

-----

## ⚙️ Installation & Setup

### Prerequisites

Ensure you have the following installed on your system:

  - [Node.js](https://www.google.com/search?q=https://nodejs.org/)
  - [MongoDB](https://www.google.com/search?q=https://www.mongodb.com/)
  - [Docker](https://www.google.com/search?q=https://www.docker.com/) (Optional, for containerized setup)

### 1\. Manual Installation

#### Clone the Repository

```bash
git clone https://github.com/koolkishan/chat-app-react-nodejs
cd chat-app-react-nodejs
```

#### Configure Environment Variables

Rename the `.env.example` files to `.env` in both the `public` and `server` directories:

```bash
# Frontend env
cd public && mv .env.example .env && cd ..

# Backend env
cd server && mv .env.example .env && cd ..
```

#### Install Dependencies

```bash
# Install server dependencies
cd server && yarn install && cd ..

# Install frontend dependencies
cd public && yarn install && cd ..
```

#### Run the Application

1.  **Start the Backend:**
    ```bash
    cd server
    yarn start
    ```
2.  **Start the Frontend (New Terminal):**
    ```bash
    cd public
    yarn start
    ```

-----

### 2\. Dockerized Installation (Recommended)

To deploy NexChat using containerization, ensure Docker and Docker Compose are running, then execute the following in the root directory:

```bash
# Build the images without cache
docker compose build --no-cache

# Launch the containers
docker compose up
```

Once the containers are healthy, access the application at `http://localhost:3000`.

-----

## 🏗️ Architecture Detail

NexChat follows a microservices-inspired structure where the frontend and backend are decoupled. This allows for independent scaling of the messaging engine and the UI components. The integration of Docker ensures that all dependencies, including the environment configurations, remain consistent across different local machines and cloud providers.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.