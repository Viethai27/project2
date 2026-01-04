import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/customer/HomeCustomer.jsx'
import CustomerLayout from './layouts/customer/customerlayout.jsx'
import Appointment from './pages/customer/Appointment.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
     <Box minH={"100vh"}>
            <Routes>
                <Route path="/" element={
                    <CustomerLayout>
                      <Home />
                    </CustomerLayout>
                    }
                />
                <Route  path="/appointment" element={
                    <CustomerLayout>
                      <Appointment />
                    </CustomerLayout>
                  }     
          />
            </Routes>

        </Box>
  )
}

export default App
