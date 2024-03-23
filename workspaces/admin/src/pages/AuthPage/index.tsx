import { Flex } from '@chakra-ui/react';

import { useAuthUser } from '../../features/auth/hooks/useAuthUser';

import { LoginContent } from './internal/LoginContent';
import { LogoutContent } from './internal/LogoutContent';

export const AuthPage: React.FC = () => {
  const { data: user } = useAuthUser();

  return (
    <Flex align="stretch" direction="column" justify="center" minHeight="100%" w="100%">
      {user == null ? <LoginContent /> : <LogoutContent />}
    </Flex>
  );
};
