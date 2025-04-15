import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { companyService } from "../../services/companyService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

interface Company {
  id?: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
}

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  company?: Company
  mode: 'create' | 'edit'
}

const CompanyModal = ({ isOpen, onClose, company, mode = 'create' }: CompanyModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Company>()
  const toast = useToast()
  const queryClient = useQueryClient()

  // Reset form when modal opens/closes or company changes
  useEffect(() => {
    if (isOpen) {
      reset(company || {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        country: '',
        postal_code: ''
      })
    }
  }, [isOpen, company, reset])

  const mutation = useMutation({
    mutationFn: (data: Company) =>
      mode === 'edit' && company?.id
        ? companyService.update(company.id, data)
        : companyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        title: `Company ${mode === 'edit' ? 'updated' : 'created'} successfully`,
        status: "success",
        duration: 3000,
      })
      onClose()
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${mode === 'edit' ? 'update' : 'create'} company`,
        status: "error",
        duration: 3000,
      })
    }
  })

  const onSubmit = (data: Company) => {
    mutation.mutate(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === 'edit' ? 'Edit' : 'Create New'} Company</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Company Name</FormLabel>
                <Input {...register("name", { required: "Name is required" })} />
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Phone</FormLabel>
                <Input {...register("phone", { required: "Phone is required" })} />
              </FormControl>

              <FormControl isInvalid={!!errors.address}>
                <FormLabel>Address</FormLabel>
                <Input {...register("address", { required: "Address is required" })} />
              </FormControl>

              <FormControl isInvalid={!!errors.city}>
                <FormLabel>City</FormLabel>
                <Input {...register("city", { required: "City is required" })} />
              </FormControl>

              <FormControl isInvalid={!!errors.province}>
                <FormLabel>Province/State</FormLabel>
                <Input {...register("province", { required: "Province/State is required" })} />
              </FormControl>

              <FormControl isInvalid={!!errors.country}>
                <FormLabel>Country</FormLabel>
                <Input {...register("country", { required: "Country is required" })} />
              </FormControl>

              <FormControl isInvalid={!!errors.postal_code}>
                <FormLabel>Postal Code</FormLabel>
                <Input {...register("postal_code", { required: "Postal code is required" })} />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={mutation.isPending}
                w="full"
              >
                {mode === 'edit' ? 'Update' : 'Create'} Company
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CompanyModal