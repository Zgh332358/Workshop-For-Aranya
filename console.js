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
    if (el && el.checked) completed++;
  });

  const completionPercent = Math.min(((completed / checklistItems.length) * 100).toFixed(1), 100);

  const completedHUD = document.getElementById("realtime-task-completed");
  if (completedHUD) completedHUD.textContent = `${completed} / ${checklistItems.length}`;

  const soulSyncVal = document.getElementById("soul-sync-val");
  const soulSyncBar = document.getElementById("soul-sync-bar");
  if (soulSyncVal) soulSyncVal.textContent = `${completionPercent}%`;
  if (soulSyncBar) soulSyncBar.style.width = `${completionPercent}%`;
}

const speechPrompts = {
  1: '"主控官，请在右侧 Providers 中配置 API 密钥授权。"',
  2: '"请点击右侧的 Character Profile，重新塑造我的人格设定吧！"',
  3: '"在右侧的 Voice Settings 中配置我的 TTS 音色。"',
  4: '"在右侧打开 Memory settings，配置长期向量记忆。"',
  5: '"在右侧的 Avatar settings 中装载 Live2D / VRM 模型。"'
};

let currentStep = 1;
const totalSteps = 5;

function updateWizardStepUI(stepNum) {
  currentStep = stepNum;

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
    if (stepEl) stepEl.classList.toggle("hidden", i !== currentStep);
  }

  const stepCountHud = document.getElementById("step-count-hud");
  if (stepCountHud) stepCountHud.textContent = `NODE: ${currentStep}/${totalSteps}`;

  const prevBtn = document.getElementById("prev-step-btn");
  if (prevBtn) prevBtn.disabled = currentStep === 1;

  const nextBtn = document.getElementById("next-step-btn");
  if (nextBtn) nextBtn.textContent = currentStep === totalSteps ? "FINISH" : "NEXT >>";

  const bubble = document.getElementById("airi-speech-bubble");
  if (bubble && speechPrompts[currentStep]) bubble.textContent = speechPrompts[currentStep];
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  updateGlobalProgress();

  // Checklist progress wiring
  checklistItems.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", updateGlobalProgress);
  });

  // Wizard step navigation
  document.querySelectorAll(".step-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      updateWizardStepUI(parseInt(btn.getAttribute("data-step")));
    });
  });

  const prevBtn = document.getElementById("prev-step-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 1) updateWizardStepUI(currentStep - 1);
    });
  }

  const nextBtn = document.getElementById("next-step-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentStep < totalSteps) {
        updateWizardStepUI(currentStep + 1);
      } else {
        alert("Airi 配置流程已完成！");
      }
    });
  }

  // Iframe loading mask
  const targetIframe = document.getElementById("airi-settings-iframe");
  const iframeLoader = document.getElementById("iframe-loading");
  function hideLoader() {
    if (!iframeLoader) return;
    iframeLoader.classList.add("opacity-0");
    setTimeout(() => { iframeLoader.style.display = "none"; }, 600);
  }
  if (targetIframe) targetIframe.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 4500);

  const skipLoadBtn = document.getElementById("skip-load-btn");
  if (skipLoadBtn) skipLoadBtn.addEventListener("click", hideLoader);

  // Node 1: simulated API key tester
  const simNode1Btn = document.getElementById("sim-test-conn-node1-btn");
  const node1Result = document.getElementById("sim-node1-result");
  const ledDisconnected = document.getElementById("led-disconnected");
  const ledAuthorizing = document.getElementById("led-authorizing");
  const ledSecured = document.getElementById("led-secured");

  if (simNode1Btn && node1Result) {
    simNode1Btn.addEventListener("click", () => {
      ledDisconnected.className = "w-2.5 h-2.5 rounded-full bg-red-600/20";
      ledAuthorizing.className = "w-2.5 h-2.5 rounded-full bg-yellow-500";
      ledSecured.className = "w-2.5 h-2.5 rounded-full bg-emerald-500/20";

      node1Result.classList.remove("hidden");
      node1Result.innerHTML = "<span class='text-yellow-400 font-bold'>> AUTHORIZING...</span>";

      setTimeout(() => {
        ledAuthorizing.className = "w-2.5 h-2.5 rounded-full bg-yellow-500/20";
        ledSecured.className = "w-2.5 h-2.5 rounded-full bg-emerald-500";
        node1Result.innerHTML = `
          <div class="text-emerald-400 flex flex-col gap-0.5">
            <span class="font-bold">✓ SECURED CONNECTION STABLE</span>
            <span>Handshake: WebSocket SSL</span>
            <span>Endpoint: auth.airi.moeru.ai</span>
          </div>`;
        const chk = document.getElementById("chk-api-3");
        if (chk && !chk.checked) { chk.checked = true; updateGlobalProgress(); }
      }, 1200);
    });
  }

  // Node 2: drag/click to "parse" character card
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
    const reveal = () => {
      parsedHolo.classList.remove("hidden");
      const chk = document.getElementById("chk-char-3");
      if (chk && !chk.checked) { chk.checked = true; updateGlobalProgress(); }
    };
    dragZone.addEventListener("drop", reveal);
    dragZone.addEventListener("click", reveal);
  }

  // Node 3: static oscilloscope (drawn once)
  const oscCanvas = document.getElementById("node3-oscilloscope");
  if (oscCanvas) {
    const oCtx = oscCanvas.getContext("2d");
    const oW = oscCanvas.width = oscCanvas.offsetWidth;
    const oH = oscCanvas.height = oscCanvas.offsetHeight;
    oCtx.strokeStyle = "#00ff66";
    oCtx.lineWidth = 1.5;
    oCtx.beginPath();
    for (let i = 0; i < oW; i++) {
      const y = oH / 2 + Math.sin(i * 0.08) * 4;
      if (i === 0) oCtx.moveTo(i, y);
      else oCtx.lineTo(i, y);
    }
    oCtx.stroke();
  }

  const playVoiceBtn = document.getElementById("node3-voice-test-btn");
  if (playVoiceBtn) {
    playVoiceBtn.addEventListener("click", () => {
      const chk = document.getElementById("chk-voice-3");
      if (chk && !chk.checked) { chk.checked = true; updateGlobalProgress(); }
    });
  }

  // Node 4: static memory mesh (redrawn only on slider change)
  const meshCanvas = document.getElementById("node4-memory-mesh");
  const matrixSlider = document.getElementById("node4-matrix-slider");
  const densityVal = document.getElementById("matrix-density-val");

  if (meshCanvas && matrixSlider) {
    const mCtx = meshCanvas.getContext("2d");
    const mW = meshCanvas.width = meshCanvas.offsetWidth;
    const mH = meshCanvas.height = meshCanvas.offsetHeight;

    function drawMeshOnce(count) {
      const points = [];
      for (let i = 0; i < count; i++) {
        points.push({ x: Math.random() * mW, y: Math.random() * mH });
      }
      mCtx.clearRect(0, 0, mW, mH);
      mCtx.strokeStyle = "rgba(0, 255, 102, 0.15)";
      mCtx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < 55) {
            mCtx.beginPath();
            mCtx.moveTo(points[i].x, points[i].y);
            mCtx.lineTo(points[j].x, points[j].y);
            mCtx.stroke();
          }
        }
      }
      mCtx.fillStyle = "#00ff66";
      points.forEach(p => {
        mCtx.beginPath();
        mCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        mCtx.fill();
      });
    }

    drawMeshOnce(parseInt(matrixSlider.value));

    matrixSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      if (densityVal) densityVal.textContent = val;
      drawMeshOnce(parseInt(val));
      const chk = document.getElementById("chk-mem-3");
      if (chk && !chk.checked) { chk.checked = true; updateGlobalProgress(); }
    });
  }
});
