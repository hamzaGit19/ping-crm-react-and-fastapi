import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Spinner,
  Center,
  Text
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { companyService } from "../../services/companyService"

interface Company {
  id: number
  name: string
  city: string
  phone: string
  created_at: string
  updated_at: string
}

const CompanyList = () => {
  const { data: companies, isLoading, isError } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: companyService.getAll
  })

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (isError) {
    return (
      <Box p={4} bg="red.100" color="red.700" rounded="md">
        <Text>Error loading companies</Text>
      </Box>
    )
  }

  return (
    <Box bg="white" rounded="lg" shadow="md" p={6}>
      <Heading size="lg" mb={6}>Companies</Heading>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>City</Th>
            <Th>Phone</Th>
          </Tr>
        </Thead>
        <Tbody>
          {companies?.map((company) => (
            <Tr key={company.id}>
              <Td>{company.name}</Td>
              <Td>{company.city}</Td>
              <Td>{company.phone}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default CompanyList