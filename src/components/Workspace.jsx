import React, { useState, useEffect, useRef } from 'react';

export default function Workspace({ problem, onBack }) {
  const [activeTab, setActiveTab] = useState('simulation');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const canvasRef = useRef(null);

  // Sync canvas size on mount / collapse
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        canvasRef.current.width = parent.clientWidth;
        canvasRef.current.height = parent.clientHeight;
        // Simple placeholder draw
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [leftCollapsed, rightCollapsed]);

  return (
    <div 
      className={`page active workspace ${leftCollapsed ? 'left-collapsed' : ''} ${rightCollapsed ? 'right-collapsed' : ''}`} 
      id="page-workspace"
    >
      {/* 1. Workspace Header */}
      <div className="workspace-header">
        <div className="workspace-problem-info">
          <button onClick={onBack} className="back-btn">← Dashboard</button>
          <h2 id="ws-problem-title">{problem.title}</h2>
          <span id="ws-difficulty" className={`difficulty-badge ${problem.difficulty}`}>{problem.difficulty}</span>
        </div>
        
        <div className="workspace-actions">
          <button className="ws-action-btn" title="💾 Save Design">💾 Save</button>
          <button className="ws-action-btn" title="🗑️ Clear all components">🗑️ Clear</button>
          <button className="ws-action-btn" title="🔄 Reset simulation">🔄 Reset</button>
          <button className="ws-action-btn" style={{borderColor:'rgba(0,212,170,0.3)', color:'var(--accent-secondary)'}}>📦 Expert View</button>
          <button className="ws-action-btn primary" title="Check your design">✅ Evaluate</button>
        </div>
      </div>

      {/* 2. Left Panel: Component Palette */}
      <div className="palette-panel" id="palettePanel">
        <div className="palette-section">
          <div className="palette-section-title">🌐 Networking</div>
          {[
            { id: 'client', icon: '👤', label: 'Client', sub: 'User / Browser', color: 'var(--comp-client)', bg: 'rgba(0,187,255,0.15)' },
            { id: 'dns', icon: '🌍', label: 'DNS', sub: 'Domain resolution', color: 'var(--comp-dns)', bg: 'rgba(102,187,255,0.15)' },
            { id: 'cdn', icon: '🌐', label: 'CDN', sub: 'Content delivery', color: 'var(--comp-cdn)', bg: 'rgba(68,221,255,0.15)' },
            { id: 'load-balancer', icon: '⚖️', label: 'Load Balancer', sub: 'Distribute traffic', color: 'var(--comp-lb)', bg: 'rgba(124,106,255,0.15)' },
            { id: 'api-gateway', icon: '🚪', label: 'API Gateway', sub: 'Rate limiting, auth', color: 'var(--comp-gateway)', bg: 'rgba(170,119,255,0.15)' },
            { id: 'waf', icon: '🛡️', label: 'WAF', sub: 'Firewall', color: '#ff5577', bg: 'rgba(255,85,119,0.15)' },
            { id: 'rate-limiter', icon: '⏱️', label: 'Rate Limiter', sub: 'Throttling', color: '#aa77ff', bg: 'rgba(170,119,255,0.15)' }
          ].map(item => (
            <div key={item.id} className="palette-item" draggable="true" data-comp={item.id}>
              <div className="palette-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
              <div className="palette-item-info"><h4>{item.label}</h4><p>{item.sub}</p></div>
            </div>
          ))}
        </div>

        <div className="palette-section">
          <div className="palette-section-title">⚙️ Compute</div>
          {[
            { id: 'web-server', icon: '🖥️', label: 'Web Server', sub: 'HTTP handler', color: 'var(--comp-server)', bg: 'rgba(0,212,170,0.15)' },
            { id: 'app-server', icon: '⚙️', label: 'App Server', sub: 'Business logic', color: 'var(--comp-server)', bg: 'rgba(0,212,170,0.15)' },
            { id: 'microservice', icon: '🔧', label: 'Microservice', sub: 'Isolated service', color: 'var(--comp-microservice)', bg: 'rgba(85,221,170,0.15)' },
            { id: 'stream-processing', icon: '🌊', label: 'Stream Proc', sub: 'Spark / Flink', color: '#00bbff', bg: 'rgba(0,187,255,0.15)' }
          ].map(item => (
            <div key={item.id} className="palette-item" draggable="true" data-comp={item.id}>
              <div className="palette-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
              <div className="palette-item-info"><h4>{item.label}</h4><p>{item.sub}</p></div>
            </div>
          ))}
        </div>

        <div className="palette-section">
          <div className="palette-section-title">💾 Data</div>
          {[
            { id: 'sql-db', icon: '🗄️', label: 'SQL DB', sub: 'Postgres / MySQL', color: 'var(--comp-database)', bg: 'rgba(255,170,0,0.15)' },
            { id: 'nosql-db', icon: '📦', label: 'NoSQL DB', sub: 'MongoDB / Dynamo', color: 'var(--comp-database)', bg: 'rgba(255,170,0,0.15)' },
            { id: 'cache', icon: '⚡', label: 'Cache', sub: 'Redis / Memcached', color: 'var(--comp-cache)', bg: 'rgba(255,107,157,0.15)' },
            { id: 'object-storage', icon: '📁', label: 'Object Storage', sub: 'S3 / Blobs', color: 'var(--comp-storage)', bg: 'rgba(136,204,68,0.15)' },
            { id: 'search', icon: '🔍', label: 'Search', sub: 'Elasticsearch', color: 'var(--comp-search)', bg: 'rgba(255,85,119,0.15)' }
          ].map(item => (
            <div key={item.id} className="palette-item" draggable="true" data-comp={item.id}>
              <div className="palette-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
              <div className="palette-item-info"><h4>{item.label}</h4><p>{item.sub}</p></div>
            </div>
          ))}
        </div>

        <div className="palette-section">
          <div className="palette-section-title">📨 Messaging</div>
          {[
            { id: 'message-queue', icon: '📬', label: 'Queue', sub: 'Kafka / RabbitMQ', color: 'var(--comp-queue)', bg: 'rgba(255,136,68,0.15)' },
            { id: 'notification', icon: '🔔', label: 'Notification', sub: 'Push / Email', color: 'var(--comp-queue)', bg: 'rgba(255,136,68,0.15)' }
          ].map(item => (
            <div key={item.id} className="palette-item" draggable="true" data-comp={item.id}>
              <div className="palette-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
              <div className="palette-item-info"><h4>{item.label}</h4><p>{item.sub}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Center: Canvas */}
      <div className="canvas-container" id="canvasContainer">
        <button className="panel-collapse-btn toggle-left" onClick={() => setLeftCollapsed(!leftCollapsed)} title="Toggle Component Palette">
           <span id="leftToggleIcon">{leftCollapsed ? '▶' : '◀'}</span>
        </button>
        <button className="panel-collapse-btn toggle-right" onClick={() => setRightCollapsed(!rightCollapsed)} title="Toggle Features Panel">
           <span id="rightToggleIcon">{rightCollapsed ? '◀' : '▶'}</span>
        </button>

        <canvas ref={canvasRef} id="designCanvas"></canvas>
        
        <div className="canvas-overlay-info" id="canvasOverlay">
          <div className="icon">🏗️</div>
          <h3>Drag components here</h3>
          <p>Build your system architecture by dragging components from the left panel</p>
        </div>

        {/* Canvas Toolbar */}
        <div className="canvas-toolbar">
          <button className="toolbar-btn active" title="Select & Move">🖱️</button>
          <button className="toolbar-btn" title="Draw Connection">🔗</button>
          <div className="toolbar-divider"></div>
          <button className="toolbar-btn" title="Zoom In">🔍+</button>
          <button className="toolbar-btn" title="Zoom Out">🔍−</button>
          <button className="toolbar-btn" title="Fit View">📐</button>
          <div className="toolbar-divider"></div>
          <button className="toolbar-btn" title="Delete Mode">❌</button>
        </div>
      </div>

      {/* 4. Right Panel */}
      <div className="right-panel">
        <div className="panel-tab-bar">
          {['simulation', 'requirements', 'properties', 'notes'].map(tab => (
            <button 
              key={tab}
              className={`panel-tab ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="panel-content">
          {activeTab === 'simulation' && (
            <div className="panel-section active">
              <div className="sim-controls">
                <div className="sim-btn-row">
                  <button className="sim-btn play">▶ Play</button>
                  <button className="sim-btn stop">⏹ Stop</button>
                </div>
                
                <div className="slider-group">
                  <div className="slider-label"><span>Request Rate</span><span>100 req/s</span></div>
                  <input type="range" min="10" max="10000" defaultValue="100" style={{width:'100%'}}/>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <button className="ws-action-btn primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>🔍 Trace Logic Path</button>
                  <button className="ws-action-btn danger" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>💥 Inject Node Failure</button>
                  <button className="ws-action-btn warning" style={{width:'100%',justifyContent:'center',background:'rgba(255,170,0,0.1)',borderColor:'rgba(255,170,0,0.4)',color:'#ffaa00',marginBottom:'8px'}}>🔥 10x Traffic Spike</button>
                </div>

                <div className="metrics-grid">
                  <div className="metric-card"><div className="metric-label">Throughput</div><div className="metric-value good">0</div></div>
                  <div className="metric-card"><div className="metric-label">Latency (ms)</div><div className="metric-value good">0</div></div>
                  <div className="metric-card"><div className="metric-label">Error Rate</div><div className="metric-value good">0%</div></div>
                  <div className="metric-card"><div className="metric-label">Monthly Cost</div><div className="metric-value" style={{ color: '#00d4aa' }}>$0</div></div>
                </div>
              </div>

              <div className="palette-section-title" style={{ padding: '16px 16px 8px' }}>📋 Simulation Log</div>
              <div className="sim-log">
                <div className="log-entry info"><span className="timestamp">[00:00]</span>Simulation engine ready.</div>
              </div>
            </div>
          )}
          
          {activeTab === 'requirements' && (
            <div className="panel-section active">
              <div className="problem-desc-panel">
                <h3>Problem Description</h3>
                <p>{problem.desc}</p>
              </div>
              <div id="requirementsList">
                {problem.requirements && problem.requirements.map((req, idx) => (
                  <div key={idx} style={{padding:'8px', borderBottom:'1px solid var(--border-subtle)', fontSize:'13px', color:'var(--text-secondary)'}}>
                    ✅ {req.text || req}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="panel-section active">
              <div className="problem-desc-panel">
                <p>Click a component on the canvas to view and configure its properties.</p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="panel-section active">
              <div className="problem-desc-panel">
                 <h3>{problem.title} Masterclass</h3>
                 <p style={{ marginBottom: '20px' }}>Unlock curated interview notes for {problem.title}.</p>
                 <button className="start-btn" style={{ width: '100%', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    📥 Download Interview PDF
                 </button>
                 <p style={{textAlign:'center', fontSize:'10px', color:'var(--text-muted)', marginTop:'8px'}}>Included with your Early Bird PRO access!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Ready</span>
          </div>
          <span>0 components · 0 connections</span>
        </div>
        <div className="status-right">
          <span>100%</span>
          <span>0, 0</span>
        </div>
      </div>
    </div>
  );
}
