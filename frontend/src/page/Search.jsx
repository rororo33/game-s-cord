import styles from "./Search.module.css"
import coin from "../assets/coin.jpg"
import user1 from "../assets/user1.png"
import user2 from "../assets/user2.png"
import user3 from "../assets/user3.png"
import user4 from "../assets/user4.png"
import user5 from "../assets/user5.png"
import user6 from "../assets/user6.png"
import user7 from "../assets/user7.png"

function Search() {
  const user = [user1, user2, user3, user4, user5, user6, user7];
  const Usercard=({img, name, star, num, price})=>{
    return(
      <div className={styles.Userbox}>
        <div style={{height:"200px", display:"flex", alignItems:"end", justifyContent:"center"}}>
          <img src={img} style={{height:"170px"}}></img>
        </div>
        <div className={styles.Userbio}>
          <div style={{fontSize:"18px", fontWeight:"bold", marginBottom:"5px"}}>{name}</div>
          <div>
            ⭐ {star} | 받은 의뢰 수 {num}
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"3px"}}>
            <img src={coin} style={{width:"20px", borderRadius:"50%"}}/>
            <div style={{marginBottom:"1px"}}>{price}코인/판</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <div style={{display:"flex", flexDirection:"row", alignItems:"end", justifyContent:"space-between"}}>
          <h1>추천 서비스</h1>
          <form className={styles.search} action="/search" method="get" style={{marginBottom:"20px"}}>
                <input type="text" name="q" placeholder="유저 이름" />
                <button type="submit"></button>
          </form>
        </div>
        <div className={styles.filter}>
          <div style={{display: "flex", gap: "10px"}}>
            <button type="button">게임 종류</button>
            <button type="button">티어/랭크</button>
            <button type="button">가격</button>
            <button type="button">성별</button>
          </div>
          <div>
            <button type="button" style={{marginLeft: "10px"}}>추천순</button>
          </div>
        </div>

        <div style={{display:"flex", marginTop: "30px", flexWrap:"wrap", gap:"40px"}}>
          {user.map((item, index)=>(
              <Usercard index={index} img={item} name={`User ${index + 1}`} star="5.00" num="10" price="12"/>
            ))}
        </div>
      </div>
    </div>
    
  )
}
export default Search