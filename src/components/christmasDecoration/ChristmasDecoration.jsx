import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ChristmasDecoration = () => {
  const initialMusicState = localStorage.getItem("musicPlaying") === "true";
  const [musicPlaying, setMusicPlaying] = useState(initialMusicState);
  const [buttonExpanded, setButtonExpanded] = useState(false);

  const musicList = ["./music.mp3"];
  const [currentMusic, setCurrentMusic] = useState(musicList[0]);

  const audioRef = useRef(null);
  const snowflakes = useRef(Array.from({ length: 50 }).map(() => ({
    left: `${Math.random() * 100}vw`,
    animationDuration: `${Math.random() * 5 + 5}s`,
    fontSize: `${Math.random() * 20 + 10}px`,
  })));

  useEffect(() => {
    localStorage.setItem("musicPlaying", musicPlaying);
  }, [musicPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (musicPlaying && audio) {
      audio.play();
    }
  }, [currentMusic, musicPlaying]);

  const handleMusicEnd = () => {
    const currentIndex = musicList.indexOf(currentMusic);
    const nextIndex = (currentIndex + 1) % musicList.length;
    setCurrentMusic(musicList[nextIndex]);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (musicPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  const toggleButton = () => {
    setButtonExpanded(!buttonExpanded);
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop={false}
        autoPlay={musicPlaying}
        onEnded={handleMusicEnd}
      >
        <source src={currentMusic} type="audio/mp3" />
      </audio>

      <div className="fixed inset-0 z-50 pointer-events-none">
        {snowflakes.current.map((snowflake, i) => (
          <div
            key={i}
            className="snowflake text-white text-2xl absolute top-0"
            style={{
              left: snowflake.left,
              animation: `fall ${snowflake.animationDuration} linear infinite`,
              fontSize: snowflake.fontSize,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <button
        onClick={toggleButton}
        className="fixed bottom-24 right-5 z-30 bg-red-600 text-white py-2 px-3 rounded-full shadow-lg hover:bg-red-700 transition"
      >
        <span className="text-2xl">{buttonExpanded ? "🎵" : "🎶"}</span>
      </button>

      {buttonExpanded && (
        <div className="fixed bottom-24 right-20 z-50 bg-white text-black py-2 px-4 rounded-lg shadow-lg transition-all">
          <button
            onClick={toggleMusic}
            className="block w-full text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition"
          >
            {musicPlaying ? "Pausar Música" : "Tocar Música"}
          </button>
          <button
            onClick={toggleButton}
            className="block w-full text-center py-2 px-4 mt-2 rounded-lg hover:bg-gray-200 transition"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
        <div
          className="light-animation"
          style={{
            position: "absolute",
            top: "10%",
            left: "0",
            right: "0",
            textAlign: "center",
          }}
        >
          <span className="text-xl">✨</span>
          <span className="text-xl">🎄</span>
          <span className="text-xl">✨</span>
        </div>
      </div>

      {/* Ícone do Papai Noel */}
      <div
        className="santa-icon"
        onClick={() => toast("Ho Ho Ho! Feliz Natal!")}
      ></div>

      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(-10vh);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh);
              opacity: 0;
            }
          }

          @keyframes lightBlink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.3;
            }
          }

          .light-animation span {
            animation: lightBlink 2s ease-in-out infinite;
          }

          .snowflake {
            animation: fall 10s linear infinite;
          }

          /* Estilo para o ícone do Papai Noel */
          .santa-icon {
            position: fixed;
            bottom: 160px;
            right: 10px;
            width: 80px;
            height: 80px;
            background: url(https://cdn-icons-png.flaticon.com/512/3723/3723054.png) no-repeat center center;
            background-size: cover;
            z-index: 30;
            cursor: pointer;
            animation: santa-bounce 1s infinite;
          }

          @keyframes santa-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </>
  );
};

export default ChristmasDecoration;
