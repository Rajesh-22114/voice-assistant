"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// LEO AI Assistant - Complete React 18 Frontend Application

var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef;

// Main App Component
function App() {
  var _useState = useState('dashboard'),
    _useState2 = _slicedToArray(_useState, 2),
    activeTab = _useState2[0],
    setActiveTab = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    assistantOnline = _useState4[0],
    setAssistantOnline = _useState4[1];
  var _useState5 = useState(true),
    _useState6 = _slicedToArray(_useState5, 2),
    micActive = _useState6[0],
    setMicActive = _useState6[1];
  var _useState7 = useState('idle'),
    _useState8 = _slicedToArray(_useState7, 2),
    assistantState = _useState8[0],
    setAssistantState = _useState8[1]; // 'idle' | 'listening' | 'processing' | 'speaking' | 'offline'

  // System Vitals
  var _useState9 = useState(new Date().toLocaleTimeString()),
    _useState10 = _slicedToArray(_useState9, 2),
    currentTime = _useState10[0],
    setCurrentTime = _useState10[1];
  var _useState11 = useState(new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })),
    _useState12 = _slicedToArray(_useState11, 2),
    currentDate = _useState12[0],
    setCurrentDate = _useState12[1];
  var _useState13 = useState({
      percent: 88,
      power_plugged: true,
      status: '88% (Plugged in)'
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    batteryInfo = _useState14[0],
    setBatteryInfo = _useState14[1];
  var _useState15 = useState({
      bytes_sent: 14200000,
      bytes_recv: 48500000,
      speed_text: 'Sent 14.2 MB, Recv 48.5 MB'
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    networkInfo = _useState16[0],
    setNetworkInfo = _useState16[1];
  var _useState17 = useState(18),
    _useState18 = _slicedToArray(_useState17, 2),
    cpuUsage = _useState18[0],
    setCpuUsage = _useState18[1];
  var _useState19 = useState(42),
    _useState20 = _slicedToArray(_useState19, 2),
    memoryUsage = _useState20[0],
    setMemoryUsage = _useState20[1];

  // Live Speech Recognition Feedback
  var _useState21 = useState(''),
    _useState22 = _slicedToArray(_useState21, 2),
    interimTranscript = _useState22[0],
    setInterimTranscript = _useState22[1];
  var _useState23 = useState(''),
    _useState24 = _slicedToArray(_useState23, 2),
    voiceErrorMsg = _useState24[0],
    setVoiceErrorMsg = _useState24[1];

  // Data collections
  var _useState25 = useState([]),
    _useState26 = _slicedToArray(_useState25, 2),
    contacts = _useState26[0],
    setContacts = _useState26[1];
  var _useState27 = useState([]),
    _useState28 = _slicedToArray(_useState27, 2),
    history = _useState28[0],
    setHistory = _useState28[1];
  var _useState29 = useState([{
      sender: 'assistant',
      text: 'Hello! I am LEO, your voice controlled productivity assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }]),
    _useState30 = _slicedToArray(_useState29, 2),
    transcript = _useState30[0],
    setTranscript = _useState30[1];
  var _useState31 = useState(''),
    _useState32 = _slicedToArray(_useState31, 2),
    textInput = _useState32[0],
    setTextInput = _useState32[1];

  // Settings
  var _useState33 = useState({
      assistantName: 'Leo',
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      voiceIndex: 0,
      theme: 'dark',
      micSource: 'Default Microphone',
      apiUrl: 'http://127.0.0.1:8000'
    }),
    _useState34 = _slicedToArray(_useState33, 2),
    settings = _useState34[0],
    setSettings = _useState34[1];
  var _useState35 = useState([]),
    _useState36 = _slicedToArray(_useState35, 2),
    availableVoices = _useState36[0],
    setAvailableVoices = _useState36[1];
  var _useState37 = useState(false),
    _useState38 = _slicedToArray(_useState37, 2),
    sidebarOpen = _useState38[0],
    setSidebarOpen = _useState38[1];

  // Modals state
  var _useState39 = useState(false),
    _useState40 = _slicedToArray(_useState39, 2),
    isImportModalOpen = _useState40[0],
    setIsImportModalOpen = _useState40[1];
  var _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    isContactModalOpen = _useState42[0],
    setIsContactModalOpen = _useState42[1];
  var _useState43 = useState(null),
    _useState44 = _slicedToArray(_useState43, 2),
    editingContact = _useState44[0],
    setEditingContact = _useState44[1];
  var _useState45 = useState({
      name: '',
      phone: '',
      whatsapp_enabled: true,
      notes: ''
    }),
    _useState46 = _slicedToArray(_useState45, 2),
    contactForm = _useState46[0],
    setContactForm = _useState46[1];

  // Web Speech Recognition reference
  var recognitionRef = useRef(null);

  // Initialize Voices & Real-time Clock & Battery/Network sync
  useEffect(function () {
    // Clock tick
    var clockInterval = setInterval(function () {
      var now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }));
    }, 1000);

    // Fetch SpeechSynthesis Voices
    var updateVoices = function updateVoices() {
      if ('speechSynthesis' in window) {
        var voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };
    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Fetch initial contacts & history from server
    fetchContacts();
    fetchHistory();
    fetchSystemVitals();

    // Vitals polling interval
    var vitalsInterval = setInterval(fetchSystemVitals, 4000);
    return function () {
      clearInterval(clockInterval);
      clearInterval(vitalsInterval);
    };
  }, []);

  // Fetch server vitals
  var fetchSystemVitals = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var res, data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch("".concat(settings.apiUrl, "/api/status"));
          case 3:
            res = _context.sent;
            if (!res.ok) {
              _context.next = 12;
              break;
            }
            _context.next = 7;
            return res.json();
          case 7:
            data = _context.sent;
            setBatteryInfo(data.battery);
            setNetworkInfo(data.network);
            setCpuUsage(data.cpu_percent || 24);
            setMemoryUsage(data.memory_percent || 45);
          case 12:
            _context.next = 17;
            break;
          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            // Fallback local battery api if server unavail
            if ('getBattery' in navigator) {
              navigator.getBattery().then(function (b) {
                setBatteryInfo({
                  percent: Math.round(b.level * 100),
                  power_plugged: b.charging,
                  status: "".concat(Math.round(b.level * 100), "% (").concat(b.charging ? 'Plugged in' : 'Battery', ")")
                });
              });
            }
          case 17:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 14]]);
    }));
    return function fetchSystemVitals() {
      return _ref.apply(this, arguments);
    };
  }();
  var fetchContacts = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var res, data, defaultContacts;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fetch("".concat(settings.apiUrl, "/api/contacts"));
          case 3:
            res = _context2.sent;
            if (!res.ok) {
              _context2.next = 9;
              break;
            }
            _context2.next = 7;
            return res.json();
          case 7:
            data = _context2.sent;
            setContacts(data);
          case 9:
            _context2.next = 15;
            break;
          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            // Seed default contacts locally if server unreachable
            defaultContacts = [{
              id: 'cnt-101',
              name: 'Rajesh',
              phone: '+919876543210',
              whatsapp_enabled: true,
              last_message_sent: '2026-09-08 10:15 AM',
              notes: 'Work Lead'
            }, {
              id: 'cnt-102',
              name: 'Ravi',
              phone: '+919999999999',
              whatsapp_enabled: true,
              last_message_sent: '2026-09-07 04:30 PM',
              notes: 'College Friend'
            }, {
              id: 'cnt-103',
              name: 'Priya',
              phone: '+919812345678',
              whatsapp_enabled: true,
              last_message_sent: '2026-09-06 09:12 AM',
              notes: 'Designer'
            }, {
              id: 'cnt-104',
              name: 'Vikram',
              phone: '+919765432109',
              whatsapp_enabled: true,
              last_message_sent: 'Never',
              notes: 'DevOps'
            }, {
              id: 'cnt-105',
              name: 'Ananya',
              phone: '+919888877777',
              whatsapp_enabled: true,
              last_message_sent: '2026-09-05 06:45 PM',
              notes: 'PM'
            }];
            setContacts(defaultContacts);
          case 15:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 11]]);
    }));
    return function fetchContacts() {
      return _ref2.apply(this, arguments);
    };
  }();
  var fetchHistory = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var res, data;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return fetch("".concat(settings.apiUrl, "/api/history"));
          case 3:
            res = _context3.sent;
            if (!res.ok) {
              _context3.next = 9;
              break;
            }
            _context3.next = 7;
            return res.json();
          case 7:
            data = _context3.sent;
            setHistory(data);
          case 9:
            _context3.next = 14;
            break;
          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            setHistory([{
              id: 'act-001',
              timestamp: '2026-09-08 10:30:15 AM',
              command: 'Leo what is the time',
              response: 'The current time is 10:30 AM',
              status: 'Success',
              type: 'Time'
            }, {
              id: 'act-002',
              timestamp: '2026-09-08 10:31:02 AM',
              command: 'Leo who is Elon Musk',
              response: 'Elon Musk is CEO of Tesla and SpaceX.',
              status: 'Success',
              type: 'Wikipedia'
            }]);
          case 14:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 11]]);
    }));
    return function fetchHistory() {
      return _ref3.apply(this, arguments);
    };
  }();

  // Speak Text Function
  var speakText = function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // cancel any active speech

    setAssistantState('speaking');
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceSpeed;
    utterance.pitch = settings.voicePitch;
    if (availableVoices.length > 0) {
      utterance.voice = availableVoices[settings.voiceIndex] || availableVoices[0];
    }
    utterance.onend = function () {
      setAssistantState('idle');
    };
    utterance.onerror = function () {
      setAssistantState('idle');
    };
    window.speechSynthesis.speak(utterance);
  };

  // Execute Voice / Text Command
  var handleExecuteCommand = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(cmdText) {
      var userMsg, responseText, res, data, clean, song, q, words, nameQuery, target, msg, topic, leoMsg;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!(!cmdText || !cmdText.trim())) {
              _context4.next = 2;
              break;
            }
            return _context4.abrupt("return");
          case 2:
            // Add user message to transcript
            userMsg = {
              sender: 'user',
              text: cmdText,
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            };
            setTranscript(function (prev) {
              return [].concat(_toConsumableArray(prev), [userMsg]);
            });
            setTextInput('');
            setAssistantState('processing');
            setInterimTranscript('');
            responseText = "";
            _context4.prev = 8;
            _context4.next = 11;
            return fetch("".concat(settings.apiUrl, "/api/command"), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                command: cmdText
              })
            });
          case 11:
            res = _context4.sent;
            if (!res.ok) {
              _context4.next = 19;
              break;
            }
            _context4.next = 15;
            return res.json();
          case 15:
            data = _context4.sent;
            responseText = data.response;
            _context4.next = 20;
            break;
          case 19:
            throw new Error('API server returned error');
          case 20:
            _context4.next = 26;
            break;
          case 22:
            _context4.prev = 22;
            _context4.t0 = _context4["catch"](8);
            // Local client-side fuzzy intent parser fallback
            clean = cmdText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
            if (clean.includes('time') || clean.includes('clock') || clean.includes('hour')) {
              responseText = "The current time is ".concat(new Date().toLocaleTimeString());
            } else if (clean.includes('play') || clean.includes('youtube') || clean.includes('song')) {
              song = clean.replace('play', '').replace('youtube', '').replace('song', '').replace('leo', '').trim();
              window.open("https://www.youtube.com/results?search_query=".concat(encodeURIComponent(song || 'popular music')), '_blank');
              responseText = "Playing ".concat(song || 'music', " on YouTube");
            } else if (clean.includes('search') || clean.includes('google') || clean.includes('find')) {
              q = clean.replace('search', '').replace('google', '').replace('find', '').replace('leo', '').trim();
              window.open("https://www.google.com/search?q=".concat(encodeURIComponent(q)), '_blank');
              responseText = "Searching Google for ".concat(q);
            } else if (clean.includes('message') || clean.includes('whatsapp') || clean.includes('text')) {
              words = clean.replace('message', '').replace('whatsapp', '').replace('text', '').replace('leo', '').replace('send', '').replace('to', '').trim().split(' ');
              nameQuery = words[0] || '';
              target = contacts.find(function (c) {
                return c.name.toLowerCase().includes(nameQuery);
              });
              if (target) {
                msg = words.slice(1).join(' ') || 'Hi, sent via Leo Voice Assistant';
                window.open("https://api.whatsapp.com/send?phone=".concat(encodeURIComponent(target.phone), "&text=").concat(encodeURIComponent(msg)), '_blank');
                responseText = "Sending WhatsApp message to ".concat(target.name, " (").concat(target.phone, "): \"").concat(msg, "\"");
              } else {
                responseText = "Could not find contact '".concat(nameQuery, "' in your contacts list.");
              }
            } else if (clean.includes('battery') || clean.includes('charge') || clean.includes('power')) {
              responseText = "Battery level is ".concat(batteryInfo.percent, "%");
            } else if (clean.includes('speed') || clean.includes('network') || clean.includes('wifi') || clean.includes('internet')) {
              responseText = "Current network speed stats: ".concat(networkInfo.speed_text);
            } else if (clean.includes('who is') || clean.includes('what is') || clean.includes('tell me about')) {
              topic = clean.replace('who is', '').replace('what is', '').replace('tell me about', '').replace('leo', '').trim();
              window.open("https://en.wikipedia.org/wiki/".concat(encodeURIComponent(topic)), '_blank');
              responseText = "Retrieving Wikipedia summary for ".concat(topic);
            } else if (clean.includes('stop') || clean.includes('exit') || clean.includes('quit') || clean.includes('bye')) {
              responseText = "Leo assistant stopped. Have a productive day!";
            } else {
              responseText = "I heard: \"".concat(cmdText, "\". I can help you search Google, play YouTube videos, check system vitals, or message contacts.");
            }
          case 26:
            // Add assistant response to transcript
            leoMsg = {
              sender: 'assistant',
              text: responseText,
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            };
            setTranscript(function (prev) {
              return [].concat(_toConsumableArray(prev), [leoMsg]);
            });

            // Refresh history & contacts
            fetchHistory();
            fetchContacts();

            // Trigger Speech Synthesis
            speakText(responseText);
          case 31:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[8, 22]]);
    }));
    return function handleExecuteCommand(_x) {
      return _ref4.apply(this, arguments);
    };
  }();

  // Mic Listen Toggle
  var startListening = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var SpeechRecognition, recognition;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            setVoiceErrorMsg('');

            // INTERRUPT RESPONSE IMMEDIATELY IF SPEAKING
            if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
              setAssistantState('idle');
            }
            SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
              _context5.next = 6;
              break;
            }
            alert("Web Speech Recognition API is not supported in this browser. You can type commands in the text prompt!");
            return _context5.abrupt("return");
          case 6:
            if (!(assistantState === 'listening')) {
              _context5.next = 11;
              break;
            }
            if (recognitionRef.current) {
              try {
                recognitionRef.current.stop();
              } catch (e) {}
            }
            setAssistantState('idle');
            setInterimTranscript('');
            return _context5.abrupt("return");
          case 11:
            _context5.prev = 11;
            if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
              _context5.next = 15;
              break;
            }
            _context5.next = 15;
            return navigator.mediaDevices.getUserMedia({
              audio: true
            });
          case 15:
            _context5.next = 22;
            break;
          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](11);
            console.warn('Microphone permission request failed:', _context5.t0);
            setVoiceErrorMsg("Microphone permission denied. Please click the camera/mic icon in your address bar to allow access!");
            return _context5.abrupt("return");
          case 22:
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true; // Enables live streaming speech feedback!
            recognition.lang = navigator.language || 'en-US';
            recognition.maxAlternatives = 3;
            recognition.onstart = function () {
              setAssistantState('listening');
              setInterimTranscript('Listening for your voice...');
            };
            recognition.onresult = function (event) {
              var interim = '';
              var finalSpeech = '';
              for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                  finalSpeech += event.results[i][0].transcript;
                } else {
                  interim += event.results[i][0].transcript;
                }
              }
              if (interim) {
                setInterimTranscript("Hearing: \"".concat(interim, "\"..."));
              }
              if (finalSpeech) {
                setInterimTranscript("Recognized: \"".concat(finalSpeech, "\""));
                setAssistantState('processing');
                handleExecuteCommand(finalSpeech);
              }
            };
            recognition.onerror = function (event) {
              console.error('Speech recognition error:', event.error);
              if (event.error === 'no-speech') {
                setVoiceErrorMsg("No speech heard. Speak clearly into your mic or click the Orb again!");
              } else if (event.error === 'not-allowed') {
                setVoiceErrorMsg("Microphone access blocked. Click the microphone icon in browser URL bar to allow access.");
              } else {
                setVoiceErrorMsg("Voice error: ".concat(event.error, ". Click Orb to try again."));
              }
              setAssistantState('idle');
            };
            recognition.onend = function () {
              if (assistantState === 'listening') {
                setAssistantState('idle');
              }
            };
            recognitionRef.current = recognition;
            try {
              recognition.start();
            } catch (e) {
              console.error('Failed to start recognition:', e);
            }
          case 33:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[11, 17]]);
    }));
    return function startListening() {
      return _ref5.apply(this, arguments);
    };
  }();

  // Contacts handlers
  var handleSaveContact = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(e) {
      var payload, res, updated, tempContact, _res, created;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            e.preventDefault();
            if (!(!contactForm.name || !contactForm.phone)) {
              _context6.next = 3;
              break;
            }
            return _context6.abrupt("return");
          case 3:
            payload = {
              name: contactForm.name.trim(),
              phone: contactForm.phone.trim(),
              whatsapp_enabled: Boolean(contactForm.whatsapp_enabled),
              notes: contactForm.notes ? contactForm.notes.trim() : ""
            };
            if (!editingContact) {
              _context6.next = 22;
              break;
            }
            // Optimistically update local React contacts state immediately
            setContacts(function (prev) {
              return prev.map(function (c) {
                return c.id === editingContact.id ? _objectSpread(_objectSpread({}, c), payload) : c;
              });
            });
            _context6.prev = 6;
            _context6.next = 9;
            return fetch("".concat(settings.apiUrl, "/api/contacts/").concat(editingContact.id), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });
          case 9:
            res = _context6.sent;
            if (!res.ok) {
              _context6.next = 15;
              break;
            }
            _context6.next = 13;
            return res.json();
          case 13:
            updated = _context6.sent;
            if (updated && updated.id) {
              setContacts(function (prev) {
                return prev.map(function (c) {
                  return c.id === editingContact.id ? updated : c;
                });
              });
            }
          case 15:
            _context6.next = 20;
            break;
          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6["catch"](6);
            console.warn('Backend contact update warning:', _context6.t0);
          case 20:
            _context6.next = 38;
            break;
          case 22:
            tempContact = _objectSpread(_objectSpread({
              id: "cnt-".concat(Date.now())
            }, payload), {}, {
              last_message_sent: 'Never'
            });
            setContacts(function (prev) {
              return [].concat(_toConsumableArray(prev), [tempContact]);
            });
            _context6.prev = 24;
            _context6.next = 27;
            return fetch("".concat(settings.apiUrl, "/api/contacts"), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });
          case 27:
            _res = _context6.sent;
            if (!_res.ok) {
              _context6.next = 33;
              break;
            }
            _context6.next = 31;
            return _res.json();
          case 31:
            created = _context6.sent;
            if (created && created.id) {
              setContacts(function (prev) {
                return prev.map(function (c) {
                  return c.id === tempContact.id ? created : c;
                });
              });
            }
          case 33:
            _context6.next = 38;
            break;
          case 35:
            _context6.prev = 35;
            _context6.t1 = _context6["catch"](24);
            console.warn('Backend contact save warning:', _context6.t1);
          case 38:
            setIsContactModalOpen(false);
            setEditingContact(null);
            setContactForm({
              name: '',
              phone: '',
              whatsapp_enabled: true,
              notes: ''
            });
          case 41:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[6, 17], [24, 35]]);
    }));
    return function handleSaveContact(_x2) {
      return _ref6.apply(this, arguments);
    };
  }();
  var handleDeleteContact = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(id) {
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (confirm("Are you sure you want to delete this contact?")) {
              _context7.next = 2;
              break;
            }
            return _context7.abrupt("return");
          case 2:
            _context7.prev = 2;
            _context7.next = 5;
            return fetch("".concat(settings.apiUrl, "/api/contacts/").concat(id), {
              method: 'DELETE'
            });
          case 5:
            fetchContacts();
            _context7.next = 11;
            break;
          case 8:
            _context7.prev = 8;
            _context7.t0 = _context7["catch"](2);
            setContacts(contacts.filter(function (c) {
              return c.id !== id;
            }));
          case 11:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[2, 8]]);
    }));
    return function handleDeleteContact(_x3) {
      return _ref7.apply(this, arguments);
    };
  }();
  var handleFileUpload = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(e) {
      var file, formData, res, data;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            file = e.target.files[0];
            if (file) {
              _context8.next = 3;
              break;
            }
            return _context8.abrupt("return");
          case 3:
            formData = new FormData();
            formData.append('file', file);
            _context8.prev = 5;
            _context8.next = 8;
            return fetch("".concat(settings.apiUrl, "/api/contacts/import"), {
              method: 'POST',
              body: formData
            });
          case 8:
            res = _context8.sent;
            if (!res.ok) {
              _context8.next = 17;
              break;
            }
            _context8.next = 12;
            return res.json();
          case 12:
            data = _context8.sent;
            alert("Successfully imported ".concat(data.imported_count, " contacts!"));
            fetchContacts();
            _context8.next = 18;
            break;
          case 17:
            alert("Failed to import file. Make sure columns are Name and Phone.");
          case 18:
            _context8.next = 23;
            break;
          case 20:
            _context8.prev = 20;
            _context8.t0 = _context8["catch"](5);
            alert("Server import error. Operating in offline mode.");
          case 23:
            setIsImportModalOpen(false);
          case 24:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[5, 20]]);
    }));
    return function handleFileUpload(_x4) {
      return _ref8.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    className: "flex h-screen overflow-hidden"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-slate-800 transition-transform duration-300 transform ".concat(sidebarOpen ? 'translate-x-0' : '-translate-x-full', " md:relative md:translate-x-0 flex flex-col justify-between")
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-6 flex items-center justify-between border-b border-slate-800/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "bot",
    className: "w-6 h-6 text-white"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "font-display font-bold text-lg text-white tracking-wide"
  }, "LEO ", /*#__PURE__*/React.createElement("span", {
    className: "text-cyan-400"
  }, "AI")), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400 font-medium tracking-wider uppercase"
  }, "Voice Assistant"))), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setSidebarOpen(false);
    },
    className: "md:hidden text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "p-4 space-y-1"
  }, [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'layout-dashboard'
  }, {
    id: 'assistant',
    label: 'Voice Assistant',
    icon: 'mic'
  }, {
    id: 'commands',
    label: 'Commands',
    icon: 'terminal'
  }, {
    id: 'contacts',
    label: 'Contacts',
    icon: 'users'
  }, {
    id: 'history',
    label: 'Activity History',
    icon: 'history'
  }, {
    id: 'settings',
    label: 'Settings',
    icon: 'settings'
  }].map(function (item) {
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: function onClick() {
        setActiveTab(item.id);
        setSidebarOpen(false);
      },
      className: "w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ".concat(activeTab === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": item.icon,
      className: "w-5 h-5 ".concat(activeTab === item.id ? 'text-cyan-400' : 'text-slate-400')
    }), /*#__PURE__*/React.createElement("span", null, item.label));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-slate-800/60 bg-slate-950/40"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full ".concat(assistantOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-rose-500')
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-white"
  }, assistantOnline ? 'Assistant Online' : 'Offline Mode'), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400"
  }, "v2.0.0 Enterprise"))), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setAssistantOnline(!assistantOnline);
    },
    className: "text-xs text-cyan-400 hover:underline font-medium"
  }, "Toggle")))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 flex flex-col h-full overflow-y-auto"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-40 glass-panel border-b border-slate-800/60 px-6 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setSidebarOpen(true);
    },
    className: "md:hidden text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "menu",
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "font-display font-bold text-xl text-white capitalize"
  }, activeTab.replace('-', ' '))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: startListening,
    className: "flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg ".concat(assistantState === 'listening' ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30' : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-cyan-500/20')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": assistantState === 'listening' ? 'square' : 'mic',
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, assistantState === 'listening' ? 'Stop Listening' : 'Speak to Leo')), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "clock",
    className: "w-3.5 h-3.5 text-cyan-400"
  }), /*#__PURE__*/React.createElement("span", null, currentTime)))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full"
  }, activeTab === 'dashboard' && /*#__PURE__*/React.createElement(DashboardHome, {
    vitals: {
      batteryInfo: batteryInfo,
      networkInfo: networkInfo,
      currentTime: currentTime,
      currentDate: currentDate,
      cpuUsage: cpuUsage,
      memoryUsage: memoryUsage,
      assistantOnline: assistantOnline,
      micActive: micActive
    },
    startListening: startListening,
    assistantState: assistantState,
    handleExecuteCommand: handleExecuteCommand
  }), activeTab === 'assistant' && /*#__PURE__*/React.createElement(VoiceAssistantPanel, {
    assistantState: assistantState,
    startListening: startListening,
    transcript: transcript,
    textInput: textInput,
    setTextInput: setTextInput,
    handleExecuteCommand: handleExecuteCommand,
    interimTranscript: interimTranscript,
    voiceErrorMsg: voiceErrorMsg
  }), activeTab === 'commands' && /*#__PURE__*/React.createElement(CommandCenter, {
    handleExecuteCommand: handleExecuteCommand
  }), activeTab === 'contacts' && /*#__PURE__*/React.createElement(ContactsManager, {
    contacts: contacts,
    onAdd: function onAdd() {
      setEditingContact(null);
      setContactForm({
        name: '',
        phone: '',
        whatsapp_enabled: true,
        notes: ''
      });
      setIsContactModalOpen(true);
    },
    onEdit: function onEdit(c) {
      setEditingContact(c);
      setContactForm(c);
      setIsContactModalOpen(true);
    },
    onDelete: handleDeleteContact,
    onImport: function onImport() {
      return setIsImportModalOpen(true);
    },
    onSendMessage: function onSendMessage(contact) {
      return handleExecuteCommand("Leo message ".concat(contact.name));
    }
  }), activeTab === 'history' && /*#__PURE__*/React.createElement(ActivityHistory, {
    history: history,
    onClear: function onClear() {
      return setHistory([]);
    }
  }), activeTab === 'settings' && /*#__PURE__*/React.createElement(SettingsPage, {
    settings: settings,
    setSettings: setSettings,
    availableVoices: availableVoices
  }))), isContactModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) {
        setIsContactModalOpen(false);
        setEditingContact(null);
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel p-6 rounded-2xl border border-slate-700 w-full max-w-md space-y-4 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center pb-2 border-b border-slate-800"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-white"
  }, editingContact ? 'Edit Contact' : 'Add New Contact'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      setIsContactModalOpen(false);
      setEditingContact(null);
    },
    className: "p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors",
    title: "Close"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSaveContact,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-semibold text-slate-400 block mb-1"
  }, "Full Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: contactForm.name,
    onChange: function onChange(e) {
      return setContactForm(_objectSpread(_objectSpread({}, contactForm), {}, {
        name: e.target.value
      }));
    },
    className: "w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-sm",
    placeholder: "e.g. Rajesh Sharma"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-semibold text-slate-400 block mb-1"
  }, "Phone Number (with Country Code)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: contactForm.phone,
    onChange: function onChange(e) {
      return setContactForm(_objectSpread(_objectSpread({}, contactForm), {}, {
        phone: e.target.value
      }));
    },
    className: "w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-sm",
    placeholder: "+919876543210"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "wa_chk",
    checked: contactForm.whatsapp_enabled,
    onChange: function onChange(e) {
      return setContactForm(_objectSpread(_objectSpread({}, contactForm), {}, {
        whatsapp_enabled: e.target.checked
      }));
    },
    className: "rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "wa_chk",
    className: "text-xs text-slate-300 font-medium"
  }, "WhatsApp Enabled")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-semibold text-slate-400 block mb-1"
  }, "Notes / Relationship"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: contactForm.notes || '',
    onChange: function onChange(e) {
      return setContactForm(_objectSpread(_objectSpread({}, contactForm), {}, {
        notes: e.target.value
      }));
    },
    className: "w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-sm",
    placeholder: "e.g. Work colleague"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end space-x-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      setIsContactModalOpen(false);
      setEditingContact(null);
    },
    className: "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
  }, "Save Contact"))))), isImportModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) setIsImportModalOpen(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel p-6 rounded-2xl border border-slate-700 w-full max-w-md space-y-4 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center pb-2 border-b border-slate-800"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-white"
  }, "Import Contacts File"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setIsImportModalOpen(false);
    },
    className: "p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors",
    title: "Close"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Supported formats: CSV, Excel (.xlsx), or JSON files containing Name and Phone columns."), /*#__PURE__*/React.createElement("div", {
    className: "border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-900/40"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".csv,.xlsx,.json",
    onChange: handleFileUpload,
    className: "hidden",
    id: "file_import_input"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "file_import_input",
    className: "cursor-pointer block space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "upload-cloud",
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-200"
  }, "Click to upload or drag & drop"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500"
  }, "CSV, XLSX, or JSON"))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex justify-between items-center border-t border-slate-800 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/sample_contacts.csv",
    download: true,
    className: "text-cyan-400 hover:underline flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "download",
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Sample CSV")), /*#__PURE__*/React.createElement("a", {
    href: "/sample_contacts.json",
    download: true,
    className: "text-cyan-400 hover:underline flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "download",
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Sample JSON"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setIsImportModalOpen(false);
    },
    className: "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
  }, "Close")))));
}

