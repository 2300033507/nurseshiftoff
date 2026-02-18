# AI-Enhanced Nursing App - Backend

Node.js + Express backend with **MySQL**, featuring AI-based triage and doctor assignment.

## Prerequisites
- Node.js installed
- **MySQL Server** installed and running
- A MySQL database created (default name: `ai_nursing_db`)

## Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Configure Database**:
   Create a `.env` file in the `backend` directory with your MySQL credentials:
   ```env
   DB_NAME=ai_nursing_db
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=localhost
   PORT=5000
   ```

## Running the Server
Start the server with hot-reloading:
```bash
npm run dev
```

The server will:
1. Connect to MySQL.
2. Automatically create tables (`Doctors`, `Patients`, `Assignments`) if they don't exist.
3. Seed initial doctor data.
4. Run on **http://localhost:5000**.

## API Endpoints

### `POST /api/patient`
Submit patient data for triage and assignment.

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 45,
  "symptoms": "chest pain, difficulty breathing",
  "severity": 8,
  "department": "Cardiology"
}
```

**Response:**
```json
{
  "message": "Patient processed successfully",
  "patientId": 1,
  "triageLevel": "Critical",
  "assignedDoctor": {
    "name": "Dr. Jones",
    "specialization": "Cardiology"
  }
}
```
