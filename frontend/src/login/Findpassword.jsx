import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const FindPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");


  const handleRequestReset = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post(
        "/auth/request-password-reset", 
        { email }
      );

      if (response.status === 200) {
        setMessage(
          "비밀번호 재설정 요청 메일을 보냈습니다. 메일함 확인 후 인증코드와 새 비밀번호를 입력해주세요."
        );

        setStep("reset"); 
      }
    } catch (error) {

      setMessage("요청 실패: 이메일을 확인하거나 다시 시도해주세요.");
    }
  };


  const handleFinalReset = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!code || !newPassword) {
      setMessage("인증코드와 새 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await api.post(
        "/auth/reset-password",
        { 
          email: email, 
          verificationCode: code, 
          newPassword: newPassword 
        }
      );

      if (response.status === 200) {
        setMessage("비밀번호가 성공적으로 재설정되었습니다.");
        setTimeout(() => {
            navigate('/login'); 
        }, 1000);
        setStep("complete");
        setEmail("");
        setCode("");
        setNewPassword("");
      }
    } catch (error) {
      setMessage("비밀번호 재설정 실패: 인증코드가 유효하지 않거나 다시 시도해주세요.");
    }
  };

  return (
    <div className="findpasswordcomponent">
      <h2>비밀번호 찾기</h2>
      {step === "email" && (
        <form onSubmit={handleRequestReset}>
          <input
            type="email"
            placeholder="가입한 이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">인증 메일 요청</button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleFinalReset}>
          <p>
            입력하신 이메일로 인증 코드가 발송되었습니다.
          </p>
          <input
            type="text"
            placeholder="메일로 받은 인증 코드"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">비밀번호 재설정 완료</button>
        </form>
      )}
      {message && <p>{message}</p>}
      {step === "complete" && <p>로그인 페이지로 돌아가시겠습니까?</p>}
    </div>
  );
};

export default FindPassword;