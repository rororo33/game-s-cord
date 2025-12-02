import React, { useState } from "react";
import "../css/JoinGameMatch.css";
import { FaPlus, FaClock, FaGamepad } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiGamepad } from "react-icons/gi";
import PUBGIcon from "../assets/smallBattle.png";
import LOLIcon from "../assets/smallLOL.png";
import OverIcon from "../assets/smallOver.png";

// 게임 목록
const availableGames = [
  { id: 0, name: "게임명 선택" },
  { id: 1, name: "리그 오브 레전드" },
  { id: 2, name: "배틀그라운드" },
  { id: 3, name: "오버워치 2" },
];

// 게임 티어 목록 (예시)
const availableTiers = [
  { value: "", name: "티어 선택" },
  { value: "BRONZE", name: "브론즈" },
  { value: "SILVER", name: "실버" },
  { value: "GOLD", name: "골드" },
  { value: "PLATINUM", name: "플래티넘" },
  { value: "DIAMOND", name: "다이아몬드" },
  { value: "MASTER", name: "마스터" },
  { value: "GRANDMASTER", name: "그랜드마스터" },
];

const GameTierSelect = ({ rate, onChange }) => {
  const isGameSelected = rate.name !== "게임명 선택";

  const title =
    rate.name === "게임명 선택"
      ? `게임 ${rate.id.slice(-1).toUpperCase()} 티어`
      : rate.name;

  // 선택된 티어 이름 찾기
  const selectedTierName =
    availableTiers.find((t) => t.value === rate.tier)?.name ||
    availableTiers[0].name;

  return (
    <div className="tier-image-wrapper">
      <p className="tier-game-title">{title}</p>
      <select
        name={`tier-select-${rate.id}`}
        value={rate.tier}
        onChange={(e) => onChange(rate.id, "tier", e.target.value)}
        className={`tier-select-dropdown ${!isGameSelected ? "disabled" : ""}`}
        disabled={!isGameSelected}
      >
        {availableTiers.map((tier) => (
          <option key={tier.value} value={tier.value}>
            {tier.name}
          </option>
        ))}
      </select>
      {/* 선택된 티어 표시 (선택되지 않은 경우 기본값) */}
      <p className="selected-tier-display">
        {isGameSelected ? selectedTierName : "게임을 먼저 선택"}
      </p>
    </div>
  );
};

// 게임별 요금 입력 필드 컴포넌트 (변경 없음, 티어 로직은 GameTierSelect로 분리)
const GameRateInput = ({ rate, onChange, selectedNames }) => (
  <div className="rate-input-row">
    <label>게임 명:</label>
    <select
      name={`gameName-${rate.id}`}
      value={rate.name}
      onChange={(e) => onChange(rate.id, "name", e.target.value)}
      className="game-select"
    >
      {availableGames
        .filter(
          (game) =>
            game.name === rate.name ||
            game.id === 0 ||
            !selectedNames.includes(game.name)
        )
        .map((game) => (
          <option key={game.id} value={game.name}>
            {game.name}
          </option>
        ))}
    </select>

    <label className="rate-input-label">코인:</label>
    <div className="rate-input-group">
      <input
        type="number"
        value={rate.price}
        placeholder="코인"
        onChange={(e) => onChange(rate.id, "price", e.target.value)}
        disabled={rate.name === "게임명 선택"}
      />
    </div>
  </div>
);

