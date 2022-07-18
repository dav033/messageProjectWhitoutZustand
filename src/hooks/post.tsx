import { useMutation, useQueryClient } from 'react-query'

export function useMutatePost (key: string, petition: any) {
  const queryClient = useQueryClient()

  return useMutation(petition, {
    onSuccess: () => {}
  })
}
