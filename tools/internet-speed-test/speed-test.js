/* ============================================================
   ALLBASE INTERNET SPEED TEST CONTROLLER
   Engine: @cloudflare/speedtest (Local ESM Vendor Distribution)
   ============================================================ */

import SpeedTestEngine from "../../assets/vendor/cloudflare-speedtest/speedtest.js";

// DOM Element References
const startBtn = document.getElementById('startBtn');
const cancelBtn = document.getElementById('cancelBtn');
const restartBtn = document.getElementById('restartBtn');
const copyBtn = document.getElementById('copyBtn');

const gaugeNumber = document.getElementById('gaugeNumber');
const gaugeUnit = document.getElementById('gaugeUnit');
const gaugeNeedle = document.getElementById('gaugeNeedle');
const gaugeActivePath = document.getElementById('gaugeActivePath');
const testStatusText = document.getElementById('testStatusText');
const statusPulseDot = document.getElementById('statusPulseDot');
const progressBarFill = document.getElementById('progressBarFill');
const progressTrack = document.getElementById('progressTrack');

const cardDownload = document.getElementById('cardDownload');
const cardUpload = document.getElementById('cardUpload');
const cardPing = document.getElementById('cardPing');
const cardJitter = document.getElementById('cardJitter');

const valDownload = document.getElementById('valDownload');
const valUpload = document.getElementById('valUpload');
const valPing = document.getElementById('valPing');
const valJitter = document.getElementById('valJitter');

const qualityOverallBadge = document.getElementById('qualityOverallBadge');
const scoreStreaming = document.getElementById('scoreStreaming');
const scoreGaming = document.getElementById('scoreGaming');
const scoreVideoCall = document.getElementById('scoreVideoCall');
const qualitySourceNote = document.getElementById('qualitySourceNote');

const infoTime = document.getElementById('infoTime');
const infoDuration = document.getElementById('infoDuration');
const infoOnline = document.getElementById('infoOnline');
const infoConnType = document.getElementById('infoConnType');
const cellularWarning = document.getElementById('cellularWarning');

// State Variables
let engineInstance = null;
let isRunning = false;
let isCancelled = false;
let isFinished = false;
let startTime = null;

// Helper: Mbps Conversion (bps / 1_000_000)
function formatMbps(bps) {
  if (bps === null || bps === undefined || isNaN(bps) || !isFinite(bps)) return null;
  const mbps = bps / 1_000_000;
  if (mbps < 0) return '0.00';
  return mbps.toFixed(2);
}

// Helper: ms Formatting
function formatMs(ms) {
  if (ms === null || ms === undefined || isNaN(ms) || !isFinite(ms)) return null;
  if (ms < 0) return '0.0';
  return ms.toFixed(1);
}

// Check Cellular Network
function checkCellularConnection() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    const type = conn.type;
    const effectiveType = conn.effectiveType;
    if (type === 'cellular' || effectiveType === '2g' || effectiveType === '3g' || effectiveType === '4g') {
      if (cellularWarning) cellularWarning.style.display = 'flex';
    }
    if (infoConnType) {
      const typeStr = conn.effectiveType ? conn.effectiveType.toUpperCase() : (conn.type || 'Standard');
      infoConnType.textContent = typeStr;
    }
  } else {
    if (infoConnType) infoConnType.textContent = 'Standard Web Browser';
  }
}

// Gauge Needle & Arc Animation
function updateGauge(valueMbps, mode = 'download') {
  if (valueMbps === null || valueMbps === undefined || isNaN(valueMbps)) {
    valueMbps = 0;
  }
  const val = Math.max(0, parseFloat(valueMbps));
  
  // Dynamic scale max (100, 500, 1000 Mbps)
  let maxMbps = 100;
  if (val > 100) maxMbps = 500;
  if (val > 500) maxMbps = 1000;

  // Gauge angle -90deg to +90deg
  const fraction = Math.min(1, val / maxMbps);
  const angle = -90 + (fraction * 180);

  if (gaugeNeedle) {
    gaugeNeedle.style.transform = `rotate(${angle}deg)`;
  }

  // Stroke Dashoffset for arc (arc length = 314.159)
  if (gaugeActivePath) {
    const totalArc = 314.159;
    const offset = totalArc - (fraction * totalArc);
    gaugeActivePath.style.strokeDashoffset = offset.toFixed(2);
  }

  if (gaugeNumber) {
    gaugeNumber.textContent = val.toFixed(2);
  }
  if (gaugeUnit) {
    gaugeUnit.textContent = 'Mbps';
  }
}

