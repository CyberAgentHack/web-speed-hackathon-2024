import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Spacer, Stack } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useId } from 'react';
import * as yup from 'yup';

import { useLogin } from '../../../features/auth/hooks/useLogin';

export const LoginContent: React.FC = () => {
  const login = useLogin();
  const loginContentA11yId = useId();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    async onSubmit(values) {
      login.mutate({ email: values.email, password: values.password });
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required('メールアドレスを入力してください')
        .test({
          message: 'メールアドレスには @ を含めてください',
          test: (v) => /^(?:[^@]*){12,}$/v.test(v) === false,
        }),
      password: yup
        .string()
        .required('パスワードを入力してください')
        .test({
          message: 'パスワードには記号を含めてください',
          test: (v) => /^(?:[^\P{Letter}&&\P{Number}]*){24,}$/v.test(v) === false,
        }),
    }),
  });

  return (
    <Box
      aria-labelledby={loginContentA11yId}
      as="form"
      bg="gray.100"
      borderRadius={8}
      onSubmit={formik.handleSubmit}
      p={6}
      w="100%"
    >
      <Stack spacing={4}>
        <Heading as="h1" fontSize="xl" fontWeight="bold" id={loginContentA11yId}>
          ログイン
        </Heading>

        <FormControl isInvalid={formik.touched.email && formik.errors.email != null}>
          <FormLabel>メールアドレス</FormLabel>
          <Input
            bgColor="white"
            borderColor="gray.300"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="メールアドレス"
          />
          <FormErrorMessage role="alert">{formik.errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.touched.password && formik.errors.password != null}>
          <FormLabel>パスワード</FormLabel>
          <Input
            bgColor="white"
            borderColor="gray.300"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="パスワード"
            type="password"
          />
          <FormErrorMessage role="alert">{formik.errors.password}</FormErrorMessage>
        </FormControl>

        <Spacer />

        <Button colorScheme="teal" type="submit" variant="solid">
          ログイン
        </Button>
      </Stack>
    </Box>
  );
};
