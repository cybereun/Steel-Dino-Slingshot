import React, { useState } from 'react';
import { DinoType, type GameLevel } from '../types';
import { sound } from '../utils/sound';

interface GameUIProps {
  levelData: GameLevel;
  score: number;
  enemiesAlive: number;
  enemiesTotal: number;
  dinoQueue: DinoType[];
  gameState: 'playing' | 'gameover';
  stars: number; // 0: 실패, 1~3: 클리어 별점
  onRestart: () => void;
  onLobby: () => void;
  onNextLevel: () => void;
  hasNextLevel: boolean;
  bgTheme: 'space' | 'day' | 'sunset' | 'cyberpunk';
  onChangeTheme: (theme: 'space' | 'day' | 'sunset' | 'cyberpunk') => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  levelData,
  score,
  enemiesAlive,
  enemiesTotal,
  dinoQueue,
  gameState,
  stars,
  onRestart,
  onLobby,
  onNextLevel,
  hasNextLevel,
  bgTheme,
  onChangeTheme,
}) => {
  const [bgmMuted, setBgmMuted] = useState<boolean>(sound.getBgmMuteState());

  const handleToggleBgm = () => {
    const nextMute = !bgmMuted;
    setBgmMuted(nextMute);
    sound.setBgmVolume(nextMute);
  };

  // 별점 달성 진행률 계산
  const getProgressPercent = () => {
    const maxScore = levelData.threeStarScore * 1.1; // 스케일링용
    return Math.min(100, (score / maxScore) * 100);
  };

  const star2Percent = (levelData.twoStarScore / (levelData.threeStarScore * 1.1)) * 100;
  const star3Percent = (levelData.threeStarScore / (levelData.threeStarScore * 1.1)) * 100;

  const getDinoEmoji = (type: DinoType) => {
    switch (type) {
      case DinoType.TYRANNO:
        return '🦖';
      case DinoType.PTERA:
        return '🦅';
      case DinoType.TRICERA:
        return '🐉';
      default:
        return '🥚';
    }
  };

  const getDinoName = (type: DinoType) => {
    switch (type) {
      case DinoType.TYRANNO:
        return '티라노 (폭발)';
      case DinoType.PTERA:
        return '프테라 (3분열)';
      case DinoType.TRICERA:
        return '트리케라 (돌진)';
      default:
        return '공룡';
    }
  };

  return (
    <div className="game-ui-container">
      {/* 상단 스코어보드 및 헤더 */}
      <div className="ui-header glass">
        <div className="header-left">
          <button className="btn-back" onClick={onLobby}>
            ◀ 로비로
          </button>
          <span className="level-title">{levelData.name}</span>

          {/* 인게임 미니 배경 테마 선택기 */}
          <div className="mini-theme-selector">
            <button 
              className={`mini-theme-btn ${bgTheme === 'space' ? 'active' : ''}`} 
              onClick={() => onChangeTheme('space')} 
              title="우주 야경 테마"
            >
              🌌
            </button>
            <button 
              className={`mini-theme-btn ${bgTheme === 'day' ? 'active' : ''}`} 
              onClick={() => onChangeTheme('day')} 
              title="맑은 평원 낮 테마"
            >
              ☀️
            </button>
            <button 
              className={`mini-theme-btn ${bgTheme === 'sunset' ? 'active' : ''}`} 
              onClick={() => onChangeTheme('sunset')} 
              title="노을 황혼 테마"
            >
              🌅
            </button>
            <button 
              className={`mini-theme-btn ${bgTheme === 'cyberpunk' ? 'active' : ''}`} 
              onClick={() => onChangeTheme('cyberpunk')} 
              title="사이버 네온 테마"
            >
              🔮
            </button>
          </div>
        </div>

        <div className="scoreboard">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score.toLocaleString()}</div>
          
          {/* 스코어 달성률 게이지 바 */}
          <div className="score-progress-container">
            <div className="score-progress-bar" style={{ width: `${getProgressPercent()}%` }}></div>
            {/* 별 임계점 마커 */}
            <div 
              className={`star-marker star-2 ${score >= levelData.twoStarScore ? 'achieved' : ''}`} 
              style={{ left: `${star2Percent}%` }}
              title="2성 달성 점수"
            >
              ★
            </div>
            <div 
              className={`star-marker star-3 ${score >= levelData.threeStarScore ? 'achieved' : ''}`} 
              style={{ left: `${star3Percent}%` }}
              title="3성 달성 점수"
            >
              ★
            </div>
          </div>
        </div>

        <div className="enemy-status glass-accent">
          <span className="enemy-icon">🤖</span>
          <span className="enemy-count">
            {enemiesAlive} / {enemiesTotal}
          </span>
        </div>
      </div>

      {/* 하단 공룡 대기열 슬롯 */}
      <div className="ui-footer">
        <div className="dino-queue-panel glass">
          <div className="queue-label">LAUNCH QUEUE</div>
          <div className="queue-list">
            {dinoQueue.length > 0 ? (
              dinoQueue.map((dino, idx) => (
                <div key={idx} className={`queue-item ${idx === 0 ? 'next-up' : ''}`} title={getDinoName(dino)}>
                  <span className="dino-emoji">{getDinoEmoji(dino)}</span>
                  {idx === 0 && <span className="next-badge">NEXT</span>}
                </div>
              ))
            ) : (
              <div className="queue-empty">공룡 소진!</div>
            )}
          </div>
        </div>

        <div className="skill-guide-panel glass">
          <div className="guide-title">💡 액티브 스킬 가이드</div>
          <div className="guide-content">
            공룡을 날린 후, <strong>공중에서 화면을 터치(클릭)</strong>하면 특수 능력이 발동합니다!
          </div>
        </div>
      </div>

      {/* 인게임 실시간 BGM 토글 및 다시하기 버튼 */}
      {gameState === 'playing' && (
        <div className="gameplay-controls-wrapper">
          <button 
            className={`btn-bgm-toggle ${bgmMuted ? 'muted' : 'active'}`} 
            onClick={handleToggleBgm} 
            title={bgmMuted ? "배경음악 켜기" : "배경음악 끄기"}
          >
            {bgmMuted ? '🔇 BGM OFF' : '🎵 BGM ON'}
          </button>
          
          <div className="restart-btn-wrapper">
            <button className="btn-restart-gameplay" onClick={onRestart} title="스테이지 처음부터 다시 도전">
              다시 하기 🔄
            </button>
          </div>
        </div>
      )}

      {/* 게임 결과 모달 팝업 */}
      {gameState === 'gameover' && (
        <div className="modal-overlay">
          <div className="modal-content glass-premium animate-fade-in">
            {stars > 0 ? (
              <>
                <h2 className="modal-title success">STAGE CLEAR! 🎉</h2>
                <p className="modal-subtitle">외딴 행성의 적 로봇 요새를 완벽히 격파했습니다!</p>
                
                {/* 별 3개 연출 애니메이션 */}
                <div className="star-rating-display">
                  <span className={`star-item animate-star-1 ${stars >= 1 ? 'gold' : 'gray'}`}>★</span>
                  <span className={`star-item animate-star-2 ${stars >= 2 ? 'gold' : 'gray'}`}>★</span>
                  <span className={`star-item animate-star-3 ${stars >= 3 ? 'gold' : 'gray'}`}>★</span>
                </div>

                <div className="final-score-box">
                  <div className="final-score-label">최종 획득 점수</div>
                  <div className="final-score-value">{score.toLocaleString()}</div>
                </div>

                <div className="modal-actions">
                  <button className="btn-action secondary" onClick={onLobby}>
                    스테이지 선택
                  </button>
                  <button className="btn-action primary animate-pulse" onClick={onRestart}>
                    다시 하기 🔄
                  </button>
                  {hasNextLevel && (
                    <button className="btn-action success-btn" onClick={onNextLevel}>
                      다음 스테이지 🚀
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title fail">MISSION FAILED 🤖💔</h2>
                <p className="modal-subtitle">모든 공룡이 소진되었으나 아직 적이 남아있습니다.</p>

                <div className="final-score-box">
                  <div className="final-score-label">최종 획득 점수</div>
                  <div className="final-score-value">{score.toLocaleString()}</div>
                </div>

                <div className="modal-actions">
                  <button className="btn-action secondary" onClick={onLobby}>
                    스테이지 선택
                  </button>
                  <button className="btn-action primary animate-pulse" onClick={onRestart}>
                    다시 도전하기 🔄
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
