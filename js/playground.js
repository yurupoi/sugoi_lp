/**
 * Gemini 3.8 Flash LP - Interactive Playground Engine
 * 4 High-Fidelity Simulation Demos demonstrating Gemini 3.8 Flash capabilities:
 * 1. 250 tps Ultra-Fast Code Generation with Live Interactive 3D/Canvas Render
 * 2. Multimodal Vision & Spatial Reasoning Radar
 * 3. 1,000,000 Token "Needle in a Haystack" Matrix Scanner
 * 4. Full-Duplex Sub-180ms Realtime Voice Stream Simulator
 */

class PlaygroundController {
  constructor() {
    this.activeTab = 'code';
    this.isStreaming = false;
    this.streamTimer = null;
    this.init();
  }

  init() {
    this.setupTabs();
    this.setupCodeGenerator();
    this.setupMultimodalVision();
    this.setupNeedleSearch();
    this.setupVoiceStream();
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll('.pg-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        if (target === this.activeTab) return;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.pg-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(`pg-panel-${target}`);
        if (panel) panel.classList.add('active');

        this.activeTab = target;
        if (window.soundEngine) window.soundEngine.playClick();
        if (window.triggerEnergySurge) window.triggerEnergySurge();

        // Render tab initial state if needed
        if (target === 'vision') this.drawVisionCanvas();
        if (target === 'needle') this.renderNeedleGrid();
        if (target === 'voice') this.initVoiceWave();
      });
    });
  }

  // =========================================================================
  // 1. ULTRA-FAST CODE GENERATION STREAM
  // =========================================================================
  setupCodeGenerator() {
    const codePresets = {
      threejs: {
        title: "Three.js 3D 量子ボロノイ空間シミュレータ",
        prompt: "Create an interactive Three.js 3D glowing quantum lattice with rotating particle nodes, chromatic aberration post-processing, and responsive orbit control.",
        tokens: 380,
        code: `// Gemini 3.8 Flash Ultra-Speed Code Synthesis (250 tps)
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(400, 300);

// Quantum particle lattice
const geometry = new THREE.IcosahedronGeometry(2.5, 3);
const material = new THREE.MeshStandardMaterial({
  color: 0x3b82f6,
  wireframe: true,
  emissive: 0x9333ea,
  emissiveIntensity: 0.8
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Core glowing nucleus
const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
const core = new THREE.Mesh(coreGeo, coreMat);
scene.add(core);

const light = new THREE.PointLight(0xffffff, 2, 50);
light.position.set(5, 5, 5);
scene.add(light);
camera.position.z = 5;

export function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.012;
  mesh.rotation.y += 0.018;
  const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.15;
  core.scale.set(pulse, pulse, pulse);
  renderer.render(scene, camera);
}`
      },
      agent: {
        title: "自律型マルチエージェント意思決定グラフ (DAG)",
        prompt: "Build an asynchronous agentic execution graph using Gemini 3.8 Flash function-calling, state evaluation loops, and streaming verification.",
        tokens: 310,
        code: `// Autonomous Agentic Execution Workflow
import { GoogleGenAI } from '@google/genai';

class AgentOrchestrator {
  constructor(apiKey) {
    this.ai = new GoogleGenAI({ apiKey, model: 'gemini-3.8-flash' });
    this.memoryState = new Map();
  }

  async executeTask(userObjective) {
    console.log(\`[Task Initialized]: \${userObjective}\`);
    // Step 1: Decomposition & Parallel Planning
    const plan = await this.ai.generateContent({
      prompt: \`Decompose into DAG steps: \${userObjective}\`,
      temperature: 0.1
    });

    // Step 2: High-Speed Tool Execution (TTFT: 78ms)
    const results = await Promise.all([
      this.callTool('code_linter', { code: plan.codeSnippet }),
      this.callTool('security_audit', { ast: plan.astTree })
    ]);

    return { status: 'OPTIMAL_VERIFIED', speed_tps: 254, latency: '82ms' };
  }
}`
      },
      quantum: {
        title: "高周波取引 (HFT) 超低遅延アービトラージ分析",
        prompt: "Implement ultra-low latency real-time WebSocket order book scanner with predictive micro-price calculation.",
        tokens: 330,
        code: `// Low Latency Market Microstructure Engine
class OrderBookAnalyzer {
  constructor() {
    this.orderBook = { bids: [], asks: [] };
    this.ttftBenchmark = 0.076; // 76ms
  }

  computeMicroPrice(depth = 10) {
    let bidVol = 0, askVol = 0, weightedPrice = 0;
    for (let i = 0; i < depth; i++) {
      bidVol += this.orderBook.bids[i]?.vol || 0;
      askVol += this.orderBook.asks[i]?.vol || 0;
    }
    const imbalance = (bidVol - askVol) / (bidVol + askVol);
    const midPrice = (this.orderBook.bids[0].price + this.orderBook.asks[0].price) / 2;
    return midPrice * (1 + 0.0004 * imbalance);
  }
}`
      }
    };

    const presetSelect = document.getElementById('code-preset-select');
    const startBtn = document.getElementById('code-stream-btn');
    const codeDisplay = document.getElementById('code-output-block');
    const previewBtn = document.getElementById('code-preview-btn');
    const previewBox = document.getElementById('code-live-preview');
    const tpsGauge = document.getElementById('code-tps-val');
    const tokenCountGauge = document.getElementById('code-tokens-val');
    const timeGauge = document.getElementById('code-time-val');

    if (!startBtn || !codeDisplay) return;

    let activePreset = 'threejs';

    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        activePreset = e.target.value;
        codeDisplay.textContent = `// 選択中: ${codePresets[activePreset].title}\n// 「250 tps で生成実行」ボタンを押して超高速ストリーミングを開始してください。`;
        if (previewBox) previewBox.innerHTML = '<div class="preview-placeholder">「プレビュー実行」をクリックすると生成コードがリアルタイム実行されます</div>';
      });
    }

    startBtn.addEventListener('click', () => {
      if (this.isStreaming) return;
      this.isStreaming = true;
      startBtn.disabled = true;
      if (previewBtn) previewBtn.disabled = true;

      const targetData = codePresets[activePreset];
      const fullText = targetData.code;
      codeDisplay.textContent = '';
      let charIdx = 0;
      let tokensGenerated = 0;
      const startTime = performance.now();

      if (window.soundEngine) window.soundEngine.playClick();
      if (window.triggerEnergySurge) window.triggerEnergySurge();

      // Simulate ultra-fast token streaming (chunk of 12-18 chars per 25ms tick ~ 240-260 tps)
      this.streamTimer = setInterval(() => {
        const chunkSize = Math.floor(Math.random() * 8 + 10);
        charIdx += chunkSize;
        tokensGenerated = Math.min(targetData.tokens, Math.floor(charIdx / 4.2));

        codeDisplay.textContent = fullText.slice(0, charIdx);
        codeDisplay.scrollTop = codeDisplay.scrollHeight;

        const elapsed = (performance.now() - startTime) / 1000;
        const currentTps = Math.min(258, Math.round(tokensGenerated / Math.max(elapsed, 0.05)));

        if (tpsGauge) tpsGauge.textContent = `${currentTps} tps`;
        if (tokenCountGauge) tokenCountGauge.textContent = `${tokensGenerated} tokens`;
        if (timeGauge) timeGauge.textContent = `${elapsed.toFixed(2)}s`;

        if (window.soundEngine && Math.random() > 0.4) {
          window.soundEngine.playStreamToken();
        }

        if (charIdx >= fullText.length) {
          clearInterval(this.streamTimer);
          this.isStreaming = false;
          startBtn.disabled = false;
          if (previewBtn) previewBtn.disabled = false;
          if (window.soundEngine) window.soundEngine.playSuccess();
        }
      }, 25);
    });

    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        if (!previewBox) return;
        previewBox.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = 380;
        canvas.height = 240;
        canvas.style.borderRadius = '12px';
        canvas.style.background = '#090d16';
        previewBox.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let angle = 0;
        const renderSphere = () => {
          if (!previewBox.contains(canvas)) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          angle += 0.03;

          // Wireframe rotating 3D quantum lattice
          const nodes = 18;
          const radius = 60 + Math.sin(angle * 2) * 8;
          const points = [];

          for (let i = 0; i < nodes; i++) {
            const phi = Math.acos(-1 + (2 * i) / nodes);
            const theta = Math.sqrt(nodes * Math.PI) * phi + angle;
            const x = cx + radius * Math.cos(theta) * Math.sin(phi);
            const y = cy + radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            points.push({ x, y, z });
          }

          // Draw connections
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
          ctx.lineWidth = 1;
          for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
              const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
              if (d < 50) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
              }
            }
          }

          // Core glowing sphere
          const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 28);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(0.6, '#9333ea');
          grad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(cx, cy, 28, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Outer dots
          points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#06b6d4';
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          requestAnimationFrame(renderSphere);
        };
        renderSphere();
        if (window.soundEngine) window.soundEngine.playSuccess();
      });
    }
  }

  // =========================================================================
  // 2. MULTIMODAL VISION & SPATIAL REASONING RADAR
  // =========================================================================
  setupMultimodalVision() {
    this.drawVisionCanvas();
    const scanBtn = document.getElementById('vision-scan-btn');
    const logBox = document.getElementById('vision-log-output');

    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        this.runVisionScan(logBox);
      });
    }
  }

  drawVisionCanvas(boxes = false, scanY = -1) {
    const canvas = document.getElementById('vision-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    // High tech Silicon Chip Circuit Schematic Mockup
    ctx.strokeStyle = 'rgba(30, 58, 138, 0.35)';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Chip die components
    // 1. TPU / Tensor Cores (Center)
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(140, 60, 200, 160);
    ctx.fillRect(140, 60, 200, 160);

    // Inner tensor micro-tiles
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        ctx.strokeRect(155 + col * 42, 75 + row * 34, 34, 26);
        ctx.fillRect(155 + col * 42, 75 + row * 34, 34, 26);
      }
    }

    // 2. HBM3e Memory Stacks (Left & Right)
    ctx.strokeStyle = '#06b6d4';
    ctx.strokeRect(30, 50, 75, 180);
    ctx.strokeRect(375, 50, 75, 180);

    // 3. Optical Interconnect Bus (Bottom)
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(100, 245, 280, 40);

    // Trace circuit copper lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(105, 100); ctx.lineTo(140, 100);
    ctx.moveTo(105, 150); ctx.lineTo(140, 150);
    ctx.moveTo(340, 100); ctx.lineTo(375, 100);
    ctx.moveTo(340, 150); ctx.lineTo(375, 150);
    ctx.moveTo(240, 220); ctx.lineTo(240, 245);
    ctx.stroke();

    // Laser Scanline overlay
    if (scanY >= 0) {
      const grad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.85)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 15, w, 30);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();
    }

    // Detected Bounding Boxes overlay
    if (boxes) {
      const detected = [
        { x: 135, y: 55, w: 210, h: 170, label: 'Gemini Tensor Matrix (4x4 v5e Cores)', conf: '99.9%', color: '#9333ea' },
        { x: 25, y: 45, w: 85, h: 190, label: 'HBM3e 48GB High-Bandwidth Stack', conf: '99.7%', color: '#06b6d4' },
        { x: 370, y: 45, w: 85, h: 190, label: 'HBM3e 48GB Ultra-L2 Bus', conf: '99.8%', color: '#06b6d4' },
        { x: 95, y: 240, w: 290, h: 50, label: 'Optical Interconnect 3.2 Tbps', conf: '99.4%', color: '#f59e0b' }
      ];

      detected.forEach(item => {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = item.color;
        ctx.strokeRect(item.x, item.y, item.w, item.h);

        // Corner accents
        const len = 8;
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x - 2, item.y - 2, len, 3);
        ctx.fillRect(item.x - 2, item.y - 2, 3, len);
        ctx.fillRect(item.x + item.w - len + 2, item.y - 2, len, 3);
        ctx.fillRect(item.x + item.w - 1, item.y - 2, 3, len);

        // Pill label
        ctx.font = '11px sans-serif';
        const txt = `${item.label} [${item.conf}]`;
        const tw = ctx.measureText(txt).width;
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y - 18, tw + 10, 18);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(txt, item.x + 5, item.y - 5);
        ctx.shadowBlur = 0;
      });
    }
  }

  runVisionScan(logBox) {
    if (window.soundEngine) window.soundEngine.playRadarScan();
    let scanY = 0;
    const canvas = document.getElementById('vision-canvas');
    if (!canvas) return;

    if (logBox) {
      logBox.innerHTML = '<div class="log-line text-cyan">⚡ マルチモーダル視覚空間解析エンジン起動 (Latency: 82ms)...</div>';
    }

    const scanInterval = setInterval(() => {
      scanY += 12;
      this.drawVisionCanvas(false, scanY);

      if (scanY > canvas.height) {
        clearInterval(scanInterval);
        this.drawVisionCanvas(true, -1);
        if (window.soundEngine) window.soundEngine.playSuccess();
        if (logBox) {
          logBox.innerHTML += `
            <div class="log-line text-green">✔ [100% 完了] 4箇所の主要マイクロアーキテクチャ領域を空間特定</div>
            <div class="log-line text-purple">▸ テンソル演算コア: 16基の並列マトリクスユニット (確信度: 99.9%)</div>
            <div class="log-line text-cyan">▸ 高帯域メモリ: 左右2基の96GB HBM3eスタック (確信度: 99.8%)</div>
            <div class="log-line text-amber">▸ 光インターコネクト: 3.2Tbps 超低遅延バス検知 (確信度: 99.4%)</div>
            <div class="log-line text-white">★ 結論: 高密度AI推論に最適化された最新SoCダイ構造と判定。</div>
          `;
        }
      }
    }, 20);
  }

  // =========================================================================
  // 3. 1,000,000 TOKEN NEEDLE IN A HAYSTACK SCANNER
  // =========================================================================
  setupNeedleSearch() {
    this.renderNeedleGrid();
    const btn = document.getElementById('needle-scan-btn');
    if (btn) {
      btn.addEventListener('click', () => this.runNeedleSearch());
    }
  }

  renderNeedleGrid(targetIdx = -1) {
    const container = document.getElementById('needle-matrix-grid');
    if (!container) return;
    container.innerHTML = '';

    // 800 blocks (each representing 1,250 tokens = 1,000,000 tokens)
    const totalBlocks = 600;
    for (let i = 0; i < totalBlocks; i++) {
      const block = document.createElement('div');
      block.className = 'matrix-cell';
      block.id = `cell-${i}`;
      if (i === targetIdx) {
        block.classList.add('needle-hit');
      }
      container.appendChild(block);
    }
  }

  runNeedleSearch() {
    const needleIdx = 437; // Target block (represents ~728,000 token mark)
    const resultBox = document.getElementById('needle-result-output');
    const timeDisplay = document.getElementById('needle-latency-val');
    const accDisplay = document.getElementById('needle-acc-val');

    if (window.soundEngine) window.soundEngine.playRadarScan();
    if (window.triggerEnergySurge) window.triggerEnergySurge();

    // Fast progressive sweep
    let currentSweep = 0;
    const total = 600;
    const sweepInterval = setInterval(() => {
      for (let k = 0; k < 30 && currentSweep < total; k++) {
        const cell = document.getElementById(`cell-${currentSweep}`);
        if (cell) {
          cell.classList.add('active-sweep');
        }
        currentSweep++;
      }

      if (currentSweep >= total) {
        clearInterval(sweepInterval);
        // Highlight hit
        const target = document.getElementById(`cell-${needleIdx}`);
        if (target) {
          target.classList.add('needle-hit');
        }
        if (window.soundEngine) window.soundEngine.playNeedleHit();

        if (timeDisplay) timeDisplay.textContent = '114 ms';
        if (accDisplay) accDisplay.textContent = '100.0%';
        if (resultBox) {
          resultBox.innerHTML = `
            <div class="needle-banner-success">
              <span class="needle-badge">🎯 TARGET LOCATED (100% 精密抽出)</span>
              <div class="needle-meta">発見位置: <strong>トークン #728,340</strong> (全 1,000,000 トークン中) / 探索所要時間: <strong>114 ms</strong></div>
              <div class="needle-content">
                <code>秘密鍵: "GEMINI_38_FLASH_QUANTUM_CORE_0x9A"</code>
                <p>前後の文脈: 「...分散クラスタの認証ハンドシェイク時に使用される暗号化シード値は上記の通り。このトークンは全アーキテクチャの根幹を司る。」</p>
              </div>
            </div>
          `;
        }
      }
    }, 12);
  }

  // =========================================================================
  // 4. SUB-180ms REALTIME VOICE STREAM SIMULATOR
  // =========================================================================
  setupVoiceStream() {
    const micBtn = document.getElementById('voice-demo-btn');
    if (micBtn) {
      micBtn.addEventListener('click', () => this.simulateVoiceInteraction());
    }
  }

  initVoiceWave() {
    const canvas = document.getElementById('voice-wave-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const draw = () => {
      if (!canvas.isConnected) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      phase += 0.05;

      // Draw multi-layered voice wave
      const layers = [
        { amp: 22, freq: 0.03, color: 'rgba(59, 130, 246, 0.8)', lw: 2.5 },
        { amp: 14, freq: 0.05, color: 'rgba(6, 182, 212, 0.6)', lw: 1.8 },
        { amp: 28, freq: 0.02, color: 'rgba(147, 51, 234, 0.4)', lw: 1.2 }
      ];

      layers.forEach(layer => {
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.lw;

        for (let x = 0; x < w; x++) {
          const y = cy + Math.sin(x * layer.freq + phase) * layer.amp * Math.sin((x / w) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      requestAnimationFrame(draw);
    };
    draw();
  }

  simulateVoiceInteraction() {
    const statusText = document.getElementById('voice-status-text');
    const latencyVal = document.getElementById('voice-latency-val');
    const transcript = document.getElementById('voice-transcript-box');

    if (window.soundEngine) window.soundEngine.playClick();
    if (statusText) statusText.innerHTML = '🔴 ユーザー発話検知中:「最新の論文の要点を3秒でまとめて」';

    setTimeout(() => {
      if (statusText) statusText.innerHTML = '⚡ Gemini 3.8 Flash 思考・同時発話ストリーム開始 (Full-Duplex)';
      if (latencyVal) latencyVal.textContent = '162 ms';
      if (window.soundEngine) window.soundEngine.playStreamToken();

      if (transcript) {
        transcript.innerHTML = `
          <div class="chat-bubble user">
            <span class="sender">User</span>
            <p>「最新の量子深層学習に関する論文の要点を3秒でまとめて」</p>
          </div>
          <div class="chat-bubble model">
            <span class="sender">Gemini 3.8 Flash (応答遅延: 162ms)</span>
            <p>「了解です！主なブレイクスルーは3点。1つ目はテンソル並列性の3倍向上、2つ目はメモリ帯域のボトルネック完全解消、3つ目は消費電力40%削減です。」</p>
          </div>
        `;
      }
      if (window.soundEngine) window.soundEngine.playSuccess();
    }, 180);
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.playground = new PlaygroundController();
});
