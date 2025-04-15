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
  InputLeftElement
} from "@chakra-ui/react"
import { EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { contactService, Contact } from "../../services/contactService"
import ContactModal from "./ContactModal"
import { useState } from "react"
import React from "react"
import { useDebounce } from "../../hooks/useDebounce"

const PAGE_SIZES = [10, 20, 30, 40, 50]

const ContactList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure()
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>()
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['contacts', page, pageSize, debouncedSearchTerm],
    queryFn: () => contactService.getAll(page, pageSize, debouncedSearchTerm)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast({
        title: "Contact deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onDeleteClose()
    },
    onError: () => {
      toast({
        title: "Error deleting contact",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  })

  const handleCreate = () => {
    setMode('create')
    setSelectedContact(undefined)
    onOpen()
  }

  const handleEdit = (contact: Contact) => {
    setMode('edit')
    setSelectedContact(contact)
    onOpen()
  }

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact)
    onDeleteOpen()
  }

  const confirmDelete = () => {
    if (selectedContact?.id) {
      deleteMutation.mutate(selectedContact.id)
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
      <Center h="200px">
        <Text>Error loading contacts</Text>
      </Center>
    )
  }

  return (
    <Box bg="white" rounded="lg" shadow="md" p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Contacts</Heading>
        <Button colorScheme="blue" onClick={handleCreate}>
          New Contact
        </Button>
      </HStack>

      {/* Search Bar */}
      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search contacts..."
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
            <Th>Country</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.items.map((contact) => (
            <Tr key={contact.id}>
              <Td>{`${contact.first_name} ${contact.last_name}`}</Td>
              <Td>{contact.email}</Td>
              <Td>{contact.phone}</Td>
              <Td>{contact.city}</Td>
              <Td>{contact.country}</Td>
              <Td>
                <ButtonGroup size="sm" spacing={2}>
                  <IconButton
                    aria-label="Edit contact"
                    icon={<EditIcon />}
                    colorScheme="blue"
                    onClick={() => handleEdit(contact)}
                  />
                  <IconButton
                    aria-label="Delete contact"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDelete(contact)}
                  />
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

      <ContactModal
        isOpen={isOpen}
        onClose={onClose}
        contact={selectedContact}
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
              Delete Contact
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {selectedContact?.first_name} {selectedContact?.last_name}? This action cannot be undone.
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
    </Box>
  )
}

export default ContactList