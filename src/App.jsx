
// APP.JSX — PART 1 OF 5
// Imports, brand settings, official social icons and shared components

import React, { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import "./App.css";

const BRAND = "ELITE ADVENTURES";
const SLOGAN = "Adventure Beyond Limits";

const LOGO = "assets/elite-adventures-logo.png";
const COVER = "assets/elite-adventures-cover.jpg";

const DEFAULT_SOCIALS = {
  facebook: "https://www.facebook.com/profile.php?id=61595176810539",
  tiktok: "https://vm.tiktok.com/ZS9yJYYksFK9P-UHc6F/",
  instagram:
    "https://www.instagram.com/elite1_adventures?xtok=NzNyMHhrenFqbWtu",
  x: "https://x.com/elite_adv254",
  youtube:
    "https://youtube.com/@elite-adventures?si=oY-rxMpJipUjyKT_"
};

const SOCIALS = [
  {
    key: "facebook",
    name: "Facebook",
    color: "#1877F2",
    url: DEFAULT_SOCIALS.facebook,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.7 0-4.5 1.6-4.5 4.6v2H6.8v3.2h2.9V21z"
        />
      </svg>
    )
  },
  {
    key: "tiktok",
    name: "TikTok",
    color: "#111111",
    url: DEFAULT_SOCIALS.tiktok,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.6 7.1a6.8 6.8 0 0 1-4.2-1.5v8.1a6.1 6.1 0 1 1-5.3-6.1v3.4a2.8 2.8 0 1 0 1.9 2.7V2h3.4a6.8 6.8 0 0 0 4.2 3.3z"
        />
      </svg>
    )
  },
  {
    key: "instagram",
    name: "Instagram",
    color: "#E1306C",
    url: DEFAULT_SOCIALS.instagram,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <circle
          cx="12"
          cy="12"
          r="4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <circle cx="17.6" cy="6.7" r="1.3" fill="currentColor" />
      </svg>
    )
  },
  {
    key: "x",
    name: "X",
    color: "#111111",
    url: DEFAULT_SOCIALS.x,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.9 3H22l-6.8 7.8L23.2 21h-6.3l-5-6.6L6.1 21H3l7.3-8.4L2.8 3h6.5l4.5 6.1zM17.8 19h1.7L8.3 4.9H6.5z"
        />
      </svg>
    )
  },
  {
    key: "youtube",
    name: "YouTube",
    color: "#FF0000",
    url: DEFAULT_SOCIALS.youtube,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M23.2 6.2a3 3 0 0 0-2.1-2.1C19.2 3.6 12 3.6 12 3.6s-7.2 0-9.1.5A3 3 0 0 0 .8 6.2 31 31 0 0 0 .3 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.1.5 9.1.5s7.2 0 9.1-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-5.8 31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6z"
        />
      </svg>
    )
  }
];

const CATEGORIES = [
  "Mountains",
  "Beaches",
  "Hiking",
  "Camping",
  "Water Sports",
  "Wildlife",
  "Other"
];

const TRIP_TAGS = ["New", "Hot", "Few Slots", "Sold Out"];

const PAYMENT_METHODS = [
  { value: "till", label: "Lipa na M-PESA Till" },
  { value: "paybill", label: "Lipa na M-PESA Paybill" },
  { value: "pochi", label: "Pochi la Biashara" }
];

const emptyTrip = {
  title: "",
  destination: "",
  trip_date: "",
  meeting_point: "",
  meeting_time: "",
  price: "",
  activities: "",
  description: "",
  tag: "New",
  poster_url: "",
  cover_url: "",
  destination_photos: [],
  payment_method: "till",
  payment_name: "",
  till_number: "",
  paybill_number: "",
  account_number: "",
  pochi_number: "",
  payment_instructions: ""
};

function formatPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return "Price available on request";
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(amount);
}

function SocialLinks({ links = DEFAULT_SOCIALS, compact = false }) {
  return (
    <div
      className={`ea-social-links ${
        compact ? "ea-social-links-compact" : ""
      }`}
      aria-label="Social media links"
    >
      {SOCIALS.map((social) => {
        const href = links?.[social.key] || social.url;

        return (
          <a
            key={social.key}
            href={href}
            className={`ea-social-link ea-social-${social.key}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit Elite Adventures on ${social.name}`}
            title={social.name}
            style={{ "--social-color": social.color }}
          >
            <span className="ea-social-icon">{social.icon}</span>
            {!compact && <span>{social.name}</span>}
          </a>
        );
      })}
    </div>
  );
}

