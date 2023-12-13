// pages/logout.js
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Logout() {
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push("/"); // ログアウト後にホームページにリダイレクト
      } catch (error) {
        console.error("Logout error:", error.message);
        // エラーメッセージを表示するなどの処理を追加することができます。
      }
    };

    handleLogout();
  }, [auth, router]);

  return <div>Logging out...</div>;
}
