import React, { useEffect, useState } from 'react';
import { companyService } from '../services/companyService';
import {
  Box,
  VStack,
  Heading,
  Text,
  IconButton,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface CompanySideRailProps {
  companyId: number | null;
  onClose: () => void;
}

interface Company {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  created_at?: string;
  updated_at?: string;
  contacts?: Contact[];
}

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export const CompanySideRail: React.FC<CompanySideRailProps> = ({ companyId, onClose }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) {
        setCompany(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await companyService.getById(companyId);
        setCompany(data);
        setError(null);
      } catch (err) {
        setError('Failed to load company details');
        console.error('Error loading company:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (!companyId) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.600"
        onClick={onClose}
        zIndex={999}
        display={companyId ? "block" : "none"}
      />

      {/* Side rail */}
      <Box
        position="fixed"
        top="0"
        right="0"
        width="33.333%"
        height="100vh"
        bg="white"
        boxShadow="-4px 0 6px -1px rgba(0, 0, 0, 0.1)"
        zIndex={1000}
        overflowY="auto"
        transition="transform 0.3s ease-in-out"
        transform={companyId ? "translateX(0)" : "translateX(100%)"}
      >
        <Box p={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
            <Heading size="lg">Company Details</Heading>
            <IconButton
              aria-label="Close panel"
              icon={<CloseIcon />}
              onClick={onClose}
              variant="solid"
              colorScheme="gray"
              size="sm"
              _hover={{ bg: 'gray.200' }}
            />
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <Spinner size="xl" color="blue.500" />
            </Box>
          ) : error ? (
            <Text color="red.500" p={4}>{error}</Text>
          ) : company ? (
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" mb={2}>{company.name}</Heading>
                <Text color="gray.600">{company.email}</Text>
                <Text color="gray.600">{company.phone}</Text>
              </Box>

              <Box>
                <Heading size="sm" mb={2}>Address</Heading>
                <Text color="gray.600">{company.address}</Text>
                <Text color="gray.600">{company.city}, {company.province}</Text>
                <Text color="gray.600">{company.country}, {company.postal_code}</Text>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>Contacts</Heading>
                <VStack spacing={4} align="stretch">
                  {company.contacts?.map((contact) => (
                    <Box
                      key={contact.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      _hover={{ bg: 'gray.50' }}
                    >
                      <Text fontWeight="medium">
                        {contact.first_name} {contact.last_name}
                      </Text>
                      <Text color="gray.600">{contact.email}</Text>
                      <Text color="gray.600">{contact.phone}</Text>
                    </Box>
                  ))}
                  {(!company.contacts || company.contacts.length === 0) && (
                    <Text color="gray.500">No contacts found</Text>
                  )}
                </VStack>
              </Box>
            </VStack>
          ) : null}
        </Box>
      </Box>
    </>
  );
};