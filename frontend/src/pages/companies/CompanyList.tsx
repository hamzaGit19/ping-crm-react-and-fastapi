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
  useDisclosure,
  ButtonGroup,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip
} from "@chakra-ui/react"
import { EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { companyService } from "../../services/companyService"
import CompanyModal from "./CompanyModal"
import { useState, useEffect } from "react"
import React from "react"
import { useDebounce } from "../../hooks/useDebounce"
import { CompanySideRail } from "../../components/CompanySideRail"
import type { Company, PaginatedResponse } from "../../services/companyService"

const PAGE_SIZES = [10, 20, 30, 50]

const CompanyList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure()
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>()
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500) // 500ms delay
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const toast = useToast()
  const queryClient = useQueryClient()
  const [selectedViewCompany, setSelectedViewCompany] = useState<number | null>(null)

  const { data, isLoading, isError } = useQuery<PaginatedResponse<Company>>({
    queryKey: ['companies', page, pageSize, debouncedSearchTerm],
    queryFn: () => companyService.getAll(page, pageSize, debouncedSearchTerm)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => companyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        title: "Company deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onDeleteClose()
    },
    onError: () => {
      toast({
        title: "Error deleting company",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
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

  const handleDelete = (company: Company) => {
    setSelectedCompany(company)
    onDeleteOpen()
  }

  const confirmDelete = () => {
    if (selectedCompany?.id) {
      deleteMutation.mutate(selectedCompany.id)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value)
    setPageSize(newSize)
    setPage(1) // Reset to first page when changing page size
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    // Remove the immediate page reset - it will happen when the debounced value changes
  }

  // Reset page when debounced search term changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  const handleViewDetails = (companyId: number) => {
    setSelectedViewCompany(companyId)
  }

  const handleCloseSideRail = () => {
    setSelectedViewCompany(null)
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
    <Box bg="white" rounded="lg" shadow="md" p={6} position="relative">
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Companies</Heading>
        <Button colorScheme="blue" onClick={handleCreate}>
          New Company
        </Button>
      </HStack>

      {/* Search Bar */}
      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={handleSearchChange}
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
          />
        </InputGroup>
      </Box>

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
          {data?.items.map((company) => (
            <Tr key={company.id}>
              <Td>{company.name}</Td>
              <Td>{company.email}</Td>
              <Td>{company.phone}</Td>
              <Td>{company.city}</Td>
              <Td>{company.province}</Td>
              <Td>{company.country}</Td>
              <Td>
                <ButtonGroup size="sm" variant="ghost">
                  <Tooltip label="View Details">
                    <IconButton
                      aria-label="View company details"
                      icon={<ViewIcon />}
                      onClick={() => handleViewDetails(company.id)}
                      colorScheme="blue"
                    />
                  </Tooltip>
                  <Tooltip label="Edit">
                    <IconButton
                      aria-label="Edit company"
                      icon={<EditIcon />}
                      onClick={() => handleEdit(company)}
                      colorScheme="green"
                    />
                  </Tooltip>
                  <Tooltip label="Delete">
                    <IconButton
                      aria-label="Delete company"
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(company)}
                      colorScheme="red"
                    />
                  </Tooltip>
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Pagination Controls */}
      <HStack mt={6} justify="space-between" align="center">
        <HStack spacing={4}>
          <Text whiteSpace="nowrap" color="gray.600">Rows per page:</Text>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            width="auto"
            size="sm"
            borderColor="gray.300"
            _hover={{ borderColor: "blue.500" }}
          >
            {PAGE_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </Select>
          <Text whiteSpace="nowrap" color="gray.600">
            {data && `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, data.total)} of ${data.total}`}
          </Text>
        </HStack>
        <ButtonGroup size="sm" spacing={2}>
          <IconButton
            aria-label="Previous page"
            icon={<ChevronLeftIcon h={6} w={6} />}
            onClick={() => handlePageChange(page - 1)}
            isDisabled={page === 1}
            colorScheme="blue"
            variant="outline"
            _hover={{ bg: "blue.50" }}
          />
          <IconButton
            aria-label="Next page"
            icon={<ChevronRightIcon h={6} w={6} />}
            onClick={() => handlePageChange(page + 1)}
            isDisabled={data && page >= data.pages}
            colorScheme="blue"
            variant="outline"
            _hover={{ bg: "blue.50" }}
          />
        </ButtonGroup>
      </HStack>

      <CompanyModal
        isOpen={isOpen}
        onClose={onClose}
        company={selectedCompany}
        mode={mode}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Company
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {selectedCompany?.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Company Side Rail */}
      <CompanySideRail
        companyId={selectedViewCompany}
        onClose={handleCloseSideRail}
      />
    </Box>
  )
}

export default CompanyList