import { Routes, Route } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout"
import Home from "./pages/Home"
import CompanyList from "./pages/companies/CompanyList"
import ContactList from "./pages/contacts/ContactList"

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/contacts" element={<ContactList />} />
      </Routes>
    </MainLayout>
  )
}

export default App
