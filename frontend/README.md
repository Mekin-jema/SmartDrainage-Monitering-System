# Ambalay Map - Frontend Contribution (Internship)

## Project Overview
The **Ambalay Map** is a web-based application developed as part of an internship program. This application focuses on providing an interactive map experience with **route rendering**, **optimized route calculations**, and **turn-by-turn navigation** using the **Open Source Routing Machine (OSRM)** API. The goal of the project is to provide users with accurate, real-time navigation capabilities, leveraging live traffic data and advanced mapping features.

### Key Features
This project comes with a variety of features designed to enhance user experience and provide real-time, dynamic mapping:

#### 1. **Advanced UI Enhancements**
   - **Auto-suggestions for Search Bar**  
     The search bar provides **predictive text suggestions**, helping users quickly find destinations or locations. This feature utilizes **Nominatim**, an open-source search engine, or can be customized with other APIs based on the requirements.

   - **Draggable Markers**  
     Users can easily set **origin** and **destination** points on the map by dragging the markers around. This allows for intuitive navigation setup and the flexibility to change routes quickly.

   - **Interactive Layers**  
     The map can display multiple **layers** on top of the base map, including:
     - **Points of Interest (POI)** such as restaurants, landmarks, and shops.
     - **Traffic conditions** showing the flow of vehicles (e.g., heavy, moderate, or light).
     - **Elevation data**, giving insights into the geographical features of the area.

#### 2. **Responsive Design**
   - **Optimized UI for Multiple Devices**  
     The user interface (UI) is fully optimized for various devices, including **desktop**, **mobile**, and **tablet**. This ensures that the map remains accessible and functional regardless of the user's screen size.
     
   - **Support for Touch Gestures**  
     On **touch-enabled devices** (like smartphones and tablets), the app supports basic gestures such as **pinch-to-zoom** and **swipe-to-pan**. These gestures allow users to interact with the map seamlessly.

#### 3. **Custom Map Styles**
   - **Branded Map Themes**  
     The map can be customized with different visual themes. These include themes like **satellite**, **terrain**, and **dark mode**, which are made possible using **MapLibre**'s style specifications. This allows users to choose the theme that suits their preferences.

   - **Dynamic Styling**  
     These styles can be dynamically switched based on user preferences or environmental conditions, improving the overall visual appeal and usability of the app.

#### 4. **Localization & Internationalization**
   - **Multi-language Support**  
     The application supports various languages for **map labels** and **UI elements**. Users can interact with the application in their preferred language, making it globally accessible.

   - **Right-to-Left (RTL) Text Support**  
     The app is designed to support **right-to-left languages**, such as **Arabic**, to accommodate users from regions where such scripts are used. This includes proper layout and text alignment.

#### 5. **Live Traffic Data Integration**
Live traffic data is critical for accurate route planning, especially in congested urban areas. This feature works as follows:

1. **Choose a Traffic Data Provider**  
   The **HERE API** is used for live traffic updates, ensuring that the map reflects real-time road conditions. Be sure to configure the appropriate **API keys** and licensing for access.

2. **Integrate Traffic Data into Routing**  
   The backend service periodically fetches traffic data from **HERE** and formats it for the **Valhalla** routing engine, which processes the traffic conditions and adjusts routes accordingly.

3. **Dynamic Routing Based on Traffic**  
   The route calculation logic adjusts dynamically based on the current traffic conditions. This ensures that the most efficient route is always chosen, even if the traffic situation changes. 
   
   - **WebSockets** or **polling** are used to fetch traffic updates at regular intervals. WebSockets allow real-time push notifications, while polling fetches updates periodically.

#### 6. **Additional Enhancements**
   - **Offline Map Support**  
     Using **PMTiles** and **Valhalla Tiles**, the app can operate **offline**. This feature is particularly useful in regions with limited or no internet connectivity.

   - **Turn-by-Turn Voice Guidance**  
     Provides **voice-based navigation** that triggers audio guidance when the user is approaching a maneuver or turn. This ensures that users are always informed about the next step in their journey, even if they are not actively looking at the screen.

   - **Shortest Path Visualization**  
     The app visualizes the **shortest path** to the destination on the map, showing all intermediate steps, road conditions, and potential hazards along the way.

---

## Repository Structure
This project follows a clear, structured branching model to facilitate collaborative development. Here’s an overview of the main branches:

- **main**: The default and production-ready branch. Contains the stable version of the codebase.
- **auth-form**: This branch contains UI components related to user authentication (login, signup, etc.).
- **dashboard-ui**: This branch is dedicated to the development of the dashboard and the core map components, including the route rendering and visualization functionality.

---


## Getting Started
### Clone the Repository
To set up the project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/Amba-Maps/fe_main_mekin.git
    cd frontend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    docker compose up
    npm run dev
    ```

