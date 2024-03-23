import './setup';

import { ChakraProvider, useToast } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { Suspense, useEffect } from 'react';

import { queryClient } from './lib/api/queryClient';
import { router } from './routes';

export const AdminApp: React.FC = () => {
  const toast = useToast();

  useEffect(() => {
    const mutationCache = queryClient.getMutationCache();
    const onError = mutationCache.config.onError?.bind(mutationCache.config);

    queryClient.getMutationCache().config.onError = (...args) => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'error',
        title: 'リクエストの処理に失敗しました',
      });
      onError?.(...args);
    };

    return () => {
      queryClient.getMutationCache().config.onError = onError;
    };
  }, [toast]);

  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <RouterProvider router={router()} />
        </ChakraProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
