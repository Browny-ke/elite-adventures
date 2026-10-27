  import React, { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import "./App.css";

const BRAND = "ELITE ADVENTURES ®️";
const SLOGAN = "Adventure Beyond Limits";

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
  { key: "facebook", name: "Facebook", color: "#1877F2", icon: "f" },
  { key: "tiktok", name: "TikTok", color: "#111111", icon: "♪" },
  { key: "instagram", name: "Instagram", color: "#E1306C", icon: "◎" },
  { key: "x", name: "X", color: "#111111", icon: "𝕏" },
  { key: "youtube", name: "YouTube", color: "#FF0000", icon: "▶" }
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
  const value = Number(price);
  return Number.isFinite(value)
    ? `KSh ${value.toLocaleString("en-KE")}`
    : "Price to be announced";
}

function SocialLinks({ links = DEFAULT_SOCIALS }) {
  return (
    <div className="ea-socials">
      {SOCIALS.map((social) => (
        <a
          key={social.key}
          className="ea-social"
          href={links[social.key] || DEFAULT_SOCIALS[social.key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${social.name}`}
        >
          <span
            className="ea-social-icon"
            style={{ backgroundColor: social.color }}
          >
            {social.icon}
          </span>
          <span>{social.name}</span>
        </a>
      ))}
    </div>
  );
}

function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="ea-section-heading">
      {eyebrow && <span className="ea-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="ea-empty">
      <span aria-hidden="true">✦</span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

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
    content: "",
    image_url: ""
  });
  const [socialForm, setSocialForm] = useState(DEFAULT_SOCIALS);
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    phone: ""
  });
  const [authMode, setAuthMode] = useState("login");
  const [bookingForm, setBookingForm] = useState({
    full_name: "",
    phone: "",
    seats: 1
  });
  const [anonymousMessage, setAnonymousMessage] = useState("");
  const [settings, setSettings] = useState({
    fontSize: "14",
    fontFamily: "system",
    theme: "dark"
  });

  useEffect(() => {
    if (!supabase) {
      setNotice(
        "Supabase configuration is missing. Check your GitHub Actions secrets and rebuild."
      );
      setLoading(false);
      return;
    }

    let active = true;

    async function initialise() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!active) return;

      setUser(session?.user || null);
      await loadPublicData();

      if (session?.user) {
        await checkAdmin(session.user);
      }

      if (active) setLoading(false);
    }

    initialise();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setIsAdmin(false);
      } else {
        setTimeout(() => checkAdmin(session.user), 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadPublicData() {
    if (!supabase) return;

    const results = await Promise.all([
      supabase.from("trips").select("*").order("trip_date", {
        ascending: true
      }),
      supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("site_settings").select("*")
    ]);

    const [tripResult, announcementResult, galleryResult, settingsResult] =
      results;

    if (!tripResult.error) setTrips(tripResult.data || []);
    if (!announcementResult.error)
      setAnnouncements(announcementResult.data || []);
    if (!galleryResult.error) setGallery(galleryResult.data || []);

    if (!settingsResult.error && settingsResult.data) {
      const socialRow = settingsResult.data.find(
        (item) => item.key === "social_links"
      );
      if (socialRow?.value) {
        setSocialLinks({ ...DEFAULT_SOCIALS, ...socialRow.value });
        setSocialForm({ ...DEFAULT_SOCIALS, ...socialRow.value });
      }
    }
  }

  async function checkAdmin(currentUser) {
    if (!supabase || !currentUser) return;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    setIsAdmin(!error && data?.role === "admin");
  }

  async function signIn(event) {
    event.preventDefault();
    setNotice("");

    if (!supabase) {
      setNotice("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email.trim(),
      password: authForm.password
    });

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Signed in successfully.");
    setPage("Home");
  }

  async function signUp(event) {
    event.preventDefault();
    setNotice("");

    if (!supabase) {
      setNotice("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: authForm.email.trim(),
      password: authForm.password
    });

    setNotice(
      error
        ? error.message
        : "Registration submitted. Check your email if confirmation is enabled."
    );
  }

  async function signInWithGoogle() {
    if (!supabase) return setNotice("Supabase is not configured.");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });

    if (error) setNotice(error.message);
  }

  async function requestPhoneLogin() {
    if (!supabase) return setNotice("Supabase is not configured.");

    const phone = authForm.phone.trim();
    if (!phone) return setNotice("Enter your phone number.");

    const { error } = await supabase.auth.signInWithOtp({ phone });
    setNotice(
      error
        ? error.message
        : "A verification code has been requested. Follow the SMS instructions."
    );
  }

  async function signOut() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) return setNotice(error.message);

    setIsAdmin(false);
    setPage("Home");
    setNotice("You have signed out.");
  }

  async function saveTrip(event) {
    event.preventDefault();

    if (!supabase || !isAdmin) {
      return setNotice("Only an authenticated admin can manage trips.");
    }

    const payload = {
      title: tripForm.title.trim(),
      destination: tripForm.destination.trim(),
      trip_date: tripForm.trip_date || null,
      meeting_point: tripForm.meeting_point.trim(),
      meeting_time: tripForm.meeting_time.trim(),
      price: Number(tripForm.price),
      activities: tripForm.activities.trim(),
      description: tripForm.description.trim(),
      tag: tripForm.tag,
      poster_url: tripForm.poster_url.trim(),
      cover_url: tripForm.cover_url.trim(),
      payment_method: tripForm.payment_method,
      payment_name: tripForm.payment_name.trim(),
      till_number: tripForm.till_number.trim(),
      paybill_number: tripForm.paybill_number.trim(),
      account_number: tripForm.account_number.trim(),
      pochi_number: tripForm.pochi_number.trim(),
      payment_instructions: tripForm.payment_instructions.trim()
    };

    const query = editingTrip
      ? supabase.from("trips").update(payload).eq("id", editingTrip)
      : supabase.from("trips").insert(payload);

    const { error } = await query;

    if (error) return setNotice(error.message);

    setNotice("Trip saved.");
    setTripForm(emptyTrip);
    setEditingTrip(null);
    await loadPublicData();
  }

  async function deleteTrip(id) {
    if (!supabase || !isAdmin) return;

    if (!window.confirm("Delete this trip? This cannot be undone.")) return;

    const { error } = await supabase.from("trips").delete().eq("id", id);

    if (error) return setNotice(error.message);

    setNotice("Trip deleted.");
    await loadPublicData();
  }

  function editTrip(trip) {
    setTripForm({ ...emptyTrip, ...trip });
    setEditingTrip(trip.id);
    setPage("Admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAnnouncement(event) {
    event.preventDefault();

    if (!supabase || !isAdmin) {
      return setNotice("Only an authenticated admin can post announcements.");
    }

    const { error } = await supabase.from("announcements").insert({
      title: announcementForm.title.trim(),
      content: announcementForm.content.trim(),
      image_url: announcementForm.image_url.trim(),
      created_by: user.id
    });

    if (error) return setNotice(error.message);

    setAnnouncementForm({ title: "", content: "", image_url: "" });
    setNotice("Announcement published.");
    await loadPublicData();
  }

  async function deleteAnnouncement(id) {
    if (!supabase || !isAdmin) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) return setNotice(error.message);

    setNotice("Announcement deleted.");
    await loadPublicData();
  }

  async function saveSocialLinks(event) {
    event.preventDefault();

    if (!supabase || !isAdmin) {
      return setNotice("Only an admin can edit social links.");
    }

    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "social_links",
        value: socialForm,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      },
      { onConflict: "key" }
    );

    if (error) return setNotice(error.message);

    setSocialLinks({ ...socialForm });
    setNotice("Social links updated.");
  }

  async function uploadFile(file, bucket = "elite-media") {
    if (!supabase || !file) return null;

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false });

    if (error) {
      setNotice(error.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleTripImage(event, field) {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file);
    if (url) {
      setTripForm((previous) => ({ ...previous, [field]: url }));
      setNotice("Image uploaded.");
    }
  }

  async function publishGalleryFile(event) {
    const file = event.target.files?.[0];
    if (!file || !supabase) return;

    const url = await uploadFile(file);
    if (!url) return;

    const isVideo = file.type.startsWith("video/");
    const { error } = await supabase.from("gallery").insert({
      title: file.name,
      media_url: url,
      media_type: isVideo ? "video" : "image",
      uploaded_by: user?.id || null
    });

    if (error) return setNotice(error.message);

    setNotice("Gallery item uploaded.");
    await loadPublicData();
  }

  async function deleteGalleryItem(id) {
    if (!supabase || !isAdmin) return;

    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) return setNotice(error.message);

    setNotice("Gallery item deleted.");
    await loadPublicData();
  }

  async function submitBooking(event) {
    event.preventDefault();

    if (!supabase) return setNotice("Supabase is not configured.");
    if (!selectedTrip) return setNotice("Choose a trip first.");

    const { error } = await supabase.from("bookings").insert({
      trip_id: selectedTrip.id,
      user_id: user?.id || null,
      full_name: bookingForm.full_name.trim(),
      phone: bookingForm.phone.trim(),
      seats: Math.max(1, Number(bookingForm.seats) || 1),
      status: "pending"
    });

    if (error) return setNotice(error.message);

    setNotice("Booking request submitted. Follow the payment instructions below.");
    setPage("Bookings");
  }

  async function sendAnonymousMessage(event) {
    event.preventDefault();

    if (!supabase) return setNotice("Supabase is not configured.");

    const message = anonymousMessage.trim();
    if (message.length < 2 || message.length > 2000) {
      return setNotice("Message must be between 2 and 2000 characters.");
    }

    const { error } = await supabase.from("anonymous_messages").insert({
      message,
      status: "unread"
    });

    if (error) return setNotice(error.message);

    setAnonymousMessage("");
    setNotice("Your anonymous message was submitted.");
  }

  async function loadAdminData() {
    if (!supabase || !isAdmin) return;

    const [bookingResult, messageResult] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", {
        ascending: false
      }),
      supabase.from("anonymous_messages").select("*").order("created_at", {
        ascending: false
      })
    ]);

    if (!bookingResult.error) setBookings(bookingResult.data || []);
    if (!messageResult.error) setMessages(messageResult.data || []);
  }

  useEffect(() => {
    if (page === "Admin" && isAdmin) loadAdminData();
  }, [page, isAdmin]);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = [
      trip.title,
      trip.destination,
      trip.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(tripSearch.toLowerCase());

    const matchesCategory =
      category === "All" || trip.category === category;

    return matchesSearch && matchesCategory;
  });

  function renderHeader() {
    return (
      <header className="ea-header">
        <button
          className="ea-brand"
          onClick={() => setPage("Home")}
          aria-label="Elite Adventures home"
        >
          <span className="ea-brand-mark">EA</span>
          <span>
            <strong>ELITE ADVENTURES</strong>
            <em>{SLOGAN}</em>
          </span>
        </button>

        <button
          className="ea-menu-button"
          onClick={() => setPage(page === "Menu" ? "Home" : "Menu")}
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>
    );
  }

  function renderNavigation() {
    const links = [
      ["Home", "⌂"],
      ["Explore", "⌕"],
      ["Bookings", "▣"],
      ["Gallery", "▧"],
      ["Profile", "♙"]
    ];

    return (
      <nav className="ea-bottom-nav" aria-label="Main navigation">
        {links.map(([label, icon]) => (
          <button
            key={label}
            className={page === label ? "active" : ""}
            onClick={() => setPage(label)}
          >
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
      </nav>
    );
  }

  function renderMenu() {
    const links = [
      "Home",
      "Explore",
      "Bookings",
      "Group Chat",
      "Private Chat",
      "Chat Admin",
      "Gallery",
      "Social Links",
      "Anonymous Chat",
      "Announcements",
      "About",
      "Profile",
      "Settings",
      ...(isAdmin ? ["Admin"] : [])
    ];

    return (
      <section className="ea-menu-panel">
        <div className="ea-menu-brand">
          <span className="ea-brand-mark">EA</span>
          <div>
            <strong>ELITE ADVENTURES</strong>
            <em>{SLOGAN}</em>
          </div>
        </div>

        {user && (
          <p className="ea-muted">
            Signed in as {user.email || user.phone || "Member"}
          </p>
        )}

        {links.map((link) => (
          <button
            key={link}
            className="ea-menu-link"
            onClick={() => setPage(link)}
          >
            {link}
            <span>›</span>
          </button>
        ))}

        {user && (
          <button className="ea-button ea-button-outline" onClick={signOut}>
            Log out
          </button>
        )}
      </section>
    );
  }

  function renderHome() {
    return (
      <>
        <section className="ea-hero">
          <div className="ea-hero-overlay">
            <span className="ea-eyebrow">YOUR NEXT STORY STARTS HERE</span>
            <h1>
              Adventure
              <br />
              <span>Awaits!</span>
            </h1>
            <p>Explore. Connect. Travel Together.</p>
            <em className="ea-slogan">{SLOGAN}</em>

            <button
              className="ea-button ea-button-primary"
              onClick={() => setPage("Explore")}
            >
              Explore trips <span>→</span>
            </button>
          </div>
        </section>

        <section className="ea-page-section">
          <SectionTitle eyebrow="WHAT'S HAPPENING" title="Latest announcements" />
          {announcements.length ? (
            <div className="ea-announcement-list">
              {announcements.slice(0, 4).map((item) => (
                <article className="ea-announcement" key={item.id}>
                  {item.image_url && (
                    <img src={item.image_url} alt="" loading="lazy" />
                  )}
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Stay tuned"
              message="New trip announcements will appear here."
            />
          )}
        </section>

        <section className="ea-page-section">
          <SectionTitle
            eyebrow="PLAN YOUR ESCAPE"
            title="Upcoming trips"
          >
                <button className="ea-text-button" onClick={() => setPage("Explore")}>
              See all →
            </button>
          </SectionTitle>

          {trips.length ? (
            <div className="ea-trip-grid">
              {trips.slice(0, 4).map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onOpen={() => {
                    setSelectedTrip(trip);
                    setPage("Trip Details");
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="New adventures are coming"
              message="Published trips will appear here."
            />
          )}
        </section>

        <section className="ea-page-section">
          <SectionTitle eyebrow="STAY CONNECTED" title="Join the community" />
          <SocialLinks links={socialLinks} />
          <div className="ea-feature-grid">
            <FeatureCard
              icon="✦"
              title="Group Chat"
              text="Connect with fellow travellers."
              onClick={() => setPage("Group Chat")}
            />
            <FeatureCard
              icon="◉"
              title="Private Chat"
              text="Continue conversations privately."
              onClick={() => setPage("Private Chat")}
            />
            <FeatureCard
              icon="✉"
              title="Anonymous Chat"
              text="Share your thoughts privately."
              onClick={() => setPage("Anonymous Chat")}
            />
          </div>
        </section>
      </>
      );
  }

  function renderTripDetails() {
    if (!selectedTrip) {
      return (
        <EmptyState
          title="Choose an adventure"
          message="Select a trip from Explore to see its details."
        />
      );
    }

    const trip = selectedTrip;
    const paymentName = trip.payment_name || "Recipient name set by admin";

    return (
      <section className="ea-page-section">
        <button className="ea-text-button" onClick={() => setPage("Explore")}>
          ← Back to trips
        </button>

        <div className="ea-trip-detail">
          {(trip.cover_url || trip.poster_url) && (
            <img
              className="ea-trip-cover"
              src={trip.cover_url || trip.poster_url}
              alt={trip.title}
            />
          )}

          <div className="ea-trip-detail-body">
            {trip.tag && <span className="ea-tag">{trip.tag}</span>}
            <h1>{trip.title}</h1>
            <p className="ea-destination">⌖ {trip.destination}</p>
            <h2 className="ea-trip-price">{formatPrice(trip.price)}</h2>

            <div className="ea-detail-grid">
              <Detail label="Date" value={trip.trip_date || "To be announced"} />
              <Detail
                label="Meeting point"
                value={trip.meeting_point || "To be announced"}
              />
              <Detail
                label="Meeting time"
                value={trip.meeting_time || "To be announced"}
              />
            </div>

            <h3>About this trip</h3>
            <p>{trip.description || "More details coming soon."}</p>

            <h3>Activities</h3>
            <p>{trip.activities || "Activities will be announced."}</p>

            {trip.poster_url && (
              <a
                className="ea-button ea-button-outline"
                href={trip.poster_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View trip poster
              </a>
            )}

            <button
              className="ea-button ea-button-primary ea-full-width"
              onClick={() => setPage(user ? "Bookings" : "Login")}
            >
              Book this trip
            </button>

            <h3>Payment instructions</h3>
            <PaymentInstructions
              trip={trip}
              paymentName={paymentName}
            />

            <form className="ea-form" onSubmit={submitBooking}>
              <h3>Booking request</h3>
              <label>
                Full name
                <input
                  required
                  value={bookingForm.full_name}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      full_name: e.target.value
                    })
                  }
                  placeholder="Enter your full name"
                />
              </label>
              <label>
                Phone number
                <input
                  required
                  value={bookingForm.phone}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      phone: e.target.value
                    })
                  }
                  placeholder="07XX XXX XXX"
                />
              </label>
              <label>
                Number of seats
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={bookingForm.seats}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      seats: e.target.value
                    })
                  }
                />
              </label>
              <button className="ea-button ea-button-primary" type="submit">
                Submit booking
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  function renderBookings() {
    return (
      <section className="ea-page-section">
        <SectionTitle eyebrow="YOUR ADVENTURES" title="My bookings" />
        {!user ? (
          <AuthPrompt onClick={() => setPage("Login")} />
        ) : (
          <EmptyState
            title="Your bookings"
            message="Booking history will appear here once your bookings table is configured for member access."
          />
        )}
      </section>
    );
  }

  function renderGallery() {
    return (
      <section className="ea-page-section">
        <SectionTitle eyebrow="MOMENTS THAT MATTER" title="Photo & video gallery" />
        {user && (
          <label className="ea-upload-button">
            + Upload photo or video
            <input
              type="file"
              accept="image/*,video/*"
              onChange={publishGalleryFile}
              hidden
              />
          </label>
        )}

        {gallery.length ? (
          <div className="ea-gallery-grid">
            {gallery.map((item) => (
              <article className="ea-gallery-item" key={item.id}>
                {item.media_type === "video" ? (
                  <video src={item.media_url} controls preload="metadata" />
                ) : (
                  <img src={item.media_url} alt={item.title || "Gallery item"} />
                )}
                <div className="ea-gallery-actions">
                  <span>{item.title || "Elite Adventures"}</span>
                  <a
                    href={item.media_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download ↧
                  </a>
                  {isAdmin && (
                    <button onClick={() => deleteGalleryItem(item.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your next memory belongs here"
            message="Gallery photos and videos will appear here after upload."
          />
        )}
      </section>
    );
  }

  function renderSocialPage() {
    return (
      <section className="ea-page-section">
        <SectionTitle eyebrow="FOLLOW THE JOURNEY" title="Connect with Elite Adventures" />
        <SocialLinks links={socialLinks} />
        <p className="ea-muted">
          Tap a coloured social icon to open the official page.
        </p>
      </section>
    );
    }

  function renderAnonymousChat() {
    return (
      <section className="ea-page-section">
        <div className="ea-iconic-banner">
          <h1>ELITE ADVENTURES <sup>®️</sup></h1>
          <span>CHATBOX</span>
        </div>
        <form className="ea-form" onSubmit={sendAnonymousMessage}>
          <p>Your message is securely encrypted.</p>
          <textarea
            value={anonymousMessage}
            onChange={(e) => setAnonymousMessage(e.target.value)}
            minLength={2}
            maxLength={2000}
            required
            placeholder="Write your anonymous message..."
            rows={5}
          />
          <small>{anonymousMessage.length}/2000 characters</small>
          <button className="ea-button ea-button-primary" type="submit">
            Submit anonymously
          </button>
        </form>
        <p className="ea-muted">
          Only authorised admins should have access to anonymous submissions.
        </p>
      </section>
    );
  }

  function renderLogin() {
    return (
      <section className="ea-auth-page">
        <div className="ea-auth-card">
          <div className="ea-brand-mark ea-auth-mark">EA</div>
          <h1>Welcome back</h1>
          <p>Sign in to explore amazing adventures and connect with fellow travellers.</p>

          <form className="ea-form" onSubmit={authMode === "login" ? signIn : signUp}>
            <label>
              Email address
              <input
                type="email"
                required
                autoComplete="email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                  }
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                required
                minLength={6}
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </label>

            <button className="ea-button ea-button-primary" type="submit">
              {authMode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <button
            className="ea-button ea-button-outline ea-full-width"
            onClick={signInWithGoogle}
          >
            Continue with Google
          </button>

          <div className="ea-divider"><span>OR PHONE</span></div>

          <form className="ea-form" onSubmit={requestPhoneLogin}>
            <input
              type="tel"
              value={authForm.phone}
              onChange={(e) =>
                setAuthForm({ ...authForm, phone: e.target.value })
              }
              placeholder="+2547XXXXXXXX"
            />
            <button className="ea-button ea-button-outline" type="submit">
              Request SMS verification
            </button>
          </form>

          <button
            className="ea-text-button"
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
          >
            {authMode === "login"
              ? "Don't have an account? Sign up"
              : "Already registered? Log in"}
          </button>
        </div>
      </section>
    );
  }

  function renderAdmin() {
    if (!user) return <AuthPrompt onClick={() => setPage("Login")} />;

    if (!isAdmin) {
      return (
        <EmptyState
          title="Admin access only"
          message="Sign in using an account that has been assigned the admin role in Supabase."
        />
      );
    }

    return (
      <section className="ea-page-section">
        <SectionTitle eyebrow="MANAGEMENT" title="Admin dashboard" />
        <div className="ea-admin-stats">
          <Stat label="Trips" value={trips.length} />
          <Stat label="Announcements" value={announcements.length} />
          <Stat label="Gallery items" value={gallery.length} />
          <Stat label="Bookings" value={bookings.length} />
        </div>

        <div className="ea-admin-panel">
          <h2>{editingTrip ? "Edit trip" : "Create trip"}</h2>
          <form className="ea-form" onSubmit={saveTrip}>
            <label>
              Trip name
              <input
                required
                value={tripForm.title}
                onChange={(e) =>
                  setTripForm({ ...tripForm, title: e.target.value })
                }
                placeholder="e.g. Mount Kenya Expedition"
              />
            </label>

            <label>
              Destination
              <input
                required
                value={tripForm.destination}
                onChange={(e) =>
                  setTripForm({ ...tripForm, destination: e.target.value })
                }
                placeholder="Destination name"
              />
            </label>

            <label>
              Trip date
              <input
                type="date"
                value={tripForm.trip_date || ""}
                onChange={(e) =>
                  setTripForm({ ...tripForm, trip_date: e.target.value })
                }
              />
            </label>

            <label>
              Fare (KSh)
              <input
                type="number"
                min="0"
                required
                value={tripForm.price}
                onChange={(e) =>
                  setTripForm({ ...tripForm, price: e.target.value })
                }
                placeholder="1800"
              />
            </label>

            <label>
              Meeting point
              <input
                value={tripForm.meeting_point}
                onChange={(e) =>
                  setTripForm({ ...tripForm, meeting_point: e.target.value })
                }
                placeholder="Meeting location"
              />
            </label>

            <label>
              Meeting time
              <input
                type="text"
                value={tripForm.meeting_time}
                onChange={(e) =>
                  setTripForm({ ...tripForm, meeting_time: e.target.value })
                  }
                placeholder="e.g. 5:30 AM"
              />
            </label>

            <label>
              Trip tag
              <select
                value={tripForm.tag}
                onChange={(e) =>
                  setTripForm({ ...tripForm, tag: e.target.value })
                }
              >
                {TRIP_TAGS.map((tag) => (
                  <option key={tag}>{tag}</option>
                ))}
              </select>
            </label>

            <label>
              Activities
              <textarea
                value={tripForm.activities}
                onChange={(e) =>
                  setTripForm({ ...tripForm, activities: e.target.value })
                }
                placeholder="Hiking, swimming, photography..."
              />
            </label>

            <label>
              Description
              <textarea
                value={tripForm.description}
                onChange={(e) =>
                  setTripForm({ ...tripForm, description: e.target.value })
                }
                placeholder="Describe the experience..."
              />
            </label>

            <label>
              Upload trip poster
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleTripImage(e, "poster_url")}
              />
            </label>
            {tripForm.poster_url && (
              <img
                className="ea-admin-preview"
                src={tripForm.poster_url}
                alt="Trip poster preview"
              />
        )}

            <label>
              Upload destination cover photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleTripImage(e, "cover_url")}
              />
            </label>
            {tripForm.cover_url && (
              <img
                className="ea-admin-preview"
                src={tripForm.cover_url}
                alt="Destination cover preview"
              />
            )}

            <h3>Payment settings</h3>

            <label>
              Payment method
              <select
                value={tripForm.payment_method}
                onChange={(e) =>
                  setTripForm({
                    ...tripForm,
                    payment_method: e.target.value
                  })
                }
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Recipient / business name
              <input
                value={tripForm.payment_name}
                onChange={(e) =>
                  setTripForm({ ...tripForm, payment_name: e.target.value })
                }
                placeholder="Name displayed to the customer"
              />
            </label>

            {tripForm.payment_method === "till" && (
              <label>
                Till number
                <input
                  value={tripForm.till_number}
                  onChange={(e) =>
            setTripForm({ ...tripForm, till_number: e.target.value })
                  }
                  placeholder="Enter Till number"
                />
              </label>
            )}

            {tripForm.payment_method === "paybill" && (
              <>
                <label>
                  Paybill number
                  <input
                    value={tripForm.paybill_number}
                    onChange={(e) =>
                      setTripForm({
                        ...tripForm,
                        paybill_number: e.target.value
                      })
                    }
                    placeholder="Enter Paybill number"
                  />
                </label>
                <label>
                  Account number
                  <input
                    value={tripForm.account_number}
                    onChange={(e) =>
                      setTripForm({
                        ...tripForm,
                        account_number: e.target.value
                      })
                    }
                    placeholder="Enter account number"
                  />
                </label>
              </>
            )}

            {tripForm.payment_method === "pochi" && (
              <label>
                Pochi phone number
                <input
                  value={tripForm.pochi_number}
                  onChange={(e) =>
                    setTripForm({
                      ...tripForm,
                      pochi_number: e.target.value
                    })
                  }
                  placeholder="Enter registered phone number"
                />
              </label>
            )}

            <label>
              Customer payment instructions
              <textarea
                value={tripForm.payment_instructions}
                onChange={(e) =>
                  setTripForm({
                    ...tripForm,
                    payment_instructions: e.target.value
                  })
                }
                placeholder="Explain the exact steps for this payment method."
              />
            </label>

            <button className="ea-button ea-button-primary" type="submit">
              {editingTrip ? "Update trip" : "Publish trip"}
            </button>

            {editingTrip && (
              <button
                type="button"
                className="ea-button ea-button-outline"
                onClick={() => {
                  setEditingTrip(null);
                  setTripForm(emptyTrip);
                }}
              >
                Cancel editing
              </button>
            )}
          </form>
        </div>

        <div className="ea-admin-panel">
          <h2>Manage trips</h2>
          {trips.map((trip) => (
            <div className="ea-admin-row" key={trip.id}>
              <div>
                <strong>{trip.title}</strong>
                <p>{trip.destination}</p>
              </div>
              <button
                className="ea-small-button"
                onClick={() => editTrip(trip)}
              >
                Edit
              </button>
              <button
                className="ea-small-button danger"
                onClick={() => deleteTrip(trip.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="ea-admin-panel">
          <h2>Publish announcement</h2>
          <form className="ea-form" onSubmit={saveAnnouncement}>
            <input
              required
              value={announcementForm.title}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  title: e.target.value
                })
              }
              placeholder="Announcement title"
            />
            <textarea
              required
              value={announcementForm.content}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  content: e.target.value
                })
              }
              placeholder="Write announcement..."
            />
            <input
              value={announcementForm.image_url}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  image_url: e.target.value
                })
              }
              placeholder="Optional image URL"
            />
            <button className="ea-button ea-button-primary" type="submit">
              Publish announcement
            </button>
          </form>

          {announcements.map((item) => (
            <div className="ea-admin-row" key={item.id}>
              <strong>{item.title}</strong>
              <button
                className="ea-small-button danger"
                onClick={() => deleteAnnouncement(item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="ea-admin-panel">
          <h2>Edit social links</h2>
          <form className="ea-form" onSubmit={saveSocialLinks}>
            {SOCIALS.map((social) => (
              <label key={social.key}>
                {social.name} URL
                <input
                  type="url"
                  required
                  value={socialForm[social.key]}
                  onChange={(e) =>
                    setSocialForm({
                      ...socialForm,
                      [social.key]: e.target.value
                    })
                  }
                />
              </label>
            ))}
            <button className="ea-button ea-button-primary" type="submit">
              Save social links
            </button>
          </form>
        </div>

        <div className="ea-admin-panel">
          <h2>Anonymous messages</h2>
          {messages.length ? (
            messages.map((item) => (
              <article className="ea-anonymous-item" key={item.id}>
                <p>{item.message}</p>
                <button
                  className="ea-small-button"
                  onClick={() => {
                    const shareText = encodeURIComponent(item.message);
                    window.open(
                      `https://wa.me/?text=${shareText}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  Share
                </button>
              </article>
            ))
          ) : (
            <p className="ea-muted">No anonymous messages to display.</p>
          )}
        </div>
      </section>
    );
  }

  function renderSettings() {
    return (
      <section className="ea-page-section">
        <SectionTitle eyebrow="MAKE IT YOURS" title="Settings" />
        <div className="ea-admin-panel">
          <label>
            Font size
            <select
              value={settings.fontSize}
              onChange={(e) =>
                setSettings({ ...settings, fontSize: e.target.value })
              }
            >
              <option value="12">Small</option>
              <option value="14">Medium</option>
              <option value="16">Large</option>
              <option value="18">Extra large</option>
            </select>
          </label>

          <label>
            Font style
            <select
              value={settings.fontFamily}
              onChange={(e) =>
                setSettings({ ...settings, fontFamily: e.target.value })
              }
            >
              <option value="system">System default</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </label>

          <label>
            Appearance
            <select
              value={settings.theme}
              onChange={(e) =>
                setSettings({ ...settings, theme: e.target.value })
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <p className="ea-muted">
            These settings apply while this page is open.
          </p>
        </div>
      </section>
    );
  }

  function renderAbout() {
    return (
      <section className="ea-page-section ea-about">
        <span className="ea-brand-mark">EA</span>
        <h1>ELITE ADVENTURES</h1>
        <em>{SLOGAN}</em>
        <p>
          Elite Adventures brings people together through travel, outdoor
          experiences, new destinations and shared memories. Discover new  places, meet fellow travellers and make every journey count.
        </p>
        <h2>Our mission</h2>
        <p>
          To connect people with remarkable experiences and create welcoming,
          memorable adventures for everyone.
        </p>
        <SocialLinks links={socialLinks} />
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="ea-page-section">
        <SectionTitle eyebrow="YOUR ACCOUNT" title="My profile" />
        {user ? (
          <div className="ea-admin-panel">
            <div className="ea-avatar">
              {(user.email || user.phone || "M").charAt(0).toUpperCase()}
            </div>
            <h2>{user.user_metadata?.full_name || "Elite Member"}</h2>
            <p>{user.email || user.phone}</p>
            <p className="ea-muted">{isAdmin ? "Administrator" : "Member"}</p>
            <button className="ea-button ea-button-outline" onClick={signOut}>
              Log out
            </button>
          </div>
        ) : (
          <AuthPrompt onClick={() => setPage("Login")} />
        )}
      </section>
    );
  }

  function renderPage() {
    switch (page) {
      case "Home":
        return renderHome();
      case "Explore":
        return renderExplore();
      case "Trip Details":
        return renderTripDetails();
      case "Bookings":
        return renderBookings();
      case "Gallery":
        return renderGallery();
      case "Social Links":
        return renderSocialPage();
      case "Anonymous Chat":
        return renderAnonymousChat();
      case "Login":
        return renderLogin();
      case "Admin":
        return renderAdmin();
      case "Settings":
        return renderSettings();
      case "About":
        return renderAbout();
      case "Profile":
        return renderProfile();
      case "Menu":
        return renderMenu();
      case "Announcements":
        return (
          <section className="ea-page-section">
            <SectionTitle title="Announcements" />
            {announcements.map((item) => (
              <article className="ea-announcement" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </article>
            ))}
          </section>
        );
      case "Group Chat":
      case "Private Chat":
      case "Chat Admin":
        return (
          <section className="ea-page-section">
            <SectionTitle title={page} />
            <EmptyState
              title="Chat setup required"
              message="Real-time group, private and admin chat require chat tables, access policies and realtime configuration in Supabase."
            />
          </section>
        );
      default:
        return renderHome();
    }
  }

  if (loading) {
    return (
      <div className="ea-loading">
        <span className="ea-brand-mark">EA</span>
        <h2>ELITE ADVENTURES</h2>
        <em>{SLOGAN}</em>
        <div className="ea-loading-bar" />
      </div>
    );
  }

  return (
    <div
      className={`ea-app theme-${settings.theme}`}
      style={{
        "--ea-font-size": `${settings.fontSize}px`,
        "--ea-font-family":
          settings.fontFamily === "system"
            ? "system-ui, sans-serif"
            : settings.fontFamily
      }}
    >
      {renderHeader()}

      {notice && (
        <div className="ea-notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <main className="ea-main">{renderPage()}</main>
      <footer className="ea-footer">
        <strong>ELITE ADVENTURES ®️</strong>
        <em>{SLOGAN}</em>
        <SocialLinks links={socialLinks} />
        <small>Explore. Connect. Travel Together.</small>
      </footer>

      {renderNavigation()}
    </div>
  );
}

function TripCard({ trip, onOpen }) {
  return (
    <article className="ea-trip-card">
      <button className="ea-trip-image-button" onClick={onOpen}>
        {trip.cover_url || trip.poster_url ? (
          <img
            src={trip.cover_url || trip.poster_url}
            alt={trip.title}
            loading="lazy"
          />
        ) : (
          <div className="ea-trip-placeholder">✦</div>
        )}
        {trip.tag && <span className="ea-tag">{trip.tag}</span>}
      </button>

      <div className="ea-trip-card-body">
        <h3>{trip.title}</h3>
        <p className="ea-destination">⌖ {trip.destination}</p>
        <p className="ea-trip-date">
          ◷ {trip.trip_date || "Date to be announced"}
        </p>
        <div className="ea-trip-card-bottom">
          <strong>{formatPrice(trip.price)}</strong>
          <button className="ea-small-button" onClick={onOpen}>
            View details
          </button>
        </div>
      </div>
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

  return (
    <div className="ea-payment-instructions">
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

function FeatureCard({ icon, title, text, onClick }) {
  return (
    <button className="ea-feature-card" onClick={onClick}>
      <span>{icon}</span>
      <strong>{title}</strong>
      <small>{text}</small>
      <b>→</b>
    </button>
  );
}

function Detail({ label, value }) {
  return (
    <div className="ea-detail-item">
      <small>{label}</small>
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

function AuthPrompt({ onClick }) {
  return (
    <div className="ea-empty">
      <span>♙</span>
      <h3>Sign in to continue</h3>
      <p>Access your Elite Adventures account.</p>
      <button className="ea-button ea-button-primary" onClick={onClick}>
        Sign in
      </button>
    </div>
  );
      }
