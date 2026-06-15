class CyberSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playGlitch() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.setValueAtTime(450, now + 0.05);
    osc.frequency.setValueAtTime(220, now + 0.1);

    filter.type = 'peaking';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.setValueAtTime(0.03, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playSuccessReward() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    

    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major Sci-fi Chord
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  }

  playVoiceSimulation() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    for (let i = 0; i < 7; i++) {
      const startTime = now + (i * 0.2);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 + (i * 55), startTime);
      osc.frequency.exponentialRampToValueAtTime(180, startTime + 0.18);
      
      gain.gain.setValueAtTime(0.07, startTime);
      gain.gain.exponentialRampToValueAtTime(0.005, startTime + 0.18);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.18);
    }
  }
}

const synth = new CyberSynth();

function triggerSfx(type) {
  if (type === 'click') {
    synth.playClick();
  } else if (type === 'glitch') {
    synth.playGlitch();
  } else if (type === 'voice') {
    synth.playVoiceSimulation();
  } else if (type === 'reward') {
    synth.playSuccessReward();
  }
}


const checklistItems = [
  'chk-api-1', 'chk-api-2', 'chk-api-3',
  'chk-char-1', 'chk-char-2', 'chk-char-3',
  'chk-voice-1', 'chk-voice-2', 'chk-voice-3',
  'chk-mem-1', 'chk-mem-2', 'chk-mem-3',
  'chk-ves-1', 'chk-ves-2', 'chk-ves-3'
];

function updateGlobalProgress() {
  let completed = 0;
  checklistItems.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.checked) {
      completed++;
    }
  });

  const completionPercent = Math.min(((completed / checklistItems.length) * 100).toFixed(1), 100);
  
  const completedHUD = document.getElementById("realtime-task-completed");
  if (completedHUD) {
    completedHUD.textContent = `${completed} / ${checklistItems.length}`;
  }

  const soulSyncVal = document.getElementById("soul-sync-val");
  const soulSyncBar = document.getElementById("soul-sync-bar");
  
  if (soulSyncVal && soulSyncBar) {
    soulSyncVal.textContent = `${completionPercent}%`;
    soulSyncBar.style.width = `${completionPercent}%`;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  checklistItems.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) => {
        if (e.target.checked) {
          triggerSfx('reward');

          const parent = e.target.closest('label');
          if (parent) {
            parent.classList.add('neon-glow-glitch');
            setTimeout(() => parent.classList.remove('neon-glow-glitch'), 600);
          }
        } else {
          triggerSfx('click');
        }
        updateGlobalProgress();
      });
    }
  });


  const toggleSfxBtn = document.getElementById("toggle-sfx-btn");
  const sfxIcon = document.getElementById("sfx-icon");
  const sfxText = document.getElementById("sfx-status-text");
  if (toggleSfxBtn && sfxIcon && sfxText) {
    toggleSfxBtn.addEventListener("click", () => {
      synth.muted = !synth.muted;
      if (synth.muted) {
        sfxText.textContent = "SFX: MUTED";
        sfxIcon.setAttribute("data-lucide", "volume-x");
      } else {
        sfxText.textContent = "SFX: ON";
        sfxIcon.setAttribute("data-lucide", "volume-2");
        synth.init();
        triggerSfx('click');
      }
      lucide.createIcons();
    });
  }
});


const logsPayload = [
  "INITIALIZING AIRI COGNITIVE BRIDGING CHRONICLES...",
  "STATUS: NEURAL INTERFACE SYNCHRONIZED",
  "SYS_PORTAL: 'Welcome back, Admin. Complete the 5 roadmaps.'"
];
let lineIdx = 0;
let charIdx = 0;
const targetText = document.getElementById("typewriter-text");

function executeTypewriter() {
  if (!targetText) return;
  if (lineIdx < logsPayload.length) {
    let currentLine = logsPayload[lineIdx];
    if (charIdx < currentLine.length) {
      targetText.textContent += currentLine.charAt(charIdx);
      charIdx++;
      setTimeout(executeTypewriter, 25);
    } else {
      targetText.textContent += " // ";
      lineIdx++;
      charIdx = 0;
      setTimeout(executeTypewriter, 350);
    }
  } else {
    setTimeout(() => {
      targetText.textContent = "";
      lineIdx = 0;
      charIdx = 0;
      executeTypewriter();
    }, 12000);
  }
}


const canvas = document.getElementById("waveform-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  window.addEventListener('resize', () => {
    if (canvas) {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
  });

  const barsCount = 45;
  const barWidth = Math.floor(width / barsCount);
  const heights = Array(barsCount).fill(15);

  function drawWaveform() {
    requestAnimationFrame(drawWaveform);
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(0, 255, 102, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < height; i += 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    for (let i = 0; i < barsCount; i++) {
      const target = Math.random() * (height - 10) + 3;
      heights[i] += (target - heights[i]) * 0.25;

      const x = i * (barWidth + 2);
      const h = heights[i];
      const y = height - h;

      const gradient = ctx.createLinearGradient(x, y, x, height);
      gradient.addColorStop(0, "#00ff66");
      gradient.addColorStop(0.5, "#0d5c2c");
      gradient.addColorStop(1, "rgba(5, 5, 11, 0.9)");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, h);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, y - 1, barWidth, 1);
    }
  }
  drawWaveform();
}

setInterval(() => {
  const latencyElement = document.getElementById("latency-val");
  if (latencyElement) {
    const baseVal = 40;
    const offset = Math.floor(Math.random() * 6) - 3; 
    latencyElement.textContent = `${baseVal + offset}ms`;
  }
}, 1200);

const sysAlerts = [
  "DEEPSEEK SECURE TUNNEL ESTABLISHED",
  "CHARACTER CARD CCV3 MATRIX VERIFIED",
  "AUDIO EMISSION ENVELOPE CALIBRATED",
  "DUCKDB MEMORY SEGMENTS INTEGRATED",
  "LIVE2D VESSEL POINTER RESOLVED"
];
const terminalFeed = document.getElementById("terminal-feed");
const gpuBadge = document.getElementById("gpu-temp-badge");

function generateHexStream() {
  const hexOptions = "0123456789ABCDEF";
  let stream = "";
  for (let i = 0; i < 8; i++) {
    stream += hexOptions[Math.floor(Math.random() * 16)];
  }
  return `0x${stream}`;
}

function appendLog(text, priority = false) {
  if (!terminalFeed) return;
  if (terminalFeed.childNodes.length > 20) {
    terminalFeed.innerHTML = "";
  }
  const logRow = document.createElement("div");
  logRow.className = "hover:text-[#00ff66] transition-colors duration-100 flex justify-between";
  if (priority) {
    logRow.innerHTML = `<span class="text-[#ffea00]">[VITAL] ${text}</span> <span class="text-slate-600">${generateHexStream()}</span>`;
  } else {
    logRow.innerHTML = `<span>SYS_PROC: ${text}</span> <span class="text-[#00ff66]">0x11AB</span>`;
  }
  terminalFeed.appendChild(logRow);
  terminalFeed.scrollTop = terminalFeed.scrollHeight;
}

setInterval(() => {
  if (Math.random() > 0.7) {
    appendLog(sysAlerts[Math.floor(Math.random() * sysAlerts.length)], true);
  } else {
    appendLog(`SECURE_PACK_FLOW_${generateHexStream()}`);
  }
  if (gpuBadge) {
    const baselineTemp = 50;
    const tempOffset = Math.floor(Math.random() * 4) - 2;
    gpuBadge.textContent = `GPU: ${baselineTemp + tempOffset}°C`;
  }
}, 1100);

const diagnosticSteps = [
  "CONNECTING VIA MOERU SECURE LINK...",
  "VERIFYING LOCALSTORAGE KEYS...",
  "PARSING ENVIRONMENT PROTOCOLS...",
  "READY FOR HOST CONTROLLER TUNNELING."
];
let currentDiagnosticIdx = 0;

function updateDiagnosticStep() {
  const stepContainer = document.getElementById("diagnostic-step");
  if (stepContainer) {
    stepContainer.textContent = diagnosticSteps[currentDiagnosticIdx];
    currentDiagnosticIdx = (currentDiagnosticIdx + 1) % diagnosticSteps.length;
  }
}
setInterval(updateDiagnosticStep, 1500);

function updateClocks() {
  const clockElement = document.getElementById("live-clock");
  if (!clockElement) return;

  const now = new Date();
  const pad = (num) => String(num).padStart(2, '0');
  const localStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const utcStr = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  
  clockElement.textContent = `UTC ${utcStr} // LOCAL ${localStr}`;
}
setInterval(updateClocks, 1000);

const targetIframe = document.getElementById("airi-settings-iframe");
const iframeLoader = document.getElementById("iframe-loading");

