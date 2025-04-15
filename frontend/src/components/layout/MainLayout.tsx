import { Box } from "@chakra-ui/react"
import { ReactNode } from "react"
import Sidebar from "./Sidebar"

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box display="flex" minH="100vh" bg="gray.100">
      <Sidebar />
      <Box flex="1" p={6}>
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout