import React, { useState } from 'react';

const PROBLEMS = [
  { id:1, title:"URL Shortener", difficulty:"easy", category:"url-shortener", isPremium:false,
    desc:"Design a URL shortening service like TinyURL that converts long URLs to short ones.",
    tags:["Hashing","Database","Cache","API Design"],
    requirements:[
      {text:"Client sends requests to the system",needs:["client"]},
      {text:"Load balancer distributes traffic",needs:["load-balancer"]},
      {text:"Application server handles business logic",needs:["app-server","web-server"]},
      {text:"Database stores URL mappings",needs:["sql-db","nosql-db"]},
      {text:"Cache for hot URLs (optional bonus)",needs:["cache"],optional:true}
    ],
    hint:"Think about how to generate unique short codes and handle high read traffic."
  },
  { id:2, title:"Chat Messaging System", difficulty:"medium", category:"messaging", isPremium:true,
    desc:"Design a real-time chat application like WhatsApp supporting 1-on-1 and group messaging.",
    tags:["WebSocket","Queue","Database","Notification"],
    requirements:[
      {text:"Client connects to the system",needs:["client"]},
      {text:"Load balancer for connection distribution",needs:["load-balancer"]},
      {text:"WebSocket server for real-time messaging",needs:["web-server"]},
      {text:"Message queue for async processing",needs:["message-queue"]},
      {text:"Database for message persistence",needs:["sql-db","nosql-db"]},
      {text:"Notification service for offline users",needs:["notification"],optional:true},
      {text:"Cache for recent conversations",needs:["cache"],optional:true}
    ],
    hint:"Consider how to handle message ordering, delivery receipts, and offline users."
  },
  { id:3, title:"Instagram / Photo Sharing", difficulty:"medium", category:"storage", isPremium:true,
    desc:"Design a photo sharing platform with feeds, likes, comments, and followers.",
    tags:["CDN","Object Storage","Feed","Cache"],
    requirements:[
      {text:"Client interface",needs:["client"]},
      {text:"CDN for serving images",needs:["cdn"]},
      {text:"Load balancer",needs:["load-balancer"]},
      {text:"Application servers",needs:["app-server","web-server"]},
      {text:"Object storage for images",needs:["object-storage"]},
      {text:"Database for metadata",needs:["sql-db","nosql-db"]},
      {text:"Cache for feed generation",needs:["cache"],optional:true},
      {text:"Message queue for async tasks",needs:["message-queue"],optional:true}
    ],
    hint:"Focus on how to efficiently store/serve images and generate user feeds at scale."
  },
  { id:4, title:"Twitter / Social Feed", difficulty:"hard", category:"messaging", isPremium:true,
    desc:"Design a social media platform with tweets, timeline, trending topics, and search.",
    tags:["Fan-out","Cache","Search","Queue"],
    requirements:[
      {text:"Client",needs:["client"]},
      {text:"CDN for static assets",needs:["cdn"]},
      {text:"Load balancer",needs:["load-balancer"]},
      {text:"API Gateway for rate limiting",needs:["api-gateway"]},
      {text:"Application servers",needs:["app-server","web-server"]},
      {text:"Database for tweets/users",needs:["sql-db","nosql-db"]},
      {text:"Cache for timelines",needs:["cache"]},
      {text:"Message queue for fan-out",needs:["message-queue"]},
      {text:"Search engine for tweets",needs:["search"],optional:true}
    ],
    hint:"Consider fan-out-on-write vs fan-out-on-read for timeline generation."
  },
  { id:5, title:"Netflix / Video Streaming", difficulty:"hard", category:"streaming", isPremium:true,
    desc:"Design a video streaming platform handling millions of concurrent viewers.",
    tags:["CDN","Transcoding","Storage","Adaptive Streaming"],
    requirements:[
      {text:"Client",needs:["client"]},
      {text:"CDN for video delivery",needs:["cdn"]},
      {text:"DNS for routing",needs:["dns"]},
      {text:"Load balancer",needs:["load-balancer"]},
      {text:"Application servers",needs:["app-server","web-server"]},
      {text:"Object storage for videos",needs:["object-storage"]},
      {text:"Database for metadata",needs:["sql-db","nosql-db"]},
      {text:"Message queue for transcoding",needs:["message-queue"]},
      {text:"Cache for recommendations",needs:["cache"],optional:true}
    ],
    hint:"Think about video transcoding pipeline, adaptive bitrate, and CDN edge caching."
  },
  { id:6, title:"Uber / Ride Sharing", difficulty:"hard", category:"location", isPremium:true,
    desc:"Design a ride-sharing service matching drivers with riders in real-time.",
    tags:["Geospatial","Real-time","Queue","Matching"],
    requirements:[
      {text:"Client (rider & driver)",needs:["client"]},
      {text:"Load balancer",needs:["load-balancer"]},
      {text:"API Gateway",needs:["api-gateway"]},
      {text:"Matching microservice",needs:["microservice"]},
      {text:"Application servers",needs:["app-server","web-server"]},
      {text:"Database for trips/users",needs:["sql-db","nosql-db"]},
      {text:"Cache for driver locations",needs:["cache"]},
      {text:"Message queue for notifications",needs:["message-queue"]},
      {text:"Notification service",needs:["notification"],optional:true}
    ],
    hint:"Focus on real-time location tracking, efficient proximity matching, and surge pricing."
  },
  { id:7, title:"Distributed Rate Limiter", difficulty:"hard", category:"url-shortener", isPremium:true,
    desc:"Design a distributed rate limiter to throttle API requests (e.g., token bucket algorithm).",
    tags:["API Gateway","Redis","Concurrency","Throttling"],
    requirements:[
      {text:"Client traffic",needs:["client"]},
      {text:"API Gateway/Load Balancer",needs:["api-gateway","load-balancer"]},
      {text:"Rate Limiter service",needs:["rate-limiter"]},
      {text:"Distributed Cache (Redis) for token storage",needs:["cache"]},
      {text:"Backend Application servers",needs:["app-server"]}
    ],
    hint:"Consider race conditions when multiple gateways read/write to the cache simultaneously."
  },
  { id:8, title:"Web Crawler / Search Engine", difficulty:"hard", category:"storage", isPremium:true,
    desc:"Design a high-throughput distributed web crawler that downloads and indexes billions of pages.",
    tags:["Queue","Worker","Storage","Directed Graph"],
    requirements:[
      {text:"Seed URLs / URL Frontier (Message Queue)",needs:["message-queue"]},
      {text:"HTML Download Workers",needs:["app-server"]},
      {text:"DNS Resolver",needs:["dns"]},
      {text:"Object Storage for raw HTML",needs:["object-storage"]},
      {text:"Content Extractor / Indexer",needs:["microservice"]},
      {text:"Search Index DB",needs:["search"]}
    ],
    hint:"Focus on BFS traversal, polite crawling delays, and canonical deduplication."
  },
  { id:9, title:"Distributed Key-Value Store", difficulty:"medium", category:"storage", isPremium:true,
    desc:"Design a highly available distributed cache/KV store (like Memcached or Redis).",
    tags:["Consistent Hashing","Replication","Gossip","CAP Theorem"],
    requirements:[
      {text:"Client library",needs:["client"]},
      {text:"Service Registry / Zookeeper for node configs",needs:["zookeeper"]},
      {text:"Multiple Cache Nodes filling a hash ring",needs:["cache","cache","cache"]},
      {text:"Backup Storage (Optional append-only file)",needs:["object-storage"],optional:true}
    ],
    hint:"Think about Consistent Hashing for data partitioning and resolving split-brain conflicts."
  },
  { id:10, title:"Yelp / Proximity Service", difficulty:"medium", category:"messaging", isPremium:true,
    desc:"Design a Location-Based Service (LBS) to find nearby restaurants instantly.",
    tags:["QuadTree","Geospatial","Read-Heavy","Cache"],
    requirements:[
      {text:"Mobile Client",needs:["client"]},
      {text:"Load Balancer",needs:["load-balancer"]},
      {text:"API Gateway",needs:["api-gateway"]},
      {text:"Location Compute Service",needs:["app-server"]},
      {text:"Read-Replica SQL DB (Locations)",needs:["sql-db"]},
      {text:"In-Memory Cache for hot zones",needs:["cache"]}
    ],
    hint:"Use a QuadTree or Geohash partitioning index to optimize multi-dimensional spatial queries."
  }
];

