import { useState } from "react";
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuth, useUser } from "../hooks/firebase.js";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);
  const auth = useAuth();
  const currentUser = useUser();
  const router = useRouter();

  const login = async () => {
    try {
      setIsProcessingLogin(true);
      await signInWithEmailAndPassword(auth, email, password);
      setIsProcessingLogin(false);
    } catch (error) {
      console.error("Login error:", error.message);
      // エラーメッセージを表示するなどの処理を追加することができます。
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    login();
  };

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
          ログイン
        </Heading>
        <Box
          boxShadow="lg"
          w="700px"
          paddingY="140px"
          paddingX="48px"
          borderRadius="8px"
          border="1px solid"
          borderColor="gray.100"
          m="0 auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <form onSubmit={handleLogin}>
            <Flex flexDirection="column" mb="25" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                Email
              </FormLabel>
              <Input
                type="email"
                size="xl"
                placeholder="example@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Flex>
            <Flex flexDirection="column" mb="25" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                パスワード
              </FormLabel>
              <Flex alignItems="center">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  size="xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <Flex flexDirection="column" alignItems="center">
              <Button
                type="submit"
                color="black"
                background="gray.800"
                size="lg"
                paddingX="80px"
                m="0 auto"
                isLoading={isProcessingLogin}
                _hover={{
                  background: "gray.700",
                }}
              >
                ログイン
              </Button>
            </Flex>
          </form>
        </Box>
        <Text mt="4" textAlign="center">
          新規ユーザーですか？{" "}
          <Link legacyBehavior href="/signup">
            <a style={{ color: 'blue' }}>新規登録はこちら</a>
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