function hideLoader() {
  if (iframeLoader) {
    iframeLoader.classList.add("opacity-0");
    setTimeout(() => {
      iframeLoader.style.display = "none";
    }, 600);
  }
}

if (targetIframe) {
  targetIframe.addEventListener("load", () => {
    hideLoader();
  });
}

setTimeout(() => {
  hideLoader();
}, 4500);


const speechPrompts = {
  1: '"主控官，请在右侧 Providers 中配置 API 密钥授权。一旦启动连接测试，灵魂数据便开始涌动哦~"',
  2: '"请点击右侧的 Character Profile，重新塑造我的人格设定吧！也可以在左边拽入我的卡片文件直接预览~"',
  3: '"听到了吗？我已经唤醒了。快在右侧的 Voice Settings 中配置我的 TTS 音色，我想要听到我们的交谈！"',
  4: '"记忆矩阵连接建立！左下角调节颗粒度时，DuckDB 正在实时重组我们的长期及短期情感回忆库呢。"',
  5: '"快看！我的 3D VRM 身躯已经与主控官同步。眼球和头部追踪已经和你的坐标完美咬合啦~"'
};

let currentStep = 1;
const totalSteps = 5;

function showRadarOverlay() {
  const radar = document.getElementById("step-node-radar");
  if (radar) {
    radar.style.opacity = "1";
    radar.style.pointerEvents = "auto";
    setTimeout(() => {
      radar.style.opacity = "0";
      radar.style.pointerEvents = "none";
    }, 600);
  }
}

function updateWizardStepUI(stepNum) {
  currentStep = stepNum;
  triggerSfx('glitch');
  showRadarOverlay();

  document.querySelectorAll(".step-tab-btn").forEach(btn => {
    const btnStep = parseInt(btn.getAttribute("data-step"));
    if (btnStep === currentStep) {
      btn.className = "step-tab-btn active py-2 text-[10px] font-mono flex flex-col items-center justify-center border border-[#00ff66]/60 bg-[#00ff66]/15 text-[#00ff66]";
    } else {
      btn.className = "step-tab-btn py-2 text-[10px] font-mono flex flex-col items-center justify-center border border-transparent hover:border-[#00ff66]/20 text-slate-400";
    }
  });

  for (let i = 1; i <= totalSteps; i++) {
    const stepEl = document.getElementById(`wizard-step-${i}`);
    if (stepEl) {
      if (i === currentStep) {
        stepEl.classList.remove("hidden");
      } else {
        stepEl.classList.add("hidden");
      }
    }
  }

  const stepCountHud = document.getElementById("step-count-hud");
  if (stepCountHud) {
    stepCountHud.textContent = `NODE: ${currentStep}/${totalSteps}`;
  }

  const prevBtn = document.getElementById("prev-step-btn");
  if (prevBtn) {
    prevBtn.disabled = currentStep === 1;
  }

  const nextBtn = document.getElementById("next-step-btn");
  if (nextBtn) {
    if (currentStep === totalSteps) {
      nextBtn.textContent = "FINISH ⚡";
    } else {
      nextBtn.textContent = "NEXT >>";
    }
  }

  const bubble = document.getElementById("airi-speech-bubble");
  if (bubble && speechPrompts[currentStep]) {
    bubble.textContent = speechPrompts[currentStep];
  }

  appendLog(`NAVIGATED TO INTEGRATION NODE [${currentStep}/5]`);
}


