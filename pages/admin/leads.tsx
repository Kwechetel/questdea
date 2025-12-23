"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  Divider,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { LeadStatus, Role } from "@prisma/client";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business: string | null;
  budget: string | null;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuLeadId, setMenuLeadId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      window.location.href = "/admin-access";
      return;
    }

    // Check role - JWT stores it as string
    const isAdmin = String(session?.user?.role) === "ADMIN";
    if (status === "authenticated" && isAdmin) {
      fetchLeads();
    } else if (status === "authenticated" && !isAdmin) {
      window.location.href = "/admin-access";
    }
  }, [status, session, router]);

  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.status === statusFilter));
    }
  }, [statusFilter, leads]);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      const data = await response.json();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      setError("Failed to load leads. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    leadId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuLeadId(leadId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLeadId(null);
  };

  const handleViewLead = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lead details");
      }
      const lead = await response.json();
      setSelectedLead(lead);
      setDrawerOpen(true);
      handleMenuClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load lead details",
        severity: "error",
      });
      console.error(err);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      // Update selected lead if drawer is open
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }

      setSnackbar({
        open: true,
        message: `Status updated to ${newStatus}`,
        severity: "success",
      });
      handleMenuClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
      console.error(err);
    }
  };

  const handleDeleteClick = (leadId: string) => {
    setLeadToDelete(leadId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;

    try {
      const response = await fetch(`/api/leads/${leadToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead");
      }

      // Remove from local state
      setLeads((prev) => prev.filter((lead) => lead.id !== leadToDelete));
      setFilteredLeads((prev) =>
        prev.filter((lead) => lead.id !== leadToDelete)
      );

      // Close drawer if deleted lead was selected
      if (selectedLead && selectedLead.id === leadToDelete) {
        setDrawerOpen(false);
        setSelectedLead(null);
      }

      setSnackbar({
        open: true,
        message: "Lead deleted successfully",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete lead",
        severity: "error",
      });
      console.error(err);
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case "NEW":
        return "default";
      case "CONTACTED":
        return "primary";
      case "WON":
        return "success";
      case "LOST":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
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

  // Check role - JWT stores it as string
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
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
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
                Leads
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
              Leads Management
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              View and manage all incoming leads ({filteredLeads.length} total)
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "ALL")}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="NEW">New</MenuItem>
              <MenuItem value="CONTACTED">Contacted</MenuItem>
              <MenuItem value="WON">Won</MenuItem>
              <MenuItem value="LOST">Lost</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Budget</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No leads found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone || "-"}</TableCell>
                    <TableCell>{lead.budget || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status}
                        color={getStatusColor(lead.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, lead.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuLeadId === lead.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleViewLead(lead.id)}>
                          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
                          View Details
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleUpdateStatus(lead.id, LeadStatus.CONTACTED)
                          }
                          disabled={lead.status === LeadStatus.CONTACTED}
                        >
                          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                          Mark as Contacted
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleUpdateStatus(lead.id, LeadStatus.WON)
                          }
                          disabled={lead.status === LeadStatus.WON}
                        >
                          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                          Mark as Won
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleUpdateStatus(lead.id, LeadStatus.LOST)
                          }
                          disabled={lead.status === LeadStatus.LOST}
                        >
                          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                          Mark as Lost
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => handleDeleteClick(lead.id)}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Lead Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 500 } },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Lead Details
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selectedLead && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={selectedLead.status}
                    color={getStatusColor(selectedLead.status) as any}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {selectedLead.status !== LeadStatus.CONTACTED && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleUpdateStatus(selectedLead.id, LeadStatus.CONTACTED)
                      }
                    >
                      Mark Contacted
                    </Button>
                  )}
                  {selectedLead.status !== LeadStatus.WON && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() =>
                        handleUpdateStatus(selectedLead.id, LeadStatus.WON)
                      }
                    >
                      Mark Won
                    </Button>
                  )}
                  {selectedLead.status !== LeadStatus.LOST && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        handleUpdateStatus(selectedLead.id, LeadStatus.LOST)
                      }
                    >
                      Mark Lost
                    </Button>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Name
                </Typography>
                <Typography variant="body1">{selectedLead.name}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1">
                  <a
                    href={`mailto:${selectedLead.email}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {selectedLead.email}
                  </a>
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1">
                  {selectedLead.phone ? (
                    <a
                      href={`tel:${selectedLead.phone}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {selectedLead.phone}
                    </a>
                  ) : (
                    "-"
                  )}
                </Typography>
              </Box>

              {selectedLead.business && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Business
                  </Typography>
                  <Typography variant="body1">{selectedLead.business}</Typography>
                </Box>
              )}

              {selectedLead.budget && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Budget
                  </Typography>
                  <Typography variant="body1">{selectedLead.budget}</Typography>
                </Box>
              )}

              {selectedLead.message && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Message
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      bgcolor: "#f5f5f5",
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    {selectedLead.message}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body2">
                  {formatDate(selectedLead.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {formatDate(selectedLead.updatedAt)}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(selectedLead.id)}
                fullWidth
              >
                Delete Lead
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this lead? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