// 1. DASHBOARD HOME VIEW
function DashboardHome(_ref9) {
  var vitals = _ref9.vitals,
    startListening = _ref9.startListening,
    assistantState = _ref9.assistantState,
    handleExecuteCommand = _ref9.handleExecuteCommand;
  useEffect(function () {
    if (window.lucide) window.lucide.createIcons();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative overflow-hidden rounded-3xl glass-panel p-8 border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-cyan-950/30"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-cyan-400 animate-ping"
  }), /*#__PURE__*/React.createElement("span", null, "Next-Gen Voice Intelligence")), /*#__PURE__*/React.createElement("h1", {
    className: "font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight"
  }, "LEO ", /*#__PURE__*/React.createElement("span", {
    className: "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
  }, "AI Assistant")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-sm max-w-xl"
  }, "\"Your Personal Voice Controlled Productivity Assistant\"")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: startListening,
    className: "px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center space-x-2 transition-all transform hover:scale-105"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "mic",
    className: "w-5 h-5"
  }), /*#__PURE__*/React.createElement("span", null, "Activate Voice"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card p-5 rounded-2xl flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-400 uppercase tracking-wider"
  }, "Assistant Status"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-3 rounded-full ".concat(vitals.assistantOnline ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-rose-500')
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-bold text-white"
  }, vitals.assistantOnline ? 'Online' : 'Offline')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500"
  }, "Latency: 12ms \u2022 Ready")), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "cpu",
    className: "w-6 h-6"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card p-5 rounded-2xl flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-400 uppercase tracking-wider"
  }, "Microphone Status"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-3 rounded-full ".concat(assistantState === 'listening' ? 'bg-cyan-400 animate-pulse' : 'bg-blue-400')
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-bold text-white"
  }, assistantState === 'listening' ? 'Listening...' : 'Active')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-1 mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce"
  }), /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-4 bg-cyan-400 rounded-full animate-bounce delay-75"
  }), /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 ml-1"
  }, "Sensitivity: 95%"))), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "mic",
    className: "w-6 h-6"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card p-5 rounded-2xl flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-400 uppercase tracking-wider"
  }, "System Clock"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-bold text-white font-mono tracking-tight"
  }, vitals.currentTime), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500"
  }, vitals.currentDate)), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "clock",
    className: "w-6 h-6"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card p-5 rounded-2xl flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1 w-full mr-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-400 uppercase tracking-wider"
  }, "Battery Level"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-cyan-400"
  }, vitals.batteryInfo.percent, "%")), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-bold text-white"
  }, vitals.batteryInfo.power_plugged ? 'Plugged In' : 'On Battery'), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500",
    style: {
      width: "".concat(vitals.batteryInfo.percent, "%")
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "battery-charging",
    className: "w-6 h-6"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card p-5 rounded-2xl flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-400 uppercase tracking-wider"
  }, "Network Throughput"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-bold text-white"
  }, roundMB(vitals.networkInfo.bytes_recv), " MB Recv"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500"
  }, roundMB(vitals.networkInfo.bytes_sent), " MB Sent \u2022 High Speed")), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wifi",
    className: "w-6 h-6"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card p-5 rounded-2xl flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-400 uppercase tracking-wider"
  }, "Voice Recognition"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-bold text-white"
  }, "Google Speech API"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500"
  }, "Neural Synthesis Active")), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "sparkles",
    className: "w-6 h-6"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel p-6 rounded-3xl border border-slate-800"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "zap",
    className: "w-4 h-4 text-cyan-400"
  }), /*#__PURE__*/React.createElement("span", null, "Popular Voice Commands")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
  }, [{
    label: 'What is the time',
    cmd: 'Leo what is the time',
    icon: 'clock'
  }, {
    label: 'Play Shape of You',
    cmd: 'Leo play shape of you',
    icon: 'play'
  }, {
    label: 'Who is Elon Musk',
    cmd: 'Leo who is Elon Musk',
    icon: 'search'
  }, {
    label: 'Check Battery',
    cmd: 'Leo battery status',
    icon: 'battery'
  }].map(function (item, idx) {
    return /*#__PURE__*/React.createElement("button", {
      key: idx,
      onClick: function onClick() {
        return handleExecuteCommand(item.cmd);
      },
      className: "p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:bg-slate-800/50 group"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center space-x-2 mb-1"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": item.icon,
      className: "w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold text-white"
    }, item.label)), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-slate-500 font-mono"
    }, "\"", item.cmd, "\""));
  }))));
}