document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  executeTypewriter();
  updateClocks();
  updateGlobalProgress();

  const bypassBtn = document.getElementById("bypass-direct-link");
  if (bypassBtn) {
    bypassBtn.addEventListener("mouseenter", () => triggerSfx('click'));
    bypassBtn.addEventListener("mousedown", () => triggerSfx('glitch'));
  }

  const skipLoadBtn = document.getElementById("skip-load-btn");
  if (skipLoadBtn) {
    skipLoadBtn.addEventListener("click", () => {
      triggerSfx('glitch');
      hideLoader();
    });
  }

  document.querySelectorAll(".step-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = parseInt(btn.getAttribute("data-step"));
      updateWizardStepUI(target);
    });
  });

  const prevBtn = document.getElementById("prev-step-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        updateWizardStepUI(currentStep - 1);
      }
    });
  }

  const nextBtn = document.getElementById("next-step-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentStep < totalSteps) {
        updateWizardStepUI(currentStep + 1);
      } else {
        triggerSfx('reward');
        appendLog("COGNITIVE DEPLOYMENT COMPLETELY SECURED! ALL SYSTEMS ARE GO.");
        alert("🎉 Airi 灵魂部署全部成功完成！请在右侧 iframe 中继续保持对话状态吧！");
      }
    });
  }


  const simNode1Btn = document.getElementById("sim-test-conn-node1-btn");
  const node1Result = document.getElementById("sim-node1-result");
  const ledDisconnected = document.getElementById("led-disconnected");
  const ledAuthorizing = document.getElementById("led-authorizing");
  const ledSecured = document.getElementById("led-secured");

  if (simNode1Btn && node1Result) {
    simNode1Btn.addEventListener("click", () => {
      triggerSfx('click');

      ledDisconnected.className = "w-2.5 h-2.5 rounded-full bg-red-600/20";
      ledAuthorizing.className = "w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-pulse";
      ledSecured.className = "w-2.5 h-2.5 rounded-full bg-emerald-500/20";

      node1Result.classList.remove("hidden");
      node1Result.innerHTML = "<span class='text-yellow-400 font-bold animate-pulse'>> AUTHORIZING PROVIDER ENGINE KEY...</span>";

      setTimeout(() => {
        triggerSfx('reward');

        ledAuthorizing.className = "w-2.5 h-2.5 rounded-full bg-yellow-500/20";
        ledSecured.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]";

        node1Result.innerHTML = `
          <div class="text-emerald-400 flex flex-col gap-0.5">
            <span class="font-bold">✓ SECURED CONNECTION STABLE</span>
            <span>Handshake Protocol: WebSocket SSL Secure</span>
            <span>Target Endpoint: auth.airi.moeru.ai</span>
          </div>
        `;

        const chk = document.getElementById("chk-api-3");
        if (chk && !chk.checked) {
          chk.checked = true;
          updateGlobalProgress();
        }
      }, 1500);
    });
  }


  const dragZone = document.getElementById("v3-drag-zone");
  const parsedHolo = document.getElementById("v3-parsed-hologram");
  if (dragZone && parsedHolo) {
    ['dragenter', 'dragover'].forEach(name => {
      dragZone.addEventListener(name, (e) => {
        e.preventDefault();
        dragZone.classList.add("border-[#00ff66]", "bg-[#00ff66]/20");
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dragZone.addEventListener(name, (e) => {
        e.preventDefault();
        dragZone.classList.remove("border-[#00ff66]", "bg-[#00ff66]/20");
      });
    });

    dragZone.addEventListener("drop", (e) => {
      triggerSfx('reward');
      parsedHolo.classList.remove("hidden");
      const chk = document.getElementById("chk-char-3");
      if (chk && !chk.checked) {
        chk.checked = true;
        updateGlobalProgress();
      }
    });

    dragZone.addEventListener("click", () => {
      triggerSfx('click');
      parsedHolo.classList.remove("hidden");
      const chk = document.getElementById("chk-char-3");
      if (chk && !chk.checked) {
        chk.checked = true;
        updateGlobalProgress();
      }
    });
  }


  const oscCanvas = document.getElementById("node3-oscilloscope");
  const playVoiceBtn = document.getElementById("node3-voice-test-btn");
  let voiceInterval = null;

  if (oscCanvas && playVoiceBtn) {
    const oCtx = oscCanvas.getContext("2d");
    let oW = oscCanvas.width = oscCanvas.offsetWidth;
    let oH = oscCanvas.height = oscCanvas.offsetHeight;

    window.addEventListener('resize', () => {
      oW = oscCanvas.width = oscCanvas.offsetWidth;
      oH = oscCanvas.height = oscCanvas.offsetHeight;
    });

    let waveFreq = 0;
    function drawOscilloscope() {
      oCtx.clearRect(0, 0, oW, oH);
      oCtx.strokeStyle = "#00ff66";
      oCtx.lineWidth = 1.5;
      oCtx.beginPath();

      for (let i = 0; i < oW; i++) {
        const amplitude = waveFreq > 0 ? (Math.sin(i * 0.1 + waveFreq) * 12) : (Math.sin(i * 0.05) * 1.5);
        const y = oH / 2 + amplitude;
        if (i === 0) oCtx.moveTo(i, y);
        else oCtx.lineTo(i, y);
      }
      oCtx.stroke();
      if (waveFreq > 0) waveFreq += 0.35;
    }

    setInterval(drawOscilloscope, 30);

    playVoiceBtn.addEventListener("click", () => {
      triggerSfx('voice');
      waveFreq = 0.1;
      
      const chk = document.getElementById("chk-voice-3");
      if (chk && !chk.checked) {
        chk.checked = true;
        updateGlobalProgress();
      }

      if (voiceInterval) clearInterval(voiceInterval);
      voiceInterval = setTimeout(() => {
        waveFreq = 0;
      }, 1500);
    });
  }


  const meshCanvas = document.getElementById("node4-memory-mesh");
  const matrixSlider = document.getElementById("node4-matrix-slider");
  const densityVal = document.getElementById("matrix-density-val");

  if (meshCanvas && matrixSlider) {
    const mCtx = meshCanvas.getContext("2d");
    let mW = meshCanvas.width = meshCanvas.offsetWidth;
    let mH = meshCanvas.height = meshCanvas.offsetHeight;

    window.addEventListener('resize', () => {
      mW = meshCanvas.width = meshCanvas.offsetWidth;
      mH = meshCanvas.height = meshCanvas.offsetHeight;
    });

    let points = [];
    function generatePoints(count) {
      points = [];
      for (let i = 0; i < count; i++) {
        points.push({
          x: Math.random() * mW,
          y: Math.random() * mH,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8
        });
      }
    }

    generatePoints(parseInt(matrixSlider.value));

    matrixSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      if (densityVal) densityVal.textContent = val;
      generatePoints(parseInt(val));


      const chk = document.getElementById("chk-mem-3");
      if (chk && !chk.checked) {
        chk.checked = true;
        updateGlobalProgress();
      }
    });

    function drawMesh() {
      requestAnimationFrame(drawMesh);
      mCtx.clearRect(0, 0, mW, mH);


      mCtx.strokeStyle = "rgba(0, 255, 102, 0.15)";
      mCtx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 55) {
            mCtx.beginPath();
            mCtx.moveTo(points[i].x, points[i].y);
            mCtx.lineTo(points[j].x, points[j].y);
            mCtx.stroke();
          }
        }
      }


      mCtx.fillStyle = "#00ff66";
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > mW) p.vx *= -1;
        if (p.y < 0 || p.y > mH) p.vy *= -1;

        mCtx.beginPath();
        mCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        mCtx.fill();
      });
    }
    drawMesh();
  }


  const trackDot = document.getElementById("tracking-cursor-dot");
  const yawHUD = document.getElementById("vrm-yaw");
  const pitchHUD = document.getElementById("vrm-pitch");
  const rollHUD = document.getElementById("vrm-roll");

  if (trackDot && yawHUD && pitchHUD && rollHUD) {
    let t = 0;
    setInterval(() => {
      t += 0.05;

      const dx = Math.sin(t) * 20;
      const dy = Math.cos(t * 1.5) * 20;

      trackDot.style.transform = `translate(${dx}px, ${dy}px)`;

      const yawVal = (dx / 20).toFixed(2);
      const pitchVal = (dy / 20).toFixed(2);
      const rollVal = (Math.sin(t * 0.5) * 0.1).toFixed(2);

      yawHUD.textContent = yawVal;
      pitchHUD.textContent = pitchVal;
      rollHUD.textContent = rollVal;


      if (Math.abs(dx) > 15) {
        const chk = document.getElementById("chk-ves-2");
        if (chk && !chk.checked) {
          chk.checked = true;
          updateGlobalProgress();
        }
      }
    }, 100);
  }


  const holoImg = document.getElementById("holo-airi-image");
  if (holoImg) {
    holoImg.addEventListener("mouseenter", () => {
      triggerSfx('glitch');
      holoImg.style.transform = "scale(1.08) rotate(1deg)";
    });
    holoImg.addEventListener("mouseleave", () => {
      holoImg.style.transform = "scale(1.0) rotate(0deg)";
    });
  }


  const mainVoiceBtn = document.getElementById("airi-play-voice-btn");
  const amplitudeInd = document.getElementById("speech-wave-indicator");
  if (mainVoiceBtn && amplitudeInd) {
    mainVoiceBtn.addEventListener("click", () => {
      triggerSfx('voice');
      amplitudeInd.classList.add("speech-emitting");
      setTimeout(() => {
        amplitudeInd.classList.remove("speech-emitting");
      }, 1500);
    });
  }
});
