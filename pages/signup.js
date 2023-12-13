import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useAuth, useUser } from "../hooks/firebase.js";
import Link from "next/link";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = useAuth();
  const currentUser = useUser();
  const [isProcessingSignup, setIsProcessingSignup] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(
    false
  );
  const router = useRouter();

  const signup = async (email, password) => {
    try {
      setIsProcessingSignup(true);
      await createUserWithEmailAndPassword(auth, email, password);
      setIsProcessingSignup(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async ({ email, password, confirmationPassword }) => {
    if (password === confirmationPassword) {
      signup(email, password);
    } else {
      alert("Passwords do not match");
    }
  };

  useEffect(() => {
    console.log("currentUser:", currentUser);
    console.log("pathname:", router.pathname);

    // サインアップが完了しているかどうかを最初に確認
    if (!isProcessingSignup && currentUser && router.pathname !== "/") {
      console.log("Redirecting to /");
      router.push("/");
    }
  }, [currentUser, isProcessingSignup, router]);

  return (
    <Flex
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="60%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Heading color="gray.800" mb="60px" textAlign="center" size="xl">
          新規登録
        </Heading>
        <Box
          boxShadow="lg"
          w="700px"
          paddingY="100px"
          paddingX="48px"
          borderRadius="8px"
          border="1px solid"
          borderColor="gray.100"
          m="0 auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDirection="column" mb="25" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                Email
              </FormLabel>
              {errors.email && (
                <Text color="red.400" mb="2">
                  Email is required
                </Text>
              )}
              <Input
                type="email"
                size="xl"
                placeholder="example@test.com"
                {...register("email", { required: true })}
              />
            </Flex>
            <Flex flexDirection="column" mb="25" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                パスワード
              </FormLabel>
              {errors.password && (
                <Text color="red.400" mb="2">
                  Password is required
                </Text>
              )}
              <Flex alignItems="center">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("password", { required: true })}
                  size="xl"
                />
                <IconButton
                  icon={isPasswordVisible ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  aria-label={
                    isPasswordVisible ? "Hide Password" : "Show Password"
                  }
                  size="lg"
                  mb="2"
                />
              </Flex>
            </Flex>
            <Flex flexDirection="column" mb="25" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                パスワード(再確認)
              </FormLabel>
              {errors.confirmationPassword && (
                <Text color="red.400" mb="2">
                  Confirm Password is required
                </Text>
              )}
              <Flex alignItems="center">
                <Input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  {...register("confirmationPassword", { required: true })}
                  size="xl"
                />
                <IconButton
                  icon={
                    isConfirmPasswordVisible ? <ViewOffIcon /> : <ViewIcon />
                  }
                  onClick={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                  aria-label={
                    isConfirmPasswordVisible
                      ? "Hide Confirm Password"
                      : "Show Confirm Password"
                  }
                  size="lg"
                  mb="2"
                />
              </Flex>
            </Flex>

            <Flex flexDirection="column" alignItems="center">
              <Text mb="8" textAlign="center">
                Already have an account?{" "}
                <Link legacyBehavior href="/login">
                  <a style={{ color: 'blue' }}>Login here</a>
                </Link>
              </Text>
              <Button
                type="submit"
                color="black"
                background="gray.800"
                size="lg"
                paddingX="80px"
                m="0 auto"
                isLoading={isProcessingSignup}
                _hover={{
                  background: "gray.700",
                }}
              >
                登録
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}
