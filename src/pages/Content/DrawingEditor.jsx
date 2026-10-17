import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import './DrawingEditor.css';
import symbol1 from '../../assets/symbol/symbol_1.svg';
import symbol2 from '../../assets/symbol/symbol_2.svg';
import symbol3 from '../../assets/symbol/symbol_3.svg';
import symbol4 from '../../assets/symbol/symbol_4.svg';

const PRESET_COLORS = ['#FD00A0', '#5F50D8', '#009DEB', '#8223A5', '#F7A600', '#00BFA4', '#1D9F10'];

const SYMBOLS = [
  { id: 'symbol-1', label: 'Symbol 1', src: symbol1 },
  { id: 'symbol-2', label: 'Symbol 2', src: symbol2 },
  { id: 'symbol-3', label: 'Symbol 3', src: symbol3 },
  { id: 'symbol-4', label: 'Symbol 4', src: symbol4 },
];

const SYMBOL_IMAGES = SYMBOLS.map((symbol) => {
  const image = new Image();
  image.src = symbol.src;
  return { ...symbol, image };
});

export default function DrawingEditor({ onShareComplete, onCancel }) {
  // 기본 펜
  const [activeTool, setActiveTool] = useState('pen');
  const [lineWidth, setLineWidth] = useState(24);
  const [symbolSpacing, setSymbolSpacing] = useState(70);
  const [selectedSymbol, setSelectedSymbol] = useState(SYMBOLS[0].id);
  const brushProgressRef = useRef(0);
  const [penColor, setPenColor] = useState(PRESET_COLORS[0]);

  // 실행 취소(Undo) / 다시 실행(Redo) 
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [userMessage, setUserMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const currentStrokePoints = useRef([]);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const getClientPoint = (e) => {
    return e.touches?.[0] || e.changedTouches?.[0] || e;
  };

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = getClientPoint(e);
    return {
      x: (point.clientX - rect.left) * (canvas.width / rect.width),
      y: (point.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  // 한 번의 드래그를 하나의 Undo/Redo 기록으로 저장
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const saveSnapshot = () => {
    const canvasData = canvasRef.current?.toDataURL('image/png');
    if (!canvasData) return;
    const updated = [...historyRef.current.slice(0, historyIndexRef.current + 1), canvasData];
    historyRef.current = updated;
    historyIndexRef.current = updated.length - 1;
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  useEffect(() => { saveSnapshot(); }, []);

  const restoreSnapshot = (data) => {
    if (!data) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, 0);
    };
    img.src = data;
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      const newIdx = historyIndexRef.current - 1;
      historyIndexRef.current = newIdx;
      setHistoryIndex(newIdx);
      restoreSnapshot(historyRef.current[newIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      const newIdx = historyIndexRef.current + 1;
      historyIndexRef.current = newIdx;
      setHistoryIndex(newIdx);
      restoreSnapshot(historyRef.current[newIdx]);
    }
  };

  const handleToolClick = (tool) => { setActiveTool(tool); };

  const stampSymbol = (ctx, x, y) => {
    const symbol = SYMBOL_IMAGES.find(item => item.id === selectedSymbol);
    if (!symbol?.image.complete || !symbol.image.naturalWidth) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    // The SVG serves as a mask, so the existing color palette still applies.
    const size = lineWidth;
    const mask = document.createElement('canvas');
    mask.width = Math.ceil(size * 2);
    mask.height = Math.ceil(size * 2);
    const maskCtx = mask.getContext('2d');
    const scale = size / Math.max(symbol.image.naturalWidth, symbol.image.naturalHeight);
    const width = symbol.image.naturalWidth * scale;
    const height = symbol.image.naturalHeight * scale;
    maskCtx.drawImage(symbol.image, size - width / 2, size - height / 2, width, height);
    maskCtx.globalCompositeOperation = 'source-in';
    maskCtx.fillStyle = penColor;
    maskCtx.fillRect(0, 0, mask.width, mask.height);
    ctx.drawImage(mask, x - size, y - size);
    ctx.restore();
  };

  const startDrawing = (e) => {
    if (activeTool !== 'pen' && activeTool !== 'eraser') return;
    e.preventDefault?.();
    const canvas = canvasRef.current;
    const { x, y } = getCanvasPoint(e);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
    if (activeTool === 'pen') stampSymbol(ctx, x, y);
    else { ctx.lineTo(x + 0.01, y + 0.01); ctx.stroke(); }
    brushProgressRef.current = 0;
    currentStrokePoints.current = [{ x, y }];
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault?.();
    const { x, y } = getCanvasPoint(e);
    const ctx = canvasRef.current.getContext('2d');
    if (activeTool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      const prev = currentStrokePoints.current[currentStrokePoints.current.length - 1];
      const dx = x - prev.x;
      const dy = y - prev.y;
      const distance = Math.hypot(dx, dy);
      const step = Math.max(2, lineWidth * symbolSpacing / 100);
      if (distance > 0) {
        let position = step - brushProgressRef.current;
        while (position <= distance) {
          stampSymbol(ctx, prev.x + dx * position / distance, prev.y + dy * position / distance);
          position += step;
        }
        brushProgressRef.current = (brushProgressRef.current + distance) % step;
      }
    }
    currentStrokePoints.current.push({ x, y });
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    canvasRef.current.getContext('2d').globalCompositeOperation = 'source-over';
    currentStrokePoints.current = [];
    saveSnapshot();
  };

  const getCombinedUserDataUrl = () => canvasRef.current.toDataURL('image/png');

  const handleNormalShare = async () => {
    if (isUploading) return;
    setIsUploading(true);

    const userObjUrl = getCombinedUserDataUrl();
    const finalMsg = userMessage.trim() || '';

    const uploadPromise = supabase.from('artifacts').insert([
      {
        image_url: userObjUrl,
        dominant_color: penColor,
        message: finalMsg
      }
    ]).select();

    try {
      const { error } = await uploadPromise;
      if (error) throw error;
      onShareComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div
      className="editor-screen"
    >
      <div className="content-container">
        {/* 상단 영역 */}
        <div className="title-heading">
        </div>

        <div className="main-stage">
          <div className="drawing-frame" id="drawingFrame">
            <div className="canvas-bottom-hint">나만의 오브젝트를 그려보세요!</div>
            <div className="history-actions">
              <button
                type="button"
                className="undo-btn"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title="되돌리기"
              >
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 14 4 9l5-5" />
                  <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                </svg>
              </button>
              <button
                type="button"
                className="undo-btn"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="다시 실행"
              >
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 14 5-5-5-5" />
                  <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
                </svg>
              </button>
            </div>
            {/* 드로잉 캔버스 */}
            <canvas
              ref={canvasRef}
              width={700}
              height={630}
              className="canvas-layer drawing-active"

              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />

          </div>

          <div className="tools-panel">
            <div className="editor-tools-card">
            <div className="tool-label">Tools</div>
            <div className="tool-icons-row">
              <button
                className={`circle-icon-btn ${activeTool === 'pen' ? 'active' : ''}`}
                onClick={() => handleToolClick('pen')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>

              <button
                className={`circle-icon-btn ${activeTool === 'eraser' ? 'active' : ''}`}
                onClick={() => handleToolClick('eraser')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                  <path d="M22 21H7" /><path d="m5 11 9 9" />
                </svg>
              </button>

            </div>

            {/* 펜/지우개 */}
            {(activeTool === 'pen' || activeTool === 'eraser') && (
              <div className="settings-block">
                {activeTool === 'pen' && (
                  <div className="field-group symbol-field">
                    <span className="field-title">Symbol</span>
                    <div className="symbol-options">
                      {SYMBOLS.map(symbol => (
                        <button key={symbol.id} type="button"
                          className={`symbol-option ${selectedSymbol === symbol.id ? 'selected' : ''}`}
                          onClick={() => setSelectedSymbol(symbol.id)} title={symbol.label}
                          aria-label={symbol.label} aria-pressed={selectedSymbol === symbol.id}>
                          <span className="symbol-preview" aria-hidden="true" style={{ maskImage: `url("${symbol.src}")`, WebkitMaskImage: `url("${symbol.src}")` }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="brush-controls-row">
                  <div className="field-group">
                    <span className="field-title">{activeTool === 'pen' ? 'Size' : 'Eraser Size'}</span>
                    <div className="slider-track-wrap">
                      <input type="range" min="8" max="64" value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))} className="custom-range" />
                    </div>
                  </div>
                  {activeTool === 'pen' && (
                    <div className="field-group">
                      <span className="field-title">Spacing</span>
                      <div className="slider-track-wrap">
                        <input type="range" min="25" max="150" value={symbolSpacing}
                          onChange={(e) => setSymbolSpacing(Number(e.target.value))} className="custom-range" />
                      </div>
                    </div>
                  )}
                </div>
                {activeTool === 'pen' && (
                  <div className="field-group" style={{ marginTop: '26px' }}>
                    <span className="field-title">Color</span>
                    <div className="palette-flex">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          aria-label={`색상 ${c}`}
                          aria-pressed={penColor === c}
                          className={`palette-dot ${penColor === c ? 'active-dot' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setPenColor(c)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            </div>
            <div className="editor-message-box">
              <label className="editor-message-title" htmlFor="editor-message">Message</label>
              <textarea
                id="editor-message"
                className="editor-message-input"
                placeholder="사용자가 자신이 그린 오브젝트에 대한 메시지를 남길 수 있습니다."
                maxLength={50}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={isUploading}
              />
              <span className="editor-message-count">{userMessage.length} / 50자</span>
            </div>
            <div className="bottom-action-wrap">
              <button className="oval-btn share-btn" onClick={handleNormalShare} disabled={isUploading}>{isUploading ? 'SHARING...' : '공유'}</button>
            </div>
          </div>
        </div>
        <button type="button" className="syncopate-modal-close editor-cancel-btn" onClick={onCancel} disabled={isUploading} aria-label="드로잉 모달 닫기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>


    </div>
  );
}