// 2. VOICE ASSISTANT PANEL (ANIMATED AI ORB)
function VoiceAssistantPanel(_ref10) {
  var assistantState = _ref10.assistantState,
    startListening = _ref10.startListening,
    transcript = _ref10.transcript,
    textInput = _ref10.textInput,
    setTextInput = _ref10.setTextInput,
    handleExecuteCommand = _ref10.handleExecuteCommand,
    interimTranscript = _ref10.interimTranscript,
    voiceErrorMsg = _ref10.voiceErrorMsg;
  useEffect(function () {
    if (window.lucide) window.lucide.createIcons();
  }, [transcript, interimTranscript]);
  var stateColors = {
    idle: 'from-blue-600 to-cyan-500 orb-idle',
    listening: 'from-cyan-400 to-blue-500 orb-listening',
    processing: 'from-purple-500 to-pink-500 orb-processing',
    speaking: 'from-emerald-400 to-cyan-500 orb-speaking'
  };
  var stateLabels = {
    idle: 'Idle - Ready for input',
    listening: 'Listening to your voice...',
    processing: 'Processing speech...',
    speaking: 'Speaking response...'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel p-8 rounded-3xl border border-slate-800 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-semibold text-cyan-400 shadow-inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full ".concat(assistantState === 'listening' ? 'bg-cyan-400 animate-ping' : assistantState === 'speaking' ? 'bg-emerald-400 animate-bounce' : 'bg-blue-400')
  }), /*#__PURE__*/React.createElement("span", null, stateLabels[assistantState] || 'Idle')), interimTranscript && /*#__PURE__*/React.createElement("div", {
    className: "mb-3 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium font-mono animate-pulse max-w-lg"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "mic",
    className: "w-3.5 h-3.5 inline mr-2 text-cyan-400"
  }), /*#__PURE__*/React.createElement("span", null, interimTranscript)), voiceErrorMsg && /*#__PURE__*/React.createElement("div", {
    className: "mb-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium max-w-lg"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "alert-circle",
    className: "w-3.5 h-3.5 inline mr-2 text-amber-400"
  }), /*#__PURE__*/React.createElement("span", null, voiceErrorMsg)), /*#__PURE__*/React.createElement("div", {
    onClick: startListening,
    className: "w-44 h-44 rounded-full bg-gradient-to-tr ".concat(stateColors[assistantState], " cursor-pointer shadow-2xl transition-all duration-500 flex items-center justify-center relative my-4 group")
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-36 h-36 rounded-full bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-2 border border-white/20"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": assistantState === 'listening' ? 'mic' : assistantState === 'speaking' ? 'volume-2' : 'bot',
    className: "w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-300 font-bold uppercase tracking-wider"
  }, assistantState === 'listening' ? 'Tap to Stop' : 'Tap to Speak'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center space-x-1.5 h-8 my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wave-bar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wave-bar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wave-bar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wave-bar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wave-bar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wave-bar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wave-bar"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-sm font-medium"
  }, "\"You can speak naturally with Leo\""), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-xs mt-1"
  }, "Try saying: \"Leo what is the time\" or \"Leo play shape of you\"")), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel p-6 rounded-3xl border border-slate-800 space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold text-slate-400 uppercase tracking-wider"
  }, "Conversation Log"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 max-h-60 overflow-y-auto pr-2"
  }, transcript.map(function (msg, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "flex ".concat(msg.sender === 'user' ? 'justify-end' : 'justify-start')
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-md p-3.5 rounded-2xl text-xs space-y-1 ".concat(msg.sender === 'user' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 rounded-br-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none')
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center text-[10px] text-slate-400"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, msg.sender === 'user' ? 'You' : 'LEO AI'), /*#__PURE__*/React.createElement("span", null, msg.time)), /*#__PURE__*/React.createElement("p", {
      className: "leading-relaxed"
    }, msg.text)));
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handleExecuteCommand(textInput);
    },
    className: "flex space-x-2 pt-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: textInput,
    onChange: function onChange(e) {
      return setTextInput(e.target.value);
    },
    placeholder: "Type your command here (e.g. Leo message Rajesh)...",
    className: "flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("span", null, "Send"), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "send",
    className: "w-3.5 h-3.5"
  })))));
}

