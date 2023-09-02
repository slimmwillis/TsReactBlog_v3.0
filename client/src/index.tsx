import React from "react"
import ReactDOM from "react-dom/client"
import "bootstrap/dist/css/bootstrap.min.css"
import App from "./App" // Change this to your main component
import axios from "axios"

axios.defaults.baseURL = process.env.REACT_APP_API_URL

const rootElement = document.getElementById("root")
if (!rootElement) {
  throw new Error("Root element not found")
}

const root = ReactDOM.createRoot(rootElement) // Create a root instance
root.render(<App />)
