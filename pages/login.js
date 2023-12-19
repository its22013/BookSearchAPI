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
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth"; // 追加
import { useRouter } from "next/router";
import { useAuth, useUser } from "../hooks/firebase.js";
import Link from "next/link";
import style from "../styles/signup.module.css";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage("ログインに失敗しました。ユーザー名とパスワードを確認してください。");
      setIsProcessingLogin(false); // ログイン失敗時に isProcessingLogin を false に戻す
      alert("ログインに失敗しました")
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // フォームが再送信されたときにエラーメッセージをリセット
    setIsProcessingLogin(true); // ログインボタンを無効化
    login();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ログイン成功したらホームにリダイレクト
        router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);

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
        <Heading color="gray.800" mb="60px" textAlign="center" size="2xl">
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
            <Flex flexDirection="column" mb="30" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                Email
              </FormLabel>
              <Input
                type="email"
                size="lg"
                borderRadius="md"
                placeholder="example@test.com"
                width="100%"
                height="30px"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Flex>
            <Flex flexDirection="column" mb="50" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                パスワード
              </FormLabel>
              <Flex alignItems="center">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  size="lg"
                  borderRadius="md"
                  width="300px"
                  height="30px"
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
              <Button className={style.touroku}
                type="submit"             
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