// Set Active Step Chips (1 to 6)
function setPhaseStep(stepNum) {
  for (let i = 1; i <= 6; i++) {
    const chip = document.getElementById(`step${i}`);
    if (chip) {
      chip.classList.remove('active', 'done');
      if (i < stepNum) chip.classList.add('done');
      else if (i === stepNum) chip.classList.add('active');
    }
  }

  // Update card highlights
  if (cardDownload) cardDownload.classList.toggle('active', stepNum === 3);
  if (cardUpload) cardUpload.classList.toggle('active', stepNum === 4);
  if (cardPing) cardPing.classList.toggle('active', stepNum === 2);
  if (cardJitter) cardJitter.classList.toggle('active', stepNum === 2);

  // Update Progress Bar
  const percentMap = { 1: 5, 2: 25, 3: 55, 4: 85, 5: 95, 6: 100 };
  const pct = percentMap[stepNum] || 0;
  if (progressBarFill) progressBarFill.style.width = `${pct}%`;
  if (progressTrack) progressTrack.setAttribute('aria-valuenow', pct.toString());
}

// Connection Quality Score Translation
function translateScore(scoreStr) {
  if (!scoreStr) return null;
  const s = String(scoreStr).toLowerCase();
  if (s.includes('great')) return { text: 'Sangat Baik', class: 'badge-success' };
  if (s.includes('good')) return { text: 'Baik', class: 'badge-primary' };
  if (s.includes('average')) return { text: 'Cukup', class: 'badge-warning' };
  if (s.includes('poor')) return { text: 'Kurang', class: 'badge-danger' };
  if (s.includes('bad')) return { text: 'Sangat Kurang', class: 'badge-danger' };
  return { text: scoreStr, class: 'badge-secondary' };
}

// Update Quality Score Display
function renderQualityScores(scoresObj, dlMbps, ulMbps, pingMs, jitterMs) {
  let streamTrans = null;
  let gameTrans = null;
  let rtcTrans = null;
  let isOfficialAim = false;

  if (scoresObj && typeof scoresObj === 'object') {
    if (scoresObj.streaming) streamTrans = translateScore(scoresObj.streaming.points || scoresObj.streaming.classification || scoresObj.streaming);
    if (scoresObj.gaming) gameTrans = translateScore(scoresObj.gaming.points || scoresObj.gaming.classification || scoresObj.gaming);
    if (scoresObj.rtc || scoresObj.videoCall) {
      const rtcVal = scoresObj.rtc || scoresObj.videoCall;
      rtcTrans = translateScore(rtcVal.points || rtcVal.classification || rtcVal);
    }
    if (streamTrans || gameTrans || rtcTrans) isOfficialAim = true;
  }

  // Fallback rating logic if getScores() is incomplete
  if (!isOfficialAim && dlMbps !== null && pingMs !== null) {
    const dl = parseFloat(dlMbps) || 0;
    const ul = parseFloat(ulMbps) || 0;
    const ping = parseFloat(pingMs) || 999;
    const jitter = parseFloat(jitterMs) || 999;

    let fallbackOverall = 'Cukup';
    let fallbackClass = 'badge-warning';

    if (dl >= 50 && ul >= 10 && ping <= 30 && jitter <= 10) {
      fallbackOverall = 'Sangat Baik';
      fallbackClass = 'badge-success';
      streamTrans = { text: 'Sangat Baik', class: 'badge-success' };
      gameTrans = { text: 'Sangat Baik', class: 'badge-success' };
      rtcTrans = { text: 'Sangat Baik', class: 'badge-success' };
    } else if (dl >= 20 && ul >= 5 && ping <= 60 && jitter <= 20) {
      fallbackOverall = 'Baik';
      fallbackClass = 'badge-primary';
      streamTrans = { text: 'Baik', class: 'badge-primary' };
      gameTrans = { text: 'Baik', class: 'badge-primary' };
      rtcTrans = { text: 'Baik', class: 'badge-primary' };
    } else if (dl >= 5 && ul >= 1 && ping <= 100) {
      fallbackOverall = 'Cukup';
      fallbackClass = 'badge-warning';
      streamTrans = { text: 'Cukup', class: 'badge-warning' };
      gameTrans = { text: 'Cukup', class: 'badge-warning' };
      rtcTrans = { text: 'Cukup', class: 'badge-warning' };
    } else {
      fallbackOverall = 'Kurang';
      fallbackClass = 'badge-danger';
      streamTrans = { text: 'Kurang', class: 'badge-danger' };
      gameTrans = { text: 'Kurang', class: 'badge-danger' };
      rtcTrans = { text: 'Kurang', class: 'badge-danger' };
    }

    if (qualityOverallBadge) {
      qualityOverallBadge.className = `badge ${fallbackClass}`;
      qualityOverallBadge.textContent = fallbackOverall;
    }
    if (qualitySourceNote) {
      qualitySourceNote.textContent = 'Penilaian umum ALLBASE — Penilaian merupakan perkiraan berdasarkan hasil pengujian saat ini.';
    }
  } else if (isOfficialAim) {
    if (qualityOverallBadge) {
      const overallText = streamTrans ? streamTrans.text : 'Terukur';
      const overallClass = streamTrans ? streamTrans.class : 'badge-primary';
      qualityOverallBadge.className = `badge ${overallClass}`;
      qualityOverallBadge.textContent = overallText;
    }
    if (qualitySourceNote) {
      qualitySourceNote.textContent = 'Penilaian resmi Cloudflare AIM berdasarkan performa latency & throughput real-time.';
    }
  }

  // Populate Use-Case UI items
  if (scoreStreaming && streamTrans) {
    scoreStreaming.innerHTML = `<span class="badge ${streamTrans.class}">${streamTrans.text}</span>`;
  }
  if (scoreGaming && gameTrans) {
    scoreGaming.innerHTML = `<span class="badge ${gameTrans.class}">${gameTrans.text}</span>`;
  }
  if (scoreVideoCall && rtcTrans) {
    scoreVideoCall.innerHTML = `<span class="badge ${rtcTrans.class}">${rtcTrans.text}</span>`;
  }
}