function BrandLogo({ className = "", showName = false }) {
  return (
    <a
      href="#home"
      className={`ea-brand ${className}`}
      aria-label="Elite Adventures home"
    >
      <img src={LOGO} alt="Elite Adventures logo" />
      {showName && (
        <span className="ea-brand-copy">
          <strong>{BRAND}</strong>
          <small>{SLOGAN}</small>
        </span>
      )}
    </a>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  light = false
}) {
  return (
    <div
      className={`ea-section-title ${
        light ? "ea-section-title-light" : ""
      }`}
    >
      {eyebrow && <span className="ea-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="ea-empty-state">
      <span className="ea-empty-icon" aria-hidden="true">
        ⛰
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
    }
// APP.JSX — PART 2 OF 5
// Main app state, Supabase loading, authentication and admin access

export default function App() {
  const [page, setPage] = useState("Home");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [trips, setTrips] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIALS);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  const [tripSearch, setTripSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripForm, setTripForm] = useState(emptyTrip);
  const [editingTrip, setEditingTrip] = useState(null);

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    active: true
  });

  const [socialForm, setSocialForm] = useState(DEFAULT_SOCIALS);

  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    full_name: ""
  });

  const [authMode, setAuthMode] = useState("signin");

  const [bookingForm, setBookingForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    people: 1,
    message: ""
  });

  const [anonymousMessage, setAnonymousMessage] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [settings, setSettings] = useState({});

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (!mounted) return;

        const currentUser = session?.user || null;
        setUser(currentUser);

        await loadPublicData();

        if (currentUser) {
          await checkAdmin(currentUser);
        }
      } catch (error) {
        console.error("App initialization failed:", error);
        if (mounted) {
          setNotice(error.message || "Unable to load the application.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initialize();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        setTimeout(() => {
          checkAdmin(currentUser);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadPublicData() {
    try {
      const [
        tripsResult,
        announcementsResult,
        galleryResult,
        settingsResult
      ] = await Promise.all([
        supabase.from("trips").select("*").order("created_at", {
          ascending: false
        }),
        supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("settings").select("*")
      ]);

      if (tripsResult.error) throw tripsResult.error;
      if (announcementsResult.error) throw announcementsResult.error;
      if (galleryResult.error) throw galleryResult.error;

      setTrips(tripsResult.data || []);
      setAnnouncements(announcementsResult.data || []);
      setGallery(galleryResult.data || []);

      const settingsRows = settingsResult.data || [];
      const nextSettings = {};

      settingsRows.forEach((row) => {
        if (row.key) nextSettings[row.key] = row.value;
      });

      setSettings(nextSettings);

      const savedSocials =
        nextSettings.social_links &&
        typeof nextSettings.social_links === "object"
          ? nextSettings.social_links
          : DEFAULT_SOCIALS;

      setSocialLinks({
        ...DEFAULT_SOCIALS,
        ...savedSocials
      });

      setSocialForm({
        ...DEFAULT_SOCIALS,
        ...savedSocials
      });
    } catch (error) {
      console.error("Unable to load public data:", error);
      setNotice(error.message || "Unable to load trips and updates.");
    }
  }

  async function checkAdmin(currentUser = user) {
    if (!currentUser) {
      setIsAdmin(false);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (error) throw error;

      const allowed = Boolean(data);
      setIsAdmin(allowed);
      return allowed;
    } catch (error) {
      console.error("Admin verification failed:", error);
      setIsAdmin(false);
      return false;
    }
  }

  async function signIn(event) {
    event?.preventDefault();

    setNotice("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authForm.email.trim(),
        password: authForm.password
      });

      if (error) throw error;

      setUser(data.user);
      await checkAdmin(data.user);
      setNotice("Signed in successfully.");
      setPage("Home");
    } catch (error) {
      setNotice(error.message || "Sign-in failed.");
    }
  }

  async function signUp(event) {
    event?.preventDefault();

    setNotice("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: authForm.email.trim(),
        password: authForm.password,
        options: {
          data: {
            full_name: authForm.full_name.trim()
          }
        }
      });

      if (error) throw error;

      if (data.user) setUser(data.user);

      setNotice(
        data.session
          ? "Account created successfully."
          : "Account created. Check your email if confirmation is required."
      );
    } catch (error) {
      setNotice(error.message || "Account creation failed.");
    }
  }

  async function signInWithGoogle() {
    setNotice("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });

      if (error) throw error;
    } catch (error) {
      setNotice(error.message || "Google sign-in failed.");
    }
  }

  async function requestPhoneLogin() {
    setNotice(
      "Phone login must be configured in your Supabase Authentication settings before it can be used."
    );
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setIsAdmin(false);
      setBookings([]);
      setMessages([]);
      setPage("Home");
      setNotice("You have signed out.");
    } catch (error) {
      setNotice(error.message || "Unable to sign out.");
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const searchText = tripSearch.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      [
        trip.title,
        trip.destination,
        trip.description,
        trip.activities,
        trip.meeting_point
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchText));

    const matchesCategory =
      category === "All" ||
      trip.category === category ||
      trip.destination_type === category;

    return matchesSearch && matchesCategory;
  });

  function renderHeader() {
    return (
      <header className="ea-header">
        <div className="ea-header-inner">
          <BrandLogo showName />

          <div className="ea-header-socials">
            <SocialLinks links={socialLinks} compact />
          </div>

          <div className="ea-header-actions">
            {user ? (
              <>
                {isAdmin && (
                  <button
                    className="ea-button ea-button-outline"
                    onClick={() => setPage("Admin")}
                  >
                    Admin
                  </button>
                )}
                <button
                  className="ea-button ea-button-outline"
                  onClick={signOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                className="ea-button ea-button-primary"
                onClick={() => setPage("Login")}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  function renderNavigation() {
    const pages = [
      "Home",
      "Explore",
      "Gallery",
      "Announcements",
      "Socials",
      "Contact"
    ];

    if (user) pages.push("Bookings");
    if (isAdmin) pages.push("Admin");

    return (
      <nav className="ea-navigation" aria-label="Main navigation">
        {pages.map((item) => (
          <button
            key={item}
            className={`ea-nav-item ${
              page === item ? "ea-nav-item-active" : ""
            }`}
            onClick={() => {
              setPage(item);
              setSelectedTrip(null);
              setNotice("");
            }}
          >
            {item}
          </button>
        ))}
      </nav>
    );
  }

  function renderMenu() {
    return (
      <div className="ea-page-top">
        <BrandLogo />
        <SocialLinks links={socialLinks} compact />
      </div>
    );
        }// APP.JSX — PART 3 OF 5
// Home, Explore, trip cards, trip details and booking

  function renderHome() {
    return (
      <main className="ea-home">
        <section
          className="ea-hero"
          id="home"
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(4,24,20,.84), rgba(4,24,20,.32)), url("${COVER}")`
          }}
        >
          <div className="ea-hero-content">
            <BrandLogo className="ea-hero-logo" />
            <span className="ea-eyebrow">YOUR NEXT ADVENTURE STARTS HERE</span>
            <h1>
              Adventure
              <br />
              <span>Beyond Limits</span>
            </h1>
            <p>
              Discover breathtaking landscapes, explore wild trails and make
              every journey unforgettable.
            </p>
            <div className="ea-hero-actions">
              <button
                className="ea-button ea-button-primary"
                onClick={() => setPage("Explore")}
              >
                Explore trips
              </button>
              <button
                className="ea-button ea-button-glass"
                onClick={() => setPage("Gallery")}
              >
                View gallery
              </button>
            </div>
            <SocialLinks links={socialLinks} compact />
          </div>
          <div className="ea-hero-caption">
            <span>DISCOVER MORE</span>
            <span aria-hidden="true">↓</span>
          </div>
        </section>

        <section className="ea-section ea-featured">
          <SectionTitle
            eyebrow="FIND YOUR NEXT ESCAPE"
            title="Journeys worth remembering"
            description="From mountain trails to peaceful getaways, your next experience awaits."
          />

          {trips.length ? (
            <div className="ea-trip-grid">
              {trips.slice(0, 3).map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => {
                    setSelectedTrip(trip);
                    setPage("Explore");
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Your next adventure is coming"
              message="New trips will appear here as soon as they are published."
            />
          )}

          <div className="ea-center-action">
            <button
              className="ea-button ea-button-primary"
              onClick={() => setPage("Explore")}
            >
              View all trips
            </button>
          </div>
        </section>

        <section className="ea-section ea-nature-section">
          <div className="ea-nature-copy">
            <span className="ea-eyebrow">OUTDOORS. FREEDOM. DISCOVERY.</span>
            <h2>Leave the ordinary behind.</h2>
            <p>
              Find fresh air, new places and memorable experiences with
              adventures designed to bring you closer to nature.
            </p>
            <button
              className="ea-button ea-button-light"
              onClick={() => setPage("Explore")}
            >
              Find an adventure
            </button>
          </div>
        </section>

        <section className="ea-section ea-announcement-preview">
          <SectionTitle
            eyebrow="STAY IN THE LOOP"
            title="Latest updates"
            description="Keep up with new trips, announcements and travel news."
          />

          {announcements.filter((item) => item.active !== false).length ? (
            <div className="ea-announcement-grid">
              {announcements
                .filter((item) => item.active !== false)
                .slice(0, 3)
                .map((item) => (
                  <article className="ea-announcement-card" key={item.id}>
                    <span className="ea-announcement-label">UPDATE</span>
                    <h3>{item.title}</h3>
                    <p>{item.message}</p>
                  </article>
                ))}
            </div>
          ) : (
            <EmptyState
              title="No new announcements"
              message="Check back for upcoming adventures and updates."
            />
          )}

          <div className="ea-center-action">
            <button
              className="ea-button ea-button-outline"
              onClick={() => setPage("Announcements")}
            >
              All announcements
            </button>
          </div>
        </section>
      </main>
    );
  }

  function renderExplore() {
    if (selectedTrip) {
      return renderTripDetails();
    }

    return (
      <main className="ea-page ea-explore-page">
        <div className="ea-page-banner">
          <BrandLogo />
          <SocialLinks links={socialLinks} compact />
          <div className="ea-page-banner-copy">
            <span className="ea-eyebrow">GO BEYOND THE ORDINARY</span>
            <h1>Explore adventures</h1>
            <p>Mountains, trails, escapes and unforgettable destinations.</p>
          </div>
        </div>

        <section className="ea-section">
          <div className="ea-explore-toolbar">
            <input
              type="search"
              value={tripSearch}
              onChange={(event) => setTripSearch(event.target.value)}
              placeholder="Search destinations or trips..."
              aria-label="Search trips"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter trips by category"
            >
              <option value="All">All adventures</option>
              {CATEGORIES.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="ea-results-count">
            {filteredTrips.length}{" "}
            {filteredTrips.length === 1 ? "adventure" : "adventures"} found
          </div>

          {filteredTrips.length ? (
            <div className="ea-trip-grid">
              {filteredTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => setSelectedTrip(trip)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No trips found"
              message="Try another search or category. New adventures may be added soon."
            />
          )}
        </section>
      </main>
    );
  }

  function renderTripDetails() {
    const trip = selectedTrip;

    if (!trip) return renderExplore();

    const photo =
      trip.cover_url ||
      trip.poster_url ||
      (Array.isArray(trip.destination_photos)
        ? trip.destination_photos[0]
        : "") ||
      COVER;

    return (
      <main className="ea-page ea-trip-details-page">
        <div className="ea-page-top">
          <BrandLogo />
          <SocialLinks links={socialLinks} compact />
        </div>

        <button
          className="ea-back-button"
          onClick={() => setSelectedTrip(null)}
        >
          ← Back to trips
        </button>

        <section className="ea-trip-detail-hero">
          <img src={photo} alt={trip.destination || trip.title} />
          <div className="ea-trip-detail-overlay">
            <span className="ea-trip-tag">{trip.tag || "Adventure"}</span>
            <h1>{trip.title}</h1>
            <p>{trip.destination}</p>
            <strong>{formatPrice(trip.price)}</strong>
          </div>
        </section>

        <section className="ea-section ea-trip-detail-content">
          <div className="ea-trip-detail-main">
            <SectionTitle
              eyebrow="YOUR ADVENTURE"
              title="Trip overview"
            />

            <p className="ea-trip-description">
              {trip.description ||
                "Get ready to discover this destination with Elite Adventures."}
            </p>

            {trip.activities && (
              <div className="ea-detail-block">
                <h3>Activities</h3>
                <p>{trip.activities}</p>
              </div>
            )}

            <div className="ea-trip-info-grid">
              <Detail label="Destination" value={trip.destination} />
              <Detail label="Trip date" value={trip.trip_date} />
              <Detail label="Meeting point" value={trip.meeting_point} />
              <Detail label="Meeting time" value={trip.meeting_time} />
            </div>

            {Array.isArray(trip.destination_photos) &&
              trip.destination_photos.length > 0 && (
                <div className="ea-destination-photos">
                  <h3>Destination photos</h3>
                  <div className="ea-photo-grid">
                    {trip.destination_photos.map((url, index) => (
                      <img
                        key={`${url}-${index}`}
                        src={url}
                        alt={`${trip.destination || trip.title} view ${index + 1}`}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>

          <aside className="ea-booking-panel">
            <span className="ea-eyebrow">RESERVE YOUR SPOT</span>
            <h2>{formatPrice(trip.price)}</h2>
            <p>Complete the form to request your booking.</p>

            <form
              className="ea-form"
              onSubmit={(event) => submitBooking(event, trip)}
            >
              <label>
                Full name
                <input
                  required
                  value={bookingForm.full_name}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      full_name: event.target.value
                    })
                  }
                  placeholder="Enter your full name"
                />
              </label>

              <label>
                Phone number
                <input
                  required
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      phone: event.target.value
                    })
                  }
                  placeholder="07XX XXX XXX"
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={bookingForm.email}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      email: event.target.value
                    })
                  }
                  placeholder="Optional email"
                />
              </label>

              <label>
                Number of people
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={bookingForm.people}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      people: Math.max(1, Number(event.target.value) || 1)
                    })
                  }
                />
              </label>

              <label>
                Additional message
                <textarea
                  value={bookingForm.message}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      message: event.target.value
                    })
                  }
                  placeholder="Anything we should know?"
                  rows="3"
                />
              </label>

              <button className="ea-button ea-button-primary" type="submit">
                Request booking
              </button>
            </form>

            <PaymentInstructions
              trip={trip}
              paymentName={trip.payment_name || BRAND}
            />
          </aside>
        </section>
      </main>
    );
          }
  // APP.JSX — PART 4 OF 5
// Gallery, announcements, socials, contact, bookings and admin actions

  function renderGallery() {
    return (
      <main className="ea-page">
        <div className="ea-page-banner ea-gallery-banner">
          <BrandLogo />
          <SocialLinks links={socialLinks} compact />
          <div className="ea-page-banner-copy">
            <span className="ea-eyebrow">MOMENTS IN THE WILD</span>
            <h1>Adventure gallery</h1>
            <p>Discover beautiful places and outdoor experiences.</p>
          </div>
        </div>

        <section className="ea-section">
          {gallery.length ? (
            <div className="ea-gallery-grid">
              {gallery.map((item) => (
                <article className="ea-gallery-card" key={item.id}>
                  <img
                    src={item.image_url || item.url}
                    alt={item.title || "Elite Adventures gallery"}
                    loading="lazy"
                  />
                  <div className="ea-gallery-caption">
                    <h3>{item.title || "Adventure moments"}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  {isAdmin && (
                    <button
                      className="ea-button ea-button-danger"
                      onClick={() => deleteGalleryItem(item)}
                    >
                      Delete
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="The gallery is getting ready"
              message="Adventure photographs will appear here when they are published."
            />
          )}
        </section>
      </main>
    );
  }

  function renderAnnouncements() {
    const visibleAnnouncements = announcements.filter(
      (item) => isAdmin || item.active !== false
    );

    return (
      <main className="ea-page">
        <div className="ea-page-banner">
          <BrandLogo />
          <SocialLinks links={socialLinks} compact />
          <div className="ea-page-banner-copy">
            <span className="ea-eyebrow">WHAT'S HAPPENING</span>
            <h1>Announcements</h1>
            <p>Stay informed about new trips and important updates.</p>
          </div>
        </div>

        <section className="ea-section">
          {visibleAnnouncements.length ? (
            <div className="ea-announcement-grid">
              {visibleAnnouncements.map((item) => (
                <article className="ea-announcement-card" key={item.id}>
                  <span className="ea-announcement-label">UPDATE</span>
                  <h3>{item.title}</h3>
                  <p>{item.message}</p>
                  {isAdmin && (
                    <div className="ea-card-actions">
                      <button
                        className="ea-button ea-button-danger"
                        onClick={() => deleteAnnouncement(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No announcements yet"
              message="New announcements will be shared here."
            />
          )}
        </section>
      </main>
    );
  }

  function renderSocials() {
    return (
      <main className="ea-page ea-socials-page">
        <div className="ea-page-banner">
          <BrandLogo />
          <SocialLinks links={socialLinks} compact />
          <div className="ea-page-banner-copy">
            <span className="ea-eyebrow">LET'S STAY CONNECTED</span>
            <h1>Follow the adventure</h1>
            <p>
              Follow Elite Adventures for trip announcements, destinations and
              new experiences.
            </p>
          </div>
        </div>

        <section className="ea-section">
          <div className="ea-socials-grid">
            {SOCIALS.map((social) => (
              <a
                key={social.key}
                href={socialLinks?.[social.key] || social.url}
                className="ea-social-platform-card"
                target="_blank"
                rel="noopener noreferrer"
                style={{ "--social-color": social.color }}
              >
                <span className="ea-social-platform-icon">
                  {social.icon}
                </span>
                <span className="ea-social-platform-name">
                  {social.name}
                </span>
                <span className="ea-social-platform-action">
                  Visit profile ↗
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>
    );
  }

  function renderContact() {
    return (
      <main className="ea-page">
        <div className="ea-page-banner">
          <BrandLogo />
          <SocialLinks links={socialLinks} compact />
          <div className="ea-page-banner-copy">
            <span className="ea-eyebrow">WE'D LOVE TO HEAR FROM YOU</span>
            <h1>Contact us</h1>
            <p>Have a question about a trip? Send us a message.</p>
          </div>
        </div>

        <section className="ea-section ea-contact-layout">
          <div className="ea-contact-copy">
            <SectionTitle
              eyebrow="GET IN TOUCH"
              title="Let's plan your next adventure"
              description="Send us your question or enquiry using the form."
            />
            <SocialLinks links={socialLinks} />
          </div>

          <form
            className="ea-form ea-contact-form"
            onSubmit={sendAnonymousMessage}
          >
            <label>
              Name (optional)
              <input
                value={anonymousMessage.name}
                onChange={(event) =>
                  setAnonymousMessage({
                    ...anonymousMessage,
                    name: event.target.value
                  })
                }
                placeholder="Your name"
              />
            </label>

            <label>
              Email (optional)
              <input
                type="email"
                value={anonymousMessage.email}
                onChange={(event) =>
                  setAnonymousMessage({
                    ...anonymousMessage,
                    email: event.target.value
                  })
                }
                placeholder="Your email"
              />
            </label>

            <label>
              Your message
              <textarea
                required
                minLength={2}
                maxLength={2000}
                value={anonymousMessage.message}
                onChange={(event) =>
                  setAnonymousMessage({
                    ...anonymousMessage,
                    message: event.target.value
                  })
                }
                placeholder="Write your question or enquiry..."
                rows="6"
              />
            </label>

            <button className="ea-button ea-button-primary" type="submit">
              Send message
            </button>
          </form>
        </section>
      </main>
    );
  }

  function renderBookings() {
    return (
      <main className="ea-page">
        <div className="ea-page-top">
          <BrandLogo />
          <SocialLinks links={socialLinks} compact />
        </div>

        <section className="ea-section">
          <SectionTitle
            eyebrow="YOUR TRAVEL PLANS"
            title="My bookings"
            description="Your booking history will appear here."
          />

          {!user ? (
            <AuthPrompt onLogin={() => setPage("Login")} />
          ) : bookings.length ? (
            <div className="ea-bookings-list">
              {bookings.map((booking) => (
                <article className="ea-booking-card" key={booking.id}>
                  <div>
                    <h3>
                      {booking.trip_title ||
                        booking.trips?.title ||
                        "Adventure booking"}
                    </h3>
                    <p>
                      Booking reference: {booking.id}
                    </p>
                    <p>Guests: {booking.people || 1}</p>
                    <p>Status: {booking.status || "Pending"}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No bookings to display"
              message="Once your bookings are available, they will show up here."
            />
          )}
        </section>
      </main>
    );
  }

  async function saveTrip(event) {
    event.preventDefault();
    setNotice("");

    if (!isAdmin) {
      setNotice("Only an administrator can manage trips.");
      return;
    }

    try {
      const payload = {
        ...tripForm,
        price: Number(tripForm.price) || 0,
        destination_photos: Array.isArray(tripForm.destination_photos)
          ? tripForm.destination_photos
          : [],
        updated_at: new Date().toISOString()
      };

      let result;

      if (editingTrip) {
        result = await supabase
          .from("trips")
          .update(payload)
          .eq("id", editingTrip)
          .select()
          .single();
      } else {
        result = await supabase
          .from("trips")
          .insert([payload])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setNotice(editingTrip ? "Trip updated." : "Trip published.");
      setTripForm(emptyTrip);
      setEditingTrip(null);
      await loadPublicData();
    } catch (error) {
      setNotice(error.message || "Unable to save the trip.");
    }
  }

  async function deleteTrip(id) {
    if (!isAdmin) {
      setNotice("Only an administrator can delete trips.");
      return;
    }

    if (!window.confirm("Delete this trip? This cannot be undone.")) return;

    try {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;

      setNotice("Trip deleted.");
      setSelectedTrip(null);
      await loadPublicData();
    } catch (error) {
      setNotice(error.message || "Unable to delete the trip.");
    }
  }

  function editTrip(trip) {
    setEditingTrip(trip.id);
    setTripForm({
      ...emptyTrip,
      ...trip,
      destination_photos: Array.isArray(trip.destination_photos)
        ? trip.destination_photos
        : []
    });
    setPage("Admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAnnouncement(event) {
    event.preventDefault();

    if (!isAdmin) {
      setNotice("Only an administrator can publish announcements.");
      return;
    }

    try {
      const { error } = await supabase.from("announcements").insert([
        {
          title: announcementForm.title,
          message: announcementForm.message,
          active: announcementForm.active
        }
      ]);

      if (error) throw error;

      setAnnouncementForm({
        title: "",
        message: "",
        active: true
      });

      setNotice("Announcement published.");
      await loadPublicData();
    } catch (error) {
      setNotice(error.message || "Unable to publish announcement.");
    }
  }

  async function deleteAnnouncement(id) {
    if (!isAdmin) {
      setNotice("Only an administrator can delete announcements.");
      return;
    }

    if (!window.confirm("Delete this announcement?")) return;

    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNotice("Announcement deleted.");
      await loadPublicData();
    } catch (error) {
      setNotice(error.message || "Unable to delete announcement.");
    }
  }

  async function saveSocialLinks(event) {
    event.preventDefault();

    if (!isAdmin) {
      setNotice("Only an administrator can edit social links.");
      return;
    }

    try {
      const { error } = await supabase.from("settings").upsert(
        {
          key: "social_links",
          value: socialForm
        },
        { onConflict: "key" }
      );

      if (error) throw error;

      setSocialLinks({
        ...DEFAULT_SOCIALS,
        ...socialForm
      });

      setNotice("Social links updated.");
      await loadPublicData();
    } catch (error) {
      setNotice(error.message || "Unable to update social links.");
    }
  }

  async function uploadFile(file, bucket = "gallery") {
    if (!file) return null;

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `${Date.now()}-${safeName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  }

  async function handleTripImage(event, field) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, "gallery");

      setTripForm((previous) => ({
        ...previous,
        [field]: url
      }));

      setNotice("Image uploaded.");
    } catch (error) {
      setNotice(error.message || "Unable to upload image.");
    }
  }

  async function publishGalleryFile(event) {
    event.preventDefault();

    if (!isAdmin) {
      setNotice("Only an administrator can publish gallery photos.");
      return;
    }

    const form = event.currentTarget;
    const file = form.elements.galleryFile?.files?.[0];
    const title = form.elements.galleryTitle?.value?.trim() || "";
    const description =
      form.elements.galleryDescription?.value?.trim() || "";

    if (!file) {
      setNotice("Choose a photo first.");
      return;
    }

    try {
      const imageUrl = await uploadFile(file, "gallery");

      const { error } = await supabase.from("gallery").insert([
        {
          title,
          description,
          image_url: imageUrl
        }
      ]);

      if (error) throw error;

      form.reset();
      setNotice("Gallery photo published.");
      await loadPublicData();
    } catch (error) {
      setNotice(error.message || "Unable to publish gallery photo.");
    }
  }

  async function deleteGalleryItem(item) {
    if (!isAdmin) {
      setNotice("Only an administrator can delete gallery photos.");
      return;
    }

    if (!window.confirm("Delete this gallery item?")) return;

    try {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      setNotice("Gallery item deleted.");
      await loadPublicData();
    } catch (error) {
      setNotice(error.message || "Unable to delete gallery item.");
    }
  }

  async function submitBooking(event, trip) {
    event.preventDefault();
    setNotice("");

    if (!user) {
      setNotice("Please sign in before requesting a booking.");
      setPage("Login");
      return;
    }

    try {
      const { error } = await supabase.from("bookings").insert([
        {
          user_id: user.id,
          trip_id: trip.id,
          trip_title: trip.title,
          full_name: bookingForm.full_name.trim(),
          phone: bookingForm.phone.trim(),
          email: bookingForm.email.trim(),
          people: Number(bookingForm.people) || 1,
          message: bookingForm.message.trim(),
          status: "Pending"
        }
      ]);

      if (error) throw error;

      setNotice("Booking request submitted successfully.");
      setBookingForm({
        full_name: "",
        phone: "",
        email: "",
        people: 1,
        message: ""
      });

      await loadAdminData();
    } catch (error) {
      setNotice(error.message || "Unable to submit booking.");
    }
  }

  async function sendAnonymousMessage(event) {
    event.preventDefault();
    setNotice("");

    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: anonymousMessage.name.trim() || null,
          email: anonymousMessage.email.trim() || null,
          message: anonymousMessage.message.trim()
        }
      ]);

      if (error) throw error;

      setAnonymousMessage({
        name: "",
        email: "",
        message: ""
      });

      setNotice("Your message has been sent.");
    } catch (error) {
      setNotice(error.message || "Unable to send your message.");
    }
  }

  async function loadAdminData() {
    if (!user || !isAdmin) return;

    try {
      const [bookingResult, messageResult] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })
      ]);

      if (bookingResult.error) throw bookingResult.error;
      if (messageResult.error) throw messageResult.error;

      setBookings(bookingResult.data || []);
      setMessages(messageResult.data || []);
    } catch (error) {
      setNotice(error.message || "Unable to load admin data.");
    }
}
  // APP.JSX — PART 5 OF 5