// 3. COMMAND CENTER VIEW
function CommandCenter(_ref11) {
  var handleExecuteCommand = _ref11.handleExecuteCommand;
  useEffect(function () {
    if (window.lucide) window.lucide.createIcons();
  }, []);
  var commandsList = [{
    title: 'Time Commands',
    voice: 'Leo what is the time',
    action: 'Returns current time.',
    icon: 'clock',
    category: 'System'
  }, {
    title: 'YouTube Commands',
    voice: 'Leo play shape of you',
    action: 'Play song on YouTube.',
    icon: 'play-circle',
    category: 'Media'
  }, {
    title: 'Google Search',
    voice: 'Leo search Python tutorials',
    action: 'Search query on Google.',
    icon: 'search',
    category: 'Web'
  }, {
    title: 'Wikipedia Search',
    voice: 'Leo who is Elon Musk',
    action: 'Returns Wikipedia summary.',
    icon: 'book-open',
    category: 'Knowledge'
  }, {
    title: 'WhatsApp Message',
    voice: 'Leo message Rajesh',
    action: 'Send WhatsApp message.',
    icon: 'message-square',
    category: 'Social'
  }, {
    title: 'Battery Status',
    voice: 'Leo battery status',
    action: 'Returns battery percentage.',
    icon: 'battery-charging',
    category: 'Hardware'
  }, {
    title: 'Network Speed',
    voice: 'Leo network speed',
    action: 'Returns current network usage.',
    icon: 'wifi',
    category: 'Network'
  }, {
    title: 'Assistant Information',
    voice: 'Leo what can you do',
    action: 'Lists all supported commands.',
    icon: 'info',
    category: 'System'
  }, {
    title: 'Stop Assistant',
    voice: 'Leo stop',
    action: 'Terminates assistant.',
    icon: 'power',
    category: 'System'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-white"
  }, "Command Center"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Supported natural voice commands and actions"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
  }, commandsList.map(function (cmd, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": cmd.icon,
      className: "w-5 h-5"
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700"
    }, cmd.category)), /*#__PURE__*/React.createElement("h3", {
      className: "font-bold text-white text-base"
    }, cmd.title), /*#__PURE__*/React.createElement("div", {
      className: "p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs text-cyan-300"
    }, "\"", cmd.voice, "\""), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-400"
    }, cmd.action)), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return handleExecuteCommand(cmd.voice);
      },
      className: "w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-semibold text-xs transition-all flex items-center justify-center space-x-2"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "play",
      className: "w-3.5 h-3.5"
    }), /*#__PURE__*/React.createElement("span", null, "Try Command")));
  })));
}

