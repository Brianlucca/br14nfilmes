import { Music } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const ChristmasDecoration = () => {
  const initialMusicState = localStorage.getItem("musicPlaying") === "true";
  const initialSnowState = localStorage.getItem("snowEnabled") !== "false";

  const [musicPlaying, setMusicPlaying] = useState(initialMusicState);
  const [buttonExpanded, setButtonExpanded] = useState(false);
  const [snowEnabled, setSnowEnabled] = useState(initialSnowState);
  const [snowflakes, setSnowflakes] = useState(
    Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      fontSize: `${Math.random() * 20 + 10}px`,
    }))
  );

  const musicList = ["./music.mp3"];
  const [currentMusic, setCurrentMusic] = useState(musicList[0]);

  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("musicPlaying", musicPlaying);
  }, [musicPlaying]);

  useEffect(() => {
    localStorage.setItem("snowEnabled", snowEnabled);
  }, [snowEnabled]);

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

  const toggleSnow = () => {
    setSnowEnabled(!snowEnabled); // Alterna o estado da neve
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

      <div className={`fixed inset-0 z-50 pointer-events-none transition-opacity ${snowEnabled ? "opacity-100" : "opacity-0"}`}>
        {snowflakes.map((snowflake, i) => (
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
        className="fixed bottom-20 right-4 z-30 bg-red-500 text-white py-3 px-3 rounded-full shadow-lg hover:bg-red-700 transition"
      >
        <span className="text-2xl">{buttonExpanded ? <Music /> : <Music />}</span>
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

      <div
        className="santa-icon z-40"
        onClick={toggleSnow}
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

          .snowflake {
            animation: fall 10s linear infinite;
          }

          /* Estilo para o ícone do Papai Noel */
          .santa-icon {
            position: fixed;
            bottom: 145px;
            right: 14.3px;
            width: 55px;
            height: 55px;
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
