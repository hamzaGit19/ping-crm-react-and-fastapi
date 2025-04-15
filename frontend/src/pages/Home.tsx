import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue, Icon } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../services/dashboardService"
import { BsFillBuildingsFill, BsFillPeopleFill } from "react-icons/bs"

const Home = () => {
  const bgColor = "#434298"
  const accentColor = "white"

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats
  })

  return (
    <Box>
      <Box bg={bgColor} p={6} rounded="lg" shadow="md" mb={6}>
        <Heading size="lg" mb={4}>Welcome to Ping CRM</Heading>
        <Text>Your dashboard overview appears below.</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Companies Stat */}
        <Box
          bg={bgColor}
          p={6}
          rounded="lg"
          shadow="md"
          position="relative"
          overflow="hidden"
          borderTop="4px solid"
          borderColor={accentColor}
        >
          <Box
            position="absolute"
            top={4}
            right={4}
            opacity={0.8}
          >
            <Icon as={BsFillBuildingsFill} boxSize={6} color={accentColor} />
          </Box>
          <Stat>
            <StatLabel fontSize="lg" color="gray.500">Total Companies</StatLabel>
            <StatNumber fontSize="4xl" fontWeight="bold" color={accentColor}>
              {isLoading ? "-" : stats?.total_companies || 0}
            </StatNumber>
            <StatHelpText>
              Active business partners
            </StatHelpText>
          </Stat>
        </Box>

        {/* Contacts Stat */}
        <Box
          bg={bgColor}
          p={6}
          rounded="lg"
          shadow="md"
          position="relative"
          overflow="hidden"
          borderTop="4px solid"
          borderColor={accentColor}
        >
          <Box
            position="absolute"
            top={4}
            right={4}
            opacity={0.8}
          >
            <Icon as={BsFillPeopleFill} boxSize={6} color={accentColor} />
          </Box>
          <Stat>
            <StatLabel fontSize="lg" color="gray.500">Total Contacts</StatLabel>
            <StatNumber fontSize="4xl" fontWeight="bold" color={accentColor}>
              {isLoading ? "-" : stats?.total_contacts || 0}
            </StatNumber>
            <StatHelpText>
              Registered individuals
            </StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export default Home