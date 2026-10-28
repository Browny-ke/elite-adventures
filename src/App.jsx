import React, { useState, useEffect, useRef } from "react";
import {
  Home, Compass, MessageCircle, CalendarDays, User,
  Menu, Search, Bell, Settings, LogOut, ChevronRight,
  MapPin, Clock, Users, Heart, Share2, Download,
  Image as ImageIcon, Video, Mic, Send, Camera,
  Paperclip, MoreVertical, Plus, Pencil, Trash2,
  CheckCircle, XCircle, CreditCard, ShieldCheck,
  Megaphone, Info, Mountain, Waves, TreePalm,
  Instagram, Facebook, Youtube, ArrowLeft, Phone,
  Mail, Lock, Eye, EyeOff, Upload, Globe, MessageSquare,
  CircleHelp, Sparkles, Ticket, Wallet, Check, X
} from "lucide-react";
import "./app.css";

const BRAND = "ELITE ADVENTURES";
const SLOGAN = "Adventure Beyond Limits";
const ADMIN_EMAIL = "ryanblessings10@gmail.com";

const SOCIALS = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61595176810539",
    color: "#1877F2",
    icon: "facebook"
  },
  {
    name: "TikTok",
    url: "https://vm.tiktok.com/ZS9yJYYksFK9P-UHc6F/",
    color: "#111111",
    icon: "tiktok"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/elite1_adventures?xtok=NzNyMHhrenFqbWtu",
    color: "#E4405F",
    icon: "instagram"
  },
  {
    name: "X",
    url: "https://x.com/elite_adv254",
    color: "#111111",
    icon: "x"
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@elite-adventures?si=oY-rxMpJipUjyKT_",
    color: "#FF0000",
    icon: "youtube"
  }
];

const INITIAL_TRIPS = [
  {
    id: 1,
    name: "Mount Kenya Expedition",
    destination: "Mount Kenya",
    date: "2026-11-15",
    endDate: "2026-11-18",
    fare: 18000,
    seats: 12,
    tag: "HOT",
    activities: ["Hiking", "Camping", "Photography", "Nature"],
    meetingPoint: "Nairobi CBD",
    meetingTime: "5:00 AM",
    description: "Explore spectacular mountain scenery with the Elite Adventures team.",
    cover: "",
    photos: [],
    videos: [],
    status: "Upcoming"
  },
  {
    id: 2,
    name: "Hell's Gate Adventure",
    destination: "Naivasha",
    date: "2026-11-08",
    endDate: "2026-11-08",
    fare: 2500,
    seats: 12,
    tag: "NEW",
    activities: ["Cycling", "Hiking", "Photography"],
    meetingPoint: "Nairobi CBD",
    meetingTime: "6:00 AM",
    description: "Enjoy a memorable day exploring the landscapes of Hell's Gate.",
    cover: "",
    photos: [],
    videos: [],
    status: "Upcoming"
  },
  {
    id: 3,
    name: "Diani Beach Getaway",
    destination: "Diani, Mombasa",
    date: "2026-12-12",
    endDate: "2026-12-15",
    fare: 16000,
    seats: 8,
    tag: "POPULAR",
    activities: ["Swimming", "Beach", "Photography", "Water Sports"],
    meetingPoint: "Nairobi CBD",
    meetingTime: "8:00 PM",
    description: "Escape to the coast for ocean views, relaxation and adventure.",
    cover: "",
    photos: [],
    videos: [],
    status: "Upcoming"
  }
];

const INITIAL_CHATS = [
  {
    id: 1,
    name: "Adventure Community",
    type: "group",
    members: 120,
    messages: [
      {
        id: 1,
        sender: "ELITE ADVENTURES",
        text: "Welcome to our adventure community!",
        time: "09:00",
        mine: false
      }
    ]
  },
  {
    id: 2,
    name: "Hell's Gate Crew",
    type: "group",
    members: 32,
    messages: []
  },
  {
    id: 3,
    name: "Chat Admin",
    type: "admin",
    members: 1,
    messages: [
      {
        id: 1,
        sender: "Chat Admin",
        text: "Hello! How can we help you today?",
        time: "09:12",
        mine: false
      }
    ]
  }
];

const INITIAL_PAYMENT = {
  method: "Pochi La Biashara",
  businessName: "",
  phoneNumber: "",
  tillNumber: "",
  paybillNumber: "",
  accountNumber: "",
  instructions: ""
};

const money = (amount) =>
  `KSh ${Number(amount || 0).toLocaleString("en-KE")}`;

const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function saveStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Could not save app data:", error);
  }
}

function SocialIcon({ type, size = 19 }) {
  if (type === "facebook") {
    return <Facebook size={size} fill="currentColor" />;
  }
  if (type === "instagram") {
    return <Instagram size={size} />;
  }
  if (type === "youtube") {
    return <Youtube size={size} fill="currentColor" />;
  }
  if (type === "tiktok") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label="TikTok"
      >
        <path d="M19.6 7.1a6.5 6.5 0 0 1-4.1-1.5v9.1a6.7 6.7 0 1 1-5.8-6.6v3.7a3.1 3.1 0 1 0 2.2 3V2h3.6a6.5 6.5 0 0 0 4.1 4.1z" />
      </svg>
    );
  }
  return <span style={{ fontWeight: 900, fontSize: size }}>𝕏</span>;
}