const JoinGameMatch = () => {
  // 파일 객체 저장을 위한 상태 (FormData 전송용)
  const [profileFiles, setProfileFiles] = useState(Array(5).fill(null));
  // 미리보기 URL 저장을 위한 상태
  const [profileImages, setProfileImages] = useState(Array(5).fill(null));

  const [preferredGame, setPreferredGame] = useState("LOL");

  const [gameRates, setGameRates] = useState([
    {
      id: "rate-a",
      gameId: 0,
      name: "게임명 선택",
      tier: "", // 티어 필드를 사용합니다.
      price: "",
      time: "",
      gender: "",
    },
    {
      id: "rate-b",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      time: "",
      gender: "",
    },
    {
      id: "rate-c",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      time: "",
      gender: "",
    },
  ]);

  const [availableTime, setAvailableTime] = useState({
    game: "",
    time: "--:00",
  });

  const [introduction, setIntroduction] = useState("");

  const selectedNames = gameRates
    .map((g) => g.name)
    .filter((n) => n && n !== "게임명 선택");

  const handleRateChange = (id, field, value) => {
    setGameRates((prev) =>
      prev.map((rate) => {
        if (rate.id !== id) return rate;

        if (field === "name") {
          const found = availableGames.find((g) => g.name === value);
          // 게임명 변경 시, gameId 변경 및 티어/가격 초기화
          return {
            ...rate,
            name: value,
            gameId: found?.id ?? rate.gameId,
            tier: "",
            price: "",
          };
        }

        return { ...rate, [field]: value };
      })
    );
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      // 미리보기 URL 저장
      const newImages = [...profileImages];
      newImages[index] = URL.createObjectURL(file);
      setProfileImages(newImages);

      // 파일 객체 저장 (전송용)
      const newFiles = [...profileFiles];
      newFiles[index] = file;
      setProfileFiles(newFiles);
    }
  };

  const handleSubmit = async () => {
    // 1. 유효성 검사: 2000 코인 초과 여부 확인
    const invalidRate = gameRates.find((g) => {
      const price = Number(g.price);
      return g.name !== "게임명 선택" && !isNaN(price) && price > 2000;
    });

    if (invalidRate) {
      alert(
        "등록하려는 게임 코인 중 2000코인을 초과하는 항목이 있습니다. 코인을 2000이하로 설정해주세요."
      );
      return;
    }

    // 1.2 유효성 검사: 게임 선택 시 티어 선택했는지 확인
    const unselectedTier = gameRates.find(
      (g) => g.name !== "게임명 선택" && !g.tier
    );
    if (unselectedTier) {
      alert(`${unselectedTier.name}의 티어를 선택해주세요.`);
      return;
    }

    // 1.3 유효성 검사: 메인 프로필 이미지 확인
    if (!profileFiles[0]) {
      alert("메인 프로필 이미지를 등록해야 합니다.");
      return;
    }

    // 2. 서버 전송 데이터 (JSON data) 준비
    const gamesData = gameRates
      .filter((g) => g.name !== "게임명 선택" && g.price && g.tier)
      .map((g) => ({
        gameId: g.gameId,
        tier: g.tier,
        price: Number(g.price),
        time: g.time,
        gender: g.gender,
      }));

    const jsonData = {
      games: gamesData,
      introduction,
      preferredGame,
      availableTime,
      profileImageCount: profileFiles.filter((f) => f).length,
    };

    console.log("전송 데이터 (JSON):", jsonData);

    // 3. FormData 객체 생성 및 데이터 추가 (multipart/form-data)
    const formData = new FormData();

    // a. 'data' 필드: JSON 데이터를 문자열로 변환하여 추가
    formData.append("data", JSON.stringify(jsonData));

    // b. 'image' 필드: 프로필 이미지를 추가
    profileFiles.forEach((file, index) => {
      if (file) {
        const fileNamePrefix =
          index === 0 ? "profile_main" : `profile_sub_${index}`;
        formData.append("image", file, `${fileNamePrefix}_${file.name}`);
      }
    });

    // 4. 서버 전송
    try {
      const response = await fetch("/api/gamemates", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("게임 메이트 등록이 완료되었습니다.");
      } else {
        const errorText = await response.text();
        alert(
          `등록 실패: ${response.status} - ${errorText.substring(0, 100)}...`
        );
      }
    } catch (e) {
      alert(`네트워크 오류 발생: ${e.message}`);
    }
  };

  return (
    <div className="join-game-match-container">
      <h1 className="page-header">게임 메이트 등록</h1>

      <div className="content-area">
        {/* 왼쪽 영역 (이전과 동일) */}
        <div className="profile-section">
          <div className="profile-main-box">
            {profileImages[0] ? (
              <img
                src={profileImages[0]}
                className="profile-image"
                alt="메인 프로필 이미지"
              />
            ) : (
              <FaPlus className="plus-icon-lg" />
            )}
            <input
              type="file"
              id="main-image-upload"
              className="hidden-file-input"
              onChange={(e) => handleImageChange(0, e)}
            />
            <label
              htmlFor="main-image-upload"
              className="image-overlay"
            ></label>
          </div>

          <div className="profile-sub-buttons">
            {profileImages.slice(1).map((img, index) => (
              <div key={index + 1} className="sub-image-wrapper">
                {img ? (
                  <img
                    src={img}
                    className="profile-image-sm"
                    alt={`서브 프로필 이미지 ${index + 1}`}
                  />
                ) : (
                  <FaPlus className="plus-icon-sm" />
                )}
                <input
                  type="file"
                  id={`sub-image-upload-${index + 1}`}
                  className="hidden-file-input"
                  onChange={(e) => handleImageChange(index + 1, e)}
                />
                <label
                  htmlFor={`sub-image-upload-${index + 1}`}
                  className="sub-image-label"
                ></label>
              </div>
            ))}
          </div>

          <div className="section-group introduction">
            <label className="section-title">소개</label>
            <textarea
              className="intro-textarea"
              value={introduction}
              placeholder="자신을 자유롭게 소개해주세요"
              onChange={(e) => setIntroduction(e.target.value)}
            />
          </div>

          <div className="available-time">
            <div className="available-time-header">
              <FaClock className="clock-icon" />
              <label className="section-title">이용가능 시간대</label>
            </div>

            <div className="time-game-name-input-row">
              <p className="game-name-label">게임명:</p>
              <input
                type="text"
                value={availableTime.game}
                onChange={(e) =>
                  setAvailableTime({ ...availableTime, game: e.target.value })
                }
              />
            </div>

            <div className="time-input-group">
              <label>시간:</label>
              <input
                type="time"
                className="time-input"
                value={availableTime.time}
                onChange={(e) =>
                  setAvailableTime({ ...availableTime, time: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className="settings-section">
          <div className="setting-box">
            <h3 className="setting-header">
              <MdOutlineAttachMoney /> 게임별 코인 등록
            </h3>

            <div className="rate-inputs">
              {gameRates.map((rate) => (
                <GameRateInput
                  key={rate.id}
                  rate={rate}
                  onChange={handleRateChange}
                  selectedNames={selectedNames}
                />
              ))}
            </div>
          </div>

          <div className="setting-game">
            <h3 className="setting-header">
              <GiGamepad /> 선호 게임 설정
            </h3>

            <div className="preference-games">
              {/* PUBG */}
              <div
                className="game-option"
                onClick={() => setPreferredGame("PUBG")}
              >
                <img src={PUBGIcon} alt="배틀그라운드 아이콘" />
                <input
                  type="checkbox"
                  checked={preferredGame === "PUBG"}
                  readOnly
                />
              </div>

              {/* OverWatch */}
              <div
                className="game-option"
                onClick={() => setPreferredGame("OverWatch")}
              >
                <img src={OverIcon} alt="오버워치 아이콘" />
                <input
                  type="checkbox"
                  checked={preferredGame === "OverWatch"}
                  readOnly
                />
              </div>

              {/* LOL */}
              <div
                className="game-option"
                onClick={() => setPreferredGame("LOL")}
              >
                <img src={LOLIcon} alt="리그 오브 레전드 아이콘" />
                <input
                  type="checkbox"
                  checked={preferredGame === "LOL"}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="setting-box tier-verification-box">
            <h3 className="setting-header">
              <FaGamepad /> 게임 별 티어 선택
            </h3>

            <div className="tier-images">
              {/* gameRates의 3개 항목 각각에 대해 티어 선택 컴포넌트를 렌더링 */}
              {gameRates.map((rate) => (
                <GameTierSelect
                  key={rate.id}
                  rate={rate}
                  onChange={handleRateChange}
                />
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button className="register-button" onClick={handleSubmit}>
              등록하기
            </button>
            <button className="cancel-button">취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGameMatch;
