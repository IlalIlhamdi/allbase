/* ============================================================
   ALLBASE INTERNET SPEED TEST CONTROLLER
   Engine: @cloudflare/speedtest (Browser ESM Bundle)
   ============================================================ */

import SpeedTest from "/assets/vendor/cloudflare-speedtest/speedtest.bundle.js";

// Safe DOM Element Selector Helper
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Elemen #${id} tidak ditemukan`);
  }
  return element;
}

// Safe Number Verification Helper
function safeNumber(value) {
  return Number.isFinite(value) ? value : null;
}

// Format bps -> Mbps (bps / 1_000_000, max 2 decimal places)
function formatMbps(bps) {
  const value = safeNumber(bps);
  if (value === null) {
    return "—";
  }
  return (value / 1_000_000).toFixed(2);
}

// Format ms (max 1 decimal place)
function formatMs(value) {
  const number = safeNumber(value);
  if (number === null) {
    return "—";
  }
  return number.toFixed(1);
}

// Safe Result Getter Exception Wrapper
function readResult(getter) {
  try {
    const value = getter();
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

// Global SpeedTest State
let testInstance = null;
let isRunning = false;
let isFinished = false;
let isCancelled = false;
let startTime = null;

// Initialize Speed Test Application
function initSpeedTest() {
  const startBtn = getElement('startBtn');
  const cancelBtn = getElement('cancelBtn');
  const restartBtn = getElement('restartBtn');
  const restartCancelledBtn = getElement('restartCancelledBtn');
  const copyBtn = getElement('copyBtn');

  checkCellularConnection();

  startBtn.addEventListener('click', startTest);
  cancelBtn.addEventListener('click', cancelTest);
  restartBtn.addEventListener('click', startTest);
  restartCancelledBtn.addEventListener('click', startTest);
  copyBtn.addEventListener('click', copyResultsToClipboard);

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  resetUIState();
}

// Network Information API Check
function checkCellularConnection() {
  const cellularWarning = document.getElementById('cellularWarning');
  const infoConnType = document.getElementById('infoConnType');

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    const type = conn.type;
    const effectiveType = conn.effectiveType;
    if (type === 'cellular' || effectiveType === '2g' || effectiveType === '3g' || effectiveType === '4g') {
      if (cellularWarning) cellularWarning.style.display = 'flex';
    }
    if (infoConnType) {
      infoConnType.textContent = effectiveType ? effectiveType.toUpperCase() : (type || 'Standard Network');
    }
  } else if (infoConnType) {
    infoConnType.textContent = 'Standard Web Browser';
  }
}

// Update Online / Offline Status Display
function updateOnlineStatus() {
  const infoOnline = document.getElementById('infoOnline');
  if (infoOnline) {
    infoOnline.textContent = navigator.onLine ? 'Online' : 'Offline';
  }
}

// Set Phase Badge Styling & Text
function setPhaseBadge(text, variantClass) {
  const testPhaseBadge = getElement('testPhaseBadge');
  const phaseBadgeText = getElement('phaseBadgeText');

  testPhaseBadge.className = `test-phase-badge ${variantClass}`;
  phaseBadgeText.textContent = text;
}

// Set Status Block Styling & Text
function setStatusBlock(title, desc, variantClass, iconName) {
  const testStatusBlock = getElement('testStatusBlock');
  const statusTitle = getElement('statusTitle');
  const statusDesc = getElement('statusDesc');
  const statusIcon = getElement('statusIcon');

  testStatusBlock.className = `test-status-block ${variantClass}`;
  statusTitle.textContent = title;
  statusDesc.textContent = desc;

  if (statusIcon) {
    statusIcon.setAttribute('data-lucide', iconName);
    if (window.lucide) lucide.createIcons();
  }
}

// Set Stepper Items Status (pending, active, completed)
function setStepperState(pingState, downloadState, uploadState, finishedState) {
  const stepPing = getElement('stepPing');
  const stepDownload = getElement('stepDownload');
  const stepUpload = getElement('stepUpload');
  const stepFinished = getElement('stepFinished');

  stepPing.className = `step-item ${pingState}`;
  stepDownload.className = `step-item ${downloadState}`;
  stepUpload.className = `step-item ${uploadState}`;
  stepFinished.className = `step-item ${finishedState}`;
}

// Reset UI to Initial Idle State
function resetUIState() {
  const startBtn = getElement('startBtn');
  const cancelBtn = getElement('cancelBtn');
  const restartBtn = getElement('restartBtn');
  const restartCancelledBtn = getElement('restartCancelledBtn');
  const copyBtn = getElement('copyBtn');

  const gaugeNumber = getElement('gaugeNumber');
  const gaugeUnit = getElement('gaugeUnit');
  const gaugeLabel = getElement('gaugeLabel');
  const progressBarFill = getElement('progressBarFill');
  const progressTrack = getElement('progressTrack');

  const valDownload = getElement('valDownload');
  const valUpload = getElement('valUpload');
  const valPing = getElement('valPing');
  const valJitter = getElement('valJitter');

  const statusDownload = getElement('statusDownload');
  const statusUpload = getElement('statusUpload');
  const statusPing = getElement('statusPing');
  const statusJitter = getElement('statusJitter');

  const cardDownload = getElement('cardDownload');
  const cardUpload = getElement('cardUpload');
  const cardPing = getElement('cardPing');
  const cardJitter = getElement('cardJitter');

  const qualityWarningNotice = getElement('qualityWarningNotice');
  const qualityOverallBadge = getElement('qualityOverallBadge');
  const scoreStreaming = getElement('scoreStreaming');
  const scoreGaming = getElement('scoreGaming');
  const scoreVideoCall = getElement('scoreVideoCall');

  const infoTime = getElement('infoTime');
  const infoDuration = getElement('infoDuration');

  // Gauge Reset
  updateGauge(0);
  gaugeNumber.style.opacity = '1';
  gaugeNumber.textContent = '0.00';
  gaugeUnit.textContent = 'Mbps';
  gaugeLabel.textContent = 'Siap Menguji Koneksi';

  // Phase Badge & Status Block
  setPhaseBadge('SIAP', 'badge-phase-ready');
  setStatusBlock(
    'Siap untuk Pengujian',
    'Klik tombol Mulai Tes untuk mengukur performa jaringan Anda.',
    'status-ready',
    'play-circle'
  );

  // Stepper & Progress
  setStepperState('pending', 'pending', 'pending', 'pending');
  progressBarFill.style.width = '0%';
  progressTrack.setAttribute('aria-valuenow', '0');

  // Buttons
  startBtn.style.display = 'inline-flex';
  startBtn.disabled = false;
  cancelBtn.style.display = 'none';
  cancelBtn.disabled = true;
  restartBtn.style.display = 'none';
  restartCancelledBtn.style.display = 'none';
  copyBtn.disabled = true;

  // Metric Cards
  valDownload.textContent = '—';
  valUpload.textContent = '—';
  valPing.textContent = '—';
  valJitter.textContent = '—';

  statusDownload.textContent = 'Belum diuji';
  statusUpload.textContent = 'Belum diuji';
  statusPing.textContent = 'Unloaded';
  statusJitter.textContent = 'Unloaded';

  [cardDownload, cardUpload, cardPing, cardJitter].forEach(card => card.className = 'metric-card');

  // Quality Panel
  qualityWarningNotice.style.display = 'none';
  qualityOverallBadge.className = 'badge badge-secondary';
  qualityOverallBadge.textContent = 'Belum diuji';
  scoreStreaming.innerHTML = '<span class="badge badge-secondary">Belum Diuji</span>';
  scoreGaming.innerHTML = '<span class="badge badge-secondary">Belum Diuji</span>';
  scoreVideoCall.innerHTML = '<span class="badge badge-secondary">Belum Diuji</span>';

  // Info
  infoTime.textContent = '—';
  infoDuration.textContent = '—';
}

// Update Speedometer SVG Gauge (Radius=120, Arc Length=376.99)
function updateGauge(mbpsValue) {
  const gaugeNeedle = document.getElementById('gaugeNeedle');
  const gaugeActivePath = document.getElementById('gaugeActivePath');

  const val = Math.max(0, safeNumber(mbpsValue) || 0);

  // Dynamic Scale: 100, 500, 1000 Mbps
  let maxMbps = 100;
  if (val > 100) maxMbps = 500;
  if (val > 500) maxMbps = 1000;

  const fraction = Math.min(1, val / maxMbps);
  const angle = -90 + (fraction * 180);

  if (gaugeNeedle) {
    gaugeNeedle.style.transform = `rotate(${angle}deg)`;
  }

  if (gaugeActivePath) {
    const totalArc = 376.99;
    const offset = totalArc - (fraction * totalArc);
    gaugeActivePath.style.strokeDashoffset = offset.toFixed(2);
  }
}

// Start Speed Test Execution
function startTest() {
  if (isRunning) return;

  if (!navigator.onLine) {
    if (window.SubpageEngine) {
      window.SubpageEngine.showToast('Koneksi Internet tidak tersedia. Periksa jaringan Anda.', 'error');
    }
    setStatusBlock(
      'Koneksi Tidak Tersedia',
      'Perangkat Anda terputus dari jaringan Internet.',
      'status-error',
      'wifi-off'
    );
    setPhaseBadge('OFFLINE', 'badge-phase-error');
    return;
  }

  resetUIState();

  isRunning = true;
  isFinished = false;
  isCancelled = false;
  startTime = Date.now();

  const startBtn = getElement('startBtn');
  const cancelBtn = getElement('cancelBtn');
  const restartBtn = getElement('restartBtn');
  const restartCancelledBtn = getElement('restartCancelledBtn');
  const copyBtn = getElement('copyBtn');

  startBtn.style.display = 'none';
  startBtn.disabled = true;
  restartCancelledBtn.style.display = 'none';
  cancelBtn.style.display = 'inline-flex';
  cancelBtn.disabled = false;
  restartBtn.style.display = 'none';
  copyBtn.disabled = true;

  setPhaseBadge('MENYIAPKAN', 'badge-phase-running');
  setStatusBlock(
    'Menyiapkan Pengujian',
    'Menghubungkan ke server pengujian Cloudflare...',
    'status-running',
    'loader'
  );

  // Instantiate Cloudflare SpeedTest Engine
  try {
    testInstance = new SpeedTest({
      autoStart: false,
      measureDownloadLoadedLatency: true,
      measureUploadLoadedLatency: true,
      measurements: [
        { type: "latency", numPackets: 1 },
        { type: "download", bytes: 100000, count: 1, bypassMinDuration: true },
        { type: "latency", numPackets: 12 },
        { type: "download", bytes: 100000, count: 6 },
        { type: "download", bytes: 1000000, count: 5 },
        { type: "upload", bytes: 100000, count: 5 },
        { type: "upload", bytes: 1000000, count: 4 },
        { type: "download", bytes: 10000000, count: 3 },
        { type: "upload", bytes: 10000000, count: 2 },
        { type: "download", bytes: 25000000, count: 2 }
      ]
    });

    testInstance.onRunningChange = (running) => {
      isRunning = running;
    };

    testInstance.onResultsChange = ({ type }) => {
      if (isCancelled) return;
      const results = testInstance.results;

      updateAvailableMetrics(results);
      updateStageFromType(type, results);
    };

    testInstance.onFinish = (results) => {
      if (isCancelled) return;

      isRunning = false;
      isFinished = true;

      updateFinalResults(results);
    };

    testInstance.onError = (error) => {
      console.error('[ALLBASE SpeedTest Error]:', error);
      isRunning = false;

      const cancelBtn = getElement('cancelBtn');
      const restartBtn = getElement('restartBtn');

      setPhaseBadge('ERROR', 'badge-phase-error');
      setStatusBlock(
        'Pengujian Gagal',
        'Terjadi kesalahan jaringan. Periksa koneksi lalu coba kembali.',
        'status-error',
        'alert-triangle'
      );

      cancelBtn.style.display = 'none';
      restartBtn.style.display = 'inline-flex';

      if (window.SubpageEngine) {
        window.SubpageEngine.showToast('Pengujian gagal. Silakan coba kembali.', 'error');
      }
    };

    testInstance.play();

  } catch (err) {
    console.error('[ALLBASE SpeedTest Init Exception]:', err);
    isRunning = false;
    const startBtn = getElement('startBtn');
    const cancelBtn = getElement('cancelBtn');

    setPhaseBadge('ERROR', 'badge-phase-error');
    setStatusBlock(
      'Gagal Memuat Engine',
      'Library pengujian Cloudflare tidak dapat diinisialisasi.',
      'status-error',
      'alert-triangle'
    );
    cancelBtn.style.display = 'none';
    startBtn.style.display = 'inline-flex';
    startBtn.disabled = false;
  }
}

// Safely Read & Render Live Metrics
function updateAvailableMetrics(results) {
  if (!results) return;

  const downloadBps = readResult(() => results.getDownloadBandwidth());
  const uploadBps = readResult(() => results.getUploadBandwidth());
  const pingMs = readResult(() => results.getUnloadedLatency());
  const jitterMs = readResult(() => results.getUnloadedJitter());

  const valDownload = getElement('valDownload');
  const valUpload = getElement('valUpload');
  const valPing = getElement('valPing');
  const valJitter = getElement('valJitter');

  const statusDownload = getElement('statusDownload');
  const statusUpload = getElement('statusUpload');
  const statusPing = getElement('statusPing');
  const statusJitter = getElement('statusJitter');

  const cardDownload = getElement('cardDownload');
  const cardUpload = getElement('cardUpload');
  const cardPing = getElement('cardPing');
  const cardJitter = getElement('cardJitter');

  if (downloadBps !== null) {
    valDownload.textContent = formatMbps(downloadBps);
    statusDownload.textContent = 'Terukur';
    cardDownload.classList.add('completed');
  }

  if (uploadBps !== null) {
    valUpload.textContent = formatMbps(uploadBps);
    statusUpload.textContent = 'Terukur';
    cardUpload.classList.add('completed');
  }

  if (pingMs !== null) {
    valPing.textContent = formatMs(pingMs);
    statusPing.textContent = 'Terukur';
    cardPing.classList.add('completed');
  }

  if (jitterMs !== null) {
    valJitter.textContent = formatMs(jitterMs);
    statusJitter.textContent = 'Terukur';
    cardJitter.classList.add('completed');
  }
}

// Update Active Stage, Gauge, and Progress Bar based on Measurement Type
function updateStageFromType(type, results) {
  const gaugeNumber = getElement('gaugeNumber');
  const gaugeUnit = getElement('gaugeUnit');
  const gaugeLabel = getElement('gaugeLabel');
  const progressBarFill = getElement('progressBarFill');
  const progressTrack = getElement('progressTrack');

  const cardDownload = getElement('cardDownload');
  const cardUpload = getElement('cardUpload');
  const cardPing = getElement('cardPing');
  const cardJitter = getElement('cardJitter');

  [cardDownload, cardUpload, cardPing, cardJitter].forEach(card => card.classList.remove('active'));

  if (type === 'latency') {
    setPhaseBadge('PING TEST', 'badge-phase-running');
    setStatusBlock(
      'Mengukur Latency & Ping',
      'Mengukur waktu respons (RTT) antara perangkat Anda dan Cloudflare.',
      'status-running',
      'activity'
    );
    setStepperState('active', 'pending', 'pending', 'pending');

    gaugeLabel.textContent = 'Mengukur Latency & Ping...';
    gaugeNumber.textContent = '—';
    gaugeUnit.textContent = 'Mbps';
    updateGauge(0);

    cardPing.classList.add('active');
    cardJitter.classList.add('active');

    progressBarFill.style.width = '20%';
    progressTrack.setAttribute('aria-valuenow', '20');

  } else if (type === 'download') {
    setPhaseBadge('DOWNLOAD TEST', 'badge-phase-running');
    setStatusBlock(
      'Mengukur Kecepatan Download',
      'Mengukur kecepatan penerimaan data dari jaringan pengujian Cloudflare.',
      'status-running',
      'arrow-down-circle'
    );
    setStepperState('completed', 'active', 'pending', 'pending');

    gaugeLabel.textContent = 'Kecepatan Download';
    const dlBps = readResult(() => results.getDownloadBandwidth());
    const mbpsStr = formatMbps(dlBps);
    if (mbpsStr !== '—') {
      gaugeNumber.textContent = mbpsStr;
      updateGauge(parseFloat(mbpsStr));
    }
    gaugeUnit.textContent = 'Mbps';

    cardDownload.classList.add('active');

    progressBarFill.style.width = '60%';
    progressTrack.setAttribute('aria-valuenow', '60');

  } else if (type === 'upload') {
    setPhaseBadge('UPLOAD TEST', 'badge-phase-running');
    setStatusBlock(
      'Mengukur Kecepatan Upload',
      'Mengukur kecepatan pengiriman data ke jaringan pengujian Cloudflare.',
      'status-running',
      'arrow-up-circle'
    );
    setStepperState('completed', 'completed', 'active', 'pending');

    gaugeLabel.textContent = 'Kecepatan Upload';
    const ulBps = readResult(() => results.getUploadBandwidth());
    const mbpsStr = formatMbps(ulBps);
    if (mbpsStr !== '—') {
      gaugeNumber.textContent = mbpsStr;
      updateGauge(parseFloat(mbpsStr));
    }
    gaugeUnit.textContent = 'Mbps';

    cardUpload.classList.add('active');

    progressBarFill.style.width = '85%';
    progressTrack.setAttribute('aria-valuenow', '85');
  }
}

// Handle Final Results on Test Completion
function updateFinalResults(results) {
  const downloadBps = readResult(() => results.getDownloadBandwidth());
  const uploadBps = readResult(() => results.getUploadBandwidth());
  const pingMs = readResult(() => results.getUnloadedLatency());
  const jitterMs = readResult(() => results.getUnloadedJitter());
  const scores = readResult(() => results.getScores());
  const durationMs = readResult(() => results.getTotalDurationMs()) || (Date.now() - startTime);

  const valDownload = getElement('valDownload');
  const valUpload = getElement('valUpload');
  const valPing = getElement('valPing');
  const valJitter = getElement('valJitter');

  const gaugeNumber = getElement('gaugeNumber');
  const gaugeUnit = getElement('gaugeUnit');
  const gaugeLabel = getElement('gaugeLabel');
  const progressBarFill = getElement('progressBarFill');
  const progressTrack = getElement('progressTrack');

  const startBtn = getElement('startBtn');
  const cancelBtn = getElement('cancelBtn');
  const restartBtn = getElement('restartBtn');
  const restartCancelledBtn = getElement('restartCancelledBtn');
  const copyBtn = getElement('copyBtn');

  const infoTime = getElement('infoTime');
  const infoDuration = getElement('infoDuration');

  // Final Metric Values
  const finalDl = formatMbps(downloadBps);
  const finalUl = formatMbps(uploadBps);
  const finalPing = formatMs(pingMs);
  const finalJitter = formatMs(jitterMs);

  valDownload.textContent = finalDl;
  valUpload.textContent = finalUl;
  valPing.textContent = finalPing;
  valJitter.textContent = finalJitter;

  // Final Speedometer Display (Main Download Speed)
  if (finalDl !== '—') {
    gaugeNumber.textContent = finalDl;
    updateGauge(parseFloat(finalDl));
  } else {
    gaugeNumber.textContent = '0.00';
    updateGauge(0);
  }
  gaugeUnit.textContent = 'Mbps';
  gaugeLabel.textContent = 'Kecepatan Download Final';

  // Phase Badge & Status Block
  setPhaseBadge('SELESAI', 'badge-phase-finished');
  setStatusBlock(
    'Pengujian Selesai',
    'Performa koneksi Internet Anda telah berhasil diuji sepenuhnya.',
    'status-finished',
    'check-circle'
  );

  // Stepper & 100% Progress
  setStepperState('completed', 'completed', 'completed', 'completed');
  progressBarFill.style.width = '100%';
  progressTrack.setAttribute('aria-valuenow', '100');

  // Un-highlight active cards
  [getElement('cardDownload'), getElement('cardUpload'), getElement('cardPing'), getElement('cardJitter')].forEach(card => {
    card.classList.remove('active');
    card.classList.add('completed');
  });

  // Quality Assessment
  renderQualityAssessment(scores, finalDl, finalUl, finalPing, finalJitter);

  // Metadata Updates
  const now = new Date();
  infoTime.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  infoDuration.textContent = `${(durationMs / 1000).toFixed(1)} dtk`;

  // Buttons After Finish
  startBtn.style.display = 'none';
  restartCancelledBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
  restartBtn.style.display = 'inline-flex';
  copyBtn.disabled = false;

  if (window.SubpageEngine) {
    window.SubpageEngine.showToast('Pengujian kecepatan internet selesai!', 'success');
  }
}

// Connection Quality Classification & Rendering
function translateScoreClassification(scoreObj) {
  if (!scoreObj) return null;
  const str = String(typeof scoreObj === 'object' ? (scoreObj.classification || scoreObj.points || '') : scoreObj).toLowerCase();

  if (str.includes('great')) return { text: 'Sangat Baik', class: 'badge-success' };
  if (str.includes('good')) return { text: 'Baik', class: 'badge-primary' };
  if (str.includes('average')) return { text: 'Cukup', class: 'badge-warning' };
  if (str.includes('poor')) return { text: 'Kurang', class: 'badge-danger' };
  if (str.includes('bad')) return { text: 'Sangat Kurang', class: 'badge-danger' };
  return null;
}

function renderQualityAssessment(scores, dlStr, ulStr, pingStr, jitterStr) {
  const qualityWarningNotice = getElement('qualityWarningNotice');
  const qualityOverallBadge = getElement('qualityOverallBadge');
  const scoreStreaming = getElement('scoreStreaming');
  const scoreGaming = getElement('scoreGaming');
  const scoreVideoCall = getElement('scoreVideoCall');

  qualityWarningNotice.style.display = 'none';

  let streamRes = null;
  let gameRes = null;
  let rtcRes = null;

  if (scores && typeof scores === 'object') {
    if (scores.streaming) streamRes = translateScoreClassification(scores.streaming);
    if (scores.gaming) gameRes = translateScoreClassification(scores.gaming);
    if (scores.rtc || scores.videoCall) rtcRes = translateScoreClassification(scores.rtc || scores.videoCall);
  }

  // General Fallback Assessment if AIM score is incomplete
  if (!streamRes || !gameRes || !rtcRes) {
    const dl = parseFloat(dlStr) || 0;
    const ul = parseFloat(ulStr) || 0;
    const ping = parseFloat(pingStr) || 999;
    const jitter = parseFloat(jitterStr) || 999;

    if (dl >= 50 && ul >= 10 && ping <= 30 && jitter <= 10) {
      const item = { text: 'Sangat Baik', class: 'badge-success' };
      streamRes = streamRes || item;
      gameRes = gameRes || item;
      rtcRes = rtcRes || item;
    } else if (dl >= 20 && ul >= 5 && ping <= 60 && jitter <= 20) {
      const item = { text: 'Baik', class: 'badge-primary' };
      streamRes = streamRes || item;
      gameRes = gameRes || item;
      rtcRes = rtcRes || item;
    } else if (dl >= 5 && ul >= 1 && ping <= 100) {
      const item = { text: 'Cukup', class: 'badge-warning' };
      streamRes = streamRes || item;
      gameRes = gameRes || item;
      rtcRes = rtcRes || item;
    } else {
      const item = { text: 'Kurang', class: 'badge-danger' };
      streamRes = streamRes || item;
      gameRes = gameRes || item;
      rtcRes = rtcRes || item;
    }
  }

  const overallObj = streamRes || { text: 'Baik', class: 'badge-primary' };
  qualityOverallBadge.className = `badge ${overallObj.class}`;
  qualityOverallBadge.textContent = overallObj.text;

  if (streamRes) {
    scoreStreaming.innerHTML = `<span class="badge ${streamRes.class}">${streamRes.text}</span>`;
  }
  if (gameRes) {
    scoreGaming.innerHTML = `<span class="badge ${gameRes.class}">${gameRes.text}</span>`;
  }
  if (rtcRes) {
    scoreVideoCall.innerHTML = `<span class="badge ${rtcRes.class}">${rtcRes.text}</span>`;
  }
}

// Cancel Speed Test Execution & Handle Cancelled State
function cancelTest() {
  if (!isRunning && !testInstance) return;

  isCancelled = true;
  isRunning = false;

  if (testInstance) {
    try {
      if (typeof testInstance.pause === 'function') {
        testInstance.pause();
      }
    } catch (e) {
      // Ignore pause exceptions
    }
  }

  const startBtn = getElement('startBtn');
  const cancelBtn = getElement('cancelBtn');
  const restartBtn = getElement('restartBtn');
  const restartCancelledBtn = getElement('restartCancelledBtn');
  const copyBtn = getElement('copyBtn');
  const gaugeNumber = getElement('gaugeNumber');
  const gaugeLabel = getElement('gaugeLabel');
  const qualityWarningNotice = getElement('qualityWarningNotice');
  const qualityOverallBadge = getElement('qualityOverallBadge');

  // Cancelled State UI Enhancements
  setPhaseBadge('DIBATALKAN', 'badge-phase-cancelled');
  setStatusBlock(
    'Pengujian Dibatalkan',
    'Hasil yang tampil merupakan hasil sementara dan belum lengkap. Tes belum selesai. Jalankan ulang untuk memperoleh hasil lengkap.',
    'status-cancelled',
    'alert-circle'
  );

  gaugeNumber.style.opacity = '0.75';
  gaugeLabel.textContent = 'Hasil Sementara (Dibatalkan)';

  // Update card statuses for cancelled state
  ['Download', 'Upload', 'Ping', 'Jitter'].forEach(key => {
    const valElem = document.getElementById(`val${key}`);
    const statusElem = document.getElementById(`status${key}`);
    if (valElem && valElem.textContent !== '—') {
      if (statusElem) statusElem.textContent = 'Hasil sementara';
    } else if (statusElem) {
      statusElem.textContent = 'Belum diuji';
    }
  });

  // Display Quality Notice for incomplete test
  qualityWarningNotice.style.display = 'flex';
  qualityOverallBadge.className = 'badge badge-secondary';
  qualityOverallBadge.textContent = 'Belum diuji';
  getElement('scoreStreaming').innerHTML = '<span class="badge badge-secondary">Belum Diuji</span>';
  getElement('scoreGaming').innerHTML = '<span class="badge badge-secondary">Belum Diuji</span>';
  getElement('scoreVideoCall').innerHTML = '<span class="badge badge-secondary">Belum Diuji</span>';

  // Button States for Cancelled Test
  cancelBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  startBtn.style.display = 'none';
  restartCancelledBtn.style.display = 'inline-flex';
  copyBtn.disabled = true;

  if (window.SubpageEngine) {
    window.SubpageEngine.showToast('Pengujian kecepatan dibatalkan.', 'info');
  }
}

// Copy Summary Results to Clipboard
function copyResultsToClipboard() {
  if (!isFinished) return;

  const valDownload = getElement('valDownload');
  const valUpload = getElement('valUpload');
  const valPing = getElement('valPing');
  const valJitter = getElement('valJitter');
  const qualityOverallBadge = getElement('qualityOverallBadge');

  const dl = valDownload.textContent;
  const ul = valUpload.textContent;
  const ping = valPing.textContent;
  const jitter = valJitter.textContent;
  const overall = qualityOverallBadge.textContent;
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
    }).catch(() => fallbackCopyText(text));
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
  } catch {
    if (window.SubpageEngine) {
      window.SubpageEngine.showToast('Gagal menyalin hasil.', 'error');
    }
  }
  document.body.removeChild(ta);
}

// DOM Ready Initialization
document.addEventListener("DOMContentLoaded", initSpeedTest);
