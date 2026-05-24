import { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';
import { GAME_LEVELS } from './game/levels';
import { DinoType } from './types';
import { sound } from './utils/sound';
import './App.css';

function App() {
  // 'lobby' | 'playing' | 'gameover'
  const [appState, setAppState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [activeTab, setActiveTab] = useState<'all' | 'easy' | 'normal' | 'hard'>('all');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [enemiesAlive, setEnemiesAlive] = useState<number>(0);
  const [enemiesTotal, setEnemiesTotal] = useState<number>(0);
  const [dinoQueue, setDinoQueue] = useState<DinoType[]>([]);
  const [stars, setStars] = useState<number>(0);
  const [restartTrigger, setRestartTrigger] = useState<number>(0);
  const [bgTheme, setBgTheme] = useState<'space' | 'day' | 'sunset' | 'cyberpunk'>('space');

  // 로컬 스토리지에 저장된 각 스테이지별 최고 점수와 별점
  const [stageRecords, setStageRecords] = useState<Record<number, { highScore: number; maxStars: number }>>({});

  useEffect(() => {
    // 로컬 스토리지에서 기록 불러오기
    const saved = localStorage.getItem('steel-dino-slingshot-records');
    if (saved) {
      try {
        setStageRecords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse records', e);
      }
    }

    // 로컬 스토리지에서 배경 테마 불러오기
    const savedTheme = localStorage.getItem('steel-dino-bg-theme');
    if (savedTheme && ['space', 'day', 'sunset', 'cyberpunk'].includes(savedTheme)) {
      setBgTheme(savedTheme as any);
    }

    // 배경음악(BGM) 자동 시동 (첫 사용자의 인터랙션 시 자동 활성화됨)
    sound.startBGM();

    return () => {
      sound.stopBGM();
    };
  }, []);

  const handleThemeChange = (theme: 'space' | 'day' | 'sunset' | 'cyberpunk') => {
    setBgTheme(theme);
    localStorage.setItem('steel-dino-bg-theme', theme);
  };

  const saveRecord = (levelId: number, finalScore: number, finalStars: number) => {
    const existing = stageRecords[levelId] || { highScore: 0, maxStars: 0 };
    const updatedRecord = {
      highScore: Math.max(existing.highScore, finalScore),
      maxStars: Math.max(existing.maxStars, finalStars),
    };

    const newRecords = {
      ...stageRecords,
      [levelId]: updatedRecord,
    };

    setStageRecords(newRecords);
    localStorage.setItem('steel-dino-slingshot-records', JSON.stringify(newRecords));
  };

  const handleStartLevel = (index: number) => {
    setCurrentLevelIndex(index);
    setScore(0);
    setAppState('playing');
    setRestartTrigger((prev) => prev + 1);
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const handleEnemiesCountChange = (alive: number, total: number) => {
    setEnemiesAlive(alive);
    setEnemiesTotal(total);
  };

  const handleDinoQueueChange = (queue: DinoType[]) => {
    setDinoQueue(queue);
  };

  const handleGameOver = (finalStars: number, finalScore: number) => {
    setStars(finalStars);
    setAppState('gameover');
    
    // 기록 저장
    const currentLevel = GAME_LEVELS[currentLevelIndex];
    saveRecord(currentLevel.id, finalScore, finalStars);
  };

  const handleRestart = () => {
    setScore(0);
    setAppState('playing');
    setRestartTrigger((prev) => prev + 1);
  };

  const handleLobby = () => {
    setAppState('lobby');
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < GAME_LEVELS.length - 1) {
      handleStartLevel(currentLevelIndex + 1);
    }
  };

  const activeLevel = GAME_LEVELS[currentLevelIndex];
  const hasNextLevel = currentLevelIndex < GAME_LEVELS.length - 1;

  const getDinoEmoji = (type: DinoType) => {
    switch (type) {
      case DinoType.TYRANNO: return '🦖';
      case DinoType.PTERA: return '🦅';
      case DinoType.TRICERA: return '🐉';
      default: return '🥚';
    }
  };

  const getDifficultyBadge = (id: number) => {
    if (id <= 10) return <span className="difficulty-badge easy">쉬움 🌿</span>;
    if (id <= 20) return <span className="difficulty-badge normal">보통 ⚡</span>;
    return <span className="difficulty-badge hard">어려움 💀</span>;
  };

  const filteredLevels = GAME_LEVELS.filter((level) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'easy') return level.id <= 10;
    if (activeTab === 'normal') return level.id >= 11 && level.id <= 20;
    if (activeTab === 'hard') return level.id >= 21;
    return true;
  });

  return (
    <>
      {/* 모바일 세로 모드 회전 안내 오버레이 */}
      <div className="rotate-device-overlay">
        <div className="rotate-device-content">
          <div className="rotate-icon">🔄</div>
          <h2>화면을 가로로 회전해주세요</h2>
          <p>이 게임은 가로 화면(Landscape)에 최적화되어 있습니다.</p>
        </div>
      </div>

      {/* 모바일 가로 모드 전용 플로팅 뒤로가기 버튼 */}
      {appState !== 'lobby' && (
        <button className="floating-back-btn" onClick={handleLobby} title="로비로 돌아가기">
          ◀ 로비
        </button>
      )}

      <div className={`app-root theme-${bgTheme} state-${appState}`}>
        {appState === 'lobby' ? (
        <div className="lobby-container animate-fade-in">
          <header className="lobby-header-wrapper">
            <div className="lobby-header">
              <h1 className="game-logo">
                STEEL DINO
                <span className="logo-accent"> SLINGSHOT</span>
              </h1>
              <p className="lobby-tagline">
                기계 군단 로봇 요새를 격파하라! 강철 공룡들의 강력한 투석 물리 액션
              </p>
            </div>

            {/* 테마 스킨 선택 패널 */}
            <div className="theme-selector-lobby glass">
              <span className="theme-label">🎨 배경 스킨</span>
              <div className="theme-options">
                <button 
                  className={`theme-opt-btn ${bgTheme === 'space' ? 'active' : ''}`} 
                  onClick={() => handleThemeChange('space')} 
                  title="우주 야경"
                >
                  🌌 우주
                </button>
                <button 
                  className={`theme-opt-btn ${bgTheme === 'day' ? 'active' : ''}`} 
                  onClick={() => handleThemeChange('day')} 
                  title="맑은 평원 낮"
                >
                  ☀️ 낮
                </button>
                <button 
                  className={`theme-opt-btn ${bgTheme === 'sunset' ? 'active' : ''}`} 
                  onClick={() => handleThemeChange('sunset')} 
                  title="노을 황혼"
                >
                  🌅 노을
                </button>
                <button 
                  className={`theme-opt-btn ${bgTheme === 'cyberpunk' ? 'active' : ''}`} 
                  onClick={() => handleThemeChange('cyberpunk')} 
                  title="네온 사이버"
                >
                  🔮 네온
                </button>
              </div>
            </div>
          </header>

          <main className="lobby-main">
            <div className="lobby-tabs-container glass">
              <button 
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                전체 ({GAME_LEVELS.length})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'easy' ? 'active' : ''}`}
                onClick={() => setActiveTab('easy')}
              >
                🌿 쉬움 (1~10)
              </button>
              <button 
                className={`tab-btn ${activeTab === 'normal' ? 'active' : ''}`}
                onClick={() => setActiveTab('normal')}
              >
                ⚡ 보통 (11~20)
              </button>
              <button 
                className={`tab-btn ${activeTab === 'hard' ? 'active' : ''}`}
                onClick={() => setActiveTab('hard')}
              >
                💀 어려움 (21~30)
              </button>
            </div>

            <h2 className="section-title">🪐 작전 구역 선택 (STAGES)</h2>
            <div className="stages-grid">
              {filteredLevels.map((level) => {
                const record = stageRecords[level.id] || { highScore: 0, maxStars: 0 };
                const originalIdx = GAME_LEVELS.findIndex((l) => l.id === level.id);
                return (
                  <div key={level.id} className="stage-card glass-premium animate-card-fade-in">
                    <div className="stage-card-header">
                      <div className="stage-meta">
                        <span className="stage-num">STAGE {level.id < 10 ? `0${level.id}` : level.id}</span>
                        {getDifficultyBadge(level.id)}
                      </div>
                      <h3 className="stage-name">{level.name}</h3>
                    </div>

                    {/* 별점 현황 */}
                    <div className="stage-stars">
                      <span className={`star ${record.maxStars >= 1 ? 'active' : ''}`}>★</span>
                      <span className={`star ${record.maxStars >= 2 ? 'active' : ''}`}>★</span>
                      <span className={`star ${record.maxStars >= 3 ? 'active' : ''}`}>★</span>
                    </div>

                    <div className="stage-info">
                      <div className="info-row">
                        <span className="info-label">최고 점수</span>
                        <span className="info-value highlight">{record.highScore.toLocaleString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">3성 목표</span>
                        <span className="info-value">{level.threeStarScore.toLocaleString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">출격대기</span>
                        <span className="info-value dino-icons">
                          {level.dinoQueue.map((d, i) => (
                            <span key={i} title={d}>{getDinoEmoji(d)}</span>
                          ))}
                        </span>
                      </div>
                    </div>

                    <button className="btn-play-stage" onClick={(e) => { e.stopPropagation(); handleStartLevel(originalIdx); }}>
                      전투 개시 ⚔️
                    </button>
                  </div>
                );
              })}
            </div>
          </main>

          <footer className="lobby-footer">
            <p>© 2026 GSG Games. All rights reserved.</p>
            <p>강철 공룡 투석기 디펜스 퍼즐 게임</p>
          </footer>
        </div>
      ) : (
        <div className="game-play-container animate-fade-in">
          <div className="game-wrapper">
            <GameCanvas
              levelData={activeLevel}
              onScoreChange={handleScoreChange}
              onEnemiesCountChange={handleEnemiesCountChange}
              onDinoQueueChange={handleDinoQueueChange}
              onGameOver={handleGameOver}
              restartTrigger={restartTrigger}
              bgTheme={bgTheme}
            />
            <GameUI
              levelData={activeLevel}
              score={score}
              enemiesAlive={enemiesAlive}
              enemiesTotal={enemiesTotal}
              dinoQueue={dinoQueue}
              gameState={appState === 'playing' ? 'playing' : 'gameover'}
              stars={stars}
              onRestart={handleRestart}
              onLobby={handleLobby}
              onNextLevel={handleNextLevel}
              hasNextLevel={hasNextLevel}
              bgTheme={bgTheme}
              onChangeTheme={handleThemeChange}
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
