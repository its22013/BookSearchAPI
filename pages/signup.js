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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useAuth, useUser } from "../hooks/firebase.js";
import Link from "next/link";
import style from "../styles/signup.module.css";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import Footer from "@/components/Footer.js";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const auth = useAuth();
  const currentUser = useUser();
  const [isProcessingSignup, setIsProcessingSignup] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const signup = async (email, password, displayName) => {
    try {
      setIsProcessingSignup(true);
   
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // ユーザーの表示名を設定
      await updateProfile(user, {
        displayName: displayName,
      });
  
      setIsProcessingSignup(false);
    } catch (error) {
      setIsProcessingSignup(false);
      if (error.code === 'auth/email-already-in-use') {
        alert('すでにアカウントが存在します');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('正しいメールアドレスを入力してください');
        alert("正しいメールアドレスを入力してください") // メールアドレスが無効な場合のエラー
      }else if (error.code === 'auth/weak-password') {
        setPasswordError('パスワードは少なくとも6文字以上で設定してください');
        alert("パスワードは6文字以上である必要があります")
      } 
      else {
        console.error('Signup Error:', error);
      }
    }
  };

  const onSubmit = async ({ email, password, confirmationPassword, displayName }) => {
    if (password === confirmationPassword) {
      setEmailError(""); // エラーが解消されたらクリアする
      signup(email, password, displayName);
    }  else {
      alert("パスワードが一致しません");
    }
  };

  useEffect(() => {
    console.log("currentUser:", currentUser);
    console.log("pathname:", router.pathname);

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
      if (user.displayName === null) {
        await updateProfile(user, {
          displayName: user.email.split('@')[0] // Googleメールアドレスの最初の部分を表示名として設定
        });
      }
      console.log("Googleログイン成功:", user);
      setIsProcessingSignup(false);
    } catch (error) {
      console.error("Googleログインエラー:", error.message);
      setIsProcessingSignup(false);
      alert("ログインに失敗しました");
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
            className={style.boxShadow}
          >
            <Heading color="gray.800" mb="60px" textAlign="center" size="2xl">
              新規登録
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex flexDirection="column" mb="4" alignItems="center" width="100%">
                <FormLabel fontWeight="bold" mb="2">
                  ユーザー名
                </FormLabel>
                {errors.displayName && (
                  <Text color="red.400" mb="2">
                    <font color="red">ユーザー名が入力されていません</font>
                  </Text>
                )}
                <Input
                  type="text"
                  size="lg"
                  borderRadius="md"
                  placeholder="ユーザー名を入力してください"
                  {...register("displayName", { required: true })}
                  width="100%"
                  height="30px"
                />
              </Flex>

              <Flex flexDirection="column" mb="4" alignItems="center" width="100%">
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
                  size="lg"
                  borderRadius="md"
                  placeholder="example@test.com"
                  {...register("email", { required: true })}
                  width="100%"
                  height="30px"
                />
              </Flex>

              <Flex flexDirection="column" mb="4" alignItems="center" width="100%">
                <FormLabel fontWeight="bold" mb="2">
                  パスワード
                </FormLabel>
                {errors.password && (
                  <Text color="red.400" mb="2">
                    <font color="red">パスワードが入力されていません</font>
                  </Text>
                )}
                <Flex alignItems="center" width="100%">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    {...register("password", { required: true })}
                    size="lg"
                    borderRadius="md"
                    height="30px"
                    width="100%"
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

              <Flex flexDirection="column" mb="6" alignItems="center" width="100%">
                <FormLabel fontWeight="bold" mb="2">
                  パスワード(再確認)
                </FormLabel>
                {errors.confirmationPassword && (
                  <Text color="red.400" mb="2">
                    <font color="red">パスワード(再確認)が入力されていません</font>
                  </Text>
                )}
                <Flex alignItems="center" width="100%">
                  <Input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    {...register("confirmationPassword", { required: true })}
                    size="lg"
                    borderRadius="md"
                    width="100%"
                    height="30px"
                  />
                  <IconButton
                    icon={isConfirmPasswordVisible ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
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

              <Flex flexDirection="column" alignItems="center" width="100%">
                <Button
                  className={style.touroku}
                  type="submit"
                  color="black"
                  background="gray.800"
                  size="lg"
                  paddingX="60px"
                  m="0 auto"
                  mb="6"
                  isLoading={isProcessingSignup}
                  _hover={{
                    background: "gray.700",
                  }}
                >
                  登録
                </Button>
                <Text mb="4" textAlign="center">または</Text>
                <Button
                  className={style.google}
                  type="button"
                  color="black"
                  background="gray.800"
                  size="lg"
                  paddingX="80px"
                  m="0 auto"
                  mb="4"
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
                      mr="2"
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
        </Flex>
      </main>
      <Footer />
    </div>
  );
}