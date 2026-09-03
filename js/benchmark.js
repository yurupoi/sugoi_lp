/**
 * Gemini 3.8 Flash LP - Interactive Benchmark Radar & TCO Cost Calculator
 * Pure Canvas radar chart and real-time cost-saving ROI calculation.
 */

class BenchmarkController {
  constructor() {
    this.canvas = document.getElementById('benchmark-radar-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.activeModels = {
      gemini: true,
      gpt4o: true,
      claude: true,
      opus: false,
      grok: false,
      kimi: false,
      llama: false
    };

    this.dimensions = [
      { label: '推論速度 (TPS)', max: 100 },
      { label: '視覚・マルチモーダル', max: 100 },
      { label: '100万トークン文脈', max: 100 },
      { label: 'コード生成力', max: 100 },
      { label: 'コスト効率性 (コスパ)', max: 100 },
      { label: '超低遅延対話 (Audio)', max: 100 }
    ];

    this.modelData = {
      gemini: {
        name: 'Gemini 3.8 Flash',
        color: '#38bdf8',
        fill: 'rgba(56, 189, 248, 0.3)',
        scores: [98, 95, 99, 94, 98, 97]
      },
      gpt4o: {
        name: 'GPT-4o',
        color: '#10b981',
        fill: 'rgba(16, 185, 129, 0.15)',
        scores: [74, 92, 60, 92, 55, 78]
      },
      claude: {
        name: 'Claude 3.5 Sonnet',
        color: '#f97316',
        fill: 'rgba(249, 115, 22, 0.15)',
        scores: [68, 91, 72, 96, 50, 45]
      },
      opus: {
        name: 'Claude 3.5 Opus',
        color: '#e11d48',
        fill: 'rgba(225, 29, 72, 0.15)',
        scores: [38, 95, 62, 98, 25, 20]
      },
      grok: {
        name: 'Grok 2 / 3 (xAI)',
        color: '#f43f5e',
        fill: 'rgba(244, 63, 94, 0.15)',
        scores: [78, 88, 58, 90, 60, 40]
      },
      kimi: {
        name: 'Kimi k1.5 (Moonshot)',
        color: '#14b8a6',
        fill: 'rgba(20, 184, 166, 0.15)',
        scores: [62, 82, 96, 85, 72, 30]
      },
      llama: {
        name: 'Llama 3.1 405B',
        color: '#a855f7',
        fill: 'rgba(168, 85, 247, 0.15)',
        scores: [52, 70, 68, 86, 62, 35]
      }
    };

    this.init();
  }

  init() {
    this.setupRadar();
    this.setupModelToggles();
    this.setupCostCalculator();
  }

  setupRadar() {
    if (!this.canvas || !this.ctx) return;
    this.drawRadar();
    window.addEventListener('resize', () => this.drawRadar());
  }

