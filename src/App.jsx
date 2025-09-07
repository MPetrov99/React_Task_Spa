import React, { useEffect, useMemo, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";
import "./index.css";

// ---------- Util: local storage helpers ----------
const LS_ANSWERS_KEY = "spaQuizAnswers_v1";
const LS_WISHLIST_KEY = "spaQuizWishlist_v1";

function saveAnswers(a) {
  localStorage.setItem(LS_ANSWERS_KEY, JSON.stringify(a));
}
function loadAnswers() {
  try {
    return JSON.parse(localStorage.getItem(LS_ANSWERS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveWishlist(ids) {
  localStorage.setItem(LS_WISHLIST_KEY, JSON.stringify(ids));
}
function loadWishlist() {
  try {
    return JSON.parse(localStorage.getItem(LS_WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

// ---------- Data: Questions ----------
const QUESTIONS = [
  {
    id: 1,
    question: "What's your hair type or texture?",
    options: ["Straight", "Curly", "Wavy", "Fine"],
  },
  {
    id: 2,
    question: "How often do you wash your hair?",
    options: [
      "Daily",
      "Every other day",
      "Twice a week",
      "Once a week",
      "Once every two weeks",
    ],
  },
  {
    id: 3,
    question: "What benefit do you look for in your hair products?",
    options: [
      "Anti-breakage",
      "Hydration",
      "Soothing dry scalp",
      "Repairs the appearance of damaged hair",
      "Volume",
      "Curl and coil enhancing",
    ],
  },
  {
    id: 4,
    question: "Is there anything troubling you about your hair?",
    options: ["Breakage", "Frizz", "Scalp dryness", "Damage", "Tangling"],
  },
  {
    id: 5,
    question: "What is your natural hair color(s) today?",
    options: ["Black", "Brown", "Blonde", "Red/Orange", "Silver/Grey"],
  },
];

// ---------- Mapping: answers -> keywords ----------
const KEYWORDS = {
  // q1 texture
  Straight: ["smooth", "straight"],
  Curly: ["curl", "curling", "curl-enhancing"],
  Wavy: ["wave", "wavy"],
  Fine: ["fine", "volume", "volum"],

  // q3 benefits
  "Anti-breakage": ["strength", "breakage", "bond", "protein"],
  Hydration: ["hydrate", "moisture", "moistur"],
  "Soothing dry scalp": ["scalp", "soothe", "anti dandruff", "dry scalp"],
  "Repairs the appearance of damaged hair": ["repair", "damage", "bond"],
  Volume: ["volume", "volumis", "thick"],
  "Curl and coil enhancing": ["curl", "coil", "define"],

  // q4 troubles
  Breakage: ["breakage", "strength"],
  Frizz: ["frizz", "smooth", "anti frizz"],
  "Scalp dryness": ["scalp", "soothe", "dry"],
  Damage: ["repair", "damage"],
  Tangling: ["detangle", "detangl"],

  // q5 color
  Blonde: ["blonde", "yellow", "brass", "purple"],
  "Red/Orange": ["red", "copper", "toning"],
  "Silver/Grey": ["silver", "grey", "gray", "toning"],
  Brown: ["brown"],
  Black: ["black"],
};

function keywordsFromAnswers(answers) {
  const picked = Object.values(answers);
  const set = new Set();
  picked.forEach((v) => (KEYWORDS[v] || []).forEach((k) => set.add(k.toLowerCase())));
  return Array.from(set);
}

// ---------- Circular Progress (SVG) ----------
function CircleProgress({ current, total }) {
  const radius = 28;
  const stroke = 6;
  const C = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, current / total));
  const dash = C * pct;

  return (
    <div className="circle-wrap" aria-label={`Progress ${current} of ${total}`}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        {/* Rotate the path -90° around the center (34,34) so it starts at 12 o'clock */}
        <g transform="rotate(-90 34 34)">
          <circle
            cx="34" cy="34" r={radius}
            strokeWidth={stroke} className="track" fill="none"
          />
          <circle
            cx="34" cy="34" r={radius}
            strokeWidth={stroke} className="progress" fill="none"
            strokeDasharray={`${dash} ${C - dash}`}
            strokeLinecap="round"
          />
        </g>
      </svg>
      <div className="circle-text">{current}/{total}</div>
    </div>
  );
}


// ---------- Start (Hero) ----------
function StartPage() {
  const nav = useNavigate();

  const start = () => {
    localStorage.removeItem(LS_ANSWERS_KEY); // reset answers
    nav("/q/1", { replace: true });
    window.scrollTo(0, 0);
  };

  return (
    <div className="hero">
      <div className="hero-inner">
        <h1>
          Build a self care routine
          <br />
          suitable for you
        </h1>
        <p>Take our test to get a personalised self care routine based on your needs.</p>
        <button className="btn primary btn-start" onClick={start}>
          Start the quiz
        </button>
      </div>
    </div>
  );
}

// ---------- Question Page ----------
function QuestionPage() {
  const { id } = useParams();
  const idx = Number(id);
  const q = QUESTIONS[idx - 1];
  const nav = useNavigate();
  const [answers, setAnswers] = useState(loadAnswers());
  const selected = answers[q.id] || "";

  useEffect(() => saveAnswers(answers), [answers]);

  const onNext = () => {
    if (!selected) return;
    if (idx < QUESTIONS.length) {
      nav(`/q/${idx + 1}`);
    } else {
      nav("/results");
    }
    window.scrollTo(0, 0);
  };
  const onBack = () => {
    if (idx > 1) nav(`/q/${idx - 1}`);
    else nav("/");
    window.scrollTo(0, 0);
  };

  // Submitted steps = index - 1 (increments only after Next)
  const submitted = Math.max(0, Math.min(QUESTIONS.length, idx - 1));

  return (
    <div className="question-layout">
      <CircleProgress current={submitted} total={QUESTIONS.length} />
      <div className="question-card">
        <h2>{q.question}</h2>
        <div className="options">
          {q.options.map((opt, i) => {
            // Generate labels: a., b., c. ...
            const label = String.fromCharCode(97 + i) + "."; // 97 = 'a'
            return (
              <button
                key={opt}
                className={`option ${selected === opt ? "active" : ""}`}
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
              >
                {label} {opt}
              </button>
            );
          })}
        </div>
        <div className="q-actions">
          <button className="link" onClick={onBack}>
            Back
          </button>
          <button className="btn next" disabled={!selected} onClick={onNext}>
            {idx < QUESTIONS.length ? "Next question →" : "Discover your results"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Results Page ----------
function ResultsPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  const answers = loadAnswers();
  const kws = useMemo(() => keywordsFromAnswers(answers), [JSON.stringify(answers)]);
  const [wishlist, setWishlist] = useState(loadWishlist());
  useEffect(() => saveWishlist(wishlist), [wishlist]);

  // fetch products (unchanged)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    fetch("https://jeval.com.au/collections/hair-care/products.json?page=1")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Network error"))))
      .then((data) => {
        if (!alive) return;
        const list = (data.products || []).map((p) => ({
          id: p.id,
          title: p.title,
          tags: p.tags || [],
          body_html: p.body_html || "",
          variants: p.variants || [],
          images: p.images || [],
          image: p.images && p.images[0] ? p.images[0].src : "",
          price: p.variants && p.variants[0] ? p.variants[0].price : "",
          handle: p.handle,
        }));
        setProducts(list);
      })
      .catch(() => {
        const sample = [
          { id: 1, title: "Hydrating Curl Shampoo", tags: ["curl","hydrate"], body_html: "Hydration for curls.", variants:[{price:"24.00"}], images:[{src:"https://via.placeholder.com/600x800?text=Curl+Shampoo"}], image:"https://via.placeholder.com/600x800?text=Curl+Shampoo" },
          { id: 2, title: "Anti-Frizz Repair Mask", tags: ["frizz","repair"], body_html: "Repairs damaged hair.", variants:[{price:"29.00"}], images:[{src:"https://via.placeholder.com/600x800?text=Repair+Mask"}], image:"https://via.placeholder.com/600x800?text=Repair+Mask" },
          { id: 3, title: "Purple Blonde Toning", tags: ["blonde","purple"], body_html: "Tones brassiness.", variants:[{price:"22.00"}], images:[{src:"https://via.placeholder.com/600x800?text=Purple+Shampoo"}], image:"https://via.placeholder.com/600x800?text=Purple+Shampoo" },
          { id: 4, title: "Volumizing Fine Hair Foam", tags: ["volume"], body_html: "Lift for fine hair.", variants:[{price:"19.00"}], images:[{src:"https://via.placeholder.com/600x800?text=Volume+Foam"}], image:"https://via.placeholder.com/600x800?text=Volume+Foam" },
        ];
        setProducts(sample);
        setError("Live products endpoint not reachable in preview – showing sample data.");
      })
      .finally(() => setLoading(false));
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!kws.length) return products;
    const hasKW = (t) => kws.some((k) => t.includes(k));
    return products.filter((p) => {
      const text = (p.title + " " + p.body_html + " " + (p.tags || []).join(" "))
        .toLowerCase()
        .replace(/<[^>]*>/g, "");
      return hasKW(text);
    });
  }, [products, kws.join(",")]);

  // wishlist first
  const items = useMemo(() => {
    const wish = [], rest = [];
    filtered.forEach((p) => (wishlist.includes(p.id) ? wish : rest).push(p));
    return [...wish, ...rest];
  }, [filtered, wishlist.join(",")]);

  // --- NEW: prepend static copy card ---
  const heroCopy =
    "Perfect for if you're looking for soft, nourished skin, our moisturizing body washes are made with skin-natural nutrients that work with your skin to replenish moisture. With a light formula, the bubbly lather leaves your skin feeling cleansed and cared for. And by choosing relaxing fragrances you can add a moment of calm to the end of your day.";

  const combined = useMemo(
    () => [{ id: "copy-card", __static: true }, ...items],
    [items]
  );

  // slider — show 3 cards at a time
  const visibleCount = 3;
  const [slideIdx, setSlideIdx] = useState(0);
  const stepPct = 34; 
  const maxSlide = Math.max(0, combined.length - visibleCount);
  const left  = () => setSlideIdx((i) => Math.max(0, i - 1));
  const right = () => setSlideIdx((i) => Math.min(maxSlide, i + 1));

  const toggleWish = (id) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const retake = () => {
    localStorage.removeItem(LS_ANSWERS_KEY);
    nav("/q/1", { replace: true });
    window.scrollTo(0, 0);
  };

  // dots = number of possible positions (windowed)
  const dotCount = Math.max(1, combined.length - visibleCount + 1);

  return (
    <div className="results">
      <div className="results-hero results-hero--banner">
        <div className="results-hero__inner">
          <h1>Build your everyday self care routine.</h1>
          <p className="results-hero__desc">{heroCopy}</p>
          <div className="hero-actions">
            <button className="btn outline btn-redo" onClick={retake}>Retake the quiz</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading products…</div>
      ) : (
        <>
          {error && <div className="notice">{error}</div>}

          <div className="slider-wrapper">
            <div className="slider">
              <button className="nav prev" disabled={slideIdx === 0} onClick={left}>◀</button>
              <div className="viewport">
                <div
                  className="track-row"
                  style={{ transform: `translateX(${-slideIdx * stepPct}%)` }}
                >
                  {combined.map((p) =>
                    p.__static ? (
                      <div className="card card--copy" key="copy-card">
                        <div className="copy">
                          <h3>Daily routine</h3>
                          <p>{heroCopy}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="card" key={p.id}>
                        <button
                          className={`wish ${wishlist.includes(p.id) ? "on" : ""}`}
                          onClick={() => toggleWish(p.id)}
                          aria-label="Add to wishlist"
                        >
                          ♥
                        </button>
                        <div
                          className="image"
                          style={{ backgroundImage: `url(${p.image || "https://via.placeholder.com/600x800?text=No+Image"})` }}
                        />
                        <div className="info">
                          <div className="title" title={p.title}>{p.title}</div>
                          <div className="price">${(p.variants?.[0]?.price || p.price || "").toString()}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <button className="nav next" disabled={slideIdx === maxSlide} onClick={right}>▶</button>
            </div>
            <div className="dots">
              {Array.from({ length: dotCount }).map((_, i) => (
                <span key={i} className={i === slideIdx ? "dot active" : "dot"} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- App Shell & Router ----------
export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="topbar">
          <Link to="/" className="brand">
            Spa Routine Quiz
          </Link>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/q/:id" element={<QuestionPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>
        <footer className="site-footer">© {new Date().getFullYear()} Spa Routine</footer>
      </div>
    </HashRouter>
  );
}
