import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { contactService, Contact } from "../../services/contactService"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { companyService } from "../../services/companyService"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact
  mode: 'create' | 'edit'
}

interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  company_id?: number
}

const ContactModal = ({ isOpen, onClose, contact, mode }: ContactModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyService.getAll()
  })

  useEffect(() => {
    if (contact && mode === 'edit') {
      reset({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address,
        city: contact.city,
        province: contact.province,
        country: contact.country,
        postal_code: contact.postal_code,
        company_id: contact.company_id
      })
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        country: '',
        postal_code: '',
        company_id: undefined
      })
    }
  }, [contact, mode, reset])

  const createMutation = useMutation({
    mutationFn: (data: FormData) => contactService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast({
        title: "Contact created",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onClose()
    },
    onError: () => {
      toast({
        title: "Error creating contact",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Contact> }) =>
      contactService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast({
        title: "Contact updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onClose()
    },
    onError: () => {
      toast({
        title: "Error updating contact",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  })

  const onSubmit = (data: FormData) => {
    if (mode === 'create') {
      createMutation.mutate(data)
    } else if (contact?.id) {
      updateMutation.mutate({ id: contact.id, data })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{mode === 'create' ? 'Create Contact' : 'Edit Contact'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input {...register('first_name', { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input {...register('last_name', { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input {...register('email', { required: true })} type="email" />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input {...register('phone', { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input {...register('address', { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>City</FormLabel>
              <Input {...register('city', { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>Province/State</FormLabel>
              <Input {...register('province', { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input {...register('country', { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>Postal Code</FormLabel>
              <Input {...register('postal_code', { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>Company</FormLabel>
              <Select {...register('company_id')} placeholder="Select company">
                {companies?.items.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ContactModal