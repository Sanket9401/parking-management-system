# 🚗 Parking Management System (MERN Stack)

A full-stack Parking Management System with vehicle entry, slot allocation, VIP re-entry handling, and admin-level reassignment and slot release features.

---

## 🔧 Tech Stack

### 📦 Backend:
- Node.js
- Express.js
- MongoDB (with Mongoose)

### 🎨 Frontend:
- React.js (Vite)
- React Query (`@tanstack/react-query`)

---

## 🧰 Prerequisites

Make sure the following are installed:

- **[Node.js](https://nodejs.org/en/download/)** (v22 recommended)
- **[MongoDB](https://www.mongodb.com/try/download/community)**
- **[Git](https://git-scm.com/downloads)**

---

### 🔍 Backend Logic

The backend handles intelligent parking slot assignment using the following rules:

✅ Slot Assignment
Vehicles are assigned to the nearest available slot based on their type: (VIP/ emergency can park anywhere)

small vehicles → small, medium, or large slots (configurable) means small vehcils can park in all the slots 

medium → medium or large slots (configurable) means medium vehicles can park only in medium and large slots

large → only large slots (configurable)

Slot availability is checked using MongoDB with filtering and prioritization.

✅Assumptions:

1. Vehicle Number is assumed to be provided in the request payload, so that if we have to implement any PUC validation, T-permit, Insurance validations. We can populate vehicle data from vehicle number by fetching data from third party services, although it was not explicitly mentioned in the original problem statement.

2. Admin role is selected manually via a UI dropdown — no authentication/authorization is implemented for now.

3. All slot and re-entry data is stored in MongoDB using Mongoose models.

4. Re-entry restriction is currently set to 60 minutes but is configurable.

✅ Collections used:

1. ParkingSlot : for storing all the slot related data (e.g. parked vehicle, slot_id, is_occupied, customer_type, level:L1 or L2)
2. Parking Level : for storing parking levels related data (e.g. capacity of level, level_id, small, medium, large available slots in that level)(configurable)
3. ReEntryLog : for storing vehicle's data, exit time for the validation while slot re-assignment
4. Vehicle : for storing all checked in vehicles data for the records
5. Slot Type Distribution per Level:  
Each parking level's total slot capacity is divided into:  
1/3 small slots + remainder slot  
1/3 medium slots  
1/3 large slots

Example: In this project I have assiged 10 slots per level:
4 small slots  (1/3 of capacity + remainder)  
3 medium slots (1/3 of capacity)  
3 large slots  (1/3 of capacity  

📊 The slot capacity per level is configurable and used while seeding or initializing the system.

🔁 Re-entry Restriction Logic
A regular vehicle that exited less than 60 minutes ago is not allowed to re-enter the same slot.

A VIP vehicle can re-enter the same slot within 60 minutes.

This logic is enforced using the ReEntryLog collection

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Sanket9401/parking-management-system.git
cd parking-management-system
```

🛠️ Backend Setup  
📍 Navigate to the backend folder:
```cd backend```

📦 Install dependencies:
```npm install```

▶️ Run backend server:
```npm run dev```

💻 Frontend Setup  
📍 Navigate to the frontend folder:
```cd ../frontend```

📦 Install dependencies:
```npm install```

▶️ Run frontend server:
```npm run dev```

Frontend will run on: http://localhost:5173

🔑 Roles  
User: Can request slot via form

Admin: Can reassign VIP slots, empty occupied slots manually

To switch roles, use the dropdown in UI.

📦 Cases which are covered ==>

1. Efficient slot allocation for vehicles

https://github.com/user-attachments/assets/3b60b687-6131-4c18-9b96-625a9fbd5ed0

2. No same slot allotment for regular vehicles within 60 min(configurable)

https://github.com/user-attachments/assets/368d0191-b5ad-41d6-a7e0-56b8feeaa229

3. Same slot allotment for VIP/emergency customer type within 60 min(configurable)

https://github.com/user-attachments/assets/2e95b4f8-6d44-48bc-968c-5287db09c10f

4. In case VIP/ emergency parked vehicle other than alloted slot, then reassign slot to VIP/emergency (only admin can do this)

https://github.com/user-attachments/assets/7c1d91dc-2494-4f93-b2f0-256b35ff4997

5. No available slots

https://github.com/user-attachments/assets/204436fa-252b-4381-af8c-9851fc808964

6. Exit/empty slot after vehicle goes out from parking slot

https://github.com/user-attachments/assets/f024f4e2-7439-409e-9636-2988cf80e543

