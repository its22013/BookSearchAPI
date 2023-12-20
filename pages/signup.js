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
import style from "../styles/signup.module.css";
import { signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import Footer  from "@/components/Footer.js";

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
    } catch (error) {
      setIsProcessingSignup(false);
      if (error.code === 'auth/email-already-in-use') {
        alert('すでにアカウントが存在します');
      } else {
        console.error('Signup Error:', error);
      }
    }
  };

  const onSubmit = async ({ email, password, confirmationPassword }) => {
    if (password === confirmationPassword) {
      signup(email, password);
    } else {
      alert("パスワードが一致しません");
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
  const googleProvider = new GoogleAuthProvider();
  const handleGoogleLogin = async () => {
    try {
      setIsProcessingSignup(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // 必要に応じてユーザーデータを処理できます
      console.log("Googleログイン成功:", user);
      setIsProcessingSignup(false);

      // ログインが成功した場合、ユーザーがすでに存在しないか確認し、新規登録するなどの処理を追加できます
    } catch (error) {
      console.error("Googleログインエラー:", error.message);
      setIsProcessingSignup(false);
      alert("ログインに失敗しました")
    }
  };
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
        <Heading color="gray.800" mb="60px" textAlign="center" size="2xl">
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
                 <font color="red"> Emailが入力されていません</font>
                </Text>
              )}
              <Input
                type="email"
                size="2lg"
                borderRadius="md"
                placeholder="example@test.com"
                {...register("email", { required: true })}
                width="100%"
                height="30px"
              />
            </Flex>
            <Flex flexDirection="column" mb="25" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                パスワード
              </FormLabel>
              {errors.password && (
                <Text color="red.400" mb="2">
                  <font color="red">パスワードが入力されていません</font>
                </Text>
              )}
              <Flex alignItems="center">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("password", { required: true })}
                  size="lg"
                  borderRadius="md"
                  height="30px"
                  width="300px"
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
            <Flex flexDirection="column" mb="40" alignItems="center">
              <FormLabel fontWeight="bold" mb="2">
                パスワード(再確認)
              </FormLabel>
              {errors.confirmationPassword && (
                <Text color="red.400" mb="2">
                 <font color="red">パスワード(再確認)が入力されていません</font>
                </Text>
              )}
              <Flex alignItems="center">
                <Input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  {...register("confirmationPassword", { required: true })}
                  size="lg"
                  borderRadius="md"
                  width="300px"
                  height="30px"
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
          
              <Button className={style.touroku} 
                type="submit"
                color="black"
                background="gray.800"
                size="lg"
                paddingX="60px"
                m="0 auto"
                marginBottom="30"
                isLoading={isProcessingSignup}
                _hover={{
                  background: "gray.700",
                }}
              >
                登録
              </Button>
          
      <h3> または</h3>
              <Button
          className={style.google}
          type="button"
          color="black"
          background="gray.800"
          size="lg"
          paddingX="80px"
          m="0 auto"
          marginBottom="4"
          isLoading={isProcessingSignup}
          _hover={{
            background: "gray.700",
          }}
          onClick={handleGoogleLogin}
        >
          <Flex align="center">
            <IconButton
              icon={<FaGoogle />}
              fontSize="20px"
              marginRight="2"  
            />
            Googleで登録・ログイン
          </Flex>
        </Button>
              <Text mb="8" textAlign="center">
                すでにアカウントをお持ちですか?{" "}
                <Link legacyBehavior href="/login">
                  <a style={{ color: 'blue' }}>ログイン</a>
                </Link>
              </Text>
              </Flex>
          </form>
        </Box>
      </Box>
    </Flex>
    </main> 
    <Footer/>
    </div>
  );
}
