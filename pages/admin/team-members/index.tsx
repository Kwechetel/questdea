"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string | null;
  description: string;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTeamMembersPage() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (status === "loading") {
      startTransition(() => {
        setCheckingSession(true);
      });
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

    startTransition(() => {
      setCheckingSession(false);
    });
  }, [status, session, isMounted]);

  useEffect(() => {
    if (!isMounted || checkingSession || status === "loading") return;

    fetchTeamMembers();
  }, [checkingSession, status, isMounted]);

  const fetchTeamMembers = async () => {
    try {
      startTransition(() => {
        setLoading(true);
      });
      const res = await fetch("/api/team-members", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch team members");
      const data = await res.json();
      startTransition(() => {
        setTeamMembers(data);
        setError("");
      });
    } catch (err: any) {
      startTransition(() => {
        setError(err.message || "Failed to load team members");
      });
    } finally {
      startTransition(() => {
        setLoading(false);
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const res = await fetch(`/api/team-members/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");
      await fetchTeamMembers();
      setAnchorEl(null);
      setSelectedMember(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete team member");
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    memberId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(memberId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  if (checkingSession || status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
              <Button
                component={Link}
                href="/admin"
                variant="text"
                sx={{ minWidth: "auto", p: 0, color: "text.secondary" }}
              >
                Dashboard
              </Button>
              <Typography sx={{ color: "text.secondary" }}>/</Typography>
              <Typography sx={{ color: "text.primary", fontWeight: 600 }}>
                Team Members
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1A1A2E",
                mb: 1,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              Team Members Management
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Manage your team members ({teamMembers.length} total)
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/admin/team-members/new"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
              color: "#1A1A2E",
              fontWeight: 700,
              "&:hover": {
                background: "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
              },
            }}
          >
            New Team Member
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Photo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <PeopleIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        No team members yet
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Add your first team member to get started
                      </Typography>
                      <Button
                        component={Link}
                        href="/admin/team-members/new"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                          background:
                            "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                          color: "#1A1A2E",
                          fontWeight: 700,
                        }}
                      >
                        Add Team Member
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  teamMembers.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell>
                        <Avatar
                          src={member.image || undefined}
                          alt={member.name}
                          sx={{
                            width: 56,
                            height: 56,
                            border: "2px solid rgba(255, 153, 0, 0.2)",
                          }}
                        >
                          {member.name.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, color: "#1A1A2E" }}
                        >
                          {member.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.role}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.1)",
                            color: "#1A1A2E",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {member.order}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            size="small"
                            component={Link}
                            href={`/admin/team-members/${member.id}`}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, member.id)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={
                              Boolean(anchorEl) && selectedMember === member.id
                            }
                            onClose={handleMenuClose}
                          >
                            <MenuItem
                              component={Link}
                              href={`/admin/team-members/${member.id}`}
                              onClick={handleMenuClose}
                            >
                              <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleDelete(member.id);
                                handleMenuClose();
                              }}
                              sx={{ color: "error.main" }}
                            >
                              <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                              Delete
                            </MenuItem>
                          </Menu>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
