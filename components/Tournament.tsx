
"use client";
import React, { useState } from "react";

function shuffle(array: string[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

type Match = {
  p1: string;
  p2: string;
  winner: string | null;
};

export default function Tournament() {
  const [players, setPlayers] = useState<string[]>(Array(14).fill(""));
  const [rounds, setRounds] = useState<Match[][]>([]);

  const handleNameChange = (idx: number, value: string) => {
    const updated = [...players];
    updated[idx] = value;
    setPlayers(updated);
  };

  const generateTournament = () => {
    const filtered = players.filter((p) => p.trim() !== "");
    if (filtered.length < 2) return;

    const shuffled = shuffle(filtered);
    let firstRound: Match[] = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      firstRound.push({
        p1: shuffled[i],
        p2: shuffled[i + 1] || "BYE",
        winner: null,
      });
    }

    setRounds([firstRound]);
  };

  const setWinner = (roundIdx: number, matchIdx: number, winner: string) => {
    const updated = [...rounds];
    updated[roundIdx][matchIdx].winner = winner;

    if (updated[roundIdx].every((m) => m.winner)) {
      const winners = updated[roundIdx].map((m) => m.winner as string);

      if (winners.length > 1) {
        let nextRound: Match[] = [];
        for (let i = 0; i < winners.length; i += 2) {
          nextRound.push({
            p1: winners[i],
            p2: winners[i + 1] || "BYE",
            winner: null,
          });
        }
        updated[roundIdx + 1] = nextRound;
      }
    }

    setRounds(updated);
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>🏓 탁구 토너먼트</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>참가자 입력 (최대 14명)</h3>
        {players.map((p, idx) => (
          <input
            key={idx}
            placeholder={`참가자 ${idx + 1}`}
            value={p}
            onChange={(e) => handleNameChange(idx, e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 6,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
        ))}
        <button
          onClick={generateTournament}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            background: "black",
            color: "white",
            fontWeight: "bold",
          }}
        >
          토너먼트 시작
        </button>
      </div>

      {rounds.map((round, rIdx) => (
        <div key={rIdx} style={{ marginBottom: 20 }}>
          <h3 style={{ textAlign: "center" }}>라운드 {rIdx + 1}</h3>

          {round.map((match, mIdx) => (
            <div
              key={mIdx}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{match.p1}</span>
                <button onClick={() => setWinner(rIdx, mIdx, match.p1)}>승</button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{match.p2}</span>
                <button onClick={() => setWinner(rIdx, mIdx, match.p2)}>승</button>
              </div>

              {match.winner && (
                <div style={{ textAlign: "center", color: "green", marginTop: 5 }}>
                  승자: {match.winner}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
