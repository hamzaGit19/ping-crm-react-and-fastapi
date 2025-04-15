import { Box, Heading, Text } from "@chakra-ui/react"

const Home = () => {
  return (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <Heading size="lg" mb={4}>Welcome to Ping CRM</Heading>
      <Text>Your dashboard overview will appear here.</Text>
    </Box>
  )
}

export default Home