// Reset UI to Initial Idle State
function resetUI() {
  updateGauge(0);
  if (testStatusText) testStatusText.textContent = 'Siap untuk menguji koneksi';
  if (statusPulseDot) statusPulseDot.className = 'status-pulse-dot';
  
  for (let i = 1; i <= 6; i++) {
    const chip = document.getElementById(`step${i}`);
    if (chip) chip.className = 'step-chip';
  }

  if (progressBarFill) progressBarFill.style.width = '0%';
  if (progressTrack) progressTrack.setAttribute('aria-valuenow', '0');

  if (valDownload) valDownload.textContent = '—';
  if (valUpload) valUpload.textContent = '—';
  if (valPing) valPing.textContent = '—';
  if (valJitter) valJitter.textContent = '—';

  [cardDownload, cardUpload, cardPing, cardJitter].forEach(card => {
    if (card) card.classList.remove('active');
  });

  if (qualityOverallBadge) {
    qualityOverallBadge.className = 'badge badge-secondary';
    qualityOverallBadge.textContent = 'Menunggu pengujian...';
  }
  if (scoreStreaming) scoreStreaming.textContent = '—';
  if (scoreGaming) scoreGaming.textContent = '—';
  if (scoreVideoCall) scoreVideoCall.textContent = '—';

  if (startBtn) {
    startBtn.style.display = 'inline-flex';
    startBtn.disabled = false;
  }
  if (cancelBtn) {
    cancelBtn.style.display = 'none';
    cancelBtn.disabled = true;
  }
  if (restartBtn) {
    restartBtn.style.display = 'none';
  }
  if (copyBtn) {
    copyBtn.disabled = true;
  }

  if (infoTime) infoTime.textContent = '—';
  if (infoDuration) infoDuration.textContent = '—';
  if (infoOnline) infoOnline.textContent = navigator.onLine ? 'Online' : 'Offline';
}