// 4. CONTACTS MANAGEMENT MODULE
function ContactsManager(_ref12) {
  var contacts = _ref12.contacts,
    onAdd = _ref12.onAdd,
    onEdit = _ref12.onEdit,
    onDelete = _ref12.onDelete,
    onImport = _ref12.onImport,
    onSendMessage = _ref12.onSendMessage;
  var _useState47 = useState(''),
    _useState48 = _slicedToArray(_useState47, 2),
    searchTerm = _useState48[0],
    setSearchTerm = _useState48[1];
  useEffect(function () {
    if (window.lucide) window.lucide.createIcons();
  }, [contacts]);
  var filteredContacts = contacts.filter(function (c) {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-white"
  }, "Contacts Directory"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 font-medium"
  }, "Manage contacts for automated WhatsApp voice messaging")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onImport,
    className: "px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-2 border border-slate-700 shadow-sm"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "file-up",
    className: "w-4 h-4 text-cyan-400"
  }), /*#__PURE__*/React.createElement("span", null, "Import File")), /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    className: "px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "user-plus",
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Add Contact")))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search",
    className: "w-4 h-4 text-slate-500 absolute left-4 top-3.5"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchTerm,
    onChange: function onChange(e) {
      return setSearchTerm(e.target.value);
    },
    placeholder: "Search contacts by name or phone...",
    className: "w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel rounded-3xl border border-slate-800 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b border-slate-800 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400"
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-4 pl-6"
  }, "Contact Name"), /*#__PURE__*/React.createElement("th", {
    className: "p-4"
  }, "Phone Number"), /*#__PURE__*/React.createElement("th", {
    className: "p-4"
  }, "WhatsApp Status"), /*#__PURE__*/React.createElement("th", {
    className: "p-4"
  }, "Last Message Sent"), /*#__PURE__*/React.createElement("th", {
    className: "p-4 pr-6 text-right"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-800/60 text-xs"
  }, filteredContacts.length > 0 ? filteredContacts.map(function (c) {
    return /*#__PURE__*/React.createElement("tr", {
      key: c.id,
      className: "hover:bg-slate-800/30 transition-colors"
    }, /*#__PURE__*/React.createElement("td", {
      className: "p-4 pl-6 font-bold text-white flex items-center space-x-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-extrabold text-xs"
    }, c.name.charAt(0)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, c.name), c.notes && /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-slate-500 font-normal"
    }, c.notes))), /*#__PURE__*/React.createElement("td", {
      className: "p-4 font-mono text-slate-300"
    }, c.phone), /*#__PURE__*/React.createElement("td", {
      className: "p-4"
    }, c.whatsapp_enabled ? /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "check-circle-2",
      className: "w-3 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Enabled")) : /*#__PURE__*/React.createElement("span", {
      className: "text-slate-500"
    }, "Disabled")), /*#__PURE__*/React.createElement("td", {
      className: "p-4 text-slate-400 text-[11px]"
    }, c.last_message_sent || 'Never'), /*#__PURE__*/React.createElement("td", {
      className: "p-4 pr-6 text-right space-x-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onSendMessage(c);
      },
      title: "Send Message",
      className: "p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "message-square",
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onEdit(c);
      },
      title: "Edit Contact",
      className: "p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "edit",
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onDelete(c.id);
      },
      title: "Delete Contact",
      className: "p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "trash-2",
      className: "w-4 h-4"
    }))));
  }) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "5",
    className: "p-8 text-center text-slate-500"
  }, "No contacts found in directory. Click \"Add Contact\" or \"Import File\".")))))));
}

