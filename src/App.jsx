import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const SUPABASE_URL = https://pokruqaprrzqkpllzrny.supabase.co;
const SUPABASE_ANON_KEY = sb_publishable_NaOujt2XAQYcwvlxgfQWWQ_PijCNOl3;

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const DEFAULT_SOCIALS = {
  facebook: "https://www.facebook.com/profile.php?id=61595176810539",
  tiktok: "https://vm.tiktok.com/ZS9yJYYksFK9P-UHc6F/",
  instagram: "https://www.instagram.com/elite1_adventures/",
  x: "https://x.com/elite_adv254",
  youtube: "https://youtube.com/@elite-adventures"
};

export default function App() {
  const [page, setPage] = useState("Home");
  const [trips, setTrips] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [socials, setSocials] = useState(DEFAULT_SOCIALS);
  const [chats, setChats] = useState([]);
  const [anonymousMessage, setAnonymousMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notice, setNotice] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tripForm, setTripForm] = useState({
    title: "",
    location: "",
    date: "",
    price: "",
    description: ""
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: ""
  });
  const [chatMessage, setChatMessage] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState("trips");

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function showPage(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);

      try {
        const [tripResult, galleryResult, announcementResult, socialResult] =
          await Promise.all([
            supabase.from("trips").select("*").order("created_at", {
              ascending: false
            }),
            supabase.from("gallery").select("*").order("created_at", {
              ascending: false
            }),
            supabase.from("announcements").select("*").order("created_at", {
              ascending: false
            }),
            supabase.from("social_links").select("*")
          ]);

        if (!active) return;

        if (tripResult.data) setTrips(tripResult.data);
        if (galleryResult.data) setGallery(galleryResult.data);
        if (announcementResult.data) {
          setAnnouncements(announcementResult.data);
        }

        if (socialResult.data?.length) {
          const updatedSocials = { ...DEFAULT_SOCIALS };

          socialResult.data.forEach((item) => {
            if (item.platform in updatedSocials) {
              updatedSocials[item.platform] = item.url;
            }
          });

          setSocials(updatedSocials);
        }
      } catch (error) {
        notify("Unable to load some content.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  async function signUp() {
    if (!email.trim() || !password) {
      notify("Enter your email and password.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password
    });

    if (error) {
      notify(error.message);
    } else {
      notify("Account created. Check your email if confirmation is required.");
      setAuthMode("login");
    }
  }

  async function signIn() {
    if (!email.trim() || !password) {
      notify("Enter your email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      notify(error.message);
    } else {
      notify("Signed in successfully.");
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      notify(error.message);
      return;
    }

    setIsAdmin(false);
    notify("You have signed out.");
    showPage("Home");
  }

  async function checkAdmin() {
    if (!user) {
      notify("Please sign in first.");
      return false;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      notify("Could not verify administrator access.");
      return false;
    }

    const allowed = data?.role === "admin";
    setIsAdmin(allowed);

    if (!allowed) {
      notify("Administrator access only.");
      return false;
    }

    return true;
  }

  async function sendChatMessage(event) {
    event.preventDefault();

    if (!user) {
      notify("Sign in to use the chat.");
      return;
    }

    if (!chatMessage.trim()) {
      notify("Type a message first.");
      return;
    }

    const { error } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      message: chatMessage.trim()
    });

    if (error) {
      notify("Message could not be sent.");
      return;
    }

    setChats((previous) => [
      ...previous,
      {
        user_id: user.id,
        message: chatMessage.trim(),
        created_at: new Date().toISOString()
      }
    ]);

    setChatMessage("");
    notify("Message sent.");
  }

  async function sendAnonymousMessage(event) {
    event.preventDefault();

    if (anonymousMessage.trim().length < 2) {
      notify("Please enter at least 2 characters.");
      return;
    }

    const { error } = await supabase
      .from("anonymous_messages")
      .insert({
        message: anonymousMessage.trim()
      });

    if (error) {
      notify("Message could not be sent. Please try again.");
      return;
    }

    setAnonymousMessage("");
    notify("Your message was submitted anonymously.");
  }
  
  async function saveTrip(event) {
    event.preventDefault();

    if (!(await checkAdmin())) return;

    if (
      !tripForm.title.trim() ||
      !tripForm.location.trim() ||
      !tripForm.date ||
      tripForm.price === ""
    ) {
      notify("Complete all required trip fields.");
      return;
    }

    const { data, error } = await supabase
      .from("trips")
      .insert({
        title: tripForm.title.trim(),
        location: tripForm.location.trim(),
        date: tripForm.date,
        price: Number(tripForm.price),
        description: tripForm.description.trim()
      })
      .select()
      .single();

    if (error) {
      notify("Could not save trip: " + error.message);
      return;
    }

    setTrips((previous) => [data, ...previous]);

    setTripForm({
      title: "",
      location: "",
      date: "",
      price: "",
      description: ""
    });

    notify("Trip published successfully.");
  }

  async function publishAnnouncement(event) {
    event.preventDefault();

    if (!(await checkAdmin())) return;

    if (
      !announcementForm.title.trim() ||
      !announcementForm.message.trim()
    ) {
      notify("Enter the announcement title and message.");
      return;
    }

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: announcementForm.title.trim(),
        message: announcementForm.message.trim()
      })
      .select()
      .single();

    if (error) {
      notify("Could not publish announcement: " + error.message);
      return;
    }

    setAnnouncements((previous) => [data, ...previous]);

    setAnnouncementForm({
      title: "",
      message: ""
    });

    notify("Announcement published.");
  }

  async function uploadGalleryImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;
    if (!(await checkAdmin())) {
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      notify("Please select an image file.");
      event.target.value = "";
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("elite-media")
      .upload(filePath, file);

    if (uploadError) {
      notify("Image upload failed: " + uploadError.message);
      event.target.value = "";
      return;
    }

    const { data: urlData } = supabase.storage
      .from("elite-media")
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from("gallery")
      .insert({
        image_url: urlData.publicUrl,
        file_path: filePath,
        uploaded_by: user.id
      })
      .select()
      .single();

    if (error) {
      notify("Image uploaded, but saving its details failed.");
      event.target.value = "";
      return;
    }

    setGallery((previous) => [data, ...previous]);
    notify("Gallery image added.");
    event.target.value = "";
  }
    
  return (
    <div className="app-shell">
      <header className="top-header">
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            showPage("Home");
          }}
        >
          <img
            src="/assets/elite-adventures-logo.png"
            alt="Elite Adventures logo"
            className="brand-logo"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <span>ELITE <strong>ADVENTURES</strong></span>
        </a>

        <div className="header-actions">
          {user ? (
            <button className="small-button" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <button
              className="small-button"
              onClick={() => showPage("Profile")}
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {notice && (
          <div className="notice" role="status">
            {notice}
          </div>
        )}

        {loading ? (
          <section className="loading-panel">
            <div className="loader" />
            <p>Loading your adventures...</p>
          </section>
        ) : (
          <>
            {page === "Home" && (
              <section className="hero-section">
                <p className="eyebrow">EXPLORE • DISCOVER • CONNECT</p>
                <h1>
                  Your next
                  <span> adventure</span>
                  starts here.
                </h1>
                <p className="hero-description">
                  Discover amazing destinations, join exciting trips,
                  meet new people, and create unforgettable memories
                  with Elite Adventures.
                </p>

                <div className="hero-actions">
                  <button
                    className="primary-button"
                    onClick={() => showPage("Explore")}
                  >
                    Explore trips
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => showPage("Gallery")}
                  >
                    View gallery
                  </button>
                </div>

                <div className="stats-row">
                  <div>
                    <strong>{trips.length}</strong>
                    <span>Listed trips</span>
                  </div>
                  <div>
                    <strong>{gallery.length}</strong>
                    <span>Gallery photos</span>
                  </div>
                  <div>
                    <strong>{announcements.length}</strong>
                    <span>Updates</span>
                  </div>
                </div>

                <section className="content-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">STAY IN THE LOOP</p>
                      <h2>Latest announcements</h2>
                    </div>
                  </div>

                  {announcements.length ? (
                    announcements.map((item) => (
                      <article className="announcement-card" key={item.id}>
                        <h3>{item.title}</h3>
                        <p>{item.message}</p>
                      </article>
                    ))
                  ) : (
                    <p className="empty-state">
                      No announcements yet. Check back for updates.
                    </p>
                  )}
                </section>

                <section className="content-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">YOUR NEXT ESCAPE</p>
                      <h2>Featured adventures</h2>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => showPage("Explore")}
                    >
                      See all
                    </button>
                  </div>

                  <TripCards
                    trips={trips.slice(0, 3)}
                    onBook={() => showPage("Bookings")}
                  />
                </section>
              </section>
            )}

            {page === "Explore" && (
              <section className="page-section">
                <p className="eyebrow">FIND YOUR NEXT ESCAPE</p>
                <h1>Explore trips</h1>
                <p className="muted">
                  Find an adventure that matches your vibe.
                </p>
                <TripCards
                  trips={trips}
                  onBook={() => showPage("Bookings")}
                />
              </section>
            )}

            {page === "Bookings" && (
              <section className="page-section">
                <p className="eyebrow">MAKE IT HAPPEN</p>
                <h1>Bookings</h1>
                <div className="info-card">
                  <h3>Ready for your next adventure?</h3>
                  <p>
                    Choose a trip from Explore and contact the
                    organizer to confirm availability, payment
                    details, and your booking.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => showPage("Explore")}
                  >
                    Browse trips
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
                  
            {page === "Chats" && (
              <section className="page-section">
                <p className="eyebrow">CONNECT WITH THE COMMUNITY</p>
                <h1>Community chat</h1>

                {!user ? (
                  <div className="info-card">
                    <p>Sign in to join the community chat.</p>
                    <button
                      className="primary-button"
                      onClick={() => showPage("Profile")}
                    >
                      Sign in
                    </button>
                  </div>
                ) : (
                  <form className="form-card" onSubmit={sendChatMessage}>
                    <label htmlFor="chatMessage">Your message</label>
                    <textarea
                      id="chatMessage"
                      value={chatMessage}
                      onChange={(event) => setChatMessage(event.target.value)}
                      placeholder="Write something..."
                      maxLength={2000}
                      required
                    />
                    <button className="primary-button" type="submit">
                      Send message
                    </button>
                    <p className="muted">
                      Community messages are stored in the chat database.
                    </p>
                  </form>
                )}

                <div className="info-card">
                  <h3>Say something without fear</h3>
                  <p>Your message is securely submitted anonymously.</p>
                  <form onSubmit={sendAnonymousMessage}>
                    <textarea
                      value={anonymousMessage}
                      onChange={(event) =>
                        setAnonymousMessage(event.target.value)
                      }
                      placeholder="Write an anonymous message..."
                      minLength={2}
                      maxLength={2000}
                      required
                    />
                    <button className="primary-button" type="submit">
                      Send anonymously
                    </button>
                  </form>
                </div>
              </section>
            )}

            {page === "Gallery" && (
              <section className="page-section">
                <p className="eyebrow">MOMENTS THAT MATTER</p>
                <h1>Our gallery</h1>

                {isAdmin && (
                  <label className="upload-button">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadGalleryImage}
                    />
                    <span>＋ Add photo</span>
                  </label>
                )}

                <GalleryGrid gallery={gallery} />
              </section>
            )}

            {page === "Profile" && (
              <section className="page-section">
                <p className="eyebrow">YOUR ACCOUNT</p>
                <h1>Profile</h1>

                {user ? (
                  <div className="info-card">
                    <h3>Welcome back!</h3>
                    <p>{user.email}</p>

                    <button
                      className="secondary-button"
                      onClick={async () => {
                        const allowed = await checkAdmin();
                        if (allowed) showPage("Admin");
                      }}
                    >
                      Open admin panel
                    </button>

                    <button className="primary-button" onClick={signOut}>
                      Sign out
                    </button>
                  </div>
                ) : (
                  <form
                    className="form-card"
                    onSubmit={(event) => {
                      event.preventDefault();
                      authMode === "login" ? signIn() : signUp();
                    }}
                  >
                    <div className="form-tabs">
                      <button
                        type="button"
                        className={authMode === "login" ? "active" : ""}
                        onClick={() => setAuthMode("login")}
                      >
                        Sign in
                      </button>
                      <button
                        type="button"
                        className={authMode === "signup" ? "active" : ""}
                        onClick={() => setAuthMode("signup")}
                      >
                        Create account
                      </button>
                    </div>

                    <label htmlFor="email">Email address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={6}
                      required
                    />

                    <button className="primary-button" type="submit">
                      {authMode === "login" ? "Sign in" : "Create account"}
                    </button>
                  </form>
                )}
              </section>
            )}

            {page === "Admin" && (
              <section className="page-section">
                <p className="eyebrow">MANAGEMENT</p>
                <h1>Admin panel</h1>

                {!user ? (
                  <div className="info-card">
                    <p>Sign in with an authorized administrator account.</p>
                    <button
                      className="primary-button"
                      onClick={() => showPage("Profile")}
                    >
                      Sign in
                    </button>
                  </div>
                ) : (
                  <div className="admin-panel">
                    <div className="form-tabs">
                      <button
                        type="button"
                        onClick={() => setActiveAdminTab("trips")}
                        className={activeAdminTab === "trips" ? "active" : ""}
                      >
                        Add trip
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveAdminTab("announcements")}
                        className={
                          activeAdminTab === "announcements" ? "active" : ""
                        }
                      >
                        Announcement
                      </button>
                    </div>

                    {activeAdminTab === "trips" && (
                      <form className="form-card" onSubmit={saveTrip}>
                        <label htmlFor="tripTitle">Trip title</label>
                        <input
                          id="tripTitle"
                          value={tripForm.title}
                          onChange={(event) =>
                            setTripForm({
                              ...tripForm,
                              title: event.target.value
                            })
                          }
                          required
                        />

                        <label htmlFor="tripLocation">Destination</label>
                        <input
                          id="tripLocation"
                          value={tripForm.location}
                          onChange={(event) =>
                            setTripForm({
                              ...tripForm,
                              location: event.target.value
                            })
                          }
                          required
                        />

                        <label htmlFor="tripDate">Trip date</label>
                        <input
                          id="tripDate"
                          type="date"
                          value={tripForm.date}
                          onChange={(event) =>
                            setTripForm({
                              ...tripForm,
                              date: event.target.value
                            })
                          }
                          required
                        />

                        <label htmlFor="tripPrice">Price (KSh)</label>
                        <input
                          id="tripPrice"
                          type="number"
                          min="0"
                          value={tripForm.price}
                          onChange={(event) =>
                            setTripForm({
                              ...tripForm,
                              price: event.target.value
                            })
                          }
                          required
                        />

                        <label htmlFor="tripDescription">Description</label>
                        <textarea
                          id="tripDescription"
                          value={tripForm.description}
                          onChange={(event) =>
                            setTripForm({
                              ...tripForm,
                              description: event.target.value
                            })
                          }
                        />

                        <button className="primary-button" type="submit">
                          Publish trip
                        </button>
                      </form>
                    )}

                    {activeAdminTab === "announcements" && (
                      <form
                        className="form-card"
                        onSubmit={publishAnnouncement}
                      >
                        <label htmlFor="announcementTitle">Title</label>
                        <input
                          id="announcementTitle"
                          value={announcementForm.title}
                          onChange={(event) =>
                            setAnnouncementForm({
                              ...announcementForm,
                              title: event.target.value
                            })
                          }
                          required
                        />

                        <label htmlFor="announcementMessage">Message</label>
                        <textarea
                          id="announcementMessage"
                          value={announcementForm.message}
                          onChange={(event) =>
                            setAnnouncementForm({
                              ...announcementForm,
                              message: event.target.value
                            })
                          }
                          required
                        />

                        <button className="primary-button" type="submit">
                          Publish announcement
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </section>
            )}

            <section className="social-section">
              <h2>Follow Elite Adventures</h2>
              <SocialLinks socials={socials} />
            </section>
          </>
        )}
      </main>

      <nav className="bottom-nav">
        {[
          ["Home", "⌂"],
          ["Explore", "⌕"],
          ["Bookings", "▣"],
          ["Chats", "✉"],
          ["Gallery", "▧"],
          ["Profile", "◎"]
        ].map(([name, symbol]) => (
          <button
            key={name}
            type="button"
            className={page === name ? "nav-item active" : "nav-item"}
            onClick={() => showPage(name)}
          >
            <span className="nav-symbol">{symbol}</span>
            <span>{name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function TripCards({ trips, onBook }) {
  if (!trips.length) {
    return <p className="empty-state">New adventures will appear here soon.</p>;
  }

  return (
    <div className="trip-grid">
      {trips.map((trip) => (
        <article className="trip-card" key={trip.id}>
          <div className="trip-card-art">✦</div>
          <div className="trip-card-content">
            <h3>{trip.title}</h3>
            <p className="muted">{trip.location}</p>
            {trip.date && (
              <p className="trip-date">
                {new Date(`${trip.date}T00:00:00`).toLocaleDateString()}
              </p>
            )}
            {trip.description && <p>{trip.description}</p>}
            <div className="trip-card-footer">
              <strong>KSh {Number(trip.price || 0).toLocaleString()}</strong>
              <button
                className="small-button"
                onClick={onBook}
                type="button"
              >
                Book
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function GalleryGrid({ gallery }) {
  if (!gallery.length) {
    return <p className="empty-state">Your adventure photos will appear here.</p>;
  }

  return (
    <div className="gallery-grid">
      {gallery.map((item) => (
        <a
          className="gallery-item"
          href={item.image_url}
          target="_blank"
          rel="noreferrer"
          key={item.id}
        >
          <img src={item.image_url} alt="Elite Adventures moment" loading="lazy" />
        </a>
      ))}
    </div>
  );
}

function SocialLinks({ socials }) {
  const platforms = [
    ["facebook", "f", "Facebook"],
    ["tiktok", "♪", "TikTok"],
    ["instagram", "◎", "Instagram"],
    ["x", "𝕏", "X"],
    ["youtube", "▶", "YouTube"]
  ];

  return (
    <div className="social-links">
      {platforms.map(([key, symbol, label]) =>
        socials[key] ? (
          <a
            key={key}
            href={socials[key]}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
          >
            {symbol}
          </a>
        ) : null
      )}
    </div>
  );
                                                         }
        
