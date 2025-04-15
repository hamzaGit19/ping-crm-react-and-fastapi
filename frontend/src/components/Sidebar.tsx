import { Box, VStack, Link, Text } from "@chakra-ui/react"
import { Link as RouterLink, useLocation } from "react-router-dom"

const Sidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/companies", label: "Companies" },
    { path: "/contacts", label: "Contacts" },
  ]

  return (
    <Box
      as="nav"
      pos="fixed"
      left="0"
      h="100vh"
      w="64"
      bg="gray.800"
      color="white"
      py={8}
    >
      <VStack spacing={2} align="stretch">
        {links.map(({ path, label }) => (
          <Link
            key={path}
            as={RouterLink}
            to={path}
            px={8}
            py={3}
            bg={isActive(path) ? "gray.700" : "transparent"}
            _hover={{ bg: "gray.700" }}
            transition="background-color 0.2s"
          >
            <Text>{label}</Text>
          </Link>
        ))}
      </VStack>
    </Box>
  )
}

export default Sidebar