  setupModelToggles() {
    const checkboxes = document.querySelectorAll('.model-toggle-chk');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', (e) => {
        const modelKey = e.target.getAttribute('data-model');
        this.activeModels[modelKey] = e.target.checked;
        this.drawRadar();
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });
  }

  drawRadar() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.38;
    const numPoints = this.dimensions.length;

    ctx.clearRect(0, 0, w, h);

    // Draw background concentric polygon rings
    const rings = 5;
    for (let r = 1; r <= rings; r++) {
      const ringRadius = (radius / rings) * r;
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
        const x = cx + ringRadius * Math.cos(angle);
        const y = cy + ringRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = r === rings ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines and labels
    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      // Dimension Label
      const labelX = cx + (radius + 28) * Math.cos(angle);
      const labelY = cy + (radius + 28) * Math.sin(angle);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = Math.abs(Math.cos(angle)) < 0.2 ? 'center' : (Math.cos(angle) > 0 ? 'left' : 'right');
      ctx.textBaseline = 'middle';
      ctx.fillText(this.dimensions[i].label, labelX, labelY);
    }

    // Draw model polygons
    Object.keys(this.modelData).forEach(key => {
      if (!this.activeModels[key]) return;
      const model = this.modelData[key];
      const isGemini = key === 'gemini';

      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
        const score = model.scores[i];
        const valRadius = (radius * (score / 100));
        const x = cx + valRadius * Math.cos(angle);
        const y = cy + valRadius * Math.sin(angle);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      ctx.fillStyle = model.fill;
      ctx.fill();

      ctx.strokeStyle = model.color;
      ctx.lineWidth = isGemini ? 3 : 1.8;
      if (isGemini) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = model.color;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw vertices
      for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
        const score = model.scores[i];
        const valRadius = (radius * (score / 100));
        const x = cx + valRadius * Math.cos(angle);
        const y = cy + valRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, isGemini ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = model.color;
        ctx.fill();
      }
    });
  }

  // =========================================================================
  // TCO COST & TIME-SAVINGS CALCULATOR
  // =========================================================================
  setupCostCalculator() {
    const reqSlider = document.getElementById('calc-requests');
    const inTokenSlider = document.getElementById('calc-in-tokens');
    const outTokenSlider = document.getElementById('calc-out-tokens');

    const reqLabel = document.getElementById('calc-requests-val');
    const inTokenLabel = document.getElementById('calc-in-tokens-val');
    const outTokenLabel = document.getElementById('calc-out-tokens-val');

    const savingDollarsLabel = document.getElementById('calc-saving-dollars');
    const savingPercentLabel = document.getElementById('calc-saving-percent');
    const savingHoursLabel = document.getElementById('calc-saving-hours');
    const competitorCostLabel = document.getElementById('calc-competitor-cost');
    const geminiCostLabel = document.getElementById('calc-gemini-cost');

    const updateCalc = () => {
      const requests = parseInt(reqSlider?.value || '100000', 10);
      const inTokens = parseInt(inTokenSlider?.value || '2000', 10);
      const outTokens = parseInt(outTokenSlider?.value || '500', 10);

      if (reqLabel) reqLabel.textContent = requests.toLocaleString() + ' 回/月';
      if (inTokenLabel) inTokenLabel.textContent = inTokens.toLocaleString() + ' tokens';
      if (outTokenLabel) outTokenLabel.textContent = outTokens.toLocaleString() + ' tokens';

      const targetModelSelect = document.getElementById('calc-target-model');
      const targetModelKey = targetModelSelect ? targetModelSelect.value : 'gpt4o';

      const pricingTable = {
        gpt4o: { in: 5.00, out: 15.00, tps: 74, name: 'GPT-4o' },
        opus: { in: 15.00, out: 75.00, tps: 38, name: 'Claude 3.5 Opus' },
        claude: { in: 3.00, out: 15.00, tps: 68, name: 'Claude 3.5 Sonnet' },
        grok: { in: 2.00, out: 10.00, tps: 78, name: 'Grok 2 / 3' },
        kimi: { in: 1.50, out: 3.00, tps: 62, name: 'Kimi k1.5' },
        llama: { in: 3.00, out: 5.00, tps: 52, name: 'Llama 3.1 405B' }
      };

      const comp = pricingTable[targetModelKey] || pricingTable.gpt4o;

      // Pricing (Per 1M tokens)
      // Selected Competitor vs Gemini 3.8 Flash ($0.35 in / $1.05 out, 248 tps)
      const totalInM = (requests * inTokens) / 1000000;
      const totalOutM = (requests * outTokens) / 1000000;

      const competitorCost = (totalInM * comp.in) + (totalOutM * comp.out);
      const geminiCost = (totalInM * 0.35) + (totalOutM * 1.05);

      const monthlySavings = Math.max(0, competitorCost - geminiCost);
      const annualSavings = monthlySavings * 12;
      const percentSaved = Math.round((monthlySavings / competitorCost) * 100);

      // Latency Savings:
      // Competitor avg tps vs Gemini 3.8 Flash (248 tps)
      const secondsSavedPerReq = Math.max(0, (outTokens / comp.tps) - (outTokens / 248));
      const totalHoursSavedAnnual = Math.round((requests * secondsSavedPerReq * 12) / 3600);

      if (savingDollarsLabel) {
        savingDollarsLabel.textContent = `約 $${Math.round(annualSavings).toLocaleString()}`;
      }
      if (savingPercentLabel) {
        savingPercentLabel.textContent = `${percentSaved}% コスト削減`;
      }
      if (savingHoursLabel) {
        savingHoursLabel.textContent = `${totalHoursSavedAnnual.toLocaleString()} 時間`;
      }
      if (competitorCostLabel) {
        competitorCostLabel.textContent = `$${Math.round(competitorCost).toLocaleString()} /月 (${comp.name})`;
      }
      if (geminiCostLabel) {
        geminiCostLabel.textContent = `$${Math.round(geminiCost).toLocaleString()} /月`;
      }
    };

    const targetModelSelect = document.getElementById('calc-target-model');
    if (targetModelSelect) {
      targetModelSelect.addEventListener('change', () => {
        updateCalc();
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    [reqSlider, inTokenSlider, outTokenSlider].forEach(slider => {
      if (slider) {
        slider.addEventListener('input', updateCalc);
      }
    });

    updateCalc();
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.benchmarkController = new BenchmarkController();
});
