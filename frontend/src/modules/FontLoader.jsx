export default function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=IBM+Plex+Mono:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg:         #08080d;
        --surface:    #10101a;
        --border:     #1e1e2e;
        --border-hi:  #2e2e4e;
        --gold:       #c9a84c;
        --gold-dim:   #7a6130;
        --red:        #c0392b;
        --red-dim:    #5a1a14;
        --green:      #27ae60;
        --green-dim:  #0f3d21;
        --amber:      #e67e22;
        --text:       #e8e8f0;
        --text-dim:   #888899;
        --text-faint: #44445a;
        --mono:       'IBM Plex Mono', monospace;
        --serif:      'Playfair Display', Georgia, serif;
        --body:       'Lora', Georgia, serif;
      }

      html, body, #root {
        height: 100%;
        background: var(--bg);
        color: var(--text);
        font-family: var(--body);
        font-size: 15px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
      }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      .fade-up { animation: fadeUp 0.5s ease both; }
      .fade-up-1 { animation: fadeUp 0.5s 0.05s ease both; }
      .fade-up-2 { animation: fadeUp 0.5s 0.12s ease both; }
      .fade-up-3 { animation: fadeUp 0.5s 0.20s ease both; }
      .fade-up-4 { animation: fadeUp 0.5s 0.28s ease both; }
      .fade-up-5 { animation: fadeUp 0.5s 0.36s ease both; }
    `}</style>
  );
}
