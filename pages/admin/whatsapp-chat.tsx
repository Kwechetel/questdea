"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
} from "@mui/material";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  CheckCircle as CheckCircleIcon,
  DoneAll as DoneAllIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  UploadFile as UploadFileIcon,
  Edit as EditIcon,
  PushPin as PushPinIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Add as AddIcon,
} from "@mui/icons-material";

interface Conversation {
  phoneNumber: string;
  contactName: string | null;
  lastMessage: string;
  lastMessageType: string;
  lastMessageDirection: string;
  lastMessageTime: string;
  unreadCount: number;
  totalMessages: number;
  isPinned: boolean;
  lastReadAt: string | null;
}

interface Message {
  id: string;
  messageId: string;
  from: string;
  to: string;
  text: string | null;
  type: string;
  direction: string;
  status: string | null;
  timestamp: string;
  createdAt: string;
}

export default function WhatsAppChatPage() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false); // Start as false to prevent hydration issues
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    notes: "",
  });
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuConversation, setMenuConversation] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationPhone, setNewConversationPhone] = useState("");
  const [newConversationName, setNewConversationName] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Track when component is mounted (after hydration)
  useEffect(() => {
    // Use setTimeout to ensure this runs after hydration
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    startTransition(() => {
      if (status === "loading") {
        setCheckingSession(true);
        return;
      }

      if (status === "unauthenticated") {
        window.location.href = "/admin-access";
        return;
      }

      const isAdmin = String(session?.user?.role) === "ADMIN";
      if (status === "authenticated" && !isAdmin) {
        window.location.href = "/admin-access";
        return;
      }

      setCheckingSession(false);
    });
  }, [status, session, isMounted]);

  useEffect(() => {
    if (!isMounted || checkingSession || status === "loading") return;

    startTransition(() => {
      fetchConversations();
    });

    // Refresh conversations every 30 seconds
    const interval = setInterval(() => {
      startTransition(() => {
        fetchConversations();
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [checkingSession, status, isMounted]);

  useEffect(() => {
    if (!isMounted || !selectedConversation) return;

    startTransition(() => {
      fetchMessages(selectedConversation);
    });

    // Refresh messages every 10 seconds when conversation is selected
    const interval = setInterval(() => {
      startTransition(() => {
        fetchMessages(selectedConversation);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedConversation, isMounted]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    if (!isMounted) return;

    startTransition(() => {
      setLoading(true);
    });

    try {
      const res = await fetch("/api/whatsapp/conversations", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();
      startTransition(() => {
        setConversations(data);
        setError("");
        setLoading(false);
      });
    } catch (err: any) {
      startTransition(() => {
        setError(err.message || "Failed to load conversations");
        setLoading(false);
      });
    }
  };

  const fetchMessages = async (phoneNumber: string) => {
    try {
      const res = await fetch(
        `/api/whatsapp/messages?phone=${encodeURIComponent(phoneNumber)}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("Failed to fetch messages:", res.status, errorData);
        throw new Error(
          errorData.message || `Failed to fetch messages (${res.status})`
        );
      }

      const data = await res.json();

      // Debug: Log message data to check for emojis (only log once per fetch, not on every refresh)
      if (data.length > 0 && process.env.NODE_ENV === "development") {
        const firstMessage = data[0];
        if (firstMessage.text) {
          const emojiRegex =
            /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
          if (emojiRegex.test(firstMessage.text)) {
            console.log(
              "✅ Emojis found in fetched message:",
              firstMessage.text
            );
          }
        }
      }

      startTransition(() => {
        setMessages(data);
      });

      // Mark conversation as read when opening
      try {
        await fetch(
          `/api/whatsapp/conversations/${encodeURIComponent(phoneNumber)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ markAsRead: true }),
          }
        );
        // Refresh conversations to update unread count
        startTransition(() => {
          fetchConversations();
        });
      } catch (err) {
        // Silently fail - not critical
        console.error("Error marking as read:", err);
      }
    } catch (err: any) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/whatsapp/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          to: selectedConversation,
          message: newMessage,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      setNewMessage("");
      // Refresh messages
      await fetchMessages(selectedConversation);
      await fetchConversations();
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("+")) {
      return phone;
    }
    return `+${phone}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getMessageStatusIcon = (status: string | null, direction: string) => {
    if (direction !== "OUTGOING") return null;

    switch (status?.toUpperCase()) {
      case "SENT":
        return <CheckCircleIcon sx={{ fontSize: 16, color: "#8696A0" }} />;
      case "DELIVERED":
        return <DoneAllIcon sx={{ fontSize: 16, color: "#8696A0" }} />;
      case "READ":
        return <DoneAllIcon sx={{ fontSize: 16, color: "#53BDEB" }} />;
      default:
        return <CheckCircleIcon sx={{ fontSize: 16, color: "#8696A0" }} />;
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.contactName &&
        conv.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = async () => {
    if (!selectedConversation || !contactForm.name.trim()) return;

    try {
      // Normalize phone number to match database format
      let normalizedPhone = selectedConversation.replace(/\s+/g, "");
      if (!normalizedPhone.startsWith("+")) {
        normalizedPhone = `+${normalizedPhone}`;
      }

      const res = await fetch("/api/whatsapp/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phoneNumber: normalizedPhone,
          name: contactForm.name,
          email: contactForm.email || null,
          notes: contactForm.notes || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add contact");
      }

      setShowAddContact(false);
      setContactForm({ name: "", email: "", notes: "" });
      // Refresh conversations to show the new contact name
      await fetchConversations();
    } catch (err: any) {
      setError(err.message || "Failed to add contact");
    }
  };

  const handleUpdateContact = async () => {
    if (!editingContact || !contactForm.name.trim()) return;

    try {
      const res = await fetch(
        `/api/whatsapp/contacts/${encodeURIComponent(editingContact)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: contactForm.name,
            email: contactForm.email || null,
            notes: contactForm.notes || null,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update contact");
      }

      setEditingContact(null);
      setContactForm({ name: "", email: "", notes: "" });
      await fetchConversations();
    } catch (err: any) {
      setError(err.message || "Failed to update contact");
    }
  };

  const handleImportCSV = async (csvContent: string) => {
    try {
      const res = await fetch("/api/whatsapp/contacts/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ csvContent }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to import CSV");
      }

      const data = await res.json();
      await fetchConversations();
      alert(
        `Import completed: ${data.results.created} created, ${data.results.updated} updated`
      );
    } catch (err: any) {
      setError(err.message || "Failed to import CSV");
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    phoneNumber: string
  ) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuConversation(phoneNumber);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuConversation(null);
  };

  const handleDeleteConversation = async () => {
    if (!menuConversation) return;

    if (
      !confirm(
        `Are you sure you want to delete all messages with ${formatPhoneNumber(
          menuConversation
        )}? This action cannot be undone.`
      )
    ) {
      handleMenuClose();
      return;
    }

    try {
      const res = await fetch(
        `/api/whatsapp/conversations/${encodeURIComponent(menuConversation)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete conversation");

      // Remove from local state
      setConversations(
        conversations.filter((c) => c.phoneNumber !== menuConversation)
      );

      // If deleted conversation was selected, clear selection
      if (selectedConversation === menuConversation) {
        setSelectedConversation(null);
        setMessages([]);
      }

      handleMenuClose();
      fetchConversations(); // Refresh list
    } catch (err: any) {
      console.error("Error deleting conversation:", err);
      alert("Failed to delete conversation");
    }
  };

  const handleTogglePin = async () => {
    if (!menuConversation) return;

    const conversation = conversations.find(
      (c) => c.phoneNumber === menuConversation
    );
    if (!conversation) return;

    try {
      const res = await fetch(
        `/api/whatsapp/conversations/${encodeURIComponent(menuConversation)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isPinned: !conversation.isPinned }),
        }
      );

      if (!res.ok) throw new Error("Failed to update conversation");

      handleMenuClose();
      fetchConversations(); // Refresh list
    } catch (err: any) {
      console.error("Error toggling pin:", err);
      alert("Failed to update conversation");
    }
  };

  const handleMarkAsRead = async () => {
    if (!menuConversation) return;

    try {
      const res = await fetch(
        `/api/whatsapp/conversations/${encodeURIComponent(menuConversation)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ markAsRead: true }),
        }
      );

      if (!res.ok) throw new Error("Failed to mark as read");

      handleMenuClose();
      fetchConversations(); // Refresh list
    } catch (err: any) {
      console.error("Error marking as read:", err);
      alert("Failed to mark conversation as read");
    }
  };

  const handleNewConversation = async () => {
    if (!newConversationPhone.trim()) {
      alert("Please enter a phone number");
      return;
    }

    try {
      const res = await fetch("/api/whatsapp/conversations/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phoneNumber: newConversationPhone.trim(),
          name: newConversationName.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create conversation");
      }

      setShowNewConversation(false);
      setNewConversationPhone("");
      setNewConversationName("");
      fetchConversations(); // Refresh list

      // Optionally select the new conversation
      const data = await res.json();
      if (data.contact) {
        setSelectedConversation(data.contact.phoneNumber);
        fetchMessages(data.contact.phoneNumber);
      }
    } catch (err: any) {
      console.error("Error creating conversation:", err);
      alert(err.message || "Failed to create conversation");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleImportCSV(content);
    };
    reader.readAsText(file);
  };

  const fetchContact = async (phoneNumber: string) => {
    try {
      const res = await fetch(
        `/api/whatsapp/contacts/${encodeURIComponent(phoneNumber)}`,
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const contact = await res.json();
        setContactForm({
          name: contact.name || "",
          email: contact.email || "",
          notes: contact.notes || "",
        });
        setEditingContact(phoneNumber);
      } else {
        // No contact exists, show add form
        setContactForm({ name: "", email: "", notes: "" });
        setShowAddContact(true);
      }
    } catch (err) {
      console.error("Error fetching contact:", err);
    }
  };

  // Don't render until mounted to prevent hydration errors
  // Show loading state during initial mount
  if (!isMounted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#ECE5DD",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show loading state during session check
  if (checkingSession || status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#ECE5DD",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const isAdmin = String(session?.user?.role) === "ADMIN";
  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Access denied. Admin role required.</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{ minHeight: "100vh", bgcolor: "#ECE5DD", pt: { xs: 0, md: "64px" } }}
    >
      {/* Desktop: Back button above chat */}
      {!isMobile && (
        <Box sx={{ mb: 2, px: 2, pt: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            href="/admin"
            sx={{ color: "#1A1A2E", mb: 1 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      )}

      <Box
        sx={{
          height: { xs: "100vh", md: "calc(100vh - 100px)" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: "1400px",
          mx: "auto",
          bgcolor: "#fff",
          boxShadow: { xs: "none", md: "0 2px 10px rgba(0,0,0,0.1)" },
          position: { xs: "relative", md: "static" },
        }}
      >
        {/* Conversations List - WhatsApp Style */}
        <Box
          sx={{
            width: { xs: "100%", md: 400 },
            borderRight: { xs: "none", md: "1px solid #E4E6EB" },
            display: { xs: selectedConversation ? "none" : "flex", md: "flex" },
            flexDirection: "column",
            bgcolor: "#fff",
            height: { xs: "100vh", md: "auto" },
            position: { xs: "absolute", md: "static" },
            top: 0,
            left: 0,
            right: 0,
            zIndex: { xs: 1, md: "auto" },
          }}
        >
          {/* Mobile: Back to Dashboard button in header */}
          {isMobile && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#1A1A2E",
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <IconButton
                component={Link}
                href="/admin"
                sx={{ color: "#fff", mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
              >
                WhatsApp Chat
              </Typography>
            </Box>
          )}
          {/* Search Bar */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#F0F2F5",
              borderBottom: "1px solid #E4E6EB",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff",
                borderRadius: 2,
                px: 1.5,
                py: 1,
                mb: 1,
              }}
            >
              <SearchIcon sx={{ color: "#667781", fontSize: 20 }} />
              <TextField
                fullWidth
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "0.95rem" },
                }}
                sx={{ "& .MuiInputBase-root": { fontSize: "0.95rem" } }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setShowNewConversation(true)}
                sx={{
                  flex: 1,
                  bgcolor: "#FF9900",
                  color: "#1A1A2E",
                  fontSize: "0.75rem",
                  "&:hover": { bgcolor: "#e68a00" },
                  minWidth: "120px",
                }}
              >
                New Chat
              </Button>
              <Button
                size="small"
                startIcon={<PersonAddIcon />}
                onClick={() => {
                  if (selectedConversation) {
                    fetchContact(selectedConversation);
                  } else {
                    setShowAddContact(true);
                  }
                }}
                sx={{
                  flex: 1,
                  bgcolor: "#FF9900",
                  color: "#1A1A2E",
                  fontSize: "0.75rem",
                  "&:hover": { bgcolor: "#e68a00" },
                  minWidth: "120px",
                }}
              >
                Add Contact
              </Button>
              <Button
                size="small"
                startIcon={<UploadFileIcon />}
                component="label"
                sx={{
                  flex: 1,
                  bgcolor: "#1A1A2E",
                  color: "#fff",
                  fontSize: "0.75rem",
                  "&:hover": { bgcolor: "#2a2a3e" },
                  minWidth: "120px",
                }}
              >
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Box>

          {/* Conversations List */}
          <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#fff" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : filteredConversations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <ChatIcon
                  sx={{ fontSize: 64, color: "#667781", mb: 2, opacity: 0.5 }}
                />
                <Typography variant="body2" sx={{ color: "#667781" }}>
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#667781", display: "block", mt: 1 }}
                >
                  {searchQuery
                    ? "Try a different search"
                    : "Messages from clients will appear here"}
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredConversations.map((conv, index) => (
                  <React.Fragment key={conv.phoneNumber}>
                    <ListItem
                      button
                      onClick={() => setSelectedConversation(conv.phoneNumber)}
                      sx={{
                        bgcolor:
                          selectedConversation === conv.phoneNumber
                            ? "#F0F2F5"
                            : "transparent",
                        "&:hover": {
                          bgcolor:
                            selectedConversation === conv.phoneNumber
                              ? "#F0F2F5"
                              : "#F5F6F6",
                        },
                        py: 1.5,
                        px: 2,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: "#FF9900",
                            width: 49,
                            height: 49,
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            color: "#1A1A2E",
                          }}
                        >
                          {formatPhoneNumber(conv.phoneNumber).slice(-2)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {conv.isPinned && (
                                <PushPinIcon
                                  sx={{
                                    fontSize: "0.875rem",
                                    color: "#FF9900",
                                    transform: "rotate(45deg)",
                                  }}
                                />
                              )}
                              <Box>
                                <Typography
                                  component="div"
                                  variant="body2"
                                  sx={{
                                    fontWeight:
                                      conv.unreadCount > 0 ? 600 : 500,
                                    color: "#111B21",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  {conv.contactName ||
                                    formatPhoneNumber(conv.phoneNumber)}
                                </Typography>
                                {conv.contactName && (
                                  <Typography
                                    component="div"
                                    variant="caption"
                                    sx={{
                                      color: "#667781",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    {formatPhoneNumber(conv.phoneNumber)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                component="div"
                                variant="caption"
                                sx={{
                                  color: "#667781",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {formatTime(conv.lastMessageTime)}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={(e) =>
                                  handleMenuOpen(e, conv.phoneNumber)
                                }
                                sx={{
                                  p: 0.5,
                                  color: "#667781",
                                  "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                                }}
                              >
                                <MoreVertIcon sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              component="div"
                              variant="body2"
                              sx={{
                                color: "#667781",
                                fontSize: "0.875rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flex: 1,
                              }}
                            >
                              {conv.lastMessage || "No messages"}
                            </Typography>
                            {conv.unreadCount > 0 && (
                              <Chip
                                label={conv.unreadCount}
                                size="small"
                                sx={{
                                  bgcolor: "#FF9900",
                                  color: "#1A1A2E",
                                  height: 20,
                                  minWidth: 20,
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  "& .MuiChip-label": { px: 1 },
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredConversations.length - 1 && (
                      <Divider sx={{ ml: 9, borderColor: "#E4E6EB" }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>

        {/* Chat Area - WhatsApp Style */}
        <Box
          sx={{
            flex: 1,
            display: { xs: selectedConversation ? "flex" : "none", md: "flex" },
            flexDirection: "column",
            bgcolor: "#ECE5DD",
            position: { xs: "absolute", md: "relative" },
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: { xs: "100vh", md: "auto" },
            zIndex: { xs: 2, md: "auto" },
          }}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header - LASTTE Navy */}
              <Box
                sx={{
                  p: { xs: 1, md: 1.5 },
                  bgcolor: "#1A1A2E",
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, md: 2 },
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                {/* Mobile: Back button to conversation list */}
                {isMobile && (
                  <IconButton
                    onClick={() => setSelectedConversation(null)}
                    sx={{ color: "#fff", mr: { xs: -1, md: 0 } }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Avatar
                  sx={{
                    bgcolor: "#FF9900",
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    fontWeight: 600,
                    color: "#1A1A2E",
                  }}
                >
                  {formatPhoneNumber(selectedConversation).slice(-2)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: "#fff",
                      fontSize: { xs: "0.95rem", md: "1rem" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conversations.find(
                      (c) => c.phoneNumber === selectedConversation
                    )?.contactName || formatPhoneNumber(selectedConversation)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {conversations.find(
                      (c) => c.phoneNumber === selectedConversation
                    )?.contactName && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: { xs: "0.7rem", md: "0.75rem" },
                        }}
                      >
                        {formatPhoneNumber(selectedConversation)}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                      }}
                    >
                      {messages.length} messages
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => {
                    if (selectedConversation) {
                      fetchContact(selectedConversation);
                    }
                  }}
                  sx={{ color: "#fff" }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Messages Area - WhatsApp Background Pattern */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: { xs: 1.5, md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  backgroundImage:
                    'url(\'data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 100 0 L 0 0 0 100" fill="none" stroke="%23E4E6EB" stroke-width="0.5" opacity="0.3"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)" /%3E%3C/svg%3E\')',
                  backgroundSize: "100px 100px",
                  pb: { xs: 1, md: 2 },
                }}
              >
                {messages.map((msg, index) => {
                  const showDate =
                    index === 0 ||
                    formatDate(msg.timestamp) !==
                      formatDate(messages[index - 1].timestamp);
                  const isOutgoing = msg.direction === "OUTGOING";

                  // Check if this message should be grouped with the previous one
                  const prevMsg = index > 0 ? messages[index - 1] : null;
                  const isGrouped =
                    prevMsg &&
                    prevMsg.direction === msg.direction &&
                    formatDate(prevMsg.timestamp) ===
                      formatDate(msg.timestamp) &&
                    new Date(msg.timestamp).getTime() -
                      new Date(prevMsg.timestamp).getTime() <
                      300000; // 5 minutes

                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <Box sx={{ my: 1.5, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.9)",
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              color: "#667781",
                              fontSize: "0.75rem",
                              display: "inline-block",
                            }}
                          >
                            {formatDate(msg.timestamp)}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: isOutgoing
                            ? "flex-end"
                            : "flex-start",
                          mb: isGrouped ? 0.25 : 0.75,
                          px: { xs: 0.5, md: 1 },
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: { xs: "85%", md: "65%" },
                            minWidth: { xs: "120px", md: "150px" },
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              p: {
                                xs: "6px 7px 4px 9px",
                                md: "6px 7px 4px 9px",
                              },
                              borderRadius: isOutgoing
                                ? isGrouped
                                  ? "7.5px 0 7.5px 7.5px"
                                  : "7.5px 0 7.5px 7.5px"
                                : isGrouped
                                ? "0 7.5px 7.5px 7.5px"
                                : "0 7.5px 7.5px 7.5px",
                              bgcolor: isOutgoing ? "#FFD580" : "#fff",
                              boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                              position: "relative",
                              wordWrap: "break-word",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: 0.5,
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography
                                component="div"
                                variant="body2"
                                sx={{
                                  color: "#111B21",
                                  fontSize: "0.875rem",
                                  lineHeight: 1.28,
                                  wordBreak: "break-word",
                                  whiteSpace: "pre-wrap",
                                  flex: 1,
                                  pr: 1,
                                  pb: 0.25,
                                  fontFamily:
                                    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
                                }}
                              >
                                {msg.text || `[${msg.type}]`}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.25,
                                  flexShrink: 0,
                                  alignSelf: "flex-end",
                                  mt: "auto",
                                  pb: 0.25,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: isOutgoing
                                      ? "rgba(17,27,33,0.6)"
                                      : "#667781",
                                    fontSize: "0.6875rem",
                                    lineHeight: 1,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {formatTime(msg.timestamp)}
                                </Typography>
                                {isOutgoing && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      ml: 0.25,
                                    }}
                                  >
                                    {getMessageStatusIcon(
                                      msg.status,
                                      msg.direction
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input - WhatsApp Style */}
              <Box
                sx={{
                  p: { xs: 1, md: 1.5 },
                  bgcolor: "#F0F2F5",
                  borderTop: "1px solid #E4E6EB",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: { xs: 0.75, md: 1 },
                  position: "sticky",
                  bottom: 0,
                  zIndex: 10,
                }}
              >
                <IconButton
                  sx={{
                    color: "#54656F",
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                  }}
                >
                  <EmojiEmotionsIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
                <IconButton
                  sx={{
                    color: "#54656F",
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                  }}
                >
                  <AttachFileIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
                <TextField
                  fullWidth
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sending}
                  multiline
                  maxRows={4}
                  variant="outlined"
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: { xs: 3, md: 2 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: { xs: 3, md: 2 },
                      fontSize: { xs: "0.875rem", md: "0.9375rem" },
                      minHeight: { xs: 36, md: "auto" },
                      "& fieldset": {
                        borderColor: "transparent",
                      },
                      "&:hover fieldset": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "transparent",
                      },
                    },
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  sx={{
                    bgcolor: sending ? "#8696A0" : "#FF9900",
                    color: "#1A1A2E",
                    width: { xs: 36, md: 42 },
                    height: { xs: 36, md: 42 },
                    "&:hover": {
                      bgcolor: sending ? "#8696A0" : "#e68a00",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#8696A0",
                      color: "#fff",
                    },
                  }}
                >
                  {sending ? (
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                  ) : (
                    <SendIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                  )}
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
                bgcolor: "#ECE5DD",
              }}
            >
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  borderRadius: "50%",
                  bgcolor: "#F0F2F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <ChatIcon
                  sx={{ fontSize: 120, color: "#667781", opacity: 0.3 }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#667781",
                  fontWeight: 300,
                  fontSize: "1.5rem",
                }}
              >
                Keep your phone connected
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#667781",
                  textAlign: "center",
                  maxWidth: "400px",
                  lineHeight: 1.6,
                }}
              >
                WhatsApp connects to your phone to sync messages. To reduce data
                usage, connect your phone to Wi-Fi.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
            minWidth: 300,
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Conversation Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {menuConversation &&
          (() => {
            const conv = conversations.find(
              (c) => c.phoneNumber === menuConversation
            );
            if (!conv) return null;
            return (
              <>
                {conv.isPinned ? (
                  <MenuItem onClick={handleTogglePin}>
                    <ListItemIcon>
                      <PushPinIcon fontSize="small" />
                    </ListItemIcon>
                    <MuiListItemText>Unpin</MuiListItemText>
                  </MenuItem>
                ) : (
                  <MenuItem onClick={handleTogglePin}>
                    <ListItemIcon>
                      <PushPinIcon fontSize="small" />
                    </ListItemIcon>
                    <MuiListItemText>Pin</MuiListItemText>
                  </MenuItem>
                )}
                {conv.unreadCount > 0 && (
                  <MenuItem onClick={handleMarkAsRead}>
                    <ListItemIcon>
                      <MarkEmailReadIcon fontSize="small" />
                    </ListItemIcon>
                    <MuiListItemText>Mark as Read</MuiListItemText>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={handleDeleteConversation}
                  sx={{ color: "error.main" }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
                  </ListItemIcon>
                  <MuiListItemText>Delete</MuiListItemText>
                </MenuItem>
              </>
            );
          })()}
      </Menu>

      {/* New Conversation Dialog */}
      <Dialog
        open={showNewConversation}
        onClose={() => {
          setShowNewConversation(false);
          setNewConversationPhone("");
          setNewConversationName("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Phone Number"
            value={newConversationPhone}
            onChange={(e) => setNewConversationPhone(e.target.value)}
            placeholder="+1234567890"
            required
            sx={{ mt: 2, mb: 2 }}
            helperText="Enter phone number in international format (e.g., +1234567890)"
          />
          <TextField
            fullWidth
            label="Name (Optional)"
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowNewConversation(false);
              setNewConversationPhone("");
              setNewConversationName("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNewConversation}
            variant="contained"
            sx={{
              bgcolor: "#FF9900",
              color: "#1A1A2E",
              "&:hover": { bgcolor: "#e68a00" },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Contact Dialog */}
      <Dialog
        open={showAddContact || editingContact !== null}
        onClose={() => {
          setShowAddContact(false);
          setEditingContact(null);
          setContactForm({ name: "", email: "", notes: "" });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingContact ? "Edit Contact" : "Add Contact"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={contactForm.name}
            onChange={(e) =>
              setContactForm({ ...contactForm, name: e.target.value })
            }
            required
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email (Optional)"
            type="email"
            value={contactForm.email}
            onChange={(e) =>
              setContactForm({ ...contactForm, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={contactForm.notes}
            onChange={(e) =>
              setContactForm({ ...contactForm, notes: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          {selectedConversation && (
            <Typography variant="caption" color="text.secondary">
              Phone: {formatPhoneNumber(selectedConversation)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAddContact(false);
              setEditingContact(null);
              setContactForm({ name: "", email: "", notes: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editingContact ? handleUpdateContact : handleAddContact}
            variant="contained"
            disabled={!contactForm.name.trim()}
            sx={{
              bgcolor: "#FF9900",
              color: "#1A1A2E",
              "&:hover": { bgcolor: "#e68a00" },
            }}
          >
            {editingContact ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
