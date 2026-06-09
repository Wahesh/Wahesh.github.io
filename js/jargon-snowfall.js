(function () {
  'use strict';

  /**
   * Edit stacks/projects in js/site-profile.js — snowfall pulls from SITE_PROFILE.
   */

  var GENERIC_JARGON = [
    'LLM',
    'RAG',
    'vector DB',
    'Kubernetes',
    'GraphQL',
    'gRPC',
    'Terraform',
    'GitOps',
    'CI/CD',
    'OAuth2',
    'JWT',
    'Redis',
    'Kafka',
    'zero trust',
    'event-driven',
    'serverless',
    'FinOps',
    'MLOps',
    'SLO / SLA',
    'OWASP',
    'WCAG',
    'mTLS',
    'Argo CD',
    'feature flags',
    'RBAC',
    'SSO',
    'multi-tenant',
    'audit trail',
    'evidence pack',
    'GDPR',
    'North Star',
    'cohort',
    'blockchain (jk)',
    '10x',
    'LGTM',
    'ship it'
  ];

  /**
   * Used only if stacks + jargon alone don’t yield any letter shared by ≥3 tokens
   * (keeps flakes working without mixing myth into the main vocabulary).
   */
  var MYTH_HISTORY_LEXICON = [
    'Zeus',
    'Hera',
    'Poseidon',
    'Hades',
    'Athena',
    'Apollo',
    'Artemis',
    'Hermes',
    'Ares',
    'Aphrodite',
    'Hephaestus',
    'Demeter',
    'Dionysus',
    'Persephone',
    'Hestia',
    'Eros',
    'Nike',
    'Iris',
    'Pan',
    'Helios',
    'Selene',
    'Chronos',
    'Cronus',
    'Rhea',
    'Oceanus',
    'Prometheus',
    'Pandora',
    'Epimetheus',
    'Atlas',
    'Achilles',
    'Odysseus',
    'Penelope',
    'Telemachus',
    'Hector',
    'Paris',
    'Helen',
    'Agamemnon',
    'Menelaus',
    'Ajax',
    'Patroclus',
    'Circe',
    'Calypso',
    'Polyphemus',
    'Scylla',
    'Charybdis',
    'Icarus',
    'Daedalus',
    'Minos',
    'Theseus',
    'Ariadne',
    'Minotaur',
    'Perseus',
    'Medusa',
    'Andromeda',
    'Pegasus',
    'Heracles',
    'Hercules',
    'Jason',
    'Argonauts',
    'Medea',
    'Orpheus',
    'Eurydice',
    'Oedipus',
    'Antigone',
    'Sisyphus',
    'Tantalus',
    'Midas',
    'Pygmalion',
    'Psyche',
    'Cupid',
    'Venus',
    'Mars',
    'Jupiter',
    'Juno',
    'Neptune',
    'Pluto',
    'Minerva',
    'Diana',
    'Mercury',
    'Vulcan',
    'Bacchus',
    'Ceres',
    'Proserpina',
    'Saturn',
    'Janus',
    'Fortuna',
    'Sparta',
    'Athens',
    'Troy',
    'Ithaca',
    'Crete',
    'Delphi',
    'Olympia',
    'Thebes',
    'Corinth',
    'Rome',
    'Rubicon',
    'Senate',
    'Caesar',
    'Cicero',
    'Seneca',
    'Augustus',
    'Nero',
    'Trajan',
    'Hadrian',
    'Constantine',
    'Homer',
    'Hesiod',
    'Sophocles',
    'Euripides',
    'Aristotle',
    'Plato',
    'Socrates',
    'Pericles',
    'Leonidas',
    'Xerxes',
    'Darius',
    'Hannibal',
    'Scipio',
    'Cleopatra',
    'Antony',
    'Brutus',
    'Cassius',
    'Livy',
    'Virgil',
    'Ovid',
    'Horace',
    'Ilium',
    'Elysium',
    'Styx',
    'Lethe',
    'Cerberus',
    'Charon',
    'Hydra',
    'Python',
    'Sphinx',
    'Centaur',
    'Satyr',
    'Nymph',
    'Muse',
    'Fate',
    'Moirai',
    'Furies',
    'Gorgon',
    'Titan',
    'Olympus',
    'Parnassus',
    'Acropolis',
    'Forum',
    'Colosseum',
    'Legion',
    'Aquila',
    'SPQR'
  ];

  function getProfileArrays() {
    var sp = typeof window.SITE_PROFILE === 'object' && window.SITE_PROFILE ? window.SITE_PROFILE : {};
    return {
      stacks: Array.isArray(sp.stacks) ? sp.stacks : [],
      projects: Array.isArray(sp.projects) ? sp.projects : []
    };
  }

  function expandFromStacksAndProjects(stacks, projects) {
    var out = [];
    var stackSuffix = [' stack', ' in prod', ' at scale', ' hardening', ' migration', ' ops'];
    var projectSuffix = [' — v2', ' (roadmap)', ' sprint', ' retro', ' scope creep'];

    stacks.forEach(function (s) {
      out.push(s);
      if (s.length < 28) {
        out.push(s + stackSuffix[Math.floor(Math.random() * stackSuffix.length)]);
      }
    });
    projects.forEach(function (p) {
      out.push(p);
      if (p.length < 32) {
        out.push(p + projectSuffix[Math.floor(Math.random() * projectSuffix.length)]);
      }
    });
    return out.concat(GENERIC_JARGON);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function shorten(label, maxLen) {
    if (label.length <= maxLen) return label;
    return label.slice(0, Math.max(2, maxLen - 1)) + '…';
  }

  /** Split pool strings into tokens so we can find shared letters across “words”. */
  function extractWords(pool) {
    var seen = {};
    var out = [];

    function add(w) {
      if (!w || w.length < 2) return;
      var key = w.toLowerCase();
      if (!seen[key]) {
        seen[key] = true;
        out.push(w);
      }
    }

    pool.forEach(function (entry) {
      if (!entry) return;
      var s = String(entry).trim();
      s.split(/[\s/·,;–—|\-]+/).forEach(function (p) {
        p = p.trim();
        if (p.length >= 2) add(p);
      });
      if (/^[^/\s]{2,28}$/.test(s) && !/\s/.test(s)) {
        add(s);
      }
    });

    return out;
  }

  function mapLettersToWords(wordList) {
    var byLetter = {};
    wordList.forEach(function (w) {
      var seenInWord = {};
      for (var j = 0; j < w.length; j++) {
        var ch = w[j].toLowerCase();
        if (ch >= 'a' && ch <= 'z') {
          if (!seenInWord[ch]) {
            seenInWord[ch] = true;
            if (!byLetter[ch]) byLetter[ch] = [];
            byLetter[ch].push(w);
          }
        }
      }
    });
    return byLetter;
  }

  function starFlakePossible(wordList) {
    var byLetter = mapLettersToWords(wordList);
    return Object.keys(byLetter).some(function (L) {
      return byLetter[L].length >= 3;
    });
  }

  /**
   * Three lines through one hub letter (six rays, ~60° apart). Each word is split at that letter:
   * neg ray = reverse(before), pos ray = after — letters placed along the ray.
   */
  var AXIS_NEG_ANGLES_DEG = [-90, -30, 30];

  function splitWordAtLetter(word, letter) {
    var lower = String(word).toLowerCase();
    var l = letter.toLowerCase();
    var idx = lower.indexOf(l);
    if (idx === -1) return null;
    return {
      before: String(word).slice(0, idx),
      after: String(word).slice(idx + 1)
    };
  }

  function lettersAlongRay(before, after) {
    var neg = before
      .split('')
      .reverse()
      .join('')
      .toUpperCase();
    var pos = after.toUpperCase();
    return { neg: neg, pos: pos };
  }

  /**
   * Pick a letter in ≥3 words; return { letter, axes: [{ neg, pos }, ×3] } or null.
   */
  function buildStarFlakeFromWords(wordList) {
    var byLetter = mapLettersToWords(wordList);

    var letters = Object.keys(byLetter).filter(function (L) {
      return byLetter[L].length >= 3;
    });

    if (!letters.length) return null;

    var L = letters[Math.floor(Math.random() * letters.length)];
    var poolW = shuffle(byLetter[L]);
    var picked = [];
    var used = {};
    for (var k = 0; k < poolW.length && picked.length < 3; k++) {
      if (!used[poolW[k]]) {
        used[poolW[k]] = true;
        picked.push(poolW[k]);
      }
    }
    if (picked.length < 3) return null;

    picked = shuffle(picked.slice(0, 3));
    var axes = [];
    for (var a = 0; a < 3; a++) {
      var w = shorten(picked[a], 14);
      var sp = splitWordAtLetter(w, L);
      if (!sp) return null;
      var along = lettersAlongRay(sp.before, sp.after);
      axes.push({ neg: along.neg, pos: along.pos });
    }

    return {
      letter: L,
      axes: axes
    };
  }

  /** Preset triples sharing one letter (sketch-style: CRYPTO / COMPUTE / PACKET + P). */
  var EMERGENCY_FLAKES = [
    { letter: 'p', words: ['CRYPTO', 'COMPUTE', 'PACKET'] },
    { letter: 'a', words: ['SaaS', 'data', 'Java'] },
    { letter: 'e', words: ['Redis', 'secure', 'serverless'] },
    { letter: 'r', words: ['GraphQL', 'Terraform', 'carrier'] },
    { letter: 't', words: ['GitOps', 'OAuth2', 'tenant'] },
    { letter: 'o', words: ['OAuth2', 'OWASP', 'SOC'] }
  ];

  function buildFlake(starWords) {
    var flake = buildStarFlakeFromWords(starWords);
    if (flake) return flake;
    var emergencies = shuffle(EMERGENCY_FLAKES.slice());
    for (var e = 0; e < emergencies.length; e++) {
      var fb = emergencies[e];
      var axes = [];
      for (var i = 0; i < fb.words.length; i++) {
        var sp = splitWordAtLetter(fb.words[i], fb.letter);
        if (!sp) continue;
        var along = lettersAlongRay(sp.before, sp.after);
        axes.push({ neg: along.neg, pos: along.pos });
      }
      if (axes.length === 3) {
        return { letter: fb.letter, axes: axes };
      }
    }
    return {
      letter: 'p',
      axes: [
        { neg: 'YRC', pos: 'TO' },
        { neg: 'MOC', pos: 'UTE' },
        { neg: '', pos: 'ACKET' }
      ]
    };
  }

  var FLAKE_STEP_PX = 9;

  function createFlakeElement(flake) {
    var root = document.createElement('div');
    root.className = 'jargon-flake';
    root.setAttribute('aria-hidden', 'true');

    var star = document.createElement('div');
    star.className = 'flake-star';

    var geo = document.createElement('div');
    geo.className = 'flake-geometry';

    /**
     * Letters are placed along each ray from the hub outward. Without adjustment, rays that
     * point screen-up (negative y) or screen-left stack characters in bottom-to-top or
     * right-to-left order, which reads backwards. Reverse the string when exactly one of
     * those applies; XOR avoids double-reversing on down-left diagonals (e.g. 225°).
     */
    function readingOrderAlongRay(angleDeg, chars) {
      var rad = (angleDeg * Math.PI) / 180;
      var pointsUp = Math.sin(rad) < -0.001;
      var pointsLeft = Math.cos(rad) < -0.001;
      var arr = chars.split('');
      if (pointsUp !== pointsLeft) {
        arr.reverse();
      }
      return arr;
    }

    function placeRay(chars, angleDeg, outward) {
      if (!chars || !chars.length) return;
      var rad = (angleDeg * Math.PI) / 180;
      var dir = outward ? 1 : -1;
      var seq = readingOrderAlongRay(angleDeg, chars);
      for (var i = 0; i < seq.length; i++) {
        var d = FLAKE_STEP_PX * (i + 1) * dir;
        var x = Math.cos(rad) * d;
        var y = Math.sin(rad) * d;
        var span = document.createElement('span');
        span.className = 'flake-char';
        span.textContent = seq[i];
        span.style.transform =
          'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px))';
        geo.appendChild(span);
      }
    }

    for (var ax = 0; ax < flake.axes.length; ax++) {
      var axis = flake.axes[ax];
      var negA = AXIS_NEG_ANGLES_DEG[ax];
      var posA = negA + 180;
      if (axis.neg) placeRay(axis.neg, negA, true);
      if (axis.pos) placeRay(axis.pos, posA, true);
    }

    var hub = document.createElement('span');
    hub.className = 'flake-hub';
    hub.textContent = flake.letter.toUpperCase();

    star.appendChild(geo);
    star.appendChild(hub);
    root.appendChild(star);
    return root;
  }

  var container = document.getElementById('jargonSnowfall');
  if (!container) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var prof = getProfileArrays();
  var pool = expandFromStacksAndProjects(prof.stacks, prof.projects);
  pool = shuffle(pool);
  var starWords = extractWords(pool);
  if (!starFlakePossible(starWords)) {
    pool = pool.concat(MYTH_HISTORY_LEXICON);
    starWords = extractWords(pool);
  }

  var flakeCount = window.innerWidth < 600 ? 24 : 40;

  for (var i = 0; i < flakeCount; i++) {
    var flakeData = buildFlake(starWords);
    var flake = createFlakeElement(flakeData);

    var left = Math.random() * 94 + 3;
    var duration = 38 + Math.random() * 42;
    var delay = -(Math.random() * duration);
    var scale = 0.72 + Math.random() * 0.38;
    var opacity = 0.32 + Math.random() * 0.18;

    var swayA = (Math.random() - 0.5) * 72;
    var swayB = (Math.random() - 0.5) * 96;
    var swayC = (Math.random() - 0.5) * 88;

    flake.style.left = left + '%';
    flake.style.animationDuration = duration + 's';
    flake.style.animationDelay = delay + 's';
    flake.style.setProperty('--sf-scale', String(scale));
    flake.style.setProperty('--sf-op', String(opacity));
    flake.style.setProperty('--sway-a', swayA + 'px');
    flake.style.setProperty('--sway-b', swayB + 'px');
    flake.style.setProperty('--sway-c', swayC + 'px');

    container.appendChild(flake);
  }
})();