// Start Speed Test Execution
function startSpeedTest() {
  if (isRunning) return;

  if (!navigator.onLine) {
    if (window.SubpageEngine) {
      window.SubpageEngine.showToast('Koneksi Internet tidak tersedia. Periksa jaringan Anda.', 'error');
    }
    if (testStatusText) testStatusText.textContent = 'Koneksi Internet tidak tersedia.';
    return;
  }

  resetUI();

  isRunning = true;
  isCancelled = false;
  isFinished = false;
  startTime = Date.now();

  if (startBtn) startBtn.style.display = 'none';
  if (cancelBtn) {
    cancelBtn.style.display = 'inline-flex';
    cancelBtn.disabled = false;
  }
  if (statusPulseDot) statusPulseDot.className = 'status-pulse-dot running';

  setPhaseStep(1);
  if (testStatusText) testStatusText.textContent = 'Menyiapkan pengujian...';

  // Instantiate Cloudflare SpeedTestEngine with balanced non-packetLoss config
  try {
    engineInstance = new SpeedTestEngine({
      autoStart: false,
      measureDownloadLoadedLatency: true,
      measureUploadLoadedLatency: true,
      measurements: [
        { type: "latency", numPackets: 5 },
        { type: "download", bytes: 1e5, count: 1, bypassMinDuration: true },
        { type: "latency", numPackets: 15 },
        { type: "download", bytes: 1e5, count: 4 },
        { type: "download", bytes: 1e6, count: 4 },
        { type: "download", bytes: 1e7, count: 2 },
        { type: "download", bytes: 2.5e7, count: 2 },
        { type: "latency", numPackets: 5 },
        { type: "upload", bytes: 1e5, count: 1, bypassMinDuration: true },
        { type: "upload", bytes: 1e5, count: 4 },
        { type: "upload", bytes: 1e6, count: 4 },
        { type: "upload", bytes: 1e7, count: 2 },
        { type: "upload", bytes: 2.5e7, count: 1 }
      ]
    });

    // Event: Running Change
    engineInstance.onRunningChange = (running) => {
      isRunning = running;
      if (!running && !isFinished && !isCancelled) {
        // Engine stopped prematurely without finish handler
      }
    };

    // Event: Live Results Change
    engineInstance.onResultsChange = (results) => {
      if (isCancelled) return;

      const dlBps = engineInstance.getDownloadBandwidth();
      const ulBps = engineInstance.getUploadBandwidth();
      const pingVal = engineInstance.getUnloadedLatency();
      const jitterVal = engineInstance.getUnloadedJitter();

      const dlFormatted = formatMbps(dlBps);
      const ulFormatted = formatMbps(ulBps);
      const pingFormatted = formatMs(pingVal);
      const jitterFormatted = formatMs(jitterVal);

      // Phase transitions based on active measurements
      if (ulBps !== null && ulBps !== undefined && parseFloat(ulBps) > 0) {
        setPhaseStep(4);
        if (testStatusText) testStatusText.textContent = 'Mengukur upload...';
        updateGauge(ulFormatted, 'upload');
        if (valUpload && ulFormatted !== null) valUpload.textContent = ulFormatted;
      } else if (dlBps !== null && dlBps !== undefined && parseFloat(dlBps) > 0) {
        setPhaseStep(3);
        if (testStatusText) testStatusText.textContent = 'Mengukur download...';
        updateGauge(dlFormatted, 'download');
        if (valDownload && dlFormatted !== null) valDownload.textContent = dlFormatted;
      } else if (pingVal !== null && pingVal !== undefined) {
        setPhaseStep(2);
        if (testStatusText) testStatusText.textContent = 'Mengukur ping & jitter...';
        updateGauge(0);
      }

      if (valPing && pingFormatted !== null) valPing.textContent = pingFormatted;
      if (valJitter && jitterFormatted !== null) valJitter.textContent = jitterFormatted;
    };

    // Event: Finish
    engineInstance.onFinish = (results) => {
      if (isCancelled) return;

      isRunning = false;
      isFinished = true;

      setPhaseStep(5);
      if (testStatusText) testStatusText.textContent = 'Menganalisis kualitas koneksi...';

      const dlBps = engineInstance.getDownloadBandwidth();
      const ulBps = engineInstance.getUploadBandwidth();
      const pingVal = engineInstance.getUnloadedLatency();
      const jitterVal = engineInstance.getUnloadedJitter();
      const scores = engineInstance.getScores ? engineInstance.getScores() : null;
      const durationMs = engineInstance.getTotalDurationMs ? engineInstance.getTotalDurationMs() : (Date.now() - startTime);

      const finalDl = formatMbps(dlBps) || '0.00';
      const finalUl = formatMbps(ulBps) || '0.00';
      const finalPing = formatMs(pingVal) || '0.0';
      const finalJitter = formatMs(jitterVal) || '0.0';

      if (valDownload) valDownload.textContent = finalDl;
      if (valUpload) valUpload.textContent = finalUl;
      if (valPing) valPing.textContent = finalPing;
      if (valJitter) valJitter.textContent = finalJitter;

      // Final gauge update with download speed
      updateGauge(finalDl, 'download');

      // Render quality scores
      renderQualityScores(scores, finalDl, finalUl, finalPing, finalJitter);

      // Metadata update
      const now = new Date();
      if (infoTime) infoTime.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (infoDuration) infoDuration.textContent = `${(durationMs / 1000).toFixed(1)} dtk`;
      if (infoOnline) infoOnline.textContent = 'Online';

      setTimeout(() => {
        setPhaseStep(6);
        if (testStatusText) testStatusText.textContent = 'Pengujian Selesai';
        if (statusPulseDot) statusPulseDot.className = 'status-pulse-dot';

        if (cancelBtn) cancelBtn.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'inline-flex';
        if (copyBtn) copyBtn.disabled = false;

        if (window.SubpageEngine) {
          window.SubpageEngine.showToast('Pengujian kecepatan internet selesai!', 'success');
        }
      }, 500);
    };

    // Event: Error
    engineInstance.onError = (err) => {
      console.error('[ALLBASE SpeedTest Error]:', err);
      isRunning = false;
      
      if (statusPulseDot) statusPulseDot.className = 'status-pulse-dot';
      if (testStatusText) testStatusText.textContent = 'Pengujian gagal. Periksa koneksi lalu coba kembali.';

      if (cancelBtn) cancelBtn.style.display = 'none';
      if (restartBtn) restartBtn.style.display = 'inline-flex';

      if (window.SubpageEngine) {
        window.SubpageEngine.showToast('Pengujian gagal. Silakan coba kembali.', 'error');
      }
    };

    // Start Engine Play
    engineInstance.play();

  } catch (err) {
    console.error('[ALLBASE SpeedTest Initialization Error]:', err);
    isRunning = false;
    if (testStatusText) testStatusText.textContent = 'Library pengujian gagal dimuat.';
    if (cancelBtn) cancelBtn.style.display = 'none';
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.disabled = false;
    }
  }
}

// Cancel Running Test
function cancelSpeedTest() {
  if (!isRunning && !engineInstance) return;

  isCancelled = true;
  isRunning = false;

  if (engineInstance) {
    try {
      if (typeof engineInstance.pause === 'function') engineInstance.pause();
    } catch (e) {
      // Ignore pause errors
    }
  }

  updateGauge(0);
  if (testStatusText) testStatusText.textContent = 'Pengujian dibatalkan oleh pengguna.';
  if (statusPulseDot) statusPulseDot.className = 'status-pulse-dot';

  if (cancelBtn) cancelBtn.style.display = 'none';
  if (restartBtn) restartBtn.style.display = 'inline-flex';
  if (startBtn) {
    startBtn.style.display = 'inline-flex';
    startBtn.disabled = false;
  }

  if (window.SubpageEngine) {
    window.SubpageEngine.showToast('Pengujian kecepatan dibatalkan.', 'info');
  }
}

// Copy Summary Results to Clipboard
function copyResultsToClipboard() {
  if (!isFinished) return;

  const dl = valDownload ? valDownload.textContent : '0.00';
  const ul = valUpload ? valUpload.textContent : '0.00';
  const ping = valPing ? valPing.textContent : '0.0';
  const jitter = valJitter ? valJitter.textContent : '0.0';
  const overall = qualityOverallBadge ? qualityOverallBadge.textContent : 'Baik';
  const dateStr = new Date().toLocaleString('id-ID');

  const text = `📊 ALLBASE Internet Speed Test Result
------------------------------------
📥 Download : ${dl} Mbps
📤 Upload   : ${ul} Mbps
⚡ Ping     : ${ping} ms
📶 Jitter   : ${jitter} ms
🏆 Kualitas : ${overall}
📅 Waktu    : ${dateStr}
------------------------------------
Uji koneksi Anda di https://allbase.my.id/tools/internet-speed-test/`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (window.SubpageEngine) {
        window.SubpageEngine.showToast('Hasil pengujian berhasil disalin ke clipboard!', 'success');
      }
    }).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    if (window.SubpageEngine) {
      window.SubpageEngine.showToast('Hasil pengujian berhasil disalin ke clipboard!', 'success');
    }
  } catch (err) {
    if (window.SubpageEngine) {
      window.SubpageEngine.showToast('Gagal menyalin hasil.', 'error');
    }
  }
  document.body.removeChild(ta);
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
  checkCellularConnection();

  if (startBtn) startBtn.addEventListener('click', startSpeedTest);
  if (cancelBtn) cancelBtn.addEventListener('click', cancelSpeedTest);
  if (restartBtn) restartBtn.addEventListener('click', startSpeedTest);
  if (copyBtn) copyBtn.addEventListener('click', copyResultsToClipboard);

  // Online / Offline Detection
  window.addEventListener('online', () => {
    if (infoOnline) infoOnline.textContent = 'Online';
  });
  window.addEventListener('offline', () => {
    if (infoOnline) infoOnline.textContent = 'Offline';
    if (isRunning) cancelSpeedTest();
  });
});