function BrandLogo({ size = 54 }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}elite-adventures-logo.png`}
      alt="Elite Adventures logo"
      width={size}
      height={size}
      className="ea-logo"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

function UploadButton({ onFiles, multiple = false, accept = "image/*,video/*" }) {
  const ref = useRef(null);

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          onFiles(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="ea-btn ea-btn-outline"
        onClick={() => ref.current?.click()}
      >
        <Upload size={16} /> Upload
      </button>
    </>
  );
  }export default function App() {
  const [page, setPage] = useState("Home");
  const [user, setUser] = useState(() =>
    readStore("ea_user", null)
  );
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [trips, setTrips] = useState(() =>
    readStore("ea_trips", INITIAL_TRIPS)
  );
  const [bookings, setBookings] = useState(() =>
    readStore("ea_bookings", [])
  );
  const [payment, setPayment] = useState(() =>
    readStore("ea_payment", INITIAL_PAYMENT)
  );
  const [announcements, setAnnouncements] = useState(() =>
    readStore("ea_announcements", [
      {
        id: 1,
        title: "Welcome to Elite Adventures!",
        text: "Discover new places, connect with adventurers and book your next trip.",
        date: new Date().toISOString()
      }
    ])
  );
  const [chats, setChats] = useState(() =>
    readStore("ea_chats", INITIAL_CHATS)
  );
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [gallery, setGallery] = useState(() =>
    readStore("ea_gallery", [])
  );
  const [anonymousMessages, setAnonymousMessages] = useState(() =>
    readStore("ea_anonymous", [])
  );
  const [socialLinks, setSocialLinks] = useState(() =>
    readStore("ea_socials", SOCIALS)
  );
  const [profile, setProfile] = useState(() =>
    readStore("ea_profile", {
      bio: "Adventure seeker",
      fontSize: "medium",
      theme: "sunset",
      language: "English",
      notifications: true
    })
  );
  const [adminTab, setAdminTab] = useState("Overview");
  const [tripForm, setTripForm] = useState({});
  const [editingTrip, setEditingTrip] = useState(null);
  const [bookingForm, setBookingForm] = useState({});
  const [anonymousText, setAnonymousText] = useState("");
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    text: ""
  });
  const [toast, setToast] = useState("");
  const [galleryCaption, setGalleryCaption] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [adminLoginEmail, setAdminLoginEmail] = useState("");
  const [adminLoginPassword, setAdminLoginPassword] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [loginView, setLoginView] = useState(false);

  const isAdmin =
    adminMode &&
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => saveStore("ea_user", user), [user]);
  useEffect(() => saveStore("ea_trips", trips), [trips]);
  useEffect(() => saveStore("ea_bookings", bookings), [bookings]);
  useEffect(() => saveStore("ea_payment", payment), [payment]);
  useEffect(() => saveStore("ea_announcements", announcements), [announcements]);
  useEffect(() => saveStore("ea_chats", chats), [chats]);
  useEffect(() => saveStore("ea_gallery", gallery), [gallery]);
  useEffect(() => saveStore("ea_anonymous", anonymousMessages), [anonymousMessages]);
  useEffect(() => saveStore("ea_socials", socialLinks), [socialLinks]);
  useEffect(() => saveStore("ea_profile", profile), [profile]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (text) => setToast(text);

  const authenticate = (e) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail.trim() || !authPassword) {
      setAuthError("Enter your email or phone and password.");
      return;
    }

    const nextUser = {
      id: Date.now(),
      name: authName.trim() || authEmail.split("@")[0] || "Adventurer",
      email: authEmail.trim(),
      phone: authPhone.trim(),
      avatar: "",
      joined: new Date().toISOString()
    };

    setUser(nextUser);
    setAdminMode(false);
    setLoginView(false);
    setPage("Home");
    notify("Welcome to Elite Adventures!");
  };

  const adminLogin = (e) => {
    e.preventDefault();
    setAuthError("");

    if (adminLoginEmail.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setAuthError("Use the registered administrator email.");
      return;
    }

    setAuthError(
      "Admin authentication must be connected to a secure server before enabling dashboard access."
    );
  };

  const logout = () => {
    setUser(null);
    setAdminMode(false);
    setPage("Home");
    setDrawer(false);
    setLoginView(false);
    notify("You have logged out.");
  };

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const openSocial = (social) => {
    window.open(social.url, "_blank", "noopener,noreferrer");
  };

  const filteredTrips = trips.filter((trip) => {
    const query = search.toLowerCase();
    return (
      trip.name?.toLowerCase().includes(query) ||
      trip.destination?.toLowerCase().includes(query) ||
      trip.activities?.some((a) => a.toLowerCase().includes(query))
    );
  });

  const updateTripField = (key, value) => {
    setTripForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadTripCover = async (files) => {
    if (!files[0]) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      notify("Choose an image for the trip cover.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateTripField("cover", reader.result);
    reader.readAsDataURL(file);
  };

  const saveTrip = (e) => {
    e.preventDefault();

    const data = {
      ...tripForm,
      id: editingTrip || Date.now(),
      name: tripForm.name?.trim(),
      destination: tripForm.destination?.trim(),
      fare: Number(tripForm.fare || 0),
      seats: Number(tripForm.seats || 0),
      activities: Array.isArray(tripForm.activities)
        ? tripForm.activities
        : String(tripForm.activities || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
      photos: tripForm.photos || [],
      videos: tripForm.videos || [],
      status: tripForm.status || "Upcoming"
    };

    if (!data.name || !data.destination || !data.date) {
      notify("Enter the trip name, destination and date.");
      return;
    }

    if (editingTrip) {
      setTrips((prev) =>
        prev.map((trip) => trip.id === editingTrip ? data : trip)
      );
      notify("Trip updated.");
    } else {
      setTrips((prev) => [data, ...prev]);
      notify("Trip published.");
    }

    setTripForm({});
    setEditingTrip(null);
    setAdminTab("Trips");
  };

  const editTrip = (trip) => {
    setTripForm({ ...trip });
    setEditingTrip(trip.id);
    setAdminTab("Add Trip");
  };

  const deleteTrip = (id) => {
    if (!window.confirm("Delete this trip permanently from this device?")) return;
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
    setBookings((prev) => prev.filter((booking) => booking.tripId !== id));
    notify("Trip deleted.");
  };

  const uploadTripMedia = async (files, field) => {
    const accepted = files.filter((file) =>
      field === "photos"
        ? file.type.startsWith("image/")
        : file.type.startsWith("video/")
    );

    const converted = await Promise.all(
      accepted.map((file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: `${Date.now()}-${Math.random()}`,
              name: file.name,
              type: file.type,
              url: reader.result
            });
          reader.readAsDataURL(file);
        })
      )
    );

    setTripForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ...converted]
    }));
  };

  const startBooking = (trip) => {
    if (!user) {
      setSelectedTrip(trip);
      setLoginView(true);
      notify("Sign in before booking your trip.");
      return;
    }
    setSelectedTrip(trip);
    setBookingForm({
      name: user.name || "",
      phone: user.phone || "",
      transactionCode: "",
      tripId: trip.id
    });
    setPage("Booking Form");
  };

  const submitBooking = (e) => {
    e.preventDefault();

    if (!selectedTrip || !bookingForm.name || !bookingForm.phone ||
        !bookingForm.transactionCode) {
      notify("Complete all booking and payment reference fields.");
      return;
    }

    const booking = {
      id: Date.now(),
      tripId: selectedTrip.id,
      tripName: selectedTrip.name,
      fare: selectedTrip.fare,
      name: bookingForm.name,
      phone: bookingForm.phone,
      transactionCode: bookingForm.transactionCode,
      paymentMethod: payment.method,
      status: "Pending admin verification",
      date: new Date().toISOString(),
      userId: user?.id
    };

    setBookings((prev) => [booking, ...prev]);
    setPage("Bookings");
    setSelectedTrip(null);
    notify("Booking submitted for admin verification.");
  };

  const setBookingStatus = (id, status) => {
    setBookings((prev) =>
      prev.map((booking) => booking.id === id
        ? { ...booking, status }
        : booking)
    );
    notify(`Booking marked ${status}.`);
  };

  const savePaymentSettings = (e) => {
    e.preventDefault();
    setPayment((prev) => ({
      ...prev,
      instructions: prev.instructions?.trim()
    }));
    notify("Payment instructions saved on this device.");
  };

  const publishAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.text.trim()) {
      notify("Enter an announcement title and message.");
      return;
    }

    setAnnouncements((prev) => [{
      id: Date.now(),
      title: announcementForm.title.trim(),
      text: announcementForm.text.trim(),
      date: new Date().toISOString()
    }, ...prev]);

    setAnnouncementForm({ title: "", text: "" });
    notify("Announcement published.");
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    notify("Announcement deleted.");
  };

  const sendMessage = (e) => {
    e?.preventDefault();

    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      sender: user?.name || "Guest",
      senderId: user?.id,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      mine: true
    };

    setChats((prev) => prev.map((chat) =>
      chat.id === activeChat.id
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));
    setMessage("");
  };

  const startPrivateChat = (person) => {
    if (!user) {
      setLoginView(true);
      return;
    }

    const existing = chats.find((chat) =>
      chat.type === "private" &&
      chat.participantId === person.id &&
      chat.ownerId === user.id
    );

    if (existing) {
      setActiveChat(existing);
    } else {
      const created = {
        id: Date.now(),
        name: person.name,
        type: "private",
        participantId: person.id,
        ownerId: user.id,
        members: 2,
        messages: []
      };
      setChats((prev) => [created, ...prev]);
      setActiveChat(created);
    }

    setPage("Chats");
  };  const submitAnonymous = (e) => {
    e.preventDefault();
    if (!anonymousText.trim()) {
      notify("Write a message first.");
      return;
    }

    setAnonymousMessages((prev) => [{
      id: Date.now(),
      text: anonymousText.trim(),
      date: new Date().toISOString(),
      shared: false,
      senderId: user?.id || null
    }, ...prev]);

    setAnonymousText("");
    notify("Your anonymous message was submitted.");
  };

  const shareAnonymous = (item) => {
    const text = `ELITE ADVENTURES ®️ Chatbox\n\n${item.text}`;
    if (navigator.share) {
      navigator.share({ title: "ELITE ADVENTURES", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      notify("Message copied. You can now share it.");
    }
  };

  const uploadGallery = async (files) => {
    const converted = await Promise.all(files.map((file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          url: reader.result,
          caption: galleryCaption,
          uploader: user?.name || "Adventurer",
          date: new Date().toISOString()
        });
        reader.readAsDataURL(file);
      })
    ));

    setGallery((prev) => [...converted, ...prev]);
    setGalleryCaption("");
    notify("Media added to the gallery.");
  };

  const deleteGalleryItem = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
    notify("Gallery item deleted.");
  };

  const menuItems = [
    { label: "Home", icon: Home },
    { label: "Explore", icon: Compass },
    { label: "Chats", icon: MessageCircle },
    { label: "Bookings", icon: CalendarDays },
    { label: "Gallery", icon: ImageIcon },
    { label: "Anonymous Chatbox", icon: MessageSquare },
    { label: "Social Links", icon: Globe },
    { label: "About", icon: Info },
    { label: "My Profile", icon: User },
    { label: "Settings", icon: Settings }
  ];

  const go = (name) => {
    setPage(name);
    setDrawer(false);
    if (name !== "Trip Details") setSelectedTrip(null);
  };

  const tripCard = (trip) => (
    <article className="ea-trip-card" key={trip.id}>
      <button
        className="ea-trip-image"
        onClick={() => {
          setSelectedTrip(trip);
          setPage("Trip Details");
        }}
        aria-label={`View ${trip.name}`}
      >
        {trip.cover ? (
          <img src={trip.cover} alt={trip.name} />
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}elite-adventures-cover.jpg`}
            alt={trip.name}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {trip.tag && (
          <span className={`ea-tag ea-tag-${trip.tag.toLowerCase().replace(/\s/g, "-")}`}>
            {trip.tag}
          </span>
        )}
      </button>

      <div className="ea-trip-content">
        <button
          className="ea-trip-title"
          onClick={() => {
            setSelectedTrip(trip);
            setPage("Trip Details");
          }}
        >
          {trip.name}
        </button>

        <p className="ea-muted">
          <MapPin size={14} /> {trip.destination}
        </p>
        <p className="ea-muted">
          <CalendarDays size={14} /> {trip.date || "Date to be announced"}
        </p>

        <div className="ea-trip-bottom">
          <strong>{money(trip.fare)}</strong>
          <span className="ea-muted">
            {trip.tag === "SOLD OUT" ? "Sold out" : `${trip.seats || 0} seats`}
          </span>
        </div>

        <button
          className="ea-btn ea-btn-primary ea-full"
          disabled={trip.tag === "SOLD OUT"}
          onClick={() => startBooking(trip)}
        >
          {trip.tag === "SOLD OUT" ? "Sold Out" : "Book Adventure"}
        </button>
      </div>
    </article>
  );

  const pageTitle = {
    Home: "Adventure Awaits!",
    Explore: "Explore Adventures",
    Chats: "Chats",
    Bookings: "My Bookings",
    Gallery: "Photo Gallery",
    "Anonymous Chatbox": "ELITE ADVENTURES ®️",
    "Social Links": "Connect With Us",
    About: "Our Story",
    "My Profile": "My Profile",
    Settings: "Settings",
    "Trip Details": "Trip Details",
    "Booking Form": "Complete Booking",
    "Chat Admin": "Chat Admin",
    "Admin Dashboard": "Admin Dashboard"
  };

  if (loginView || !user) {
    return (
      <div className={`ea-app ea-auth ${profile.theme}`}>
        <div className="ea-auth-cover">
          <img
            src={`${import.meta.env.BASE_URL}elite-adventures-cover.jpg`}
            alt="Adventure landscape"
            className="ea-auth-background"
          />
          <div className="ea-auth-overlay" />
          <div className="ea-auth-brand">
            <BrandLogo size={100} />
            <h1>{BRAND}™️</h1>
            <p className="ea-slogan">{SLOGAN}</p>
          </div>
        </div>

        <div className="ea-auth-panel">
          <div className="ea-auth-heading">
            <h2>
              {authMode === "signup" ? "Join the Adventure" : "Welcome Back"}
            </h2>
            <p>Sign in to explore, connect and travel together.</p>
          </div>

          <div className="ea-auth-switch">
            <button
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Sign In
            </button>
            <button
              className={authMode === "signup" ? "active" : ""}
              onClick={() => setAuthMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <form className="ea-form" onSubmit={authenticate}>
            {authMode === "signup" && (
              <>
                <label>Full name</label>
                <input
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
                <label>Phone number</label>
                <input
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  type="tel"
                />
              </>
            )}

            <label>Email address</label>
            <div className="ea-input-icon">
              <Mail size={17} />
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <label>Password</label>
            <div className="ea-input-icon">
              <Lock size={17} />
              <input
                type={showPassword ? "text" : "password"}
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="ea-icon-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {authError && <p className="ea-error">{authError}</p>}

            <button className="ea-btn ea-btn-primary ea-full" type="submit">
              {authMode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="ea-auth-divider"><span>OR CONTINUE WITH</span></div>

          <div className="ea-auth-providers">
            <button
              onClick={() => notify("Connect Firebase Authentication to enable Google sign-in.")}
            >
              <span className="ea-google-g">G</span> Google
            </button>
            <button
              onClick={() => notify("Phone sign-in requires SMS authentication setup.")}
            >
              <Phone size={17} /> Phone
            </button>
          </div>

          <button
            className="ea-text-button"
            onClick={() => {
              setLoginView(false);
              setPage("Admin Login");
            }}
          >
            Administrator sign in
          </button>

          <p className="ea-auth-foot">
            By continuing, you agree to our community guidelines.
          </p>
        </div>
      </div>
    );
  }

  if (page === "Admin Login") {
    return (
      <div className="ea-app ea-admin-login">
        <button className="ea-back-button" onClick={() => go("Home")}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="ea-admin-login-card">
          <BrandLogo size={72} />
          <h2>Administrator Access</h2>
          <p>Sign in using the configured administrator account.</p>
          <form className="ea-form" onSubmit={adminLogin}>
            <label>Admin email</label>
            <input
              type="email"
              value={adminLoginEmail}
              onChange={(e) => setAdminLoginEmail(e.target.value)}
              placeholder={ADMIN_EMAIL}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={adminLoginPassword}
              onChange={(e) => setAdminLoginPassword(e.target.value)}
              placeholder="Admin password"
              required
            />
            {authError && <p className="ea-error">{authError}</p>}
            <button className="ea-btn ea-btn-primary ea-full" type="submit">
              <ShieldCheck size={17} /> Secure Admin Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`ea-app ea-theme-${profile.theme} ea-font-${profile.fontSize}`}>
      <header className="ea-topbar">
        <button
          className="ea-icon-button ea-menu-button"
          onClick={() => setDrawer(!drawer)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="ea-topbar-brand">
          <BrandLogo size={43} />
          <div>
            <strong>{BRAND}™️</strong>
            <small className="ea-slogan">{SLOGAN}</small>
          </div>
        </div>

        <button
          className="ea-icon-button"
          onClick={() => go("Settings")}
          aria-label="Settings"
        >
          <Bell size={20} />
        </button>
      </header>

      {drawer && (
        <>
          <button
            className="ea-drawer-shade"
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
          />
          <aside className="ea-drawer">
            <div className="ea-drawer-profile">
              <BrandLogo size={58} />
              <div>
                <strong>{user.name}</strong>
                <small>Member</small>
              </div>
            </div>

            {menuItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={`ea-menu-item ${page === label ? "active" : ""}`}
                onClick={() => go(label)}
              >
                <Icon size={19} /> <span>{label}</span>
                <ChevronRight size={15} className="ea-menu-chevron" />
              </button>
            ))}

            {isAdmin && (
              <button
                className="ea-menu-item"
                onClick={() => go("Admin Dashboard")}
              >
                <ShieldCheck size={19} /> Admin Dashboard
              </button>
            )}

            <button className="ea-menu-item ea-logout" onClick={logout}>
              <LogOut size={19} /> Log Out
            </button>
          </aside>
        </>
      )}

      <main className="ea-main">
        {page === "Home" && (
          <>
            <section className="ea-hero">
              <img
                src={`${import.meta.env.BASE_URL}elite-adventures-cover.jpg`}
                alt=""
                className="ea-hero-bg"
              />
              <div className="ea-hero-overlay" />
              <div className="ea-hero-content">
                <span className="ea-eyebrow">GOOD MORNING, {user.name.split(" ")[0]}!</span>
                <h1>Adventure Awaits!</h1>
                <p>Explore. Connect. Travel Together.</p>
                <div className="ea-search">
                  <Search size={19} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search trips, destinations..."
                  />
                  <button onClick={() => go("Explore")} aria-label="Search trips">
                    <Search size={18} />
                  </button>
                </div>
              </div>
            </section>

            {announcements.length > 0 && (
              <section className="ea-section">
                <div className="ea-section-heading">
                  <h2><Megaphone size={19} /> Latest Announcement</h2>
                  <button onClick={() => go("Announcements")}>See all</button>
                </div>
                <div className="ea-announcement-banner">
                  <span className="ea-announcement-label">ELITE NEWS</span>
                  <h3>{announcements[0].title}</h3>
                  <p>{announcements[0].text}</p>
                  <small>{new Date(announcements[0].date).toLocaleDateString()}</small>
                </div>
              </section>
            )}

            <section className="ea-section">
              <div className="ea-section-heading">
                <h2>Upcoming Trips</h2>
                <button onClick={() => go("Explore")}>See all <ChevronRight size={16} /></button>
              </div>
              <div className="ea-trip-grid">
                {filteredTrips.slice(0, 4).map(tripCard)}
              </div>
            </section>

            <section className="ea-quick-actions">
              <button onClick={() => go("Chats")}>
                <span className="ea-action-icon ea-pink"><Users size={23} /></span>
                <strong>Group Chat</strong>
              </button>
              <button onClick={() => go("Chats")}>
                <span className="ea-action-icon ea-blue"><MessageCircle size={23} /></span>
                <strong>Private Chat</strong>
              </button>
              <button onClick={() => go("Chat Admin")}>
                <span className="ea-action-icon ea-purple"><ShieldCheck size={23} /></span>
                <strong>Chat Admin</strong>
              </button>
            </section>

            <section className="ea-section">
              <div className="ea-section-heading">
                <h2>Connect With Us</h2>
                <button onClick={() => go("Social Links")}>All socials <ChevronRight size={16} /></button>
              </div>
              <SocialRow socials={socialLinks} onOpen={openSocial} />
            </section>
          </>
        )}        {page === "Explore" && (
          <>
            <section className="ea-page-heading">
              <h1>Explore</h1>
              <p>Find your next adventure.</p>
              <div className="ea-search ea-search-light">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search trips or destinations..."
                />
              </div>
            </section>

            <div className="ea-category-row">
              {["All Trips", "Mountains", "Beaches", "Hiking", "Camping", "Water Sports"].map((cat) => (
                <button
                  key={cat}
                  className="ea-category"
                  onClick={() => setSearch(cat === "All Trips" ? "" : cat)}
                >
                  <span>{cat === "Mountains" ? <Mountain /> :
                    cat === "Beaches" ? <Waves /> :
                    cat === "Camping" ? <TreePalm /> : <Compass />}</span>
                  {cat}
                </button>
              ))}
            </div>

            <section className="ea-section">
              <div className="ea-section-heading">
                <h2>Featured Trips</h2>
                <span>{filteredTrips.length} adventures</span>
              </div>
              <div className="ea-trip-grid">
                {filteredTrips.map(tripCard)}
              </div>
              {filteredTrips.length === 0 && (
                <div className="ea-empty">
                  <Compass size={36} />
                  <h3>No trips found</h3>
                  <p>Try another destination or search term.</p>
                </div>
              )}
            </section>
          </>
        )}

        {page === "Trip Details" && selectedTrip && (
          <section className="ea-detail-page">
            <button className="ea-back-button" onClick={() => go("Explore")}>
              <ArrowLeft size={18} /> Back to trips
            </button>
            <div className="ea-detail-cover">
              {selectedTrip.cover ? (
                <img src={selectedTrip.cover} alt={selectedTrip.name} />
              ) : (
                <img
                  src={`${import.meta.env.BASE_URL}elite-adventures-cover.jpg`}
                  alt={selectedTrip.name}
                />
              )}
              {selectedTrip.tag && <span className="ea-tag">{selectedTrip.tag}</span>}
            </div>

            <div className="ea-detail-content">
              <h1>{selectedTrip.name}</h1>
              <p className="ea-muted"><MapPin size={16} /> {selectedTrip.destination}</p>
              <div className="ea-detail-facts">
                <div><CalendarDays /><span>Date</span><strong>{selectedTrip.date}</strong></div>
                <div><Clock /><span>Meeting time</span><strong>{selectedTrip.meetingTime || "To be announced"}</strong></div>
                <div><MapPin /><span>Meeting point</span><strong>{selectedTrip.meetingPoint || "To be announced"}</strong></div>
                <div><Users /><span>Available seats</span><strong>{selectedTrip.seats ?? "To be announced"}</strong></div>
              </div>

              <div className="ea-detail-price">{money(selectedTrip.fare)}</div>
              <h3>About this adventure</h3>
              <p>{selectedTrip.description || "Discover amazing destinations with Elite Adventures."}</p>

              <h3>Activities</h3>
              <div className="ea-chip-list">
                {(selectedTrip.activities || []).map((activity) => (
                  <span className="ea-chip" key={activity}>{activity}</span>
                ))}
              </div>

              {selectedTrip.photos?.length > 0 && (
                <>
                  <h3>Destination photos</h3>
                  <div className="ea-gallery-grid">
                    {selectedTrip.photos.map((item) => (
                      <img key={item.id} src={item.url} alt={item.name} />
                    ))}
                  </div>
                </>
              )}

              {selectedTrip.videos?.length > 0 && (
                <>
                  <h3>Destination videos</h3>
                  <div className="ea-gallery-grid">
                    {selectedTrip.videos.map((item) => (
                      <video key={item.id} src={item.url} controls />
                    ))}
                  </div>
                </>
              )}

              <button
                className="ea-btn ea-btn-primary ea-full"
                disabled={selectedTrip.tag === "SOLD OUT"}
                onClick={() => startBooking(selectedTrip)}
              >
                <Ticket size={18} /> Book This Trip
              </button>
            </div>
          </section>
        )}

        {page === "Booking Form" && selectedTrip && (
          <section className="ea-panel ea-booking-panel">
            <button className="ea-back-button" onClick={() => go("Explore")}>
              <ArrowLeft size={18} /> Back
            </button>
            <h1>Complete Your Booking</h1>
            <div className="ea-booking-summary">
              <h3>{selectedTrip.name}</h3>
              <p><MapPin size={15} /> {selectedTrip.destination}</p>
              <strong>{money(selectedTrip.fare)}</strong>
            </div>

            <div className="ea-payment-instructions">
              <h3><Wallet size={19} /> Pay via M-Pesa</h3>
              <span className="ea-payment-method">{payment.method}</span>

              {payment.businessName && (
                <p><strong>Recipient name:</strong> {payment.businessName}</p>
              )}

              {payment.method === "Till Number" && (
                <p><strong>Till number:</strong> {payment.tillNumber || "Awaiting admin setup"}</p>
              )}
              {payment.method === "Paybill" && (
                <>
                  <p><strong>Paybill number:</strong> {payment.paybillNumber || "Awaiting admin setup"}</p>
                  <p><strong>Account number:</strong> {payment.accountNumber || "Awaiting admin setup"}</p>
                </>
              )}
              {payment.method === "Pochi La Biashara" && (
                <p><strong>Business phone:</strong> {payment.phoneNumber || "Awaiting admin setup"}</p>
              )}

              <ol>
                <li>Open M-Pesa on your phone or SIM Toolkit.</li>
                <li>Select <strong>Lipa na M-Pesa</strong>.</li>
                {payment.method === "Till Number" && (
                  <li>Select Buy Goods and Services, then enter the Till number.</li>
                )}
                {payment.method === "Paybill" && (
                  <>
                    <li>Select Paybill and enter the business Paybill number.</li>
                    <li>Enter the account number shown above.</li>
                  </>
                )}
                {payment.method === "Pochi La Biashara" && (
                  <>
                    <li>Select Pochi La Biashara using the available M-Pesa menu.</li>
                    <li>Use the business details displayed above.</li>
                  </>
                )}
                <li>Enter the trip amount: <strong>{money(selectedTrip.fare)}</strong>.</li>
                <li>Confirm the recipient name and amount before entering your PIN.</li>
                <li>After payment, copy the M-Pesa transaction code into the form below.</li>
              </ol>

              {payment.instructions && <p>{payment.instructions}</p>}
              <p className="ea-notice">
                <ShieldCheck size={16} /> Never share your M-Pesa PIN or password.
              </p>
            </div>

            <form className="ea-form" onSubmit={submitBooking}>
              <label>Full name</label>
              <input
                required
                value={bookingForm.name || ""}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                placeholder="Name used for payment"
              />
              <label>Phone number</label>
              <input
                required
                type="tel"
                value={bookingForm.phone || ""}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                placeholder="07XX XXX XXX"
              />
              <label>M-Pesa transaction code / receipt reference</label>
              <input
                required
                value={bookingForm.transactionCode || ""}
                onChange={(e) => setBookingForm({ ...bookingForm, transactionCode: e.target.value })}
                placeholder="Enter transaction code"
              />
              <button className="ea-btn ea-btn-primary ea-full" type="submit">
                Submit for Admin Verification
              </button>
              <p className="ea-muted ea-small">
                Your booking remains pending until an administrator verifies your payment.
              </p>
            </form>
          </section>
        )}

        {page === "Bookings" && (
          <section className="ea-section ea-page-section">
            <div className="ea-page-heading">
              <h1>My Bookings</h1>
              <p>Track your adventure reservations.</p>
            </div>
            <div className="ea-booking-list">
              {bookings.filter((b) => b.userId === user.id || isAdmin).map((booking) => (
                <article className="ea-booking-card" key={booking.id}>
                  <div className="ea-booking-card-main">
                    <div className="ea-booking-icon"><Ticket size={22} /></div>
                    <div>
                      <h3>{booking.tripName}</h3>
                      <p>{money(booking.fare)} · {booking.name}</p>
                      <small>Receipt: {booking.transactionCode}</small>
                      <span className={`ea-status ea-status-${booking.status === "Approved" ? "approved" : booking.status === "Rejected" ? "rejected" : "pending"}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="ea-inline-actions">
                      <button onClick={() => setBookingStatus(booking.id, "Approved")}><Check size={16} /> Approve</button>
                      <button onClick={() => setBookingStatus(booking.id, "Rejected")}><X size={16} /> Reject</button>
                    </div>
                  )}
                </article>
              ))}
              {bookings.filter((b) => b.userId === user.id || isAdmin).length === 0 && (
                <div className="ea-empty">
                  <CalendarDays size={38} />
                  <h3>No bookings yet</h3>
                  <p>Your next adventure starts here.</p>
                  <button className="ea-btn ea-btn-primary" onClick={() => go("Explore")}>Explore Trips</button>
                </div>
              )}
            </div>
          </section>
        )}

        {page === "Chats" && (
          <section className="ea-chat-layout">
            <div className="ea-chat-sidebar">
              <div className="ea-chat-list-heading">
                <h1>Chats</h1>
                <button className="ea-icon-button" onClick={() => notify("Create group: connect a backend to invite members.")}><Plus /></button>
              </div>
              <div className="ea-search ea-search-light">
                <Search size={17} />
                <input value={chatSearch} onChange={(e) => setChatSearch(e.target.value)} placeholder="Search chats..." />
              </div>
              {chats.filter((c) => c.name.toLowerCase().includes(chatSearch.toLowerCase())).map((chat) => (
                <button
                  key={chat.id}
                  className={`ea-chat-list-item ${activeChat?.id === chat.id ? "active" : ""}`}
                  onClick={() => setActiveChat(chat)}
                >
                  <div className="ea-chat-avatar">
                    {chat.type === "group" ? <Users size={21} /> : <MessageCircle size={21} />}
                  </div>
                  <div className="ea-chat-list-copy">
                    <strong>{chat.name}</strong>
                    <small>{chat.messages?.at(-1)?.text || (chat.type === "group" ? `${chat.members} members` : "Start a conversation")}</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="ea-chat-window">
              {!activeChat ? (
                <div className="ea-chat-welcome">
                  <MessageCircle size={54} />
                  <h2>Stay connected</h2>
                  <p>Choose a group or conversation to get started.</p>
                </div>
              ) : (
                <>
                  <div className="ea-chat-header">
                    <button className="ea-chat-avatar" onClick={() => notify("Group and member profiles require shared accounts and backend support.")}>
                      {activeChat.type === "group" ? <Users /> : <User />}
                    </button>
                    <div>
                      <strong>{activeChat.name}</strong>
                      <small>{activeChat.type === "group" ? `${activeChat.members} members` : "Private conversation"}</small>
                    </div>
                    <button className="ea-icon-button" onClick={() => notify("Chat options")}><MoreVertical /></button>
                  </div>

                  <div className="ea-chat-messages">
                    {activeChat.messages?.map((msg) => (
                      <div key={msg.id} className={`ea-message ${msg.mine ? "mine" : ""}`}>
                        {!msg.mine && <small className="ea-message-sender">{msg.sender}</small>}
                        <p>{msg.text}</p>
                        <time>{msg.time}</time>
                      </div>
                    ))}
                  </div>

                  <form className="ea-chat-composer" onSubmit={sendMessage}>
                    <button type="button" className="ea-icon-button" onClick={() => notify("Media messaging requires file storage and a chat backend.")}><Paperclip /></button>
                    <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
                    <button type="button" className="ea-icon-button" onClick={() => notify("Microphone recording requires audio capture and message storage.")}><Mic /></button>
                    <button type="submit" className="ea-send-button"><Send size={18} /></button>
                  </form>
                </>
              )}
            </div>
          </section>
        )}        {page === "Chat Admin" && (
          <section className="ea-section ea-page-section">
            <div className="ea-page-heading">
              <h1>Chat Admin</h1>
              <p>Contact the Elite Adventures support team.</p>
            </div>
            <div className="ea-support-card">
              <div className="ea-support-header">
                <BrandLogo size={52} />
                <div>
                  <h3>Chat Admin</h3>
                  <span className="ea-online-dot" /> Official Support
                </div>
              </div>
              <div className="ea-support-body">
                <p className="ea-support-bubble">Hello! How can we help you today?</p>
                <p className="ea-muted">Ask us about trips, bookings and payment instructions.</p>
                <button className="ea-btn ea-btn-primary ea-full" onClick={() => {
                  const support = chats.find((c) => c.type === "admin");
                  setActiveChat(support || chats[0]);
                  go("Chats");
                }}>
                  <MessageCircle size={18} /> Start Conversation
                </button>
              </div>
            </div>
          </section>
        )}

        {page === "Gallery" && (
          <section className="ea-section ea-page-section">
            <div className="ea-page-heading">
              <h1>Photo Gallery</h1>
              <p>Memories from our adventures.</p>
            </div>
            <div className="ea-gallery-tools">
              <input
                value={galleryCaption}
                onChange={(e) => setGalleryCaption(e.target.value)}
                placeholder="Add a caption before uploading..."
              />
              <UploadButton
                multiple
                accept="image/*,video/*"
                onFiles={uploadGallery}
              />
            </div>

            <div className="ea-gallery-grid">
              {gallery.map((item) => (
                <article className="ea-gallery-item" key={item.id}>
                  {item.type?.startsWith("video/") ? (
                    <video src={item.url} controls />
                  ) : (
                    <img src={item.url} alt={item.caption || item.name} />
                  )}
                  <div className="ea-gallery-item-info">
                    <strong>{item.caption || item.name}</strong>
                    <small>By {item.uploader || "Adventurer"}</small>
                    <div className="ea-inline-actions">
                      <a
                        className="ea-download-link"
                        href={item.url}
                        download={item.name || "elite-adventures-media"}
                      >
                        <Download size={15} /> Download
                      </a>
                      {isAdmin && (
                        <button onClick={() => deleteGalleryItem(item.id)}>
                          <Trash2 size={15} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {gallery.length === 0 && (
              <div className="ea-empty">
                <ImageIcon size={40} />
                <h3>Your memories start here</h3>
                <p>Upload trip photos or videos to build the gallery.</p>
              </div>
            )}
          </section>
        )}

        {page === "Anonymous Chatbox" && (
          <section className="ea-anonymous-page">
            <div className="ea-anonymous-banner">
              <span className="ea-anonymous-brand">KEEP IT ICONIC®</span>
              <h1>ELITE ADVENTURES ®️</h1>
              <p className="ea-slogan">{SLOGAN}</p>
              <p>Share your thoughts. Inspire the adventure.</p>
            </div>

            <div className="ea-anonymous-content">
              <h2>Anonymous Chatbox</h2>
              <p>Your message is submitted for the administrator to review.</p>
              <form className="ea-form" onSubmit={submitAnonymous}>
                <textarea
                  value={anonymousText}
                  onChange={(e) => setAnonymousText(e.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  maxLength={2000}
                />
                <div className="ea-textarea-footer">
                  <span>{anonymousText.length}/2000</span>
                  <button className="ea-btn ea-btn-primary" type="submit">
                    <Send size={17} /> Submit Anonymously
                  </button>
                </div>
              </form>

              {isAdmin && (
                <div className="ea-admin-anonymous">
                  <h3>Messages for Admin Review</h3>
                  {anonymousMessages.map((item) => (
                    <article className="ea-anonymous-message" key={item.id}>
                      <p>{item.text}</p>
                      <small>{new Date(item.date).toLocaleString()}</small>
                      <div className="ea-inline-actions">
                        <button onClick={() => shareAnonymous(item)}>
                          <Share2 size={16} /> Share
                        </button>
                        <button onClick={() => setAnonymousMessages((prev) => prev.filter((m) => m.id !== item.id))}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {page === "Social Links" && (
          <section className="ea-section ea-page-section">
            <div className="ea-page-heading">
              <h1>Follow Our Adventures</h1>
              <p>Connect with Elite Adventures on social media.</p>
            </div>
            <div className="ea-social-grid">
              {socialLinks.map((social) => (
                <button
                  className="ea-social-card"
                  key={social.name}
                  onClick={() => openSocial(social)}
                >
                  <span className="ea-social-icon" style={{ color: social.color }}>
                    <SocialIcon type={social.icon} size={25} />
                  </span>
                  <strong>{social.name}</strong>
                  <span>Visit profile <ChevronRight size={15} /></span>
                </button>
              ))}
            </div>

            {isAdmin && (
              <div className="ea-panel">
                <h2>Edit Social Links</h2>
                {socialLinks.map((social, index) => (
                  <div className="ea-form ea-social-edit" key={social.name}>
                    <label>{social.name} URL</label>
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => setSocialLinks((prev) =>
                        prev.map((item, i) => i === index ? { ...item, url: e.target.value } : item)
                      )}
                    />
                  </div>
                ))}
                <button className="ea-btn ea-btn-primary" onClick={() => notify("Social links saved on this device.")}>
                  Save Social Links
                </button>
              </div>
            )}
          </section>
        )}

        {page === "About" && (
          <section className="ea-about-page">
            <div className="ea-about-cover">
              <img
                src={`${import.meta.env.BASE_URL}elite-adventures-cover.jpg`}
                alt="Adventure landscape"
              />
              <div className="ea-about-overlay" />
              <div className="ea-about-brand">
                <BrandLogo size={92} />
                <h1>{BRAND}™️</h1>
                <p className="ea-slogan">{SLOGAN}</p>
              </div>
            </div>

            <div className="ea-about-content">
              <h2>Our Story</h2>
              <p>
                Elite Adventures brings people together through travel,
                exploration, nature and unforgettable experiences.
              </p>
              <h2>Our Mission</h2>
              <p>
                To inspire people to explore new destinations, connect with
                fellow travellers and experience the beauty of adventure.
              </p>
              <h2>Our Community</h2>
              <p>
                Discover upcoming trips, share your memories, meet adventurers
                and become part of the Elite Adventures family.
              </p>
              <SocialRow socials={socialLinks} onOpen={openSocial} />
            </div>
          </section>
        )}

        {page === "My Profile" && (
          <section className="ea-section ea-page-section">
            <div className="ea-profile-cover">
              <img
                src={`${import.meta.env.BASE_URL}elite-adventures-cover.jpg`}
                alt=""
              />
              <div className="ea-profile-avatar">
                {user.name?.charAt(0)?.toUpperCase() || <User />}
              </div>
            </div>
            <div className="ea-profile-details">
              <h1>{user.name}</h1>
              <span className="ea-member-pill">Member</span>
              <p>{user.email}</p>
              <p>{user.phone || "Phone not added"}</p>
              <p>{profile.bio}</p>
              <div className="ea-profile-stats">
                <div><strong>{bookings.filter((b) => b.userId === user.id).length}</strong><span>Bookings</span></div>
                <div><strong>{gallery.filter((g) => g.uploader === user.name).length}</strong><span>Uploads</span></div>
              </div>
              <button className="ea-btn ea-btn-outline ea-full" onClick={() => go("Settings")}>
                <Pencil size={16} /> Edit Preferences
              </button>
            </div>
          </section>
        )}

        {page === "Settings" && (
          <section className="ea-section ea-page-section">
            <div className="ea-page-heading">
              <h1>Settings</h1>
              <p>Customise your Elite Adventures experience.</p>
            </div>

            <div className="ea-panel">
              <h2><User size={19} /> Profile</h2>
              <form className="ea-form" onSubmit={(e) => {
                e.preventDefault();
                setUser((prev) => ({ ...prev, name: authName || prev.name, phone: authPhone || prev.phone }));
                notify("Profile updated on this device.");
              }}>
                <label>Display name</label>
                <input value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder={user.name} />
                <label>Phone number</label>
                <input value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder={user.phone || "Add phone number"} />
                <button className="ea-btn ea-btn-primary" type="submit">Save Profile</button>
              </form>
            </div>

            <div className="ea-panel">
              <h2><Settings size={19} /> Appearance</h2>
              <label>Colour theme</label>
              <div className="ea-theme-options">
                {[
                  ["sunset", "Sunset", "linear-gradient(120deg,#f0008f,#ff8a00)"],
                  ["ocean", "Ocean", "linear-gradient(120deg,#0077ff,#00c8cb)"],
                  ["forest", "Forest", "linear-gradient(120deg,#087f5b,#9acb34)"],
                  ["royal", "Royal", "linear-gradient(120deg,#5712bd,#e02da1)"],
                  ["dark", "Dark", "linear-gradient(120deg,#101729,#39445a)"]
                ].map(([value, label, background]) => (
                  <button
                    key={value}
                    className={`ea-theme-choice ${profile.theme === value ? "selected" : ""}`}
                    onClick={() => updateProfile("theme", value)}
                  >
                    <span style={{ background }} />
                    {label}
                  </button>
                ))}
              </div>

              <label>Font size</label>
              <select value={profile.fontSize} onChange={(e) => updateProfile("fontSize", e.target.value)}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>

              <label>Language</label>
              <select value={profile.language} onChange={(e) => updateProfile("language", e.target.value)}>
                <option>English</option>
                <option>Kiswahili</option>
              </select>
            </div>

            <div className="ea-panel">
              <h2><Bell size={19} /> Notifications</h2>
              <label className="ea-toggle-row">
                <span>Trip and booking notifications</span>
                <input
                  type="checkbox"
                  checked={profile.notifications}
                  onChange={(e) => updateProfile("notifications", e.target.checked)}
                />
              </label>
            </div>

            <button className="ea-btn ea-btn-outline ea-full" onClick={logout}>
              <LogOut size={17} /> Sign Out
            </button>
          </section>
        )}        {page === "Announcements" && (
          <section className="ea-section ea-page-section">
            <div className="ea-page-heading">
              <h1>Announcements</h1>
              <p>Latest news from Elite Adventures.</p>
            </div>
            {announcements.map((item) => (
              <article className="ea-announcement-card" key={item.id}>
                <Megaphone size={22} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <small>{new Date(item.date).toLocaleString()}</small>
                </div>
                {isAdmin && (
                  <button className="ea-icon-button" onClick={() => deleteAnnouncement(item.id)}>
                    <Trash2 size={17} />
                  </button>
                )}
              </article>
            ))}
          </section>
        )}

        {page === "Admin Dashboard" && (
          <section className="ea-admin-page">
            {!isAdmin ? (
              <div className="ea-empty">
                <ShieldCheck size={42} />
                <h2>Administrator access required</h2>
                <p>Sign in through the secure administrator authentication system.</p>
                <button className="ea-btn ea-btn-primary" onClick={() => go("Admin Login")}>
                  Admin Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="ea-admin-heading">
                  <div>
                    <span className="ea-eyebrow">CONTROL CENTRE</span>
                    <h1>Admin Dashboard</h1>
                    <p>Manage trips, payments, bookings and community updates.</p>
                  </div>
                  <BrandLogo size={52} />
                </div>

                <div className="ea-admin-stats">
                  <div><Users /><strong>{gallery.length}</strong><span>Gallery uploads</span></div>
                  <div><Ticket /><strong>{bookings.length}</strong><span>Bookings</span></div>
                  <div><Compass /><strong>{trips.length}</strong><span>Trips</span></div>
                  <div><Wallet /><strong>{money(bookings.filter((b) => b.status === "Approved").reduce((sum, b) => sum + Number(b.fare || 0), 0))}</strong><span>Approved bookings value</span></div>
                </div>

                <div className="ea-admin-tabs">
                  {[
                    "Overview", "Trips", "Add Trip", "Bookings",
                    "Payments", "Announcements", "Gallery",
                    "Anonymous", "Social Links"
                  ].map((tab) => (
                    <button
                      key={tab}
                      className={adminTab === tab ? "active" : ""}
                      onClick={() => {
                        setAdminTab(tab);
                        if (tab === "Add Trip" && !editingTrip) setTripForm({});
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {adminTab === "Overview" && (
                  <div className="ea-admin-overview">
                    <div className="ea-panel">
                      <h2>Recent Bookings</h2>
                      {bookings.slice(0, 5).map((booking) => (
                        <div className="ea-admin-row" key={booking.id}>
                          <div>
                            <strong>{booking.tripName}</strong>
                            <small>{booking.name} · {booking.phone}</small>
                          </div>
                          <span className="ea-status ea-status-pending">{booking.status}</span>
                        </div>
                      ))}
                      {bookings.length === 0 && <p className="ea-muted">No bookings have been submitted.</p>}
                      <button className="ea-btn ea-btn-outline" onClick={() => setAdminTab("Bookings")}>Manage Bookings</button>
                    </div>
                    <div className="ea-panel">
                      <h2>Quick Actions</h2>
                      <button className="ea-btn ea-btn-primary ea-full" onClick={() => {
                        setTripForm({});
                        setEditingTrip(null);
                        setAdminTab("Add Trip");
                      }}><Plus size={17} /> Create Trip</button>
                      <button className="ea-btn ea-btn-outline ea-full" onClick={() => setAdminTab("Announcements")}><Megaphone size={17} /> Publish Announcement</button>
                      <button className="ea-btn ea-btn-outline ea-full" onClick={() => setAdminTab("Payments")}><Wallet size={17} /> Payment Settings</button>
                    </div>
                  </div>
                )}

                {adminTab === "Trips" && (
                  <div className="ea-panel">
                    <div className="ea-section-heading">
                      <h2>Manage Trips</h2>
                      <button className="ea-btn ea-btn-primary" onClick={() => {
                        setTripForm({});
                        setEditingTrip(null);
                        setAdminTab("Add Trip");
                      }}><Plus size={16} /> Add Trip</button>
                    </div>
                    {trips.map((trip) => (
                      <article className="ea-admin-trip-row" key={trip.id}>
                        <div className="ea-admin-trip-thumb">
                          {trip.cover ? <img src={trip.cover} alt="" /> : <Compass />}
                        </div>
                        <div className="ea-admin-trip-info">
                          <strong>{trip.name}</strong>
                          <small>{trip.destination} · {trip.date}</small>
                          <b>{money(trip.fare)}</b>
                          <span className="ea-tag">{trip.tag || "UPCOMING"}</span>
                        </div>
                        <div className="ea-admin-actions">
                          <button onClick={() => editTrip(trip)} aria-label="Edit trip"><Pencil size={17} /></button>
                          <button onClick={() => deleteTrip(trip.id)} aria-label="Delete trip"><Trash2 size={17} /></button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {adminTab === "Add Trip" && (
                  <div className="ea-panel">
                    <h2>{editingTrip ? "Edit Trip" : "Create Upcoming Trip"}</h2>
                    <form className="ea-form" onSubmit={saveTrip}>
                      <label>Trip name</label>
                      <input required value={tripForm.name || ""} onChange={(e) => updateTripField("name", e.target.value)} placeholder="e.g. Mount Kenya Expedition" />

                      <label>Destination name</label>
                      <input required value={tripForm.destination || ""} onChange={(e) => updateTripField("destination", e.target.value)} placeholder="e.g. Mount Kenya" />

                      <label>Trip description</label>
                      <textarea value={tripForm.description || ""} onChange={(e) => updateTripField("description", e.target.value)} placeholder="Describe the adventure..." rows={4} />

                      <div className="ea-form-grid">
                        <div>
                          <label>Start date</label>
                          <input type="date" required value={tripForm.date || ""} onChange={(e) => updateTripField("date", e.target.value)} />
                        </div>
                        <div>
                          <label>End date</label>
                          <input type="date" value={tripForm.endDate || ""} onChange={(e) => updateTripField("endDate", e.target.value)} />
                        </div>
                        <div>
                          <label>Fare (KSh)</label>
                          <input type="number" min="0" required value={tripForm.fare ?? ""} onChange={(e) => updateTripField("fare", e.target.value)} placeholder="2500" />
                        </div>
                        <div>
                          <label>Available seats</label>
                          <input type="number" min="0" value={tripForm.seats ?? ""} onChange={(e) => updateTripField("seats", e.target.value)} placeholder="12" />
                        </div>
                      </div>

                      <label>Trip tag</label>
                      <select value={tripForm.tag || "NEW"} onChange={(e) => updateTripField("tag", e.target.value)}>
                        <option value="NEW">New</option>
                        <option value="HOT">Hot</option>
                        <option value="POPULAR">Popular</option>
                        <option value="LIMITED">Limited Seats</option>
                        <option value="SOLD OUT">Sold Out</option>
                        <option value="COMING SOON">Coming Soon</option>
                      </select>

                      <label>Activities (separate with commas)</label>
                      <input
                        value={Array.isArray(tripForm.activities) ? tripForm.activities.join(", ") : tripForm.activities || ""}
                        onChange={(e) => updateTripField("activities", e.target.value)}
                        placeholder="Hiking, Camping, Photography"
                      />

                      <label>Meeting point</label>
                      <input value={tripForm.meetingPoint || ""} onChange={(e) => updateTripField("meetingPoint", e.target.value)} placeholder="e.g. Nairobi CBD" />

                      <label>Meeting time</label>
                      <input type="time" value={tripForm.meetingTime || ""} onChange={(e) => updateTripField("meetingTime", e.target.value)} />

                      <label>Top background / trip poster</label>
                      {tripForm.cover && <img className="ea-form-cover-preview" src={tripForm.cover} alt="Trip cover preview" />}
                      <UploadButton accept="image/*" onFiles={uploadTripCover} />

                      <label>Destination photos</label>
                      <UploadButton multiple accept="image/*" onFiles={(files) => uploadTripMedia(files, "photos")} />
                      <small className="ea-muted">{tripForm.photos?.length || 0} photos selected</small>

                      <label>Destination videos</label>
                      <UploadButton multiple accept="video/*" onFiles={(files) => uploadTripMedia(files, "videos")} />
                      <small className="ea-muted">{tripForm.videos?.length || 0} videos selected</small>

                      <div className="ea-inline-actions">
                        <button className="ea-btn ea-btn-primary" type="submit">
                          <Check size={17} /> {editingTrip ? "Update Trip" : "Publish Trip"}
                        </button>
                        <button type="button" className="ea-btn ea-btn-outline" onClick={() => {
                          setTripForm({});
                          setEditingTrip(null);
                          setAdminTab("Trips");
                        }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                {adminTab === "Bookings" && (
                  <div className="ea-panel">
                    <h2>Booking Verification</h2>
                    {bookings.map((booking) => (
                      <article className="ea-admin-booking" key={booking.id}>
                        <h3>{booking.tripName}</h3>
                        <p><strong>Customer:</strong> {booking.name}</p>
                        <p><strong>Phone:</strong> {booking.phone}</p>
                        <p><strong>Transaction code:</strong> {booking.transactionCode}</p>
                        <p><strong>Payment method:</strong> {booking.paymentMethod}</p>
                        <p><strong>Amount:</strong> {money(booking.fare)}</p>
                        <span className="ea-status ea-status-pending">{booking.status}</span>
                        <div className="ea-inline-actions">
                          <button className="ea-btn ea-btn-primary" onClick={() => setBookingStatus(booking.id, "Approved")}><CheckCircle size={16} /> Approve</button>
                          <button className="ea-btn ea-btn-outline" onClick={() => setBookingStatus(booking.id, "Rejected")}><XCircle size={16} /> Reject</button>
                        </div>
                      </article>
                    ))}
                    {bookings.length === 0 && <p className="ea-muted">No bookings to verify.</p>}
                  </div>
                )}                {adminTab === "Payments" && (
                  <div className="ea-panel">
                    <h2><Wallet size={20} /> Payment Configuration</h2>
                    <p className="ea-muted">
                      Select the payment method for the current booking process.
                    </p>

                    <form className="ea-form" onSubmit={savePaymentSettings}>
                      <label>Payment method</label>
                      <select
                        value={payment.method}
                        onChange={(e) => setPayment({
                          ...payment,
                          method: e.target.value
                        })}
                      >
                        <option value="Pochi La Biashara">Pochi La Biashara</option>
                        <option value="Till Number">Till Number / Buy Goods</option>
                        <option value="Paybill">Paybill</option>
                      </select>

                      <label>Business / recipient name displayed to customers</label>
                      <input
                        value={payment.businessName}
                        onChange={(e) => setPayment({ ...payment, businessName: e.target.value })}
                        placeholder="Enter the exact M-Pesa recipient name"
                      />

                      {payment.method === "Pochi La Biashara" && (
                        <>
                          <label>Business phone number</label>
                          <input
                            value={payment.phoneNumber}
                            onChange={(e) => setPayment({ ...payment, phoneNumber: e.target.value })}
                            placeholder="Enter Pochi business phone number"
                          />
                        </>
                      )}

                      {payment.method === "Till Number" && (
                        <>
                          <label>Till number</label>
                          <input
                            value={payment.tillNumber}
                            onChange={(e) => setPayment({ ...payment, tillNumber: e.target.value })}
                            placeholder="Enter Buy Goods Till number"
                          />
                        </>
                      )}

                      {payment.method === "Paybill" && (
                        <>
                          <label>Paybill number</label>
                          <input
                            value={payment.paybillNumber}
                            onChange={(e) => setPayment({ ...payment, paybillNumber: e.target.value })}
                            placeholder="Enter business Paybill number"
                          />
                          <label>Account number / reference</label>
                          <input
                            value={payment.accountNumber}
                            onChange={(e) => setPayment({ ...payment, accountNumber: e.target.value })}
                            placeholder="e.g. trip name or booking reference"
                          />
                        </>
                      )}

                      <label>Additional payment instructions</label>
                      <textarea
                        rows={4}
                        value={payment.instructions}
                        onChange={(e) => setPayment({ ...payment, instructions: e.target.value })}
                        placeholder="Enter any extra payment instructions for customers..."
                      />

                      <div className="ea-payment-instructions">
                        <h3>Customer instructions preview</h3>
                        <ol>
                          <li>Open M-Pesa or your SIM Toolkit.</li>
                          <li>Select Lipa na M-Pesa.</li>
                          {payment.method === "Till Number" && (
                            <li>Select Buy Goods and Services and enter the Till number above.</li>
                          )}
                          {payment.method === "Paybill" && (
                            <>
                              <li>Select Paybill and enter the Paybill number above.</li>
                              <li>Enter the configured account number.</li>
                            </>
                          )}
                          {payment.method === "Pochi La Biashara" && (
                            <li>Select Pochi La Biashara using the available M-Pesa menu and follow the business payment prompts.</li>
                          )}
                          <li>Enter the trip fare displayed on the booking page.</li>
                          <li>Confirm the displayed recipient name before authorising payment.</li>
                          <li>Submit the transaction code with your booking.</li>
                        </ol>
                        <p><strong>Recipient:</strong> {payment.businessName || "Not configured"}</p>
                        <p><strong>Method:</strong> {payment.method}</p>
                        {payment.instructions && <p>{payment.instructions}</p>}
                      </div>

                      <button className="ea-btn ea-btn-primary ea-full" type="submit">
                        <Check size={17} /> Save Payment Settings
                      </button>
                    </form>
                  </div>
                )}

                {adminTab === "Announcements" && (
                  <div className="ea-panel">
                    <h2><Megaphone size={20} /> Publish Announcement</h2>
                    <form className="ea-form" onSubmit={publishAnnouncement}>
                      <label>Announcement title</label>
                      <input
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                        placeholder="e.g. New trip now open for booking"
                        required
                      />
                      <label>Announcement message</label>
                      <textarea
                        rows={5}
                        value={announcementForm.text}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                        placeholder="Write your announcement..."
                        required
                      />
                      <button className="ea-btn ea-btn-primary" type="submit">
                        <Megaphone size={17} /> Publish
                      </button>
                    </form>

                    <h3>Published Announcements</h3>
                    {announcements.map((item) => (
                      <article className="ea-announcement-card" key={item.id}>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.text}</p>
                          <small>{new Date(item.date).toLocaleString()}</small>
                        </div>
                        <button className="ea-icon-button" onClick={() => deleteAnnouncement(item.id)}>
                          <Trash2 size={17} />
                        </button>
                      </article>
                    ))}
                  </div>
                )}

                {adminTab === "Gallery" && (
                  <div className="ea-panel">
                    <h2>Manage Gallery</h2>
                    <p>Upload photos or videos from completed trips for members to view.</p>
                    <div className="ea-gallery-tools">
                      <input
                        value={galleryCaption}
                        onChange={(e) => setGalleryCaption(e.target.value)}
                        placeholder="Trip name or caption"
                      />
                      <UploadButton
                        multiple
                        accept="image/*,video/*"
                        onFiles={uploadGallery}
                      />
                    </div>
                    <div className="ea-gallery-grid">
                      {gallery.map((item) => (
                        <article className="ea-gallery-item" key={item.id}>
                          {item.type?.startsWith("video/") ? (
                            <video src={item.url} controls />
                          ) : (
                            <img src={item.url} alt={item.caption || item.name} />
                          )}
                          <div className="ea-gallery-item-info">
                            <strong>{item.caption || item.name}</strong>
                            <a href={item.url} download={item.name || "elite-adventures-media"}>
                              <Download size={15} /> Download
                            </a>
                            <button onClick={() => deleteGalleryItem(item.id)}>
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === "Anonymous" && (
                  <div className="ea-panel">
                    <h2>Anonymous Chatbox Messages</h2>
                    <p>These messages are shown here for administrator review.</p>
                    {anonymousMessages.map((item) => (
                      <article className="ea-anonymous-message" key={item.id}>
                        <p>{item.text}</p>
                        <small>{new Date(item.date).toLocaleString()}</small>
                        <div className="ea-inline-actions">
                          <button onClick={() => shareAnonymous(item)}><Share2 size={16} /> Share</button>
                          <button onClick={() => setAnonymousMessages((prev) => prev.filter((m) => m.id !== item.id))}><Trash2 size={16} /> Delete</button>
                        </div>
                      </article>
                    ))}
                    {anonymousMessages.length === 0 && <p className="ea-muted">No anonymous messages yet.</p>}
                  </div>
                )}

                {adminTab === "Social Links" && (
                  <div className="ea-panel">
                    <h2>Manage Social Links</h2>
                    <p>These five social links are the official links shown on the front end.</p>
                    {socialLinks.map((social, index) => (
                      <div className="ea-social-edit" key={social.name}>
                        <label>{social.name}</label>
                        <input
                          type="url"
                          value={social.url}
                          onChange={(e) => setSocialLinks((prev) =>
                            prev.map((item, i) => i === index
                              ? { ...item, url: e.target.value }
                              : item)
                          )}
                        />
                      </div>
                    ))}
                    <button className="ea-btn ea-btn-primary" onClick={() => {
                      saveStore("ea_socials", socialLinks);
                      notify("Social links saved.");
                    }}>
                      Save Social Links
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        <footer className="ea-footer">
          <BrandLogo size={42} />
          <strong>{BRAND}™️</strong>
          <p className="ea-slogan">{SLOGAN}</p>
          <SocialRow socials={socialLinks} onOpen={openSocial} />
          <small>Explore · Connect · Travel Together</small>
        </footer>
      </main>

      <nav className="ea-bottom-nav">
        {[
          { name: "Home", icon: Home },
          { name: "Explore", icon: Compass },
          { name: "Chats", icon: MessageCircle },
          { name: "Bookings", icon: CalendarDays },
          { name: "My Profile", icon: User }
        ].map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={page === name ? "active" : ""}
            onClick={() => go(name)}
          >
            <Icon size={21} />
            <span>{name === "My Profile" ? "Profile" : name}</span>
            {name === "Chats" && <i className="ea-nav-dot" />}
          </button>
        ))}
      </nav>

      {toast && <div className="ea-toast">{toast}</div>}
    </div>
  );
}

function SocialRow({ socials, onOpen }) {
  return (
    <div className="ea-social-row">
      {socials.map((social) => (
        <button
          type="button"
          key={social.name}
          title={social.name}
          aria-label={`Open ${social.name}`}
          className="ea-social-round"
          style={{ color: social.color }}
          onClick={() => onOpen(social)}
        >
          <SocialIcon type={social.icon} size={20} />
        </button>
      ))}
    </div>
  );
                                                         }
