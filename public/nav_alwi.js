/**
 * ╔══════════════════════════════════════════════════╗
 * ║   NAV ALWI ⛑️ — Pos Tengah & Navigasi Peta      ║
 * ║   Indramayu Club - NURgenerator                  ║
 * ╚══════════════════════════════════════════════════╝
 */

(function () {
  if (document.getElementById('alwi-nav-container')) return;

  // ── SIFAT SUARA BEEP (Web Audio API) ──
  function playClickSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Note D5 (Nada Spiritual Positif)
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Ramp up to A5

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Browser memblokir autostart audio sebelum interaksi
    }
  }

  // ── CONFIG 3 APLIKASI PETA (SESUAI NAMA FILE ASLI) ──
  const PAGE_INFO = {
    'peta-cod.html'  : { icon: '📍', label: 'Peta 3 Titik',   desc: 'Peta COD Bebas 3 Titik' },
    'peta-cod22.html': { icon: '🟡', label: 'Pos Tengah Awi', desc: 'Lokasi Member ke Pos Awi' },
    'peta.html'      : { icon: '🗺️', label: 'Peta Interaktif', desc: 'Cari Paket & Alamat Indramayu' }
  };

  const currentPage = location.pathname.split('/').pop() || 'peta.html';

  // ── INJECT CSS ALWI ──
  const style = document.createElement('style');
  style.textContent = `
    #alwi-nav-container {
      position: fixed; bottom: 20px; left: 16px;
      z-index: 99999; font-family: Arial, sans-serif;
    }
    #alwi-nav-toggle {
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #06140b, #0a2e1c);
      border: 2.5px solid #ffd700;
      color: #ffd700; font-size: 26px; cursor: pointer;
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.45);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s;
    }
    #alwi-nav-toggle:hover { transform: scale(1.08); }
    #alwi-nav-panel {
      display: none; position: absolute;
      bottom: 66px; left: 0; width: 260px;
      background: #1e1e1e; border: 1.5px solid #ffd700;
      border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.8);
      overflow: hidden;
    }
    #alwi-nav-panel.show { display: block; }
    .alwi-nav-head {
      background: #121212; border-bottom: 1px solid #333;
      padding: 10px 14px; display: flex; align-items: center; gap: 8px;
    }
    .alwi-nav-head-title { font-size: 13px; font-weight: bold; color: #ffd700; }
    .alwi-nav-head-sub   { font-size: 10px; color: #a0a0a0; }
    .alwi-tool-list { padding: 8px; display: flex; flex-direction: column; gap: 5px; }
    .alwi-tool-item {
      display: flex; align-items: center; gap: 9px;
      padding: 9px 10px; border-radius: 8px;
      text-decoration: none; color: #e0e0e0;
      background: #161616; border: 1px solid #333;
    }
    .alwi-tool-item:hover { border-color: #ffd700; }
    .alwi-tool-item.current { border-color: #ffd700; background: rgba(255, 215, 0, 0.15); }
    .alwi-tool-label { font-size: 12px; font-weight: bold; color: #ffd700; }
    .alwi-tool-desc  { font-size: 10px; color: #a0a0a0; }
  `;
  document.head.appendChild(style);

  // ── BUILD CONTAINER ──
  const container = document.createElement('div');
  container.id = 'alwi-nav-container';
  container.innerHTML = `
    <div id="alwi-nav-panel">
      <div class="alwi-nav-head">
        <span style="font-size:20px;">⛑️</span>
        <div>
          <div class="alwi-nav-head-title">POS TENGAH ALWI</div>
          <div class="alwi-nav-head-sub">Penghubung 3 Aplikasi Peta</div>
        </div>
      </div>
      <div class="alwi-tool-list" id="alwi-tool-list"></div>
    </div>
    <button id="alwi-nav-toggle" title="Agen Alwi — Pos Tengah">⛑️</button>
  `;
  document.body.appendChild(container);

  const panel  = document.getElementById('alwi-nav-panel');
  const toggle = document.getElementById('alwi-nav-toggle');
  const list   = document.getElementById('alwi-tool-list');

  // Klik Toggle + Buka Panel + Bunyikan Suara 🔊
  toggle.addEventListener('click', () => {
    playClickSound();
    panel.classList.toggle('show');
  });

  // Render Daftar Aplikasi Peta
  list.innerHTML = Object.keys(PAGE_INFO).map(file => {
    const info = PAGE_INFO[file];
    const isCurrent = file === currentPage;
    return `
      <a href="/${file}" class="alwi-tool-item ${isCurrent ? 'current' : ''}" onclick="window.playClickSound && window.playClickSound()">
        <span style="font-size:18px">${info.icon}</span>
        <div>
          <div class="alwi-tool-label">${info.label} ${isCurrent ? '(Aktif)' : ''}</div>
          <div class="alwi-tool-desc">${info.desc}</div>
        </div>
      </a>
    `;
  }).join('');

  window.playClickSound = playClickSound;
})();
