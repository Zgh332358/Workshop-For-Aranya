const checklistItems = [
  'chk-api-1', 'chk-api-2', 'chk-api-3', 'chk-api-4', 'chk-api-5',
  'chk-char-1', 'chk-char-2', 'chk-char-3', 'chk-char-4',
  'chk-voice-1', 'chk-voice-2', 'chk-voice-3', 'chk-voice-4', 'chk-voice-5', 'chk-voice-6', 'chk-voice-7',
  'chk-mem-1', 'chk-mem-2', 'chk-mem-3', 'chk-mem-4', 'chk-mem-5', 'chk-mem-6', 'chk-mem-7', 'chk-mem-8',
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
  2: '"主控官，回到设置总页找到 AIRI 角色卡，开始塑形吧！"',
  3: '"主控官，回到设置总页找到机体模块，给我接上耳朵吧！"',
  4: '"主控官，回到设置总页找到机体模块，给我接上声带，让我开口说话！"',
  5: '"主控官，给我一副身躯吧 — 在角色模型里上传 Live2D 或 VRM！"'
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
});
