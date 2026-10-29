import React from "react";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import api from "./api";

const fallbackMovies = [
  {
    _id: "demo-1",
    title: "Midnight Run",
    genre: "Thriller",
    language: "English",
    durationMinutes: 128,
    rating: "U/A",
    description:
      "A tense night-time journey where every choice changes the story.",
    posterUrl: "",
  },
  {
    _id: "demo-2",
    title: "The Last Orbit",
    genre: "Sci-Fi",
    language: "English",
    durationMinutes: 116,
    rating: "U/A",
    description: "A crew races against time at the edge of the known universe.",
    posterUrl: "",
  },
  {
    _id: "demo-3",
    title: "Monsoon Letters",
    genre: "Drama",
    language: "Hindi",
    durationMinutes: 134,
    rating: "U",
    description: "A heartfelt story about home, memory, and second chances.",
    posterUrl: "",
  },
];

function Header({ user, logout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark topbar">
      <div className="container">
        <Link className="navbar-brand brand" to="/">
          i<span>MOVIES</span>
        </Link>
        <div className="d-flex align-items-center gap-3">
          <Link className="nav-link text-light" to="/">
            Explore
          </Link>
          {user && (
            <Link className="nav-link text-light" to="/bookings">
              My bookings
            </Link>
          )}
          {user ? (
            <>
              <span className="small text-secondary d-none d-md-inline">
                {user.name}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <Link className="btn btn-light btn-sm px-3" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function MovieCard({ movie }) {
  return (
    <div className="movie-card h-100">
      <div
        className="poster"
        style={
          movie.posterUrl
            ? {
                backgroundImage: `linear-gradient(180deg,transparent,#111827),url("${movie.posterUrl}")`,
              }
            : {}
        }
      >
        <span className="poster-label">{movie.genre || "Now showing"}</span>
        {!movie.posterUrl && <div className="poster-title">{movie.title}</div>}
      </div>
      <div className="p-3">
        <div className="d-flex justify-content-between gap-2 align-items-start">
          <h3>{movie.title}</h3>
          <span className="rating">{movie.rating || "U/A"}</span>
        </div>
        <p className="muted small mb-3">
          {movie.language || "Hindi"} · {movie.durationMinutes || 120} min
        </p>
        <p className="description">
          {movie.description || "Discover the story on the big screen."}
        </p>
        {movie._id.startsWith("demo-") ? (
          <button
            className="btn btn-primary w-100"
            disabled
            title="Connect MongoDB and add movies to enable booking"
          >
            Booking unavailable in preview
          </button>
        ) : (
          <Link className="btn btn-primary w-100" to={`/movie/${movie._id}`}>
            View showtimes
          </Link>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/movies")
      .then((r) => setMovies(r.data.movies))
      .catch(() => setMovies([]));
  }, []);
  const visible = (movies.length ? movies : fallbackMovies).filter((m) =>
    `${m.title} ${m.genre} ${m.language}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">YOUR SEAT. YOUR STORY.</span>
          <h1>
            Movie nights,
            <br />
            <em>made memorable.</em>
          </h1>
          <p>
            Find your next favourite film. Pick a showtime. Make it a night.
          </p>
          <a href="#movies" className="btn btn-primary btn-lg mt-2">
            Explore movies <span aria-hidden="true">↘</span>
          </a>
          <div className="hero-note">
            <span className="pulse-dot"></span> New stories are waiting on the
            big screen
          </div>
        </div>
      </section>
      <section className="container movie-section" id="movies">
        <div className="section-head">
          <div>
            <span className="eyebrow">NOW SHOWING</span>
            <h2>Find your film</h2>
          </div>
          <input
            className="form-control search-box"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, genre or language…"
            aria-label="Search movies"
          />
        </div>
        {error && <div className="alert alert-warning">{error}</div>}
        {!movies.length && (
          <p className="preview-note">
            Preview mode: sample cards are shown. Connect MongoDB and add movie
            records to load real listings and enable booking.
          </p>
        )}
        <div className="row g-4">
          {visible.map((m) => (
            <div className="col-sm-6 col-lg-4" key={m._id}>
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="muted py-5">
            No movies match that search. Try another title.
          </p>
        )}
      </section>
    </main>
  );
}

function Auth({ mode, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      localStorage.setItem("imovies_token", data.token);
      onLogin(data.user);
      nav("/");
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not connect to the server. Start the API and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <Link className="brand mb-4 d-inline-block" to="/">
          i<span>MOVIES</span>
        </Link>
        <span className="eyebrow">
          {mode === "login" ? "WELCOME BACK" : "START YOUR STORY"}
        </span>
        <h1>{mode === "login" ? "Sign in" : "Create your account"}</h1>
        <p className="muted">
          {mode === "login"
            ? "Your next movie night is one step away."
            : "A better movie night starts here."}
        </p>
        {mode === "register" && (
          <label className="form-label">
            Full name
            <input
              className="form-control"
              required
              minLength="2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
        )}
        <label className="form-label">
          Email address
          <input
            className="form-control"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="form-label">
          Password
          <input
            className="form-control"
            type="password"
            required
            minLength="8"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <small className="muted">Use at least 8 characters.</small>
        </label>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button className="btn btn-primary w-100 py-2" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
        <p className="muted small text-center mt-4">
          {mode === "login" ? "New to IMovies? " : "Already have an account? "}
          <Link to={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </form>
    </div>
  );
}

function MovieDetails({ user }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((r) => setMovie(r.data.movie))
      .catch((e) =>
        setError(e.response?.data?.message || "Unable to load movie."),
      );
    api
      .get(`/shows?movieId=${id}`)
      .then((r) => setShows(r.data.shows))
      .catch(() => setShows([]));
  }, [id]);
  async function book(showId) {
    if (!user) return nav("/login");
    const seats = window.prompt(
      "Enter seat IDs separated by commas (example: A1,A2):",
      "A1",
    );
    if (!seats) return;
    try {
      const r = await api.post("/bookings", {
        showId,
        seats: seats.split(",").map((s) => s.trim()),
      });
      window.alert(`Booking confirmed. Total: ₹${r.data.booking.totalAmount}`);
      nav("/bookings");
    } catch (e) {
      setError(e.response?.data?.message || "Booking failed.");
    }
  }
  if (!movie)
    return <div className="container py-5">{error || "Loading movie…"}</div>;
  return (
    <div className="container detail-wrap">
      <Link to="/" className="back-link">
        ← All movies
      </Link>
      <div className="detail-panel">
        <div
          className="detail-poster"
          style={
            movie.posterUrl
              ? { backgroundImage: `url("${movie.posterUrl}")` }
              : {}
          }
        ></div>
        <div className="detail-copy">
          <span className="eyebrow">
            {movie.genre} · {movie.language}
          </span>
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <p className="muted">
            {movie.durationMinutes} min · {movie.rating}
          </p>
          <h2 className="mt-4">Choose a showtime</h2>
          {error && <div className="alert alert-warning">{error}</div>}
          {shows.length ? (
            shows.map((s) => (
              <div className="show-row" key={s._id}>
                <div>
                  <strong>{s.theatreName}</strong>
                  <div className="muted small">
                    {s.city} · {new Date(s.startsAt).toLocaleString()}
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => book(s._id)}>
                  Book · ₹{s.price}
                </button>
              </div>
            ))
          ) : (
            <p className="muted">
              No upcoming showtimes have been added for this movie yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Bookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/bookings/my")
      .then((r) => setBookings(r.data.bookings))
      .catch((e) =>
        setError(e.response?.data?.message || "Unable to load bookings."),
      );
  }, []);
  if (!user)
    return (
      <div className="container py-5">
        Please <Link to="/login">sign in</Link> to view your bookings.
      </div>
    );
  return (
    <div className="container detail-wrap">
      <span className="eyebrow">YOUR TICKETS</span>
      <h1 className="page-title">My bookings</h1>
      {error && <div className="alert alert-warning">{error}</div>}
      {!bookings.length && !error && (
        <p className="muted">
          No bookings yet. Your next movie night starts in{" "}
          <Link to="/">Explore movies</Link>.
        </p>
      )}
      {bookings.map((b) => (
        <div className="booking-row" key={b._id}>
          <div>
            <strong>{b.show?.movie?.title || "Movie"}</strong>
            <div className="muted small">
              {b.show?.theatreName} · {b.show?.city}
            </div>
            <div className="muted small">
              {b.seats.join(", ")} ·{" "}
              {new Date(b.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-end">
            <strong>₹{b.totalAmount}</strong>
            <div>
              <span className="badge text-bg-success">{b.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("imovies_token"))
      api
        .get("/auth/me")
        .then((r) => setUser(r.data.user))
        .catch(() => localStorage.removeItem("imovies_token"))
        .finally(() => setReady(true));
    else setReady(true);
  }, []);
  function logout() {
    localStorage.removeItem("imovies_token");
    setUser(null);
  }
  if (!ready)
    return (
      <div className="loading">
        IMOVIES<span>.</span>
      </div>
    );
  return (
    <>
      <Header user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Auth mode="login" onLogin={setUser} />}
        />
        <Route
          path="/register"
          element={<Auth mode="register" onLogin={setUser} />}
        />
        <Route path="/movie/:id" element={<MovieDetails user={user} />} />
        <Route path="/bookings" element={<Bookings user={user} />} />
        <Route
          path="*"
          element={
            <div className="container py-5">
              <h1>Page not found</h1>
              <Link to="/">Return home</Link>
            </div>
          }
        />
      </Routes>
      <footer>
        <div className="container d-flex justify-content-between flex-wrap gap-2">
          <span className="brand">
            i<span>MOVIES</span>
          </span>
          <span>Made for the love of cinema.</span>
          <span>© {new Date().getFullYear()} IMovies</span>
        </div>
      </footer>
    </>
  );
}
