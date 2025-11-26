import styles from "./Home.module.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import LeagueofLeagends from "./assets/LeaguofLeagends.jpg";
import Battleground from "./assets/Battleground.jpg";
import overwatch from "./assets/Overwatch.jpg";
import user1 from "./assets/user1.png";
import user2 from "./assets/user2.png";
import user3 from "./assets/user3.png";
import user4 from "./assets/user4.png";
import user5 from "./assets/user5.png";
import user6 from "./assets/user6.png";
import user7 from "./assets/user7.png";
import coin from "./assets/coin.jpg";

function useScroll(ref, scrollAmount) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const handleScroll = () => {
    const box = ref.current;
    if (!box) return; // box가 null일 때 방어
    setCanScrollPrev(box.scrollLeft > 0);
    setCanScrollNext(box.scrollLeft < box.scrollWidth - box.clientWidth - 1);
  };

  const scrollNext = () => {
    if (ref.current) { // ref.current가 null이 아닐 때만 실행
        ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (ref.current) { // ref.current가 null이 아닐 때만 실행
        ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const box = ref.current;
    if (!box) return; // box가 null일 때 이벤트 리스너 등록 방지
    box.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => box.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return { canScrollPrev, canScrollNext, scrollNext, scrollPrev };
}

function Home() {
  const gameList = ["LeagueofLeagends", "Battleground", "Overwatch"];
  const games = {
    LeagueofLeagends: LeagueofLeagends,
    Battleground: Battleground,
    Overwatch: overwatch,
  };
  const [lolUsers, setLolUsers] = useState([]);
  const [bgUsers, setBgUsers] = useState([]);
  const [owUsers, setOwUsers] = useState([]);

  const userImages = [user1, user2, user3, user4, user5, user6, user7];

  const [users, setUsers] = useState([]);
  const gameBoxRef = useRef(null);
  
  // 1. Ref 중복 사용 문제 해결: 각 사용자 박스에 고유한 Ref를 할당
  const lolUserBoxRef = useRef(null); 
  const bgUserBoxRef = useRef(null); 
  const owUserBoxRef = useRef(null);

  const gameScroll = useScroll(gameBoxRef, 340);
  
  // 1. Ref 중복 사용 문제 해결: 각 섹션에 고유한 스크롤 훅을 적용
  const lolUserScroll = useScroll(lolUserBoxRef, 440); 
  const bgUserScroll = useScroll(bgUserBoxRef, 440); 
  const owUserScroll = useScroll(owUserBoxRef, 440);
  
  const navigate = useNavigate();

  const gameIdMap = {
    LeagueofLeagends: 1,
    Battleground: 2,
    Overwatch: 3,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const lol = await axios.get("/api/gamemates/popular/1");
        const bg = await axios.get("/api/gamemates/popular/2");
        const ow = await axios.get("/api/gamemates/popular/3");

        // API 응답 데이터가 배열인지 확인하고 설정
        setLolUsers(Array.isArray(lol.data) ? lol.data : []); 
        setBgUsers(Array.isArray(bg.data) ? bg.data : []);
        setOwUsers(Array.isArray(ow.data) ? ow.data : []);
        
        console.log(lol.data);
        console.log(bg.data);
        console.log(ow.data);
      } catch (e) {
        // API 요청 실패 시에도 빈 배열을 유지하므로 map 오류는 발생하지 않음
        console.error("추천 유저 조회 실패:", e);
      }
    };

    fetchUsers();
  }, []);

  const GameComponent = ({ game }) => {
    return (
      <div
        className={styles.game}
        onClick={() => navigate("/search", { state: { gameId: gameIdMap[game] } })}
        style={{ cursor: "pointer" }}
      >
        <img src={games[game]} />
      </div>
    );
  };

  const UserComponent = ({ index,userId,name, tier, game, price }) => {
    return (
      <div
        className={styles.user}
        onClick={() => navigate("/matchdetail", { state: { userId } })}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.imgbox}>
          <img src={userImages[index]} />
          <div className={styles.biobox}>
            <div style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "5px", marginTop: "-5px" }}>{name}</div>
            <div style={{ marginBottom: "2px" }}>{game}</div>
            <div style={{ marginBottom: "5px", fontSize: "15px" }}>Level : {tier}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img src={coin} style={{ width: "20px", height: "20px", marginLeft: "0", marginTop: "3px" }} />
              <div style={{ color: "#f1a100ff" }}>{price}/판</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h1>추천 서비스</h1>
        <div className={styles.visible_gamebox} ref={gameBoxRef}>
          <div className={styles.gamebox}>
            {gameList.map((item, index) => (
              <GameComponent key={index} game={item} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h1>리그 오브 레전드</h1>

        <button
          onClick={() => lolUserScroll.scrollPrev()} // ⬅️ 1. 스크롤 훅 변경
          className={!lolUserScroll.canScrollPrev ? styles.hidden : styles.prev} // ⬅️ 1. 스크롤 훅 변경
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => lolUserScroll.scrollNext()} // ⬅️ 1. 스크롤 훅 변경
          className={!lolUserScroll.canScrollNext ? styles.hidden : styles.next} // ⬅️ 1. 스크롤 훅 변경
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={lolUserBoxRef}> // ⬅️ 1. Ref 변경
          <div className={styles.userbox}>
            {/* 2. lolUsers가 배열이 아닐 경우 (u.map 오류) 빈 배열로 대체 */}
            {(lolUsers || []).map((item, index) => (
              <UserComponent
                key={index}
                index={index}
                userId={item.userId}
                name={item.userName}
                tier={item.tier}
                game={item.gameName}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h1>배틀 그라운드</h1>

        <button
          onClick={() => bgUserScroll.scrollPrev()} // ⬅️ 1. 스크롤 훅 변경
          className={!bgUserScroll.canScrollPrev ? styles.hidden : styles.prev} // ⬅️ 1. 스크롤 훅 변경
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => bgUserScroll.scrollNext()} // ⬅️ 1. 스크롤 훅 변경
          className={!bgUserScroll.canScrollNext ? styles.hidden : styles.next} // ⬅️ 1. 스크롤 훅 변경
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={bgUserBoxRef}> // ⬅️ 1. Ref 변경
          <div className={styles.userbox}>
            {/* 3. bgUsers가 배열이 아닐 경우 빈 배열로 대체 */}
            {(bgUsers || []).map((item, index) => (
              <UserComponent
                key={index}
                index={index}
                userId={item.userId}
                name={item.userName}
                tier={item.tier}
                game={item.gameName}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h1>오버워치</h1>

        <button
          onClick={() => owUserScroll.scrollPrev()} // ⬅️ 1. 스크롤 훅 변경
          className={!owUserScroll.canScrollPrev ? styles.hidden : styles.prev} // ⬅️ 1. 스크롤 훅 변경
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => owUserScroll.scrollNext()} // ⬅️ 1. 스크롤 훅 변경
          className={!owUserScroll.canScrollNext ? styles.hidden : styles.next} // ⬅️ 1. 스크롤 훅 변경
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={owUserBoxRef}> // ⬅️ 1. Ref 변경
          <div className={styles.userbox}>
            {/* 4. owUsers가 배열이 아닐 경우 빈 배열로 대체 */}
            {(owUsers || []).map((item, index) => (
              <UserComponent
                key={index}
                index={index}
                userId={item.userId}
                name={item.userName}
                tier={item.tier}
                game={item.gameName}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;