import { Route, Routes, Navigate } from "react-router-dom"
import jwt from "jwt-decode"

import Signup from "./components/Signup"
import Login from "./components/Login"

import Main from "./components/Main"
import Rooms from "./components/Rooms"
import Reservations from "./components/Reservations"
import EditReservation from "./components/EditReservation"
import AddReservation from "./components/AddReservation"
import MainAdmin from "./components/MainAdmin"

function App() {
  const user = localStorage.getItem("token")
  let decode = null
  if(user)
    decode = jwt(user)
  return (
    
    <Routes>
      {user && decode.type == "USER" && <Route path="/" exact element={<Main />} />}
      {user && decode.type == "USER" && <Route path="/rooms" exact element={<Rooms />} />}
      {user && decode.type == "USER" && <Route path="/reservations" exact element={<Reservations />} />}
      {user && decode.type == "USER" && <Route path="/reservations/edit" exact element={<EditReservation />} />}
      {user && decode.type == "USER" && <Route path="/reservations/add" exact element={<AddReservation />} />}
      {user && decode.type == "ADMIN" && <Route path="/" exact element={<MainAdmin />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  )
}
export default App