// Admin dashboard, page rendering and reusable UI components

  function renderAdmin() {
    if (!user) {
      return <AuthPrompt onLogin={() => setPage("Login")} />;
    }

    if (!isAdmin) {
      return (
        <main className="ea-page">
          <section className="ea-section">
            <BrandLogo />
            <EmptyState
              title="Administrator access required"
              message="Sign in with an account authorised to manage this website."
            />
          </section>
        </main>
      );
    }

    return (
      <main className="ea-page ea-admin-page">
        <div className="ea-page-banner">
          <BrandLogo />
          <SocialLinks links={socialLinks} compact />
          <div className="ea-page-banner-copy">
            <span className="ea-eyebrow">CONTROL CENTRE</span>
            <h1>Admin dashboard</h1>
            <p>Manage trips, announcements, gallery photos and social links.</p>
          </div>
        </div>

        <section className="ea-section">
          <div className="ea-admin-shortcuts">
            <Stat label="Trips" value={trips.length} />
            <Stat label="Announcements" value={announcements.length} />
            <Stat label="Gallery photos" value={gallery.length} />
            <Stat label="Bookings loaded" value={bookings.length} />
          </div>

          <div className="ea-admin-panel">
            <SectionTitle
              eyebrow="TRIP MANAGEMENT"
              title={editingTrip ? "Edit trip" : "Publish a trip"}
            />

            <form className="ea-form ea-admin-form" onSubmit={saveTrip}>
              <label>
                Trip title
                <input
                  required
                  value={tripForm.title}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      title: event.target.value
                    })
                  }
                  placeholder="e.g. Mountain hiking adventure"
                />
              </label>

              <label>
                Destination
                <input
                  required
                  value={tripForm.destination}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      destination: event.target.value
                    })
                  }
                  placeholder="Destination"
                />
              </label>

              <label>
                Category
                <select
                  value={tripForm.category || "Other"}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      category: event.target.value
                    })
                  }
                >
                  {CATEGORIES.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Trip date
                <input
                  type="date"
                  value={tripForm.trip_date || ""}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      trip_date: event.target.value
                    })
                  }
                />
              </label>

              <label>
                Price (KES)
                <input
                  type="number"
                  min="0"
                  required
                  value={tripForm.price}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      price: event.target.value
                    })
                  }
                  placeholder="Price per person"
                />
              </label>

              <label>
                Meeting point
                <input
                  value={tripForm.meeting_point}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      meeting_point: event.target.value
                    })
                  }
                  placeholder="Meeting location"
                />
              </label>

              <label>
                Meeting time
                <input
                  type="time"
                  value={tripForm.meeting_time || ""}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      meeting_time: event.target.value
                    })
                  }
                />
              </label>

              <label>
                Trip tag
                <select
                  value={tripForm.tag || "New"}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      tag: event.target.value
                    })
                  }
                >
                  {TRIP_TAGS.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ea-field-full">
                Description
                <textarea
                  value={tripForm.description}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      description: event.target.value
                    })
                  }
                  rows="4"
                  placeholder="Describe this adventure..."
                />
              </label>

              <label className="ea-field-full">
                Activities
                <textarea
                  value={tripForm.activities}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      activities: event.target.value
                    })
                  }
                  rows="3"
                  placeholder="List the activities included..."
                />
              </label>

              <label>
                Cover image URL
                <input
                  value={tripForm.cover_url || ""}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      cover_url: event.target.value
                    })
                  }
                  placeholder="https://..."
                />
              </label>

              <label>
                Upload cover image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleTripImage(event, "cover_url")
                  }
                />
              </label>

              <label>
                Poster image URL
                <input
                  value={tripForm.poster_url || ""}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      poster_url: event.target.value
                    })
                  }
                  placeholder="https://..."
                />
              </label>

              <label>
                Upload poster image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleTripImage(event, "poster_url")
                  }
                />
              </label>

              <label>
                Payment method
                <select
                  value={tripForm.payment_method || "till"}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      payment_method: event.target.value
                    })
                  }
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option value={method.value} key={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Recipient/business name
                <input
                  value={tripForm.payment_name || ""}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      payment_name: event.target.value
                    })
                  }
                  placeholder="M-PESA recipient name"
                />
              </label>

              {tripForm.payment_method === "till" && (
                <label>
                  Till number
                  <input
                    value={tripForm.till_number || ""}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        till_number: event.target.value
                      })
                    }
                  />
                </label>
              )}

              {tripForm.payment_method === "paybill" && (
                <>
                  <label>
                    Paybill number
                    <input
                      value={tripForm.paybill_number || ""}
                      onChange={(event) =>
                        setTripForm({
                          ...tripForm,
                          paybill_number: event.target.value
                        })
                      }
                    />
                  </label>

                  <label>
                    Account number
                    <input
                      value={tripForm.account_number || ""}
                      onChange={(event) =>
                        setTripForm({
                          ...tripForm,
                          account_number: event.target.value
                        })
                      }
                    />
                  </label>
                </>
              )}

              {tripForm.payment_method === "pochi" && (
                <label>
                  Pochi la Biashara number
                  <input
                    value={tripForm.pochi_number || ""}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        pochi_number: event.target.value
                      })
                    }
                  />
                </label>
              )}

              <label className="ea-field-full">
                Extra payment instructions
                <textarea
                  value={tripForm.payment_instructions || ""}
                  onChange={(event) =>
                    setTripForm({
                      ...tripForm,
                      payment_instructions: event.target.value
                    })
                  }
                  rows="3"
                  placeholder="Optional payment details..."
                />
              </label>

              <div className="ea-form-actions ea-field-full">
                <button
                  className="ea-button ea-button-primary"
                  type="submit"
                >
                  {editingTrip ? "Save trip changes" : "Publish trip"}
                </button>

                {editingTrip && (
                  <button
                    className="ea-button ea-button-outline"
                    type="button"
                    onClick={() => {
                      setEditingTrip(null);
                      setTripForm(emptyTrip);
                    }}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="ea-admin-panel">
            <SectionTitle title="Manage existing trips" />

            {trips.length ? (
              <div className="ea-admin-list">
                {trips.map((trip) => (
                  <article className="ea-admin-list-item" key={trip.id}>
                    <div>
                      <h3>{trip.title}</h3>
                      <p>{trip.destination}</p>
                      <strong>{formatPrice(trip.price)}</strong>
                    </div>
                    <div className="ea-card-actions">
                      <button
                        className="ea-button ea-button-outline"
                        onClick={() => editTrip(trip)}
                      >
                        Edit
                      </button>
                      <button
                        className="ea-button ea-button-danger"
                        onClick={() => deleteTrip(trip.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No trips yet"
                message="Publish your first adventure using the form above."
              />
            )}
          </div>

          <div className="ea-admin-panel">
            <SectionTitle
              eyebrow="COMMUNICATION"
              title="Publish announcement"
            />

            <form className="ea-form" onSubmit={saveAnnouncement}>
              <label>
                Announcement title
                <input
                  required
                  value={announcementForm.title}
                  onChange={(event) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      title: event.target.value
                    })
                  }
                />
              </label>

              <label>
                Announcement message
                <textarea
                  required
                  rows="4"
                  value={announcementForm.message}
                  onChange={(event) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      message: event.target.value
                    })
                  }
                />
              </label>

              <button className="ea-button ea-button-primary" type="submit">
                Publish announcement
              </button>
            </form>
          </div>

          <div className="ea-admin-panel">
            <SectionTitle
              eyebrow="SOCIAL MEDIA"
              title="Edit social links"
              description="Update the URLs used by the social icons throughout the website."
            />

            <form className="ea-form" onSubmit={saveSocialLinks}>
              {SOCIALS.map((social) => (
                <label key={social.key}>
                  {social.name} URL
                  <input
                    type="url"
                    value={socialForm[social.key] || ""}
                    onChange={(event) =>
                      setSocialForm({
                        ...socialForm,
                        [social.key]: event.target.value
                      })
                    }
                    placeholder={`https://${social.name.toLowerCase()}.com/...`}
                  />
                </label>
              ))}

              <button className="ea-button ea-button-primary" type="submit">
                Save social links
              </button>
            </form>
          </div>

          <div className="ea-admin-panel">
            <SectionTitle
              eyebrow="PHOTO MANAGEMENT"
              title="Publish gallery photo"
            />

            <form
              className="ea-form"
              onSubmit={publishGalleryFile}
            >
              <label>
                Photo title
                <input name="galleryTitle" placeholder="Photo title" />
              </label>

              <label>
                Description
                <input
                  name="galleryDescription"
                  placeholder="Short description"
                />
              </label>

              <label>
                Choose photo
                <input
                  name="galleryFile"
                  type="file"
                  accept="image/*"
                  required
                />
              </label>

              <button className="ea-button ea-button-primary" type="submit">
                Publish photo
              </button>
            </form>
          </div>

          <div className="ea-admin-panel">
            <SectionTitle
              eyebrow="BOOKING MANAGEMENT"
              title="Recent bookings"
            />

            <button
              className="ea-button ea-button-outline"
              onClick={loadAdminData}
            >
              Refresh bookings and messages
            </button>

            {bookings.length ? (
              <div className="ea-admin-list">
                {bookings.map((booking) => (
                  <article className="ea-admin-list-item" key={booking.id}>
                    <div>
                      <h3>{booking.trip_title || "Trip booking"}</h3>
                      <p>Name: {booking.full_name || "Not provided"}</p>
                      <p>Phone: {booking.phone || "Not provided"}</p>
                      <p>Email: {booking.email || "Not provided"}</p>
                      <p>Guests: {booking.people || 1}</p>
                      <p>Status: {booking.status || "Pending"}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No bookings loaded"
                message="Use refresh to load booking records available to your admin account."
              />
            )}
          </div>

          <div className="ea-admin-panel">
            <SectionTitle
              eyebrow="INBOX"
              title="Contact messages"
            />

            {messages.length ? (
              <div className="ea-admin-list">
                {messages.map((message) => (
                  <article className="ea-admin-list-item" key={message.id}>
                    <div>
                      <h3>{message.name || "Visitor"}</h3>
                      {message.email && <p>{message.email}</p>}
                      <p>{message.message}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No messages loaded"
                message="Contact messages available to your admin account will appear here."
              />
            )}
          </div>
        </section>
      </main>
    );
  }

  function renderLogin() {
    return (
      <main className="ea-page">
        <section className="ea-section ea-auth-layout">
          <BrandLogo showName />
          <SocialLinks links={socialLinks} compact />

          <div className="ea-auth-card">
            <SectionTitle
              eyebrow="WELCOME"
              title={authMode === "signin" ? "Sign in" : "Create account"}
              description="Sign in to request bookings and manage your account."
            />

            <form
              className="ea-form"
              onSubmit={authMode === "signin" ? signIn : signUp}
            >
              {authMode === "signup" && (
                <label>
                  Full name
                  <input
                    required
                    value={authForm.full_name}
                    onChange={(event) =>
                      setAuthForm({
                        ...authForm,
                        full_name: event.target.value
                      })
                    }
                    placeholder="Your full name"
                  />
                </label>
              )}

              <label>
                Email address
                <input
                  required
                  type="email"
                  value={authForm.email}
                  onChange={(event) =>
                    setAuthForm({
                      ...authForm,
                      email: event.target.value
                    })
                  }
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Password
                <input
                  required
                  type="password"
                  minLength="6"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm({
                      ...authForm,
                      password: event.target.value
                    })
                  }
                  placeholder="Enter your password"
                />
              </label>

              <button className="ea-button ea-button-primary" type="submit">
                {authMode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <button
              className="ea-button ea-button-outline ea-auth-alternative"
              onClick={signInWithGoogle}
            >
              Continue with Google
            </button>

            <button
              className="ea-text-button"
              onClick={() =>
                setAuthMode(authMode === "signin" ?"signup" : "signin")
              }
            >
              {authMode === "signin"
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  function renderCurrentPage() {
    switch (page) {
      case "Home":
        return renderHome();

      case "Explore":
        return renderExplore();

      case "Gallery":
        return renderGallery();

      case "Announcements":
        return renderAnnouncements();

      case "Socials":
        return renderSocials();

      case "Contact":
        return renderContact();

      case "Bookings":
        return renderBookings();

      case "Admin":
        return renderAdmin();

      case "Login":
        return renderLogin();

      default:
        return renderHome();
    }
  }

  return (
    <div className="ea-app">
      {renderHeader()}
      {renderNavigation()}

      {notice && (
        <div className="ea-notice" role="status">
          <span>{notice}</span>
          <button
            type="button"aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <main className="ea-loading">
          <BrandLogo />
          <div className="ea-loading-spinner" />
          <p>Preparing your next adventure...</p>
        </main>
      ) : (
        renderCurrentPage()
      )}

      <footer className="ea-footer">
        <BrandLogo />
        <SocialLinks links={socialLinks} compact />
        <em>{SLOGAN}</em>
      </footer>

      {renderNavigation()}
    </div>
  );
}

function TripCard({ trip, onClick }) {
  const image =
    trip.cover_url ||
    trip.poster_url ||
    (Array.isArray(trip.destination_photos)
      ? trip.destination_photos[0]
      : "") ||
    COVER;

  return (
    <article className="ea-trip-card">
      <button
        className="ea-trip-card-click"
        onClick={onClick}
        aria-label={`View ${trip.title}`}
      >
        <div className="ea-trip-card-image">
          <img
            src={image}
            alt={trip.destination || trip.title}
            loading="lazy"
          />
          <span className="ea-trip-tag">{trip.tag || "Adventure"}</span>
        </div>

        <div className="ea-trip-card-content">
          <span className="ea-trip-destination">
            {trip.destination || "Explore Kenya"}
          </span>
          <h3>{trip.title}</h3>
          <p className="ea-trip-card-description">
            {trip.description ||
              "Discover a new destination and create unforgettable memories."}
          </p>

          <div className="ea-trip-card-meta">
            {trip.trip_date && <span>📅 {trip.trip_date}</span>}
            {trip.meeting_point && <span>📍 {trip.meeting_point}</span>}
          </div>

          <div className="ea-trip-card-bottom">
            <strong>{formatPrice(trip.price)}</strong>
            <span>Explore trip ↗</span>
          </div>
        </div>
      </button>
    </article>
  );
}

function PaymentInstructions({ trip, paymentName }) {
  let steps = [];

  if (trip.payment_method === "paybill") {
    steps = [
      "Open M-PESA on your phone.",
      "Choose Lipa na M-PESA, then Pay Bill.",
      `Enter Paybill number: ${trip.paybill_number || "To be provided"}.`,
      `Enter account number: ${trip.account_number || "To be provided"}.`,
      `Enter the trip amount and confirm the recipient: ${paymentName}.`
    ];
  } else if (trip.payment_method === "pochi") {
    steps = [
      "Open M-PESA on your phone.",
      "Choose Pochi la Biashara.",
      `Use the registered business number: ${trip.pochi_number || "To be provided"}.`,
      `Confirm the recipient name: ${paymentName}, then enter the amount.`
    ];
  } else {
    steps = [
      "Open M-PESA on your phone.",
      "Choose Lipa na M-PESA, then Buy Goods and Services.",
      `Enter Till number: ${trip.till_number || "To be provided"}.`,
      `Confirm the business name: ${paymentName}, then enter the amount.`
    ];
  }

  return (<div className="ea-payment-instructions">
      <strong>Payment instructions</strong>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      {trip.payment_instructions && <p>{trip.payment_instructions}</p>}

      <p className="ea-muted">
        Verify the recipient and amount before confirming payment.
      </p>
    </div>
  );
}

function Detail({ label, value }) {
  if (!value) return null;

  return (
    <div className="ea-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="ea-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function AuthPrompt({ onLogin }) {
  return (
    <div className="ea-auth-prompt">
      <BrandLogo />
      <h2>Sign in to continue</h2>
      <p>Sign in to access this part of your account.</p>
      <button className="ea-button ea-button-primary" onClick={onLogin}>
        Sign in
      </button>
    </div>
  );
}
   
