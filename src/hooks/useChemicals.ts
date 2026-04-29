import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChemicalsService } from '../services/ChemicalsService';
import { useSchool } from '../context/SchoolContext';
import { Chemical } from '../types/chemical';
import { useEffect } from 'react';

/**
 * Custom hook to fetch and keep chemicals synced using TanStack Query.
 */
export function useChemicals() {
  const { schoolId } = useSchool();
  const queryClient = useQueryClient();
  const queryKey = ['chemicals', schoolId];

  // 1. Fetch initial data
  const { data: chemicals = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => ChemicalsService.getAll(schoolId),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    meta: {
      errorMessage: 'Failed to fetch chemicals'
    }
  });

  // 2. Setup real-time listener for background updates
  useEffect(() => {
    // Only subscribe if we have a schoolId
    if (!schoolId) return;

    const unsubscribe = ChemicalsService.subscribe(schoolId, (updatedChemicals) => {
      // Update React Query's cache with the real-time data
      queryClient.setQueryData(queryKey, updatedChemicals);
    });

    return () => unsubscribe();
  }, [schoolId, queryClient, queryKey]);

  return {
    chemicals,
    isLoading,
    error
  };
}

/**
 * Custom hook for interacting with mutations on Chemicals
 */
export function useChemicalsMutation() {
  const { schoolId } = useSchool();
  const queryClient = useQueryClient();
  const queryKey = ['chemicals', schoolId];

  const addMutation = useMutation({
    mutationFn: (newChemical: Omit<Chemical, 'id'>) => ChemicalsService.add(schoolId, newChemical),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Chemical> }) => 
      ChemicalsService.update(schoolId, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ChemicalsService.delete(schoolId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  return {
    addChemical: addMutation.mutateAsync,
    updateChemical: updateMutation.mutateAsync,
    deleteChemical: deleteMutation.mutateAsync,
    isMutating: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
}
