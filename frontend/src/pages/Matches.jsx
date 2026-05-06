import { useEffect, useState, useRef } from "react";
import MatchCard from "../components/MatchCard";
import "../styles/Matches.css";

const PAGE_SIZE = 10;

const EMPTY_FILTERS = {
  dorm: "",
  term: "",
  room_type: "",
  standing: "",
  noise_level: "",
  cleanliness: "",
  sleep_habits: "",
  social_level: "",
  guest_policy: "",
  alcohol_policy: "",
  shared_belongings: "",
};

function Matches() {
  const [matches, setMatches] = useState([]);
  const [myDorm, setMyDorm] = useState("");
  const [pendingIds, setPendingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  const [skippingId, setSkippingId] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(EMPTY_FILTERS);
  const [filteredMatches, setFilteredMatches] = useState(null);
  const [filtersActive, setFiltersActive] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const filterPanelRef = useRef(null);

  useEffect(() => {
    document.title = "Explore and Connect | Roommate Finder";
    fetch("http://localhost:8000/api/matches/potential/", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load matches");
        return res.json();
      })
      .then(data => {
        setMatches(data.matches || []);
        setPendingIds(new Set(data.pending_request_ids || []));
        const dorm = data.my_dorm || "";
        setMyDorm(dorm);
        setFilterValues(prev => ({ ...prev, dorm }));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    clearTimeout(debounceRef.current);

    if (filtersActive) return; // search is client-side when filters active

    if (q.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setSearching(true);
      fetch(`http://localhost:8000/api/search/?q=${encodeURIComponent(q.trim())}`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.results || []);
          setPendingIds(prev => new Set([...prev, ...(data.pending_request_ids || [])]));
        })
        .finally(() => setSearching(false));
    }, 400);
  };

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v !== "") params.append(k, v);
    });

    setFilterLoading(true);
    fetch(`http://localhost:8000/api/matches/filtered/?${params.toString()}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setFilteredMatches(data.results || []);
        setPendingIds(new Set(data.pending_request_ids || []));
        setFiltersActive(true);
        setFilterOpen(false);
        setPage(0);
      })
      .finally(() => setFilterLoading(false));
  };

  const handleResetFilters = () => {
    const reset = { ...EMPTY_FILTERS, dorm: myDorm };
    setFilterValues(reset);
    setFilteredMatches(null);
    setFiltersActive(false);
    setSearchResults([]);
    setPage(0);
  };

  const handleSkip = (userId) => {
    setSkippingId(userId);
    setTimeout(() => {
      setMatches(prev => prev.filter(m => m.id !== userId));
      setFilteredMatches(prev => prev ? prev.filter(m => m.id !== userId) : prev);
      setSearchResults(prev => prev.filter(m => m.id !== userId));
      setSkippingId(null);
    }, 350);
  };

  const handleMatchRequest = (userId) => {
    setPendingIds(prev => new Set([...prev, userId]));
    fetch(`http://localhost:8000/api/match/request/${userId}/`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });
  };

  if (loading) return <div style={{ padding: "2rem", color: "white" }}>Loading matches...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  const baseList = filtersActive ? (filteredMatches || []) : matches;
  const isSearching = searchQuery.trim().length >= 3;

  let displayList;
  if (isSearching && filtersActive) {
    const q = searchQuery.trim().toLowerCase();
    displayList = baseList.filter(m => m.name.toLowerCase().includes(q));
  } else if (isSearching && !filtersActive) {
    displayList = searchResults;
  } else {
    displayList = baseList;
  }

  const totalPages = Math.ceil(displayList.length / PAGE_SIZE);
  const pageList = (isSearching || filtersActive)
    ? displayList
    : displayList.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const renderMatchList = (list) => (
    <div className="matches-list">
      {list.map(match => (
        <div key={match.id} className={skippingId === match.id ? "match-card-skipping" : ""}>
          <MatchCard match={match} />
          <div className="match-card-actions">
            <button
              className={`match-btn ${pendingIds.has(match.id) ? "match-btn-pending" : "match-btn-accept"}`}
              onClick={() => handleMatchRequest(match.id)}
              disabled={pendingIds.has(match.id)}
            >
              {pendingIds.has(match.id) ? "Pending" : "Match"}
            </button>
            <button className="match-btn match-btn-deny" onClick={() => handleSkip(match.id)}>Skip</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="matches-page">
      <p className="matches-subtitle">Showing your top matches based on compatibility.</p>

      <div className="matches-search-row" ref={filterPanelRef}>
        <input
          type="text"
          className="matches-search-input"
          placeholder="Or search by name (min. 3 characters)..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className={`matches-filter-btn ${filtersActive ? "matches-filter-btn-active" : ""}`}
          onClick={() => setFilterOpen(o => !o)}
        >
          Filters {filtersActive ? "●" : "▼"}
        </button>

        {filterOpen && (
          <div className="matches-filter-panel">
            <div className="filter-section-title">Basic Info</div>
            <div className="filter-grid">
              <div className="filter-field">
                <label>Dorm</label>
                <select value={filterValues.dorm} onChange={e => handleFilterChange("dorm", e.target.value)}>
                  <option value="">Any</option>
                  <option value="C">Cambridge Commons</option>
                  <option value="R">Riverview</option>
                  <option value="S1">Sandburg (N/S/W)</option>
                  <option value="S2">Sandburg (East)</option>
                </select>
              </div>
              <div className="filter-field">
                <label>Term</label>
                <select value={filterValues.term} onChange={e => handleFilterChange("term", e.target.value)}>
                  <option value="">Any</option>
                  <option value="F">Fall</option>
                  <option value="S">Spring</option>
                </select>
              </div>
              <div className="filter-field">
                <label>Room Type</label>
                <select value={filterValues.room_type} onChange={e => handleFilterChange("room_type", e.target.value)}>
                  <option value="">Any</option>
                  <option value="S">Single</option>
                  <option value="D">Double</option>
                  <option value="T">Triple</option>
                </select>
              </div>
              <div className="filter-field">
                <label>Standing</label>
                <select value={filterValues.standing} onChange={e => handleFilterChange("standing", e.target.value)}>
                  <option value="">Any</option>
                  <option value="FR">Freshman</option>
                  <option value="SO">Sophomore</option>
                  <option value="JR">Junior</option>
                  <option value="SR">Senior</option>
                </select>
              </div>
            </div>

            <div className="filter-section-title" style={{ marginTop: "1rem" }}>Preferences</div>
            <div className="filter-grid">
              {[
                { key: "noise_level", label: "Noise Level", options: ["Quiet", "Moderate", "Lively"] },
                { key: "cleanliness", label: "Cleanliness", options: ["Very Clean", "Moderate", "Relaxed"] },
                { key: "sleep_habits", label: "Sleep Habits", options: ["Early Bird", "Moderate", "Night Owl"] },
                { key: "social_level", label: "Social Level", options: ["Introvert", "Ambivert", "Extrovert"] },
                { key: "guest_policy", label: "Guests", options: ["Barely", "Occasionally", "Frequently"] },
                { key: "alcohol_policy", label: "Alcohol", options: ["Strictly Dry", "Occasionally", "Comfortable"] },
                { key: "shared_belongings", label: "Sharing", options: ["Keep Separate", "Ask First", "Share Everything"] },
              ].map(({ key, label, options }) => (
                <div className="filter-field" key={key}>
                  <label>{label}</label>
                  <select value={filterValues[key]} onChange={e => handleFilterChange(key, e.target.value)}>
                    <option value="">Any</option>
                    {options.map((opt, i) => (
                      <option key={i} value={i}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="filter-actions">
              <button className="filter-reset-btn" onClick={handleResetFilters}>Reset</button>
              <button className="filter-apply-btn" onClick={handleApplyFilters} disabled={filterLoading}>
                {filterLoading ? "Loading..." : "Apply"}
              </button>
            </div>
          </div>
        )}
      </div>

      {isSearching && !filtersActive && searching ? (
        <p className="matches-search-status">Searching...</p>
      ) : displayList.length === 0 ? (
        <div className="matches-empty">
          {filtersActive || isSearching ? (
            <>
              <h3>No results found</h3>
              <p>Try adjusting your filters or search query.</p>
            </>
          ) : (
            <>
              <h3>No matches found right now</h3>
              <p>Make sure your profile and preferences are complete, and check back as more users join.</p>
            </>
          )}
        </div>
      ) : (isSearching || filtersActive) ? (
        renderMatchList(pageList)
      ) : (
        <>
          {renderMatchList(pageList)}
          <div className="matches-pagination">
            <button className="matches-pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
              Previous
            </button>
            <span className="matches-pagination-label">Page {page + 1} of {totalPages}</span>
            <button className="matches-pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Matches;