// 5. ACTIVITY HISTORY VIEW
function ActivityHistory(_ref13) {
  var history = _ref13.history,
    onClear = _ref13.onClear;
  var _useState49 = useState('All'),
    _useState50 = _slicedToArray(_useState49, 2),
    filter = _useState50[0],
    setFilter = _useState50[1];
  useEffect(function () {
    if (window.lucide) window.lucide.createIcons();
  }, [history]);
  var filteredHistory = history.filter(function (h) {
    return filter === 'All' || h.type === filter;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-white"
  }, "Activity History"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Logs of voice commands and system responses")), /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    className: "px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash",
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Clear Logs"))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel rounded-3xl border border-slate-800 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b border-slate-800 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400"
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-4 pl-6"
  }, "Timestamp"), /*#__PURE__*/React.createElement("th", {
    className: "p-4"
  }, "Command"), /*#__PURE__*/React.createElement("th", {
    className: "p-4"
  }, "Response"), /*#__PURE__*/React.createElement("th", {
    className: "p-4"
  }, "Category"), /*#__PURE__*/React.createElement("th", {
    className: "p-4 pr-6"
  }, "Status"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-800/60 text-xs"
  }, filteredHistory.length > 0 ? filteredHistory.map(function (item, idx) {
    return /*#__PURE__*/React.createElement("tr", {
      key: idx,
      className: "hover:bg-slate-800/30 transition-colors"
    }, /*#__PURE__*/React.createElement("td", {
      className: "p-4 pl-6 text-slate-400 font-mono text-[11px] whitespace-nowrap"
    }, item.timestamp), /*#__PURE__*/React.createElement("td", {
      className: "p-4 font-semibold text-white font-mono"
    }, item.command), /*#__PURE__*/React.createElement("td", {
      className: "p-4 text-slate-300 max-w-md"
    }, item.response), /*#__PURE__*/React.createElement("td", {
      className: "p-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700"
    }, item.type || 'General')), /*#__PURE__*/React.createElement("td", {
      className: "p-4 pr-6"
    }, /*#__PURE__*/React.createElement("span", {
      className: "px-2.5 py-1 rounded-full text-[10px] font-bold ".concat(item.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400')
    }, item.status)));
  }) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "5",
    className: "p-8 text-center text-slate-500"
  }, "No activity logs recorded yet.")))))));
}

