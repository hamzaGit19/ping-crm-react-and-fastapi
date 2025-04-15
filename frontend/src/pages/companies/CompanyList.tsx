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
  Text,
  Button,
  HStack,
  IconButton,
  useDisclosure
} from "@chakra-ui/react"
import { EditIcon } from "@chakra-ui/icons"
import { useQuery } from "@tanstack/react-query"
import { companyService } from "../../services/companyService"
import CompanyModal from "./CompanyModal"
import { useState } from "react"

interface Company {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  created_at: string
  updated_at: string
}

const CompanyList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>()
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  const { data: companies, isLoading, isError } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: companyService.getAll
  })

  const handleCreate = () => {
    setMode('create')
    setSelectedCompany(undefined)
    onOpen()
  }

  const handleEdit = (company: Company) => {
    setMode('edit')
    setSelectedCompany(company)
    onOpen()
  }

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
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Companies</Heading>
        <Button colorScheme="blue" onClick={handleCreate}>
          New Company
        </Button>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>City</Th>
            <Th>Province</Th>
            <Th>Country</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {companies?.map((company) => (
            <Tr key={company.id}>
              <Td>{company.name}</Td>
              <Td>{company.email}</Td>
              <Td>{company.phone}</Td>
              <Td>{company.city}</Td>
              <Td>{company.province}</Td>
              <Td>{company.country}</Td>
              <Td>
                <IconButton
                  aria-label="Edit company"
                  icon={<EditIcon />}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleEdit(company)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <CompanyModal
        isOpen={isOpen}
        onClose={onClose}
        company={selectedCompany}
        mode={mode}
      />
    </Box>
  )
}

export default CompanyList