export default function Dashboard({ onStart, isPro, isLoggedIn, setActiveView }) {
  // Navigate directly to the original working playground page.
  // This page is a 1:1 copy of the reference site and handles everything:
  // Expert View, Simulation, Drag-and-Drop, Auth, Paywall — all natively in JS.
  const goToPlayground = (p) => {
    if (!isLoggedIn) {
      // Intercept logged-out users trying to access locked problems immediately on Dashboard
      setActiveView('auth');
      return;
    }
    window.location.href = `/playground.html?problemId=${p.id}`;
  };

  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredProblems = activeFilter === 'all' 
    ? PROBLEMS 
    : PROBLEMS.filter(p => p.difficulty === activeFilter || p.category === activeFilter);

  return (
    <div className="page active" id="page-dashboard">
      <div className="hero">
        <div className="hero-badge">⚡ Interactive System Design Practice</div>
        <h1>Master <span className="gradient-text">System Design</span><br/>With Real Simulation</h1>
        <p>Build architectures with drag & drop, connect components, and watch your system handle real traffic in a live simulation. Download FAANG & top product-based MNC interview-ready PDFs with complete solutions, Q&A flashcards, and trade-off deep dives.</p>
        
        <div className="stats-row">
          <div className="stat">
            <div className="stat-value">12+</div>
            <div className="stat-label">Design Problems</div>
          </div>
          <div className="stat">
            <div className="stat-value">15+</div>
            <div className="stat-label">Components</div>
          </div>
          <div className="stat">
            <div className="stat-value">∞</div>
            <div className="stat-label">Simulations</div>
          </div>
        </div>
      </div>

      <div className="filter-bar" id="filterBar">
        {['all', 'easy', 'medium', 'hard', 'url-shortener', 'messaging', 'storage', 'streaming'].map(f => (
          <button 
            key={f}
            className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="problems-grid" id="problemsGrid">
        {filteredProblems.map((p, i) => {
          const lockHtml = (p.isPremium && !isPro) 
            ? <span className="pro-lock" style={{background:'var(--accent-warning)', color:'#fff', padding:'2px 6px', borderRadius:'4px', fontSize:'10px', fontWeight:'bold', marginLeft:'8px'}}>🔒 PRO</span>
            : null;
            
          const btnText = (p.isPremium && !isPro) ? 'Unlock Pro →' : 'Start →';

          return (
            <div 
              key={p.id} 
              className="problem-card fade-in" 
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={(e) => { 
                if (e.target.tagName !== 'BUTTON') goToPlayground(p); 
              }}
            >
              <div className="problem-card-header">
                <span className="problem-number">#{String(p.id).padStart(3,'0')} {lockHtml}</span>
                <span className={`difficulty-badge ${p.difficulty}`}>{p.difficulty}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="problem-tags">
                {p.tags.map(t => <span key={t} className="problem-tag">{t}</span>)}
              </div>
              <div className="problem-card-footer">
                <div className="problem-meta">
                  <span>📋 {p.requirements.length} requirements</span>
                </div>
                <button 
                  className="start-btn" 
                  onClick={(e) => { e.stopPropagation(); goToPlayground(p); }}
                >
                  {btnText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMING SOON CTA */}
      <div style={{ margin: '40px auto', maxWidth: '800px', padding: '24px 32px', background: 'linear-gradient(145deg, rgba(124, 106, 255, 0.1), rgba(0, 212, 170, 0.05))', border: '1px solid rgba(124, 106, 255, 0.2)', borderRadius: '16px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '40px' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '20px' }}>🚀 Coming Soon: More Reality-Tested Architectures</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
          We are actively engineering 80+ ultra-realistic system designs from tier-1 tech companies, including <strong>Google Maps (Geospatial routing), Spotify (Audio caching), and Tinder (Matching engines)</strong>.
        </p>
        <div style={{ display: 'inline-block', padding: '15px 24px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,215,0,0.3)', marginBottom: '25px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '16px' }}>🔒 Early Bird Pricing:</span> 
            <span style={{ color: 'var(--text-muted)', fontSize: '15px', marginLeft: '5px' }}>Unlock Lifetime Pro Access today for just <strong>$10 or ₹799</strong> before the full launch!</span>
          </div>
          <button onClick={() => window.open('https://rzp.io/rzp/aVExvTId', '_blank')} style={{ background: 'linear-gradient(90deg, #3399cc, #2b82ad)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(51, 153, 204, 0.3)', transition: 'transform 0.2s' }}>
            Secure Checkout with Razorpay ⚡
          </button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', padding: '60px 0 20px 0', fontSize: '14px', color: 'var(--text-muted)', opacity: '0.6' }}>
         &copy; 2026 SystemForge. All rights reserved.
      </div>
    </div>
  );
}
