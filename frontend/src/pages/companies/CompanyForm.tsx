import { Box, Button, FormControl, FormLabel, Input, VStack, useToast } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { companyService } from "../../services/companyService"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CompanyFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
}

interface CompanyFormProps {
  initialData?: CompanyFormData
  isEditing?: boolean
}

const CompanyForm = ({ initialData, isEditing = false }: CompanyFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
    defaultValues: initialData
  })
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CompanyFormData) =>
      isEditing
        ? companyService.update(initialData?.id!, data)
        : companyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        title: `Company ${isEditing ? 'updated' : 'created'} successfully`,
        status: "success",
        duration: 3000,
      })
      navigate("/companies")
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} company`,
        status: "error",
        duration: 3000,
      })
    }
  })

  const onSubmit = (data: CompanyFormData) => {
    mutation.mutate(data)
  }

  return (
    <Box bg="white" rounded="lg" shadow="md" p={6}>
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
            {isEditing ? "Update" : "Create"} Company
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default CompanyForm