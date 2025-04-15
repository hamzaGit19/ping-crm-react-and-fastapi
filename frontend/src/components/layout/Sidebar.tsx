import { Box, VStack, Link as ChakraLink, Text } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const Sidebar = () => {
  return (
    <Box w="64" minH="100vh" bg="#3F3F94" color="white">
      <Box p={6}>
        <Text fontSize="xl" fontWeight="bold" mb={8}>
          <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            Ping CRM
          </ChakraLink>
        </Text>

        <VStack spacing={2} align="stretch">
          <ChakraLink
            as={RouterLink}
            to="/"
            py={2}
            px={4}
            _hover={{ bg: "whiteAlpha.200", textDecoration: 'none' }}
            borderRadius="md"
          >
            Dashboard
          </ChakraLink>

          <ChakraLink
            as={RouterLink}
            to="/companies"
            py={2}
            px={4}
            _hover={{ bg: "whiteAlpha.200", textDecoration: 'none' }}
            borderRadius="md"
          >
            Companies
          </ChakraLink>

          <ChakraLink
            as={RouterLink}
            to="/contacts"
            py={2}
            px={4}
            _hover={{ bg: "whiteAlpha.200", textDecoration: 'none' }}
            borderRadius="md"
          >
            Contacts
          </ChakraLink>

        </VStack>
      </Box>
    </Box>
  )
}

export default Sidebar