# Chat-app

# Documentation for Flask-SocketIO Chat Application

This document provides a comprehensive guide to the Flask-SocketIO chat application. The app implements features such as user authentication, chat messaging, WebSocket communication, and message read status updates.

---

## **Overview**

**Core Features**

----------------------------------------------------------------------------------------------------------------
User Registration and Login

Users and admins can register with their name, email, password, and role (admin or user).
During login, the system verifies credentials and issues a JWT token for secure access, which is used in subsequent API and WebSocket requests.
Role-Based Access Control

Admins can view a list of users, and users can see available admins for chatting.
The JWT token identifies the logged-in user’s role and restricts access accordingly.
Real-Time Messaging with Socket.IO

Real-time chat is enabled using Socket.IO, allowing users and admins to exchange messages instantly.
Each user is assigned a unique WebSocket room based on their ID for direct communication.
Database Management

SQLAlchemy ORM manages the database, storing user and chat data.
The Chat model tracks messages, including sender and receiver IDs, content, timestamps, and read statuses.
Message Handling

When a message is sent, it is stored in the database and broadcasted to the recipient’s WebSocket room in real-time.
Messages are marked as read when viewed by the recipient, and this status is updated in the database.
Frontend Interaction

The frontend is built with Vue.js, which displays dynamic chat histories and allows users to send/receive messages.
The app features separate dashboards for Admin and User roles, where they can select chat partners and view past conversations.
Authentication and Security

All API and WebSocket requests are secured by JWT tokens, ensuring that only authorized users can access specific routes and chat rooms.
CORS settings are configured to allow frontend access from trusted domains.


----------------------------------------------------------------------------------------------------------------

## **1. Setup**
----------------------------------------------------------------------------------------------------------------
To install the requirements for setup
 use : pip install -r requirements.txt
----------------------------------------------------------------------------------------------------------------
### **Requirements**
- Python 3.x
- Flask
- Flask-SocketIO
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-CORS
- Werkzeug
----------------------------------------------------------------------------------------------------------------
## **2. Application Architecture**
----------------------------------------------------------------------------------------------------------------
### **Models**
----------------------------------------------------------------------------------------------------------------
#### **User Model**

Represents users in the system.
- `id`: Unique identifier for the user.
- `name`: Name of the user.
- `email`: Email address (unique).
- `password`: Hashed password.
- `role`: User role (`admin` or `user`).
----------------------------------------------------------------------------------------------------------------
#### **Chat Model**
Represents chat messages.
- `id`: Unique identifier for the message.
- `sender_id`: ID of the sender.
- `receiver_id`: ID of the receiver.
- `content`: Message content.
- `timestamp`: Message timestamp (defaults to current time).
- `read_status`: Boolean indicating whether the message has been read.

----------------------------------------------------------------------------------------------------------------

## **3. API Endpoints**

### **Authentication**
#### **Register User**
- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "user"
  }
  ```
- **Response:**
  ```json
  {
    "msg": "Registration successful"
  }
  ```
----------------------------------------------------------------------------------------------------------------
#### **Login User**
- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns access and refresh tokens.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword",
    "role": "user"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "jwt-token",
    "refresh_token": "refresh-jwt-token",
    "name": "John Doe"
  }
  ```

----------------------------------------------------------------------------------------------------------------

### **Chat**
#### **Get Admins**
- **Endpoint:** `/chat/admins`
- **Method:** `GET`
- **Description:** Retrieves a list of all admins.
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Admin One",
      "role": "admin"
    }
  ]
  ```
----------------------------------------------------------------------------------------------------------------
#### **Get Users**
- **Endpoint:** `/chat/users`
- **Method:** `GET`
- **Description:** Retrieves a list of all users.
- **Response:**
  ```json
  [
    {
      "id": 2,
      "name": "User One",
      "role": "user"
    }
  ]
  ```
----------------------------------------------------------------------------------------------------------------
#### **Get Messages**
- **Endpoint:** `/chat/messages/<receiver_id>`
- **Method:** `GET`
- **Authentication:** Required
- **Description:** Retrieves chat messages between the current user and a specified receiver.
- **Response:**
  ```json
  [
    {
      "id": 1,
      "sender_id": 2,
      "receiver_id": 1,
      "content": "Hello!",
      "timestamp": "2024-11-27T12:00:00",
      "read_status": false
    }
  ]
  ```
----------------------------------------------------------------------------------------------------------------
#### **Get Loaded Messages**
- **Endpoint:** `/chat/loaded`
- **Method:** `GET`
- **Authentication:** Required
- **Description:** Retrieves all messages involving the current user.

----------------------------------------------------------------------------------------------------------------

## **4. WebSocket Events**

### **Overview**
WebSocket events use Flask-SocketIO to enable real-time communication. JWT authentication is verified for secure access.

### **Event Documentation**

#### **Send Message**
- **Event Name:** `smessage`
- **Payload:**
  ```json
  {
    "receiver_id": 2,
    "content": "Hello!"
  }
  ```
- **Response Broadcast:**
  ```json
  {
    "sender_id": 1,
    "receiver_id": 2,
    "content": "Hello!",
    "timestamp": "2024-11-27T12:00:00",
    "read_status": false
  }
  ```

#### **Mark Message as Read**
- **Event Name:** `mark_message_read`
- **Payload:**
  ```json
  {
    "sender_id": 1
  }
  ```
- **Response Broadcast:**
  ```json
  {
    "sender_id": 1,
    "receiver_id": 2
  }
  ```

#### **Connection Events**
- **Connect**
  - Emits a confirmation and joins the user-specific room.
- **Disconnect**
  - Logs when a client disconnects.

----------------------------------------------------------------------------------------------------------------

## **5. Database Schema**
### **User Table**
| Column      | Type       | Notes           |
|-------------|------------|-----------------|
| `id`        | Integer    | Primary Key     |
| `name`      | String(100)| Required        |
| `email`     | String(100)| Unique, Required|
| `password`  | String(200)| Required        |
| `role`      | String(20) | Required        |

### **Chat Table**
| Column       | Type       | Notes           |
|--------------|------------|-----------------|
| `id`         | Integer    | Primary Key     |
| `sender_id`  | Integer    | Foreign Key     |
| `receiver_id`| Integer    | Foreign Key     |
| `content`    | Text       | Required        |
| `timestamp`  | DateTime   | Defaults to UTC |
| `read_status`| Boolean    | Defaults to False|

----------------------------------------------------------------------------------------------------------------

## **6. Execution**

### **Running the App**
1. Ensure the database is set up:
   ```bash
   flask db upgrade
   ```
2. Start the server:
   ```bash
   python app.py
   ```
3. Access the app at:
   - Flask API: `http://localhost:5000`
   - WebSocket: `ws://localhost:5000`

----------------------------------------------------------------------------------------------------------------

This documentation covers the application structure, API endpoints, WebSocket events, and more, offering a clear understanding of the Flask-SocketIO chat application.