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
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // signInWithPopupとGoogleAuthProviderを追加
import { useRouter } from "next/router";
import { useAuth, useUser } from "../hooks/firebase.js";
import Link from "next/link";
import style from "../styles/signup.module.css";
import Footer from "../components/Footer.js";

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
      setIsProcessingLogin(false);
      alert("ログインに失敗しました");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessingLogin(true);
    login();
  };

  const handleGoogleLogin = async () => {
    try {
      setIsProcessingLogin(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Googleログイン成功:", user);
      setIsProcessingLogin(false);
    } catch (error) {
      console.error("Googleログインエラー:", error.message);
      setIsProcessingLogin(false);
      alert("ログインに失敗しました");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);

  return (
    <div className={style.mainContainer}>
      <main>
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
            <Box
              boxShadow="lg"
              w="500px"
              paddingY="60px"
              paddingX="20px"
              borderRadius="4px"
              border="1px solid"
              borderColor="gray.100"
              m="0 auto"
              display="flex"
              flexDirection="column"
              alignItems="center"
              bg="rgba(255, 255, 255, 0.9)" 
            >
              <Heading color="gray.800" mb="60px" textAlign="center" size="2xl" marginBottom="38px">
                ログイン
              </Heading>
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
                  <Button
                    className={style.touroku}
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
                  <h3>または</h3>
                  <Button
                    className={style.google}
                    type="button"
                    size="lg"
                    paddingX="80px"
                    m="0 auto"
                    mt="4"
                    isLoading={isProcessingLogin}
                    _hover={{
                      background: "gray.700",
                    }}
                    onClick={handleGoogleLogin}
                  >
                    <span style={{color:'black'}}>Googleでログイン</span>
                  </Button>
                </Flex>
              </form>

              <Text mt="4" textAlign="center">
                新規ユーザーですか？{" "}
                <Link legacyBehavior href="/signup">
                  <a style={{ color: 'blue' }}>新規登録はこちら</a>
                </Link>
              </Text>
            </Box>
          </Box>
        </Flex>
      </main>
      <Footer />
    </div>
  );
}