// 6. SETTINGS PAGE
function SettingsPage(_ref14) {
  var settings = _ref14.settings,
    setSettings = _ref14.setSettings,
    availableVoices = _ref14.availableVoices;
  useEffect(function () {
    if (window.lucide) window.lucide.createIcons();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 max-w-4xl"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-white"
  }, "Assistant Settings"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Configure assistant voice, speed, theme, and API server")), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel p-6 rounded-3xl border border-slate-800 space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2"
  }, "Assistant Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings.assistantName,
    onChange: function onChange(e) {
      return setSettings(_objectSpread(_objectSpread({}, settings), {}, {
        assistantName: e.target.value
      }));
    },
    className: "w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2"
  }, "Voice Model / Speech Synthesizer"), /*#__PURE__*/React.createElement("select", {
    value: settings.voiceIndex,
    onChange: function onChange(e) {
      return setSettings(_objectSpread(_objectSpread({}, settings), {}, {
        voiceIndex: parseInt(e.target.value)
      }));
    },
    className: "w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
  }, availableVoices.length > 0 ? availableVoices.map(function (v, idx) {
    return /*#__PURE__*/React.createElement("option", {
      key: idx,
      value: idx
    }, v.name, " (", v.lang, ")");
  }) : /*#__PURE__*/React.createElement("option", {
    value: 0
  }, "System Default Speech Engine"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center max-w-md mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-300 uppercase tracking-wider"
  }, "Voice Speed Rate"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-cyan-400"
  }, settings.voiceSpeed, "x")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0.5",
    max: "2.0",
    step: "0.1",
    value: settings.voiceSpeed,
    onChange: function onChange(e) {
      return setSettings(_objectSpread(_objectSpread({}, settings), {}, {
        voiceSpeed: parseFloat(e.target.value)
      }));
    },
    className: "w-full max-w-md accent-cyan-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2"
  }, "Python FastAPI Backend API Server URL"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings.apiUrl,
    onChange: function onChange(e) {
      return setSettings(_objectSpread(_objectSpread({}, settings), {}, {
        apiUrl: e.target.value
      }));
    },
    className: "w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-1"
  }, "Default local server: http://127.0.0.1:8000")), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-slate-800 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return alert("Settings saved successfully!");
    },
    className: "px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
  }, "Save Changes"))));
}

// Utility Helper
function roundMB(bytes) {
  if (!bytes) return 0;
  return (bytes / (1024 * 1024)).toFixed(1);
}

// Render Application
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));