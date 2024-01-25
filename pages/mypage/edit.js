// pages/mypage/edit.js
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Header from '@/components/HeaderSigup';
import Footer from '@/components/Footer';
import Styles from "@/styles/Home.module.css";
import styles from "@/styles/Edit.module.css";
import { useUser, useAuth } from "@/hooks/firebase";
import { useRouter } from 'next/router';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updateProfile, updatePassword } from 'firebase/auth';
import Breadcrumbs from '@/components/Breadcrumbs';

const EditPage = () => {
  const currentUser = useUser();
  const auth = useAuth();
  const router = useRouter();

  // State for form fields
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    // ログインユーザーの確認
    if (currentUser && currentUser.providerData[0]?.providerId === 'password') {
      setIsVerified(false); // 初期状態では未認証状態に設定
    }
  }, [currentUser]);

  const handleVerify = async () => {
    try {
      if (currentUser.providerData[0]?.providerId === 'password') {
        const credential = EmailAuthProvider.credential(currentUser.email, enteredPassword);

        // Firebase AuthのreauthenticateWithCredentialメソッドを使用して再認証を行う
        await reauthenticateWithCredential(currentUser, credential);

        // 認証が成功した場合
        setIsVerified(true);
      } else {
        alert('Googleログインのユーザーはパスワードとユーザー名の変更ができません。');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      alert('パスワードの再認証に失敗しました。');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (currentUser) {
        // サインイン方法の確認
        const signInMethod = currentUser.providerData[0]?.providerId;
  
        if (signInMethod === 'password') {
          // 新しい名前を更新
          await updateProfile(currentUser, { displayName: newName });
  
          // パスワードが入力されている場合は、パスワードも更新
          if (newPassword) {
            await updatePassword(auth.currentUser, newPassword);
          }
  
          console.log('プロファイルが更新されました');
          setUpdateSuccess(true);
        } else {
          alert('Googleログインのユーザーはパスワードとユーザー名の変更ができません。');
        }
      }
    } catch (error) {
      console.error('更新エラー:', error);
    }
  };
  
  const handleReturnToMyPage = () => {
    router.push('/mypage');
  };

  const breadcrumbs = [
    { label: 'トップ', path: '/' },
    { label: 'マイページ', path: '/mypage' },
    { label: 'プロフィール編集', path: '/mypage/edit' },
  ];

  return (
    <div className={Styles.mainContainer}>
      <Header />
      
      <main>
      <Breadcrumbs crumbs={breadcrumbs} />  
      <div className={styles.container}>
        <h1>マイプロフィール編集</h1>
        {!isVerified ? (
          <div>
            <p className={styles.chooes}>セキュリティのため、パスワードを再入力してください。</p>
            <label>
              パスワード:
              <input 
                className={styles.form}
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
              />
            </label>
            <button onClick={handleVerify}>確認</button>
          </div>
        ) : (
          <div>

          <div className={styles.space01}></div>
            <div className={styles.nyuryoku}>
            <label className={styles.newName}>
              新しい名前:
              <input
                className={styles.form}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </label>
            

            <br/>
            <div className={styles.space}></div>

            <label className={styles.form01}>
              新しいパスワード:
              <input
                className={styles.form}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            </div>

            <br />
            <div className={styles.button}>
              {updateSuccess ? (
                <div>
                  <div className={styles.kousin} style={{ textAlign: 'center' }}>
                    <p>プロファイルが正常に更新されました。</p>
                  </div>
                  <button onClick={handleReturnToMyPage}>完了</button>
                </div>
              ) : (
                <button onClick={handleUpdateProfile}>更新</button>
              )}
            </div>
          </div>
        )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditPage;