var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});

// temp_build/package/dist/speedtest.js
var REL_API_URL = "https://speed.cloudflare.com";
var defaultConfig = {
  autoStart: true,
  downloadApiUrl: `${REL_API_URL}/__down`,
  uploadApiUrl: `${REL_API_URL}/__up`,
  logMeasurementApiUrl: null,
  logAimApiUrl: `${REL_API_URL}/__results`,
  turnServerUri: "turn.speed.cloudflare.com:50000",
  turnServerCredsApiUrl: `${REL_API_URL}/turn-creds`,
  turnServerUser: null,
  turnServerPass: null,
  rpkiInvalidHost: "invalid.rpki.cloudflare.com",
  includeCredentials: false,
  sessionId: void 0,
  measurements: [
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "download",
      bytes: 1e5,
      count: 1,
      bypassMinDuration: true
    },
    {
      type: "latency",
      numPackets: 20
    },
    {
      type: "download",
      bytes: 1e5,
      count: 9
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "download",
      bytes: 1e6,
      count: 8
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "upload",
      bytes: 1e5,
      count: 8
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "packetLoss",
      numPackets: 1e3,
      batchSize: 10,
      batchWaitTime: 10,
      responsesWaitTime: 3e3
    },
    {
      type: "upload",
      bytes: 1e6,
      count: 6
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "download",
      bytes: 1e7,
      count: 6
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "upload",
      bytes: 1e7,
      count: 4
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "download",
      bytes: 25e6,
      count: 4
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "upload",
      bytes: 25e6,
      count: 4
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "download",
      bytes: 1e8,
      count: 3
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "upload",
      bytes: 5e7,
      count: 3
    },
    {
      type: "latency",
      numPackets: 2
    },
    {
      type: "download",
      bytes: 25e7,
      count: 2
    }
  ],
  measureDownloadLoadedLatency: true,
  measureUploadLoadedLatency: true,
  loadedLatencyThrottle: 400,
  bandwidthFinishRequestDuration: 1e3,
  estimatedServerTime: 0,
  bandwidthAbortRequestDuration: 0,
  latencyPercentile: 0.5,
  bandwidthPercentile: 0.9,
  bandwidthMinRequestDuration: 10,
  loadedRequestMinDuration: 250,
  loadedLatencyMaxPoints: 20
};
var scaleThreshold = (domain, range) => {
  return (value) => {
    let i = 0;
    while (i < domain.length && value >= domain[i]) i++;
    return range[i];
  };
};
var internalConfig = {
  aimMeasurementScoring: {
    packetLoss: scaleThreshold([
      0.01,
      0.05,
      0.25,
      0.5
    ], [
      10,
      5,
      0,
      -10,
      -20
    ]),
    latency: scaleThreshold([
      10,
      20,
      50,
      100,
      500
    ], [
      20,
      10,
      5,
      0,
      -10,
      -20
    ]),
    loadedLatencyIncrease: scaleThreshold([
      10,
      20,
      50,
      100,
      500
    ], [
      20,
      10,
      5,
      0,
      -10,
      -20
    ]),
    jitter: scaleThreshold([
      10,
      20,
      100,
      500
    ], [
      10,
      5,
      0,
      -10,
      -20
    ]),
    download: scaleThreshold([
      1e6,
      1e7,
      5e7,
      1e8
    ], [
      0,
      5,
      10,
      20,
      30
    ]),
    upload: scaleThreshold([
      1e6,
      1e7,
      5e7,
      1e8
    ], [
      0,
      5,
      10,
      20,
      30
    ])
  },
  aimExperiencesDefs: {
    streaming: {
      input: [
        "latency",
        "packetLoss",
        "download",
        "loadedLatencyIncrease"
      ],
      pointThresholds: [
        15,
        20,
        40,
        60
      ]
    },
    gaming: {
      input: [
        "latency",
        "packetLoss",
        "loadedLatencyIncrease"
      ],
      pointThresholds: [
        5,
        15,
        25,
        30
      ]
    },
    rtc: {
      input: [
        "latency",
        "jitter",
        "packetLoss",
        "loadedLatencyIncrease"
      ],
      pointThresholds: [
        5,
        15,
        25,
        40
      ]
    }
  }
};
var MAX_RETRIES = 20;
var SERVER_TIME_MIN_DURATION = 0.01;
var SERVER_TIME_DELTA_MAX = 15;
var SERVER_TIME_CALIBRATION_MAX = 150;
var SERVER_TIME_DELTA_WEIGHT = 0.75;
var cfGetServerTime = (r) => {
  const serverTiming = r.headers.get(`server-timing`);
  if (!serverTiming) return;
  const re = serverTiming.match(/(?:^|,\s*)cfReq(?:uest)?Dur(?:ation)?;\s*dur=([0-9.]+)/i);
  if (re && +re[1] > SERVER_TIME_MIN_DURATION) return +re[1];
  let sum2 = 0;
  for (const m of serverTiming.matchAll(/(?:^|,\s*)cfSpeed[a-zA-Z]*;\s*dur=([0-9.]+)/gi)) sum2 += +m[1];
  if (sum2 > SERVER_TIME_MIN_DURATION) return sum2;
};
var getTtfb = (perf) => perf.responseStart - perf.requestStart;
var getPayloadDownload = (perf) => perf.responseEnd - perf.responseStart;
var calcDownloadDuration = ({ ping, payloadDownloadTime }) => ping + payloadDownloadTime;
var calcUploadDuration = ({ ttfb }) => ttfb;
var calcDownloadSpeed = ({ duration, transferSize }, numBytes) => {
  const bits = 8 * (transferSize || +numBytes * 1.005);
  const secs = duration / 1e3;
  return !secs ? void 0 : bits / secs;
};
var calcUploadSpeed = ({ duration }, numBytes) => {
  const bits = 8 * numBytes * 1.005;
  const secs = duration / 1e3;
  return !secs ? void 0 : bits / secs;
};
var genContent = /* @__PURE__ */ (() => {
  const cache = /* @__PURE__ */ new Map();
  return (numBytes) => {
    if (!cache.has(numBytes)) cache.set(numBytes, "0".repeat(numBytes));
    return cache.get(numBytes);
  };
})();
var _qsParams, _fetchOptions, _responseHook, _onRunningChange, _onNewMeasurementStarted, _onMeasurementResult, _onFinished, _onConnectionError, _measurements, _downloadApi, _uploadApi, _running, _finished, _results, _measIdx, _counter, _retries, _minDuration, _throttleMs, _estimatedServerTime, _serverTimeDelta, _currentAbortController, _BandwidthMeasurementEngine_instances, setRunning_fn, saveMeasurementResults_fn, nextMeasurement_fn, cancelCurrentMeasurement_fn, _a;
var BandwidthMeasurementEngine = (_a = class {
  constructor(measurements, { downloadApiUrl, uploadApiUrl, throttleMs = 0, estimatedServerTime = 0, serverTimeDelta = 0 } = {}) {
    __privateAdd(this, _BandwidthMeasurementEngine_instances);
    __privateAdd(this, _qsParams, {});
    __privateAdd(this, _fetchOptions, {});
    __publicField(this, "finishRequestDuration", 1e3);
    __publicField(this, "abortRequestDuration", 0);
    __publicField(this, "getServerTime", cfGetServerTime);
    __privateAdd(this, _responseHook, () => {
    });
    __privateAdd(this, _onRunningChange, () => {
    });
    __privateAdd(this, _onNewMeasurementStarted, () => {
    });
    __privateAdd(this, _onMeasurementResult, () => {
    });
    __privateAdd(this, _onFinished, () => {
    });
    __privateAdd(this, _onConnectionError, () => {
    });
    __privateAdd(this, _measurements);
    __privateAdd(this, _downloadApi);
    __privateAdd(this, _uploadApi);
    __privateAdd(this, _running, false);
    __privateAdd(this, _finished, {
      down: false,
      up: false
    });
    __privateAdd(this, _results, {
      down: {},
      up: {}
    });
    __privateAdd(this, _measIdx, 0);
    __privateAdd(this, _counter, 0);
    __privateAdd(this, _retries, 0);
    __privateAdd(this, _minDuration, -Infinity);
    __privateAdd(this, _throttleMs, 0);
    __privateAdd(this, _estimatedServerTime, 0);
    __privateAdd(this, _serverTimeDelta, 0);
    __privateAdd(this, _currentAbortController);
    if (!measurements) throw new Error("Missing measurements argument");
    if (!downloadApiUrl) throw new Error("Missing downloadApiUrl argument");
    if (!uploadApiUrl) throw new Error("Missing uploadApiUrl argument");
    __privateSet(this, _measurements, measurements);
    __privateSet(this, _downloadApi, downloadApiUrl);
    __privateSet(this, _uploadApi, uploadApiUrl);
    __privateSet(this, _throttleMs, throttleMs);
    __privateSet(this, _estimatedServerTime, Math.max(0, estimatedServerTime));
    __privateSet(this, _serverTimeDelta, Math.max(0, serverTimeDelta));
  }
  get results() {
    return __privateGet(this, _results);
  }
  get serverTimeDelta() {
    return __privateGet(this, _serverTimeDelta);
  }
  get qsParams() {
    return __privateGet(this, _qsParams);
  }
  set qsParams(v) {
    __privateSet(this, _qsParams, v);
  }
  get fetchOptions() {
    return __privateGet(this, _fetchOptions);
  }
  set fetchOptions(v) {
    __privateSet(this, _fetchOptions, v);
  }
  set responseHook(f) {
    __privateSet(this, _responseHook, f);
  }
  set onRunningChange(f) {
    __privateSet(this, _onRunningChange, f);
  }
  set onNewMeasurementStarted(f) {
    __privateSet(this, _onNewMeasurementStarted, f);
  }
  set onMeasurementResult(f) {
    __privateSet(this, _onMeasurementResult, f);
  }
  set onFinished(f) {
    __privateSet(this, _onFinished, f);
  }
  set onConnectionError(f) {
    __privateSet(this, _onConnectionError, f);
  }
  pause() {
    __privateMethod(this, _BandwidthMeasurementEngine_instances, cancelCurrentMeasurement_fn).call(this, `pause()`);
    __privateMethod(this, _BandwidthMeasurementEngine_instances, setRunning_fn).call(this, false);
  }
  play() {
    if (!__privateGet(this, _running)) {
      __privateMethod(this, _BandwidthMeasurementEngine_instances, setRunning_fn).call(this, true);
      __privateMethod(this, _BandwidthMeasurementEngine_instances, nextMeasurement_fn).call(this);
    }
  }
}, _qsParams = new WeakMap(), _fetchOptions = new WeakMap(), _responseHook = new WeakMap(), _onRunningChange = new WeakMap(), _onNewMeasurementStarted = new WeakMap(), _onMeasurementResult = new WeakMap(), _onFinished = new WeakMap(), _onConnectionError = new WeakMap(), _measurements = new WeakMap(), _downloadApi = new WeakMap(), _uploadApi = new WeakMap(), _running = new WeakMap(), _finished = new WeakMap(), _results = new WeakMap(), _measIdx = new WeakMap(), _counter = new WeakMap(), _retries = new WeakMap(), _minDuration = new WeakMap(), _throttleMs = new WeakMap(), _estimatedServerTime = new WeakMap(), _serverTimeDelta = new WeakMap(), _currentAbortController = new WeakMap(), _BandwidthMeasurementEngine_instances = new WeakSet(), setRunning_fn = function(running) {
  if (running !== __privateGet(this, _running)) {
    __privateSet(this, _running, running);
    setTimeout(() => __privateGet(this, _onRunningChange).call(this, __privateGet(this, _running)));
  }
  if (!running) __privateGet(this, _currentAbortController)?.abort("setRunning(false)");
}, saveMeasurementResults_fn = function(measIdx, measTiming) {
  const { bytes, dir } = __privateGet(this, _measurements)[measIdx];
  const results = __privateGet(this, _results);
  const bytesResult = results[dir].hasOwnProperty(bytes) ? results[dir][bytes] : {
    timings: [],
    numMeasurements: __privateGet(this, _measurements).filter(({ bytes: b, dir: d }) => bytes === b && dir === d).map((m) => m.count).reduce((agg, cnt) => agg + cnt, 0)
  };
  measTiming && bytesResult.timings.push(measTiming);
  bytesResult.timings = bytesResult.timings.slice(-bytesResult.numMeasurements);
  results[dir][bytes] = bytesResult;
  if (measTiming) setTimeout(() => {
    __privateGet(this, _onMeasurementResult).call(this, {
      type: dir,
      bytes,
      ...measTiming
    }, results);
  });
  else __privateGet(this, _onNewMeasurementStarted).call(this, __privateGet(this, _measurements)[measIdx], results);
}, nextMeasurement_fn = function() {
  const measurements = __privateGet(this, _measurements);
  let meas = measurements[__privateGet(this, _measIdx)];
  if (__privateGet(this, _counter) >= meas.count) {
    const finished = __privateGet(this, _finished);
    if (__privateGet(this, _minDuration) > this.finishRequestDuration && !meas.bypassMinDuration) {
      const dir2 = meas.dir;
      __privateGet(this, _finished)[dir2] = true;
      Object.values(__privateGet(this, _finished)).every((finished2) => finished2) && __privateGet(this, _onFinished).call(this, __privateGet(this, _results));
    }
    __privateSet(this, _counter, 0);
    __privateSet(this, _minDuration, -Infinity);
    performance.clearResourceTimings();
    do
      __privateSet(this, _measIdx, __privateGet(this, _measIdx) + 1);
    while (__privateGet(this, _measIdx) < measurements.length && finished[measurements[__privateGet(this, _measIdx)].dir]);
    if (__privateGet(this, _measIdx) >= measurements.length) {
      __privateSet(this, _finished, {
        down: true,
        up: true
      });
      __privateMethod(this, _BandwidthMeasurementEngine_instances, setRunning_fn).call(this, false);
      __privateGet(this, _onFinished).call(this, __privateGet(this, _results));
      return;
    }
    meas = measurements[__privateGet(this, _measIdx)];
  }
  const measIdx = __privateGet(this, _measIdx);
  if (__privateGet(this, _counter) === 0) __privateMethod(this, _BandwidthMeasurementEngine_instances, saveMeasurementResults_fn).call(this, measIdx);
  const { bytes: numBytes, dir } = meas;
  const isDown = dir === "down";
  const apiUrl = isDown ? __privateGet(this, _downloadApi) : __privateGet(this, _uploadApi);
  const qsParams = Object.assign({}, __privateGet(this, _qsParams));
  qsParams.bytes = `${numBytes}`;
  const urlObj = new URL(apiUrl, window.location.origin);
  Object.entries(qsParams).forEach(([k, v]) => urlObj.searchParams.set(k, v));
  const url = urlObj.href;
  const fetchOpt = Object.assign({}, isDown ? {} : {
    method: "POST",
    body: genContent(numBytes)
  }, __privateGet(this, _fetchOptions));
  if (__privateGet(this, _retries) === 0) {
    __privateGet(this, _currentAbortController)?.abort("restarting engine");
    __privateSet(this, _currentAbortController, new AbortController());
    if (this.abortRequestDuration) {
      const abortTimeout = setTimeout(() => {
        const errorMessage = `${isDown ? "Download" : "Upload"} measurement of ${numBytes} bytes aborted. Measurement exceeded bandwidthAbortRequestDuration (${this.abortRequestDuration}ms)`;
        __privateMethod(this, _BandwidthMeasurementEngine_instances, cancelCurrentMeasurement_fn).call(this, errorMessage);
        __privateSet(this, _retries, 0);
        __privateMethod(this, _BandwidthMeasurementEngine_instances, setRunning_fn).call(this, false);
        __privateGet(this, _onConnectionError).call(this, errorMessage);
      }, this.abortRequestDuration);
      __privateGet(this, _currentAbortController).signal.addEventListener("abort", () => clearTimeout(abortTimeout));
    }
  }
  let serverTime;
  fetch(url, {
    ...fetchOpt,
    signal: __privateGet(this, _currentAbortController).signal
  }).then((r) => {
    if (r.ok) return r;
    throw Error(r.statusText);
  }).then((r) => {
    this.getServerTime && (serverTime = this.getServerTime(r));
    return r;
  }).then((r) => r.text().then((body) => {
    __privateGet(this, _responseHook).call(this, {
      url,
      headers: r.headers,
      body
    });
    return body;
  })).then(() => {
    const perf = performance.getEntriesByName(url).slice(-1)[0];
    const timing = {
      transferSize: perf.transferSize,
      ttfb: getTtfb(perf),
      payloadDownloadTime: getPayloadDownload(perf),
      serverTime: serverTime || -1,
      measTime: /* @__PURE__ */ new Date(),
      ping: 0,
      duration: 0,
      bps: void 0
    };
    let connectTime = 0;
    if (perf.secureConnectionStart > perf.connectStart) connectTime = perf.secureConnectionStart - perf.connectStart;
    else connectTime = perf.connectEnd - perf.connectStart;
    const protoMatch = perf.nextHopProtocol.match(/([0-9.]+)/);
    const httpVersion = protoMatch ? +protoMatch[1] : 0;
    if (serverTime && connectTime && httpVersion > 0 && httpVersion < 2) {
      const delta2 = Math.max(0, timing.ttfb - connectTime) - serverTime;
      if (delta2 > 0 && delta2 <= SERVER_TIME_DELTA_MAX && delta2 <= serverTime && serverTime <= SERVER_TIME_CALIBRATION_MAX) {
        __privateSet(this, _serverTimeDelta, __privateGet(this, _serverTimeDelta) * (1 - SERVER_TIME_DELTA_WEIGHT) + delta2 * SERVER_TIME_DELTA_WEIGHT);
        console.log(`serverTimeDelta (estimated): ${__privateGet(this, _serverTimeDelta).toFixed(2)}ms`);
      } else if (delta2 > 0) console.log(`serverTimeDelta (skipped): ${delta2.toFixed(2)}ms`);
    }
    const baseServerTime = serverTime || __privateGet(this, _estimatedServerTime);
    timing.ping = timing.ttfb - baseServerTime - __privateGet(this, _serverTimeDelta);
    if (timing.ping <= 1) timing.ping = Math.max(0, timing.ttfb - baseServerTime);
    timing.duration = (isDown ? calcDownloadDuration : calcUploadDuration)(timing);
    timing.bps = (isDown ? calcDownloadSpeed : calcUploadSpeed)(timing, numBytes);
    const delta = __privateGet(this, _serverTimeDelta);
    if (+numBytes === 0) console.log("latency", {
      phase: `during ${qsParams.during || "idle"}`,
      ttfb: timing.ttfb,
      serverTime: baseServerTime,
      ...delta && { serverTimeDelta: delta },
      ping: timing.ping
    });
    else console.log(isDown ? "download" : "upload", {
      bytes: +numBytes,
      bps: timing.bps,
      ttfb: timing.ttfb,
      serverTime: baseServerTime,
      ...delta && { serverTimeDelta: delta },
      ping: timing.ping
    });
    if (isDown && numBytes) {
      const reqSize = +numBytes;
      if (timing.transferSize && (timing.transferSize < reqSize || timing.transferSize / reqSize > 1.05)) console.warn(`Requested ${reqSize}B but received ${timing.transferSize}B (${Math.round(timing.transferSize / reqSize * 1e4) / 100}%).`);
    }
    __privateMethod(this, _BandwidthMeasurementEngine_instances, saveMeasurementResults_fn).call(this, measIdx, timing);
    const requestDuration = timing.duration;
    __privateSet(this, _minDuration, __privateGet(this, _minDuration) < 0 ? requestDuration : Math.min(__privateGet(this, _minDuration), requestDuration));
    __privateSet(this, _counter, __privateGet(this, _counter) + 1);
    __privateSet(this, _retries, 0);
    if (__privateGet(this, _throttleMs)) {
      const throttleTimeout = setTimeout(() => __privateMethod(this, _BandwidthMeasurementEngine_instances, nextMeasurement_fn).call(this), __privateGet(this, _throttleMs));
      __privateGet(this, _currentAbortController).signal.addEventListener("abort", () => clearTimeout(throttleTimeout));
    } else __privateMethod(this, _BandwidthMeasurementEngine_instances, nextMeasurement_fn).call(this);
  }).catch((error) => {
    if (__privateGet(this, _currentAbortController).signal.aborted) return;
    console.warn(`Error fetching ${url}: ${error}`);
    if (__privateWrapper(this, _retries)._++ < MAX_RETRIES) __privateMethod(this, _BandwidthMeasurementEngine_instances, nextMeasurement_fn).call(this);
    else {
      __privateSet(this, _retries, 0);
      __privateMethod(this, _BandwidthMeasurementEngine_instances, setRunning_fn).call(this, false);
      __privateGet(this, _onConnectionError).call(this, `Connection failed to ${url}. Gave up after ${MAX_RETRIES} retries.`);
    }
  });
}, cancelCurrentMeasurement_fn = function(reason) {
  __privateGet(this, _currentAbortController)?.abort(reason || `aborted with no reason provided`);
}, _a);
var _latencyEngine, _latencyTimeout, _setLatencyRunning, _a2;
var BandwidthWithParallelLatencyEngine = (_a2 = class extends BandwidthMeasurementEngine {
  constructor(measurements, { measureParallelLatency = false, parallelLatencyThrottleMs = 100, downloadApiUrl, uploadApiUrl, estimatedServerTime = 0, serverTimeDelta = 0, ...ptProps } = {}) {
    super(measurements, {
      downloadApiUrl,
      uploadApiUrl,
      estimatedServerTime,
      serverTimeDelta,
      ...ptProps
    });
    __privateAdd(this, _latencyEngine);
    __privateAdd(this, _latencyTimeout);
    __privateAdd(this, _setLatencyRunning, (running) => {
      if (__privateGet(this, _latencyEngine)) if (!running) {
        clearTimeout(__privateGet(this, _latencyTimeout));
        __privateGet(this, _latencyEngine).pause();
      } else __privateSet(this, _latencyTimeout, setTimeout(() => __privateGet(this, _latencyEngine).play(), 20));
    });
    if (measureParallelLatency) {
      __privateSet(this, _latencyEngine, new BandwidthMeasurementEngine([{
        dir: "down",
        bytes: 0,
        count: Infinity,
        bypassMinDuration: true
      }], {
        downloadApiUrl,
        uploadApiUrl,
        estimatedServerTime,
        serverTimeDelta,
        throttleMs: parallelLatencyThrottleMs
      }));
      __privateGet(this, _latencyEngine).qsParams = { during: `${measurements[0].dir}load` };
      super.onRunningChange = __privateGet(this, _setLatencyRunning);
      super.onConnectionError = () => __privateGet(this, _latencyEngine).pause();
    }
  }
  get latencyResults() {
    return __privateGet(this, _latencyEngine) && __privateGet(this, _latencyEngine).results.down[0].timings;
  }
  set onParallelLatencyResult(f) {
    __privateGet(this, _latencyEngine) && (__privateGet(this, _latencyEngine).onMeasurementResult = (res) => f(res));
  }
  get fetchOptions() {
    return super.fetchOptions;
  }
  set fetchOptions(fetchOptions) {
    super.fetchOptions = fetchOptions;
    __privateGet(this, _latencyEngine) && (__privateGet(this, _latencyEngine).fetchOptions = fetchOptions);
  }
  set onRunningChange(onRunningChange) {
    super.onRunningChange = (running) => {
      __privateGet(this, _setLatencyRunning).call(this, running);
      onRunningChange(running);
    };
  }
  set onConnectionError(onConnectionError) {
    super.onConnectionError = (...args) => {
      __privateGet(this, _latencyEngine) && __privateGet(this, _latencyEngine).pause();
      onConnectionError(...args);
    };
  }
}, _latencyEngine = new WeakMap(), _latencyTimeout = new WeakMap(), _setLatencyRunning = new WeakMap(), _a2);
var _measurementId, _token, _requestTime, _logApiUrl, _sessionId, _LoggingBandwidthEngine_instances, loggingResponseHook_fn, logMeasurement_fn, _a3;
var LoggingBandwidthEngine = (_a3 = class extends BandwidthWithParallelLatencyEngine {
  constructor(measurements, { measurementId, logApiUrl, sessionId, ...ptProps } = {}) {
    super(measurements, ptProps);
    __privateAdd(this, _LoggingBandwidthEngine_instances);
    __privateAdd(this, _measurementId);
    __privateAdd(this, _token);
    __privateAdd(this, _requestTime);
    __privateAdd(this, _logApiUrl);
    __privateAdd(this, _sessionId);
    __privateSet(this, _measurementId, measurementId);
    __privateSet(this, _logApiUrl, logApiUrl);
    __privateSet(this, _sessionId, sessionId);
    super.qsParams = logApiUrl ? { measId: __privateGet(this, _measurementId) } : {};
    super.responseHook = (r) => __privateMethod(this, _LoggingBandwidthEngine_instances, loggingResponseHook_fn).call(this, r);
    super.onMeasurementResult = (meas) => __privateMethod(this, _LoggingBandwidthEngine_instances, logMeasurement_fn).call(this, meas);
  }
  set qsParams(qsParams) {
    super.qsParams = __privateGet(this, _logApiUrl) ? {
      measId: __privateGet(this, _measurementId),
      ...qsParams
    } : qsParams;
  }
  set responseHook(responseHook) {
    super.responseHook = (r) => {
      responseHook(r);
      __privateMethod(this, _LoggingBandwidthEngine_instances, loggingResponseHook_fn).call(this, r);
    };
  }
  set onMeasurementResult(onMeasurementResult) {
    super.onMeasurementResult = (meas, ...restArgs) => {
      onMeasurementResult(meas, ...restArgs);
      __privateMethod(this, _LoggingBandwidthEngine_instances, logMeasurement_fn).call(this, meas);
    };
  }
}, _measurementId = new WeakMap(), _token = new WeakMap(), _requestTime = new WeakMap(), _logApiUrl = new WeakMap(), _sessionId = new WeakMap(), _LoggingBandwidthEngine_instances = new WeakSet(), loggingResponseHook_fn = function(r) {
  if (!__privateGet(this, _logApiUrl)) return;
  __privateSet(this, _requestTime, +r.headers.get(`cf-meta-request-time`));
  __privateSet(this, _token, r.body.slice(-300).split("___").pop());
}, logMeasurement_fn = function(measData) {
  if (!__privateGet(this, _logApiUrl)) return;
  const logData = {
    type: measData.type,
    bytes: measData.bytes,
    ping: Math.round(measData.ping),
    ttfb: Math.round(measData.ttfb),
    payloadDownloadTime: Math.round(measData.payloadDownloadTime),
    duration: Math.round(measData.duration),
    transferSize: Math.round(measData.transferSize),
    serverTime: Math.round(measData.serverTime),
    token: __privateGet(this, _token),
    requestTime: __privateGet(this, _requestTime),
    measId: __privateGet(this, _measurementId),
    sessionId: __privateGet(this, _sessionId)
  };
  __privateSet(this, _token, null);
  __privateSet(this, _requestTime, null);
  fetch(__privateGet(this, _logApiUrl), {
    method: "POST",
    body: JSON.stringify(logData),
    ...this.fetchOptions
  });
}, _a3);
var _running2, _currentPromise, _promiseFn, _PromiseEngine_instances, setRunning_fn2, next_fn, cancelCurrent_fn, _a4;
var PromiseEngine = (_a4 = class {
  constructor(promiseFn) {
    __privateAdd(this, _PromiseEngine_instances);
    __privateAdd(this, _running2, false);
    __privateAdd(this, _currentPromise);
    __privateAdd(this, _promiseFn);
    if (!promiseFn) throw new Error(`Missing operation to perform`);
    __privateSet(this, _promiseFn, promiseFn);
    this.play();
  }
  pause() {
    __privateMethod(this, _PromiseEngine_instances, cancelCurrent_fn).call(this);
    __privateMethod(this, _PromiseEngine_instances, setRunning_fn2).call(this, false);
  }
  stop() {
    this.pause();
  }
  play() {
    if (!__privateGet(this, _running2)) {
      __privateMethod(this, _PromiseEngine_instances, setRunning_fn2).call(this, true);
      __privateMethod(this, _PromiseEngine_instances, next_fn).call(this);
    }
  }
}, _running2 = new WeakMap(), _currentPromise = new WeakMap(), _promiseFn = new WeakMap(), _PromiseEngine_instances = new WeakSet(), setRunning_fn2 = function(running) {
  if (running !== __privateGet(this, _running2)) __privateSet(this, _running2, running);
}, next_fn = function() {
  const curPromise = __privateSet(this, _currentPromise, __privateGet(this, _promiseFn).call(this).then(() => {
    !curPromise._cancel && __privateMethod(this, _PromiseEngine_instances, next_fn).call(this);
  }));
}, cancelCurrent_fn = function() {
  const curPromise = __privateGet(this, _currentPromise);
  curPromise && (curPromise._cancel = true);
}, _a4);
var _engines, _a5;
var LoadNetworkEngine = (_a5 = class {
  constructor({ download, upload } = {}) {
    __publicField(this, "qsParams", {});
    __publicField(this, "fetchOptions", {});
    __privateAdd(this, _engines, []);
    if (!download && !upload) throw new Error("Missing at least one of download/upload config");
    [[download, "download"], [upload, "upload"]].filter((entry) => entry[0] !== null && entry[0] !== void 0).forEach(([cfg, type]) => {
      const { apiUrl, chunkSize } = cfg;
      if (!apiUrl) throw new Error(`Missing ${type} apiUrl argument`);
      if (!chunkSize) throw new Error(`Missing ${type} chunkSize argument`);
    });
    const getLoadEngine = ({ apiUrl, qsParams = {}, fetchOptions = {} }) => new PromiseEngine(() => {
      const fetchQsParams = Object.assign({}, qsParams, this.qsParams);
      const urlObj = new URL(apiUrl, window.location.origin);
      Object.entries(fetchQsParams).forEach(([k, v]) => urlObj.searchParams.set(k, v));
      const url = urlObj.href;
      const fetchOpt = Object.assign({}, fetchOptions, this.fetchOptions);
      return fetch(url, fetchOpt).then((r) => {
        if (r.ok) return r;
        throw Error(r.statusText);
      }).then((r) => r.text());
    });
    download && __privateGet(this, _engines).push(getLoadEngine({
      apiUrl: download.apiUrl,
      qsParams: { bytes: `${download.chunkSize}` }
    }));
    upload && __privateGet(this, _engines).push(getLoadEngine({
      apiUrl: upload.apiUrl,
      fetchOptions: {
        method: "POST",
        body: "0".repeat(upload.chunkSize)
      }
    }));
  }
  pause() {
    __privateGet(this, _engines).forEach((engine) => engine.pause());
  }
  stop() {
    this.pause();
  }
  play() {
    __privateGet(this, _engines).forEach((engine) => engine.play());
  }
}, _engines = new WeakMap(), _a5);
var _established, _sender, _receiver, _senderDc, _receiverDc, _a6;
var SelfWebRtcDataConnection = (_a6 = class {
  constructor({ iceServers = [], acceptIceCandidate = (candidate) => {
    let protocol = candidate.protocol || "";
    if (!protocol && candidate.candidate) {
      const sdpAttrs = candidate.candidate.split(" ");
      sdpAttrs.length >= 3 && (protocol = sdpAttrs[2]);
    }
    return protocol.toLowerCase() === "udp";
  }, dataChannelCfg = {
    ordered: false,
    maxRetransmits: 0
  }, ...rtcPeerConnectionCfg } = {}) {
    __publicField(this, "onOpen", () => {
    });
    __publicField(this, "onClose", () => {
    });
    __publicField(this, "onMessageReceived", () => {
    });
    __privateAdd(this, _established, false);
    __privateAdd(this, _sender);
    __privateAdd(this, _receiver);
    __privateAdd(this, _senderDc);
    __privateAdd(this, _receiverDc);
    const sender = new RTCPeerConnection({
      iceServers,
      ...rtcPeerConnectionCfg
    });
    const receiver = new RTCPeerConnection({
      iceServers,
      ...rtcPeerConnectionCfg
    });
    const senderDc = sender.createDataChannel("channel", dataChannelCfg);
    senderDc.onopen = () => {
      __privateSet(this, _established, true);
      this.onOpen();
    };
    senderDc.onclose = () => this.close();
    receiver.ondatachannel = (e) => {
      const dc = e.channel;
      dc.onclose = () => this.close();
      dc.onmessage = (msg) => this.onMessageReceived(msg.data);
      __privateSet(this, _receiverDc, dc);
    };
    sender.onicecandidate = (e) => {
      e.candidate && acceptIceCandidate(e.candidate) && receiver.addIceCandidate(e.candidate);
    };
    receiver.onicecandidate = (e) => {
      e.candidate && acceptIceCandidate(e.candidate) && sender.addIceCandidate(e.candidate);
    };
    sender.createOffer().then((offer) => sender.setLocalDescription(offer)).then(() => receiver.setRemoteDescription(sender.localDescription)).then(() => receiver.createAnswer()).then((answer) => receiver.setLocalDescription(answer)).then(() => sender.setRemoteDescription(receiver.localDescription));
    __privateSet(this, _sender, sender);
    __privateSet(this, _receiver, receiver);
    __privateSet(this, _senderDc, senderDc);
  }
  send(msg) {
    __privateGet(this, _senderDc).send(String(msg));
  }
  close() {
    __privateGet(this, _sender) && __privateGet(this, _sender).close();
    __privateGet(this, _receiver) && __privateGet(this, _receiver).close();
    __privateGet(this, _senderDc) && __privateGet(this, _senderDc).close();
    __privateGet(this, _receiverDc) && __privateGet(this, _receiverDc).close();
    __privateGet(this, _established) && this.onClose();
    __privateSet(this, _established, false);
    return this;
  }
}, _established = new WeakMap(), _sender = new WeakMap(), _receiver = new WeakMap(), _senderDc = new WeakMap(), _receiverDc = new WeakMap(), _a6);
var _onCredentialsFailure, _onConnectionError2, _onFinished2, _msgTracker, _numMsgs, _a7;
var PacketLossEngine = (_a7 = class {
  constructor({ turnServerUri, turnServerCredsApi, turnServerCredsApiParser = ({ username, credential, server }) => ({
    turnServerUser: username,
    turnServerPass: credential,
    turnServerUri: server
  }), turnServerCredsApiIncludeCredentials = false, turnServerUser, turnServerPass, numMsgs = 100, batchSize = 10, batchWaitTime = 10, responsesWaitTime = 5e3, connectionTimeout = 5e3 } = {}) {
    __privateAdd(this, _onCredentialsFailure, () => {
    });
    __privateAdd(this, _onConnectionError2, () => {
    });
    __privateAdd(this, _onFinished2, () => {
    });
    __publicField(this, "onMsgSent", () => {
    });
    __publicField(this, "onAllMsgsSent", () => {
    });
    __publicField(this, "onMsgReceived", () => {
    });
    __privateAdd(this, _msgTracker, {});
    __privateAdd(this, _numMsgs);
    if (!turnServerUri && !turnServerCredsApi) throw new Error("Missing turnServerCredsApi or turnServerUri argument");
    if ((!turnServerUser || !turnServerPass) && !turnServerCredsApi) throw new Error("Missing either turnServerCredsApi or turnServerUser+turnServerPass arguments");
    __privateSet(this, _numMsgs, numMsgs);
    (!turnServerUser || !turnServerPass ? fetch(turnServerCredsApi, { credentials: turnServerCredsApiIncludeCredentials ? "include" : void 0 }).then((r) => r.json()).then((d) => {
      if (d.error) throw d.error;
      return d;
    }).then(turnServerCredsApiParser) : Promise.resolve({
      turnServerUser,
      turnServerPass
    })).catch((e) => __privateGet(this, _onCredentialsFailure).call(this, e)).then((creds) => {
      if (!creds) return;
      const { turnServerUser: credsUser, turnServerPass: credsPass, turnServerUri: credsApiTurnServerUri } = creds;
      const c = new SelfWebRtcDataConnection({
        iceServers: [{
          urls: `turn:${credsApiTurnServerUri || turnServerUri}?transport=udp`,
          username: credsUser,
          credential: credsPass
        }],
        iceTransportPolicy: "relay"
      });
      let connectionSuccess = false;
      setTimeout(() => {
        if (!connectionSuccess) {
          c.close();
          __privateGet(this, _onConnectionError2).call(this, "ICE connection timeout!");
        }
      }, connectionTimeout);
      const msgTracker = __privateGet(this, _msgTracker);
      c.onOpen = () => {
        connectionSuccess = true;
        const self = this;
        (function sendNum(n) {
          if (n <= numMsgs) {
            let i = n;
            while (i <= Math.min(numMsgs, n + batchSize - 1)) {
              msgTracker[i] = false;
              c.send(i);
              self.onMsgSent(i);
              i++;
            }
            setTimeout(() => sendNum(i), batchWaitTime);
          } else {
            self.onAllMsgsSent(Object.keys(msgTracker).length);
            const finishFn = () => {
              var _a14;
              c.close();
              __privateGet(_a14 = self, _onFinished2).call(_a14, self.results);
            };
            let finishTimeout = setTimeout(finishFn, responsesWaitTime);
            let missingMsgs = Object.values(__privateGet(self, _msgTracker)).filter((recv) => !recv).length;
            c.onMessageReceived = (msg) => {
              clearTimeout(finishTimeout);
              msgTracker[msg] = true;
              self.onMsgReceived(msg);
              missingMsgs--;
              if (missingMsgs <= 0 && Object.values(__privateGet(self, _msgTracker)).every((recv) => recv)) finishFn();
              else finishTimeout = setTimeout(finishFn, responsesWaitTime);
            };
          }
        })(1);
      };
      c.onMessageReceived = (msg) => {
        msgTracker[msg] = true;
        this.onMsgReceived(msg);
      };
    }).catch((e) => __privateGet(this, _onConnectionError2).call(this, e.toString()));
  }
  set onCredentialsFailure(f) {
    __privateSet(this, _onCredentialsFailure, f);
  }
  set onConnectionError(f) {
    __privateSet(this, _onConnectionError2, f);
  }
  set onFinished(f) {
    __privateSet(this, _onFinished2, f);
  }
  get results() {
    const totalMessages = __privateGet(this, _numMsgs);
    const numMessagesSent = Object.keys(__privateGet(this, _msgTracker)).length;
    const lostMessages = Object.entries(__privateGet(this, _msgTracker)).filter(([, recv]) => !recv).map(([n]) => +n);
    return {
      totalMessages,
      numMessagesSent,
      packetLoss: lostMessages.length / numMessagesSent,
      lostMessages
    };
  }
}, _onCredentialsFailure = new WeakMap(), _onConnectionError2 = new WeakMap(), _onFinished2 = new WeakMap(), _msgTracker = new WeakMap(), _numMsgs = new WeakMap(), _a7);
var _loadEngine, _a8;
var PacketLossUnderLoadEngine = (_a8 = class extends PacketLossEngine {
  constructor({ downloadChunkSize, uploadChunkSize, downloadApiUrl, uploadApiUrl, ...ptProps } = {}) {
    super(ptProps);
    __privateAdd(this, _loadEngine);
    if (downloadChunkSize || uploadChunkSize) {
      __privateSet(this, _loadEngine, new LoadNetworkEngine({
        download: downloadChunkSize ? {
          apiUrl: downloadApiUrl,
          chunkSize: downloadChunkSize
        } : null,
        upload: uploadChunkSize ? {
          apiUrl: uploadApiUrl,
          chunkSize: uploadChunkSize
        } : null
      }));
      super.onCredentialsFailure = super.onConnectionError = super.onFinished = () => __privateGet(this, _loadEngine).stop();
    }
  }
  set qsParams(qsParams) {
    __privateGet(this, _loadEngine) && (__privateGet(this, _loadEngine).qsParams = qsParams);
  }
  set fetchOptions(fetchOptions) {
    __privateGet(this, _loadEngine) && (__privateGet(this, _loadEngine).fetchOptions = fetchOptions);
  }
  set onCredentialsFailure(onCredentialsFailure) {
    super.onCredentialsFailure = (...args) => {
      onCredentialsFailure(...args);
      __privateGet(this, _loadEngine) && __privateGet(this, _loadEngine).stop();
    };
  }
  set onConnectionError(onConnectionError) {
    super.onConnectionError = (...args) => {
      onConnectionError(...args);
      __privateGet(this, _loadEngine) && __privateGet(this, _loadEngine).stop();
    };
  }
  set onFinished(onFinished) {
    super.onFinished = (...args) => {
      onFinished(...args);
      __privateGet(this, _loadEngine) && __privateGet(this, _loadEngine).stop();
    };
  }
}, _loadEngine = new WeakMap(), _a8);
var ReachabilityEngine = class {
  constructor(targetUrl, { timeout = -1, fetchOptions = {} } = {}) {
    __publicField(this, "onFinished", () => {
    });
    let finished = false;
    const finish = ({ reachable, ...rest }) => {
      if (finished) return;
      finished = true;
      this.onFinished({
        targetUrl,
        reachable,
        ...rest
      });
    };
    fetch(targetUrl, fetchOptions).then((response) => {
      finish({
        reachable: true,
        response
      });
    }).catch((error) => {
      finish({
        reachable: false,
        error
      });
    });
    timeout > 0 && setTimeout(() => finish({
      reachable: false,
      error: "Request timeout"
    }), timeout);
  }
};
var sum = (vals) => vals.reduce((agg, val) => agg + val, 0);
var percentile = (vals, perc = 0.5) => {
  if (!vals.length) return 0;
  const sortedVals = vals.slice().sort((a, b) => a - b);
  const idx = (vals.length - 1) * perc;
  const rem = idx % 1;
  if (rem === 0) return sortedVals[Math.round(idx)];
  const edges = [Math.floor, Math.ceil].map((rndFn) => sortedVals[rndFn(idx)]);
  return edges[0] + (edges[1] - edges[0]) * rem;
};
var _config, _extractLoadedLatencies, _a9;
var MeasurementCalculations = (_a9 = class {
  constructor(config) {
    __publicField(this, "getLatencyPoints", (latencyResults) => latencyResults.timings.map((d) => d.ping));
    __publicField(this, "getLatency", (latencyResults) => percentile(this.getLatencyPoints(latencyResults), __privateGet(this, _config).latencyPercentile));
    __publicField(this, "getBandwidthPoints", (bandwidthResults) => Object.entries(bandwidthResults).map(([bytes, { timings }]) => timings.map(({ bps, duration, ping, measTime, serverTime, transferSize }) => ({
      bytes: +bytes,
      bps,
      duration,
      ping,
      measTime,
      serverTime,
      transferSize
    }))).flat());
    __publicField(this, "getBandwidth", (bandwidthResults) => percentile(this.getBandwidthPoints(bandwidthResults).filter((d) => d.duration >= __privateGet(this, _config).bandwidthMinRequestDuration).map((d) => d.bps).filter((bps) => bps), __privateGet(this, _config).bandwidthPercentile));
    __publicField(this, "getLoadedLatency", (loadedResults) => this.getLatency({ timings: __privateGet(this, _extractLoadedLatencies).call(this, loadedResults) }));
    __publicField(this, "getLoadedJitter", (loadedResults) => this.getJitter({ timings: __privateGet(this, _extractLoadedLatencies).call(this, loadedResults) }));
    __publicField(this, "getLoadedLatencyPoints", (loadedResults) => this.getLatencyPoints({ timings: __privateGet(this, _extractLoadedLatencies).call(this, loadedResults) }));
    __publicField(this, "getPacketLoss", (plResults) => plResults.packetLoss);
    __publicField(this, "getPacketLossDetails", (plResults) => plResults);
    __publicField(this, "getReachability", (reachabilityResults) => !!reachabilityResults.reachable);
    __publicField(this, "getReachabilityDetails", (d) => ({
      host: d.host,
      reachable: d.reachable
    }));
    __privateAdd(this, _config);
    __privateAdd(this, _extractLoadedLatencies, (loadedResults) => Object.values(loadedResults).filter((d) => d.timings.length && Math.min(...d.timings.map((d2) => d2.duration)) >= __privateGet(this, _config).loadedRequestMinDuration).map((d) => d.sideLatency || []).flat().slice(-__privateGet(this, _config).loadedLatencyMaxPoints));
    __privateSet(this, _config, config);
  }
  getJitter(latencyResults) {
    const pings = this.getLatencyPoints(latencyResults);
    return pings.length < 2 ? null : pings.reduce(({ sumDeltas = 0, prevLatency }, latency) => ({
      sumDeltas: sumDeltas + (prevLatency !== void 0 ? Math.abs(prevLatency - latency) : 0),
      prevLatency: latency
    }), {}).sumDeltas / (pings.length - 1);
  }
}, _config = new WeakMap(), _extractLoadedLatencies = new WeakMap(), _a9);
var classificationNames = [
  "bad",
  "poor",
  "average",
  "good",
  "great"
];
var customResultTypes = { loadedLatencyIncrease: (measurements) => measurements.latency && (measurements.downLoadedLatency || measurements.upLoadedLatency) ? Math.max(measurements.downLoadedLatency, measurements.upLoadedLatency) - measurements.latency : void 0 };
var defaultPoints = { packetLoss: 0 };
var _config2, _a10;
var ScoresCalculations = (_a10 = class {
  constructor(config) {
    __privateAdd(this, _config2);
    __privateSet(this, _config2, config);
  }
  getScores(measurements) {
    const scores = Object.assign({}, ...Object.entries(__privateGet(this, _config2).aimMeasurementScoring).map(([type, fn]) => {
      const val = customResultTypes.hasOwnProperty(type) ? customResultTypes[type](measurements) : measurements[type];
      return val === void 0 ? defaultPoints.hasOwnProperty(type) ? { [type]: defaultPoints[type] } : {} : { [type]: +fn(val) };
    }));
    return Object.assign({}, ...Object.entries(__privateGet(this, _config2).aimExperiencesDefs).filter(([, { input }]) => input.every((k) => scores.hasOwnProperty(k))).map(([k, { input, pointThresholds }]) => {
      const sumPoints = Math.max(0, sum(input.map((k2) => scores[k2])));
      const classificationIdx = scaleThreshold(pointThresholds, [
        0,
        1,
        2,
        3,
        4
      ])(sumPoints);
      const classificationName = classificationNames[classificationIdx];
      return { [k]: {
        points: sumPoints,
        classificationIdx,
        classificationName
      } };
    }));
  }
}, _config2 = new WeakMap(), _a10);
var _config3, _measCalc, _scoresCalc, _calcGetter, _getV4Reachability, _getV4ReachabilityDetails, _getV6Reachability, _getV6ReachabilityDetails, _a11;
var Results = (_a11 = class {
  constructor(config) {
    __publicField(this, "raw");
    __publicField(this, "getUnloadedLatency", () => __privateGet(this, _calcGetter).call(this, "getLatency", "latency"));
    __publicField(this, "getUnloadedJitter", () => __privateGet(this, _calcGetter).call(this, "getJitter", "latency"));
    __publicField(this, "getUnloadedLatencyPoints", () => __privateGet(this, _calcGetter).call(this, "getLatencyPoints", "latency", []));
    __publicField(this, "getDownLoadedLatency", () => __privateGet(this, _calcGetter).call(this, "getLoadedLatency", "download"));
    __publicField(this, "getDownLoadedJitter", () => __privateGet(this, _calcGetter).call(this, "getLoadedJitter", "download"));
    __publicField(this, "getDownLoadedLatencyPoints", () => __privateGet(this, _calcGetter).call(this, "getLoadedLatencyPoints", "download", []));
    __publicField(this, "getUpLoadedLatency", () => __privateGet(this, _calcGetter).call(this, "getLoadedLatency", "upload"));
    __publicField(this, "getUpLoadedJitter", () => __privateGet(this, _calcGetter).call(this, "getLoadedJitter", "upload"));
    __publicField(this, "getUpLoadedLatencyPoints", () => __privateGet(this, _calcGetter).call(this, "getLoadedLatencyPoints", "upload", []));
    __publicField(this, "getDownloadBandwidth", () => __privateGet(this, _calcGetter).call(this, "getBandwidth", "download"));
    __publicField(this, "getDownloadBandwidthPoints", () => __privateGet(this, _calcGetter).call(this, "getBandwidthPoints", "download", []));
    __publicField(this, "getUploadBandwidth", () => __privateGet(this, _calcGetter).call(this, "getBandwidth", "upload"));
    __publicField(this, "getUploadBandwidthPoints", () => __privateGet(this, _calcGetter).call(this, "getBandwidthPoints", "upload", []));
    __publicField(this, "getPacketLoss", () => __privateGet(this, _calcGetter).call(this, "getPacketLoss", "packetLoss"));
    __publicField(this, "getPacketLossDetails", () => __privateGet(this, _calcGetter).call(this, "getPacketLossDetails", "packetLoss", void 0, true));
    __publicField(this, "getTotalDurationMs", () => this.raw.totalDurationMs);
    __publicField(this, "getScores", () => __privateGet(this, _scoresCalc).getScores(this.getSummary()));
    __privateAdd(this, _config3);
    __privateAdd(this, _measCalc);
    __privateAdd(this, _scoresCalc);
    __privateAdd(this, _calcGetter, (calcFn, resKey, defaultVal = void 0, surfaceError = false) => {
      const entry = this.raw[resKey];
      if (!entry || typeof entry !== "object" || !entry.started) return defaultVal;
      const measEntry = entry;
      if (surfaceError && measEntry.error) return { error: measEntry.error };
      return __privateGet(this, _measCalc)[calcFn](measEntry.results);
    });
    __privateAdd(this, _getV4Reachability, () => __privateGet(this, _calcGetter).call(this, "getReachability", "v4Reachability"));
    __privateAdd(this, _getV4ReachabilityDetails, () => __privateGet(this, _calcGetter).call(this, "getReachabilityDetails", "v4Reachability"));
    __privateAdd(this, _getV6Reachability, () => __privateGet(this, _calcGetter).call(this, "getReachability", "v6Reachability"));
    __privateAdd(this, _getV6ReachabilityDetails, () => __privateGet(this, _calcGetter).call(this, "getReachabilityDetails", "v6Reachability"));
    __privateSet(this, _config3, config);
    this.clear();
    __privateSet(this, _measCalc, new MeasurementCalculations(__privateGet(this, _config3)));
    __privateSet(this, _scoresCalc, new ScoresCalculations(__privateGet(this, _config3)));
  }
  get isFinished() {
    return Object.values(this.raw).filter((d) => d !== null && typeof d === "object").every((d) => d.finished);
  }
  clear() {
    this.raw = Object.assign({ totalDurationMs: void 0 }, ...[...new Set(__privateGet(this, _config3).measurements.map((m) => m.type))].map((m) => ({ [m]: {
      started: false,
      finished: false,
      results: {}
    } })));
  }
  getSummary() {
    const items = {
      download: this.getDownloadBandwidth,
      upload: this.getUploadBandwidth,
      latency: this.getUnloadedLatency,
      jitter: this.getUnloadedJitter,
      downLoadedLatency: this.getDownLoadedLatency,
      downLoadedJitter: this.getDownLoadedJitter,
      upLoadedLatency: this.getUpLoadedLatency,
      upLoadedJitter: this.getUpLoadedJitter,
      packetLoss: this.getPacketLoss,
      v4Reachability: __privateGet(this, _getV4Reachability),
      v6Reachability: __privateGet(this, _getV6Reachability),
      totalDurationMs: this.getTotalDurationMs
    };
    return Object.assign({}, ...Object.entries(items).map(([key, fn]) => {
      const val = fn();
      return val === void 0 ? {} : { [key]: val };
    }));
  }
}, _config3 = new WeakMap(), _measCalc = new WeakMap(), _scoresCalc = new WeakMap(), _calcGetter = new WeakMap(), _getV4Reachability = new WeakMap(), _getV4ReachabilityDetails = new WeakMap(), _getV6Reachability = new WeakMap(), _getV6ReachabilityDetails = new WeakMap(), _a11);
var round = (num, decimals = 0) => !num ? num : Math.round(num * 10 ** decimals) / 10 ** decimals;
var latencyPointsParser = (durations) => durations.map((d) => round(d, 2));
var bpsPointsParser = (pnts) => pnts.map((d) => ({
  bytes: +d.bytes,
  bps: round(d.bps)
}));
var packetLossParser = (d) => {
  const details = d;
  return details.error ? void 0 : {
    numMessages: details.numMessagesSent,
    lossRatio: round(details.packetLoss, 4)
  };
};
var resultsParsers = {
  latencyMs: ["getUnloadedLatencyPoints", latencyPointsParser],
  download: ["getDownloadBandwidthPoints", bpsPointsParser],
  upload: ["getUploadBandwidthPoints", bpsPointsParser],
  downLoadedLatencyMs: ["getDownLoadedLatencyPoints", latencyPointsParser],
  upLoadedLatencyMs: ["getUpLoadedLatencyPoints", latencyPointsParser],
  packetLoss: ["getPacketLossDetails", packetLossParser],
  totalDurationMs: ["getTotalDurationMs"]
};
var scoreParser = (d) => ({
  points: d.points,
  classification: d.classificationName
});
var logAimResults = async (results, { apiUrl, sessionId }) => {
  const logData = { sessionId };
  Object.entries(resultsParsers).forEach(([logK, [fn, parser]]) => {
    const resolvedParser = parser ?? ((d) => d);
    const val = results[fn]();
    if (val) logData[logK] = resolvedParser(val);
  });
  const scores = results.getScores();
  if (scores) logData.scores = Object.assign({}, ...Object.entries(scores).map(([k, score]) => ({ [k]: scoreParser(score) })));
  console.log("results", logData);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(logData)
    });
    if (!response.ok) return { requestId: void 0 };
    return await response.json();
  } catch {
    return { requestId: void 0 };
  }
};
var DEFAULT_OPTIMAL_DOWNLOAD_SIZE = 1e6;
var DEFAULT_OPTIMAL_UPLOAD_SIZE = 1e6;
var OPTIMAL_SIZE_RATIO = 0.5;
var pausableTypes = [
  "latency",
  "latencyUnderLoad",
  "download",
  "upload"
];
var genMeasId = () => `${Math.round(Math.random() * 1e16)}`;
var _onFinish, _onError, _config4, _results2, _measurementId2, _serverTimeDelta2, _curMsmIdx, _curEngine, _optimalDownloadChunkSize, _optimalUploadChunkSize, _startTime, _accumulatedRuntimeMs, _running3, _finished2, _MeasurementEngine_instances, setRunning_fn3, setFinished_fn, curType_fn, curTypeResults_fn, clear_fn, destroyCurEngine_fn, next_fn2, _a12;
var MeasurementEngine = (_a12 = class {
  constructor(userConfig = {}) {
    __privateAdd(this, _MeasurementEngine_instances);
    __publicField(this, "onRunningChange", () => {
    });
    __publicField(this, "onResultsChange", () => {
    });
    __publicField(this, "onPhaseChange", () => {
    });
    __privateAdd(this, _onFinish, () => {
    });
    __privateAdd(this, _onError, () => {
    });
    __privateAdd(this, _config4);
    __privateAdd(this, _results2);
    __privateAdd(this, _measurementId2, genMeasId());
    __privateAdd(this, _serverTimeDelta2, 0);
    __privateAdd(this, _curMsmIdx, -1);
    __privateAdd(this, _curEngine);
    __privateAdd(this, _optimalDownloadChunkSize, DEFAULT_OPTIMAL_DOWNLOAD_SIZE);
    __privateAdd(this, _optimalUploadChunkSize, DEFAULT_OPTIMAL_UPLOAD_SIZE);
    __privateAdd(this, _startTime);
    __privateAdd(this, _accumulatedRuntimeMs, 0);
    __privateAdd(this, _running3, false);
    __privateAdd(this, _finished2, false);
    __privateSet(this, _config4, Object.assign({}, defaultConfig, userConfig, internalConfig));
    __privateSet(this, _results2, new Results(__privateGet(this, _config4)));
    __privateGet(this, _config4).autoStart && this.play();
  }
  get results() {
    return __privateGet(this, _results2);
  }
  get isRunning() {
    return __privateGet(this, _running3);
  }
  get isFinished() {
    return __privateGet(this, _finished2);
  }
  set onFinish(f) {
    __privateSet(this, _onFinish, f);
  }
  set onError(f) {
    __privateSet(this, _onError, f);
  }
  pause() {
    const curType = __privateMethod(this, _MeasurementEngine_instances, curType_fn).call(this);
    curType && pausableTypes.includes(curType) && __privateGet(this, _curEngine)?.pause?.();
    __privateMethod(this, _MeasurementEngine_instances, setRunning_fn3).call(this, false);
  }
  play() {
    if (!__privateGet(this, _running3)) {
      performance.clearResourceTimings();
      performance.setResourceTimingBufferSize(1e4);
      __privateMethod(this, _MeasurementEngine_instances, setRunning_fn3).call(this, true);
      __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
    }
  }
  restart() {
    __privateMethod(this, _MeasurementEngine_instances, clear_fn).call(this);
    this.play();
  }
}, _onFinish = new WeakMap(), _onError = new WeakMap(), _config4 = new WeakMap(), _results2 = new WeakMap(), _measurementId2 = new WeakMap(), _serverTimeDelta2 = new WeakMap(), _curMsmIdx = new WeakMap(), _curEngine = new WeakMap(), _optimalDownloadChunkSize = new WeakMap(), _optimalUploadChunkSize = new WeakMap(), _startTime = new WeakMap(), _accumulatedRuntimeMs = new WeakMap(), _running3 = new WeakMap(), _finished2 = new WeakMap(), _MeasurementEngine_instances = new WeakSet(), setRunning_fn3 = function(running) {
  if (running !== __privateGet(this, _running3)) {
    __privateSet(this, _running3, running);
    this.onRunningChange(__privateGet(this, _running3));
  }
  if (running) __privateSet(this, _startTime, performance.now());
  else if (typeof __privateGet(this, _startTime) !== "undefined") {
    __privateSet(this, _accumulatedRuntimeMs, __privateGet(this, _accumulatedRuntimeMs) + (performance.now() - __privateGet(this, _startTime)));
    __privateSet(this, _startTime, void 0);
  }
}, setFinished_fn = function(finished) {
  if (finished !== __privateGet(this, _finished2)) {
    __privateSet(this, _finished2, finished);
    if (finished) {
      __privateGet(this, _results2).raw.totalDurationMs = __privateGet(this, _accumulatedRuntimeMs);
      setTimeout(() => __privateGet(this, _onFinish).call(this, this.results));
    }
  }
}, curType_fn = function() {
  return __privateGet(this, _curMsmIdx) < 0 || __privateGet(this, _curMsmIdx) >= __privateGet(this, _config4).measurements.length ? null : __privateGet(this, _config4).measurements[__privateGet(this, _curMsmIdx)].type;
}, curTypeResults_fn = function() {
  const type = __privateMethod(this, _MeasurementEngine_instances, curType_fn).call(this);
  if (!type) return void 0;
  return __privateGet(this, _results2).raw[type] || void 0;
}, clear_fn = function() {
  __privateMethod(this, _MeasurementEngine_instances, destroyCurEngine_fn).call(this);
  __privateSet(this, _measurementId2, genMeasId());
  __privateSet(this, _curMsmIdx, -1);
  __privateSet(this, _curEngine, void 0);
  __privateMethod(this, _MeasurementEngine_instances, setRunning_fn3).call(this, false);
  __privateMethod(this, _MeasurementEngine_instances, setFinished_fn).call(this, false);
  __privateGet(this, _results2).clear();
  __privateSet(this, _accumulatedRuntimeMs, 0);
}, destroyCurEngine_fn = function() {
  const engine = __privateGet(this, _curEngine);
  if (!engine) return;
  engine.onFinished = engine.onConnectionError = engine.onMsgReceived = engine.onCredentialsFailure = engine.onMeasurementResult = () => {
  };
  const curType = __privateMethod(this, _MeasurementEngine_instances, curType_fn).call(this);
  curType && pausableTypes.includes(curType) && engine.pause?.();
}, next_fn2 = function() {
  const resumeType = __privateMethod(this, _MeasurementEngine_instances, curType_fn).call(this);
  const resumeResults = __privateMethod(this, _MeasurementEngine_instances, curTypeResults_fn).call(this);
  if (resumeType && pausableTypes.includes(resumeType) && resumeResults && resumeResults.started && !resumeResults.finished && !resumeResults.finishedCurrentRound && !resumeResults.error) {
    __privateGet(this, _curEngine)?.play?.();
    return;
  }
  __privateWrapper(this, _curMsmIdx)._++;
  if (__privateGet(this, _curMsmIdx) >= __privateGet(this, _config4).measurements.length) {
    __privateMethod(this, _MeasurementEngine_instances, setRunning_fn3).call(this, false);
    __privateMethod(this, _MeasurementEngine_instances, setFinished_fn).call(this, true);
    return;
  }
  const { type, ...msmConfig } = __privateGet(this, _config4).measurements[__privateGet(this, _curMsmIdx)];
  const msmResults = __privateMethod(this, _MeasurementEngine_instances, curTypeResults_fn).call(this);
  this.onPhaseChange({
    measurementId: __privateGet(this, _curMsmIdx),
    measurement: {
      type,
      ...msmConfig
    }
  });
  const { downloadApiUrl, uploadApiUrl, estimatedServerTime } = __privateGet(this, _config4);
  let engine;
  switch (type) {
    case "v4Reachability":
    case "v6Reachability":
      engine = new ReachabilityEngine(`https://${msmConfig.host}`, { fetchOptions: {
        method: "GET",
        mode: "no-cors"
      } });
      engine.onFinished = (result) => {
        const r = result;
        msmResults.finished = true;
        msmResults.results = {
          host: msmConfig.host,
          ...r
        };
        this.onResultsChange({ type });
        __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
      };
      break;
    case "rpki":
      engine = new ReachabilityEngine(`https://${__privateGet(this, _config4).rpkiInvalidHost}`, { timeout: 5e3 });
      engine.onFinished = (result) => {
        const r = result;
        (r.response ? r.response.json() : Promise.resolve()).then((response) => {
          msmResults.finished = true;
          msmResults.results = {
            host: __privateGet(this, _config4).rpkiInvalidHost,
            filteringInvalids: !r.reachable,
            ...response ? {
              asn: response.asn,
              name: response.name
            } : {}
          };
          this.onResultsChange({ type });
          __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
        });
      };
      break;
    case "nxdomain":
      engine = new ReachabilityEngine(`https://${msmConfig.nxhost}`, { fetchOptions: { mode: "no-cors" } });
      engine.onFinished = (result) => {
        const r = result;
        msmResults.finished = true;
        msmResults.results = {
          host: msmConfig.nxhost,
          reachable: r.reachable
        };
        this.onResultsChange({ type });
        __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
      };
      break;
    case "packetLoss":
    case "packetLossUnderLoad":
      {
        msmResults.finished = false;
        const { numPackets: numMsgs, ...ptCfg } = msmConfig;
        const { turnServerUri, turnServerCredsApiUrl: turnServerCredsApi, turnServerUser, turnServerPass, includeCredentials } = __privateGet(this, _config4);
        engine = new PacketLossUnderLoadEngine({
          turnServerUri,
          turnServerCredsApi,
          turnServerCredsApiIncludeCredentials: includeCredentials,
          turnServerUser: turnServerUser ?? void 0,
          turnServerPass: turnServerPass ?? void 0,
          numMsgs,
          downloadChunkSize: msmConfig.loadDown ? __privateGet(this, _optimalDownloadChunkSize) : void 0,
          uploadChunkSize: msmConfig.loadUp ? __privateGet(this, _optimalUploadChunkSize) : void 0,
          downloadApiUrl,
          uploadApiUrl,
          ...ptCfg
        });
      }
      engine.onMsgReceived = () => {
        msmResults.results = Object.assign({}, engine.results);
        this.onResultsChange({ type });
      };
      engine.onFinished = () => {
        msmResults.finished = true;
        this.onResultsChange({ type });
        __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
      };
      engine.onConnectionError = (e) => {
        msmResults.error = e;
        this.onResultsChange({ type });
        __privateGet(this, _onError).call(this, `Connection error while measuring packet loss: ${e}`);
        __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
      };
      engine.onCredentialsFailure = () => {
        msmResults.error = "unable to get turn server credentials";
        this.onResultsChange({ type });
        __privateGet(this, _onError).call(this, "Error while measuring packet loss: unable to get turn server credentials.");
        __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
      };
      break;
    case "latency":
    case "latencyUnderLoad": {
      msmResults.finished = false;
      engine = new LoggingBandwidthEngine([{
        dir: "down",
        bytes: 0,
        count: msmConfig.numPackets,
        bypassMinDuration: true
      }], {
        downloadApiUrl,
        uploadApiUrl,
        estimatedServerTime,
        serverTimeDelta: __privateGet(this, _serverTimeDelta2),
        logApiUrl: __privateGet(this, _config4).logMeasurementApiUrl ?? void 0,
        measurementId: __privateGet(this, _measurementId2),
        sessionId: __privateGet(this, _config4).sessionId,
        downloadChunkSize: msmConfig.loadDown ? __privateGet(this, _optimalDownloadChunkSize) : void 0,
        uploadChunkSize: msmConfig.loadUp ? __privateGet(this, _optimalUploadChunkSize) : void 0
      });
      engine.fetchOptions = { credentials: __privateGet(this, _config4).includeCredentials ? "include" : void 0 };
      engine.abortRequestDuration = __privateGet(this, _config4).bandwidthAbortRequestDuration;
      if (!msmConfig.loadDown && !msmConfig.loadUp) {
        const eng = engine;
        eng.qsParams = {
          ...eng.qsParams,
          during: "idle"
        };
      }
      const priorTimings = (msmResults.results?.timings || []).slice();
      engine.onMeasurementResult = engine.onNewMeasurementStarted = (_meas, results) => {
        msmResults.results = Object.assign({}, results.down[0]);
        msmResults.results.timings = priorTimings.concat(msmResults.results.timings);
        this.onResultsChange({ type });
      };
      engine.onFinished = () => {
        __privateSet(this, _serverTimeDelta2, engine.serverTimeDelta);
        msmResults.finished = true;
        this.onResultsChange({ type });
        __privateGet(this, _running3) && __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
      };
      engine.onConnectionError = (e) => {
        __privateSet(this, _serverTimeDelta2, engine.serverTimeDelta);
        msmResults.error = e;
        this.onResultsChange({ type });
        __privateGet(this, _onError).call(this, `Connection error while measuring latency: ${e}`);
        __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
      };
      engine.play();
      break;
    }
    case "download":
    case "upload":
      if (msmResults.finished || msmResults.error) __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
      else {
        delete msmResults.finishedCurrentRound;
        const measureParallelLatency = __privateGet(this, _config4)[`measure${type === "download" ? "Down" : "Up"}loadLoadedLatency`];
        engine = new LoggingBandwidthEngine([{
          dir: type === "download" ? "down" : "up",
          ...msmConfig
        }], {
          downloadApiUrl,
          uploadApiUrl,
          estimatedServerTime,
          serverTimeDelta: __privateGet(this, _serverTimeDelta2),
          logApiUrl: __privateGet(this, _config4).logMeasurementApiUrl ?? void 0,
          measurementId: __privateGet(this, _measurementId2),
          measureParallelLatency,
          parallelLatencyThrottleMs: __privateGet(this, _config4).loadedLatencyThrottle,
          sessionId: __privateGet(this, _config4).sessionId
        });
        engine.fetchOptions = { credentials: __privateGet(this, _config4).includeCredentials ? "include" : void 0 };
        engine.finishRequestDuration = __privateGet(this, _config4).bandwidthFinishRequestDuration;
        engine.abortRequestDuration = __privateGet(this, _config4).bandwidthAbortRequestDuration;
        engine.onNewMeasurementStarted = (...args) => {
          const { count, bytes } = args[0];
          const res = msmResults.results = Object.assign({}, msmResults.results);
          !res.hasOwnProperty(bytes) && (res[bytes] = {
            timings: [],
            numMeasurements: 0,
            sideLatency: measureParallelLatency ? [] : void 0
          });
          const bucket = res[bytes];
          if (bucket.numMeasurements - bucket.timings.length !== count) {
            bucket.numMeasurements += count;
            this.onResultsChange({ type });
          }
        };
        engine.onMeasurementResult = (...args) => {
          const { bytes, ...timing } = args[0];
          msmResults.results[bytes].timings.push(timing);
          msmResults.results = Object.assign({}, msmResults.results);
          this.onResultsChange({ type });
        };
        engine.onParallelLatencyResult = (res) => {
          msmResults.results[msmConfig.bytes].sideLatency.push(res);
          msmResults.results = Object.assign({}, msmResults.results);
          this.onResultsChange({ type });
        };
        engine.onFinished = (results) => {
          __privateSet(this, _serverTimeDelta2, engine.serverTimeDelta);
          const bwResults = results;
          const isLastMsmOfType = !__privateGet(this, _config4).measurements.slice(__privateGet(this, _curMsmIdx) + 1).map((d) => d.type).includes(type);
          const minDuration = Math.min(...Object.values(type === "download" ? bwResults.down : bwResults.up).slice(-1)[0].timings.map((d) => d.duration));
          if (!(isLastMsmOfType || !msmConfig.bypassMinDuration && minDuration > __privateGet(this, _config4).bandwidthFinishRequestDuration)) msmResults.finishedCurrentRound = true;
          else {
            msmResults.finished = true;
            this.onResultsChange({ type });
            const optimalSize = Object.keys(msmResults.results).map((n) => +n).sort((a, b) => b - a)[0] * OPTIMAL_SIZE_RATIO;
            type === "download" && __privateSet(this, _optimalDownloadChunkSize, optimalSize);
            type === "upload" && __privateSet(this, _optimalUploadChunkSize, optimalSize);
          }
          __privateGet(this, _running3) && __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
        };
        engine.onConnectionError = (e) => {
          __privateSet(this, _serverTimeDelta2, engine.serverTimeDelta);
          msmResults.error = e;
          this.onResultsChange({ type });
          __privateGet(this, _onError).call(this, `Connection error while measuring ${type}: ${e}`);
          __privateMethod(this, _MeasurementEngine_instances, next_fn2).call(this);
        };
        engine.play();
      }
      break;
    default:
  }
  __privateSet(this, _curEngine, engine);
  msmResults.started = true;
  this.onResultsChange({ type });
}, _a12);
var _logAimApiUrl, _sessionId2, _logFinalResults, _a13;
var SpeedTestEngine = (_a13 = class extends MeasurementEngine {
  constructor(userConfig = {}) {
    super(userConfig);
    __publicField(this, "onResultsLogged", () => {
    });
    __privateAdd(this, _logAimApiUrl);
    __privateAdd(this, _sessionId2);
    __privateAdd(this, _logFinalResults, (results) => {
      if (!__privateGet(this, _logAimApiUrl)) return;
      logAimResults(results, {
        apiUrl: __privateGet(this, _logAimApiUrl),
        sessionId: __privateGet(this, _sessionId2)
      }).then((response) => {
        this.onResultsLogged(response);
      });
    });
    super.onFinish = __privateGet(this, _logFinalResults);
    const config = Object.assign({}, defaultConfig, userConfig, internalConfig);
    __privateSet(this, _logAimApiUrl, config.logAimApiUrl);
    __privateSet(this, _sessionId2, config.sessionId);
  }
  set onFinish(onFinish) {
    super.onFinish = (results) => {
      onFinish(results);
      __privateGet(this, _logFinalResults).call(this, results);
    };
  }
}, _logAimApiUrl = new WeakMap(), _sessionId2 = new WeakMap(), _logFinalResults = new WeakMap(), _a13);
export {
  SpeedTestEngine as default
};
