import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/RequestReceived.css";

const dummyReceivedRequests = [
  { id: 10, nickname: "USER1", status: "waiting" },
  { id: 11, nickname: "USER2", status: "waiting" },
  { id: 12, nickname: "USER3", status: "accepted" },
  { id: 13, nickname: "USER4", status: "rejected" },
];

// 이 컴포넌트는 내가 받은 요청의 처리(수락/거절)를 담당합니다.
export default function RequestReceived() {
  // 탭: request(처리 대기) | processed(처리 완료)
  const [activeTab, setActiveTab] = useState("request"); // 기본값: 처리해야 할 요청
  const [receivedList, setReceivedList] = useState(dummyReceivedRequests);

  // [받은 요청 처리]: 수락 또는 거절로 상태 변경
  const handleDecision = (id, decision) => {
    setReceivedList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: decision } : item
      )
    );
    alert(`${decision === "accepted" ? "수락" : "거절"} 처리되었습니다.`);
  };

  // 탭에 따라 리스트 필터링
  const filteredRequests = receivedList.filter((item) => {
    if (activeTab === "request") {
      // '매칭요청' 탭: 아직 처리하지 않은 'waiting' 요청만
      return item.status === "waiting";
    } else if (activeTab === "processed") {
      // '매칭수락' 탭: 처리 완료된 'accepted' 또는 'rejected' 요청만
      return item.status === "accepted" || item.status === "rejected";
    }
    return false;
  });

  // 상태에 따른 닷 클래스 결정
  const getStatusDotClass = (status) => {
    switch (status) {
      case "accepted":
        return "status-dot--accepted";
      case "rejected":
        return "status-dot--rejected";
      case "waiting":
      default:
        // 'waiting' 상태는 응답 없음과 유사하게 처리
        return "status-dot--pending";
    }
  };

  return (
    <div className="page">
      <div className="request-layout">
        <aside className="request-sidebar">
          <ul>
            <li className="disabled-menu">마이페이지</li>
            <li className="active-menu">신청내역</li>
            <li className="disabled-menu">결제 및 정산</li>
          </ul>
        </aside>

        <section className="request-content">
          <Link to="/requestReceived" className="request-title">
            받은내역
          </Link>
          <Link to="/requestdetail" className="request-title">
            신청내역
          </Link>
          <div className="request-tabs">
            <button
              className={
                "request-tab" +
                (activeTab === "request" ? " request-tab--active" : "")
              }
              onClick={() => setActiveTab("request")}
            >
              매칭요청
            </button>
            <button
              className={
                "request-tab" +
                (activeTab === "processed" ? " request-tab--active" : "")
              }
              onClick={() => setActiveTab("processed")}
            >
              매칭수락
            </button>
          </div>

          {/* ------------------- 상태 범례 (처리 완료 탭에만 표시) ------------------- */}
          {activeTab === "processed" && (
            <div className="status-legend">
              <span>
                <span className="status-dot status-dot--accepted" /> 수락됨
              </span>
              <span>
                <span className="status-dot status-dot--rejected" /> 거절됨
              </span>
            </div>
          )}

          {/* ------------------- 내가 받은 요청 목록 (request & processed 공통) ------------------- */}
          <ul className="request-list">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((item) => (
                <li key={item.id} className="request-row">
                  <div className="request-row-left">
                    <span className="request-row-title">
                      {item.nickname} 님의 매칭요청
                    </span>
                  </div>

                  <div className="request-row-right">
                    {activeTab === "request" ? (
                      // 1. 처리 대기 탭: 수락/거절 버튼 표시
                      <>
                        <button
                          className={"pill-button pill-button--accept"}
                          onClick={() => handleDecision(item.id, "accepted")}
                        >
                          수락
                        </button>
                        <button
                          className={"pill-button pill-button--reject"}
                          onClick={() => handleDecision(item.id, "rejected")}
                        >
                          거절
                        </button>
                      </>
                    ) : (
                      // 2. 처리 완료 탭: 처리 상태 표시 및 상대 정보 확인 버튼
                      <>
                        <span className="request-row-status-label">
                          처리상태 :
                        </span>
                        <span
                          className={
                            "status-dot " + getStatusDotClass(item.status)
                          }
                        />
                        <button
                          className="info-button"
                          disabled={item.status === "rejected"}
                        >
                          상대 정보 확인하기
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <div className="no-requests">
                {activeTab === "request"
                  ? "새로운 매칭 요청이 없습니다."
                  : "처리 완료된 매칭 내역이 없습니다."}
              </div>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
