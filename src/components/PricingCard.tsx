import React from "react";
import { Card, Avatar, Typography, Box } from "@mui/material";

interface PricingCardProps {
  tierNumber: number;
  title: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  colorDark: string;
  deliverables?: string;
  bestFor: string;
  outcome: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tierNumber,
  title,
  price,
  description,
  features,
  color,
  colorDark,
  deliverables,
  bestFor,
  outcome,
}) => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: `0 4px 20px ${color}26`,
        width: { xs: 280, sm: 320 },
        minWidth: { xs: 280, sm: 320 },
        height: "auto",
        minHeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        borderTop: `4px solid ${color}`,
        background: "#fff",
        position: "relative",
        scrollSnapAlign: "start",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: `0 12px 40px ${color}40`,
          borderTop: `4px solid ${colorDark}`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${color}, ${colorDark})`,
          borderRadius: "3px 3px 0 0",
        },
      }}
    >
      {/* Tier Number Avatar */}
      <Avatar
        sx={{
          bgcolor: color,
          width: 64,
          height: 64,
          mb: 2,
          fontSize: "1.5rem",
          fontWeight: 700,
          boxShadow: `0 4px 12px ${color}4D`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1) rotate(5deg)",
            boxShadow: `0 6px 20px ${color}66`,
          },
        }}
      >
        {tierNumber}
      </Avatar>

      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 1.5,
          color: "#1A1A2E",
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        {title}
      </Typography>

      {/* Price */}
      <Typography
        sx={{
          color: color,
          fontWeight: 700,
          mb: 2,
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          lineHeight: 1.5,
        }}
        dangerouslySetInnerHTML={{ __html: price }}
      />

      {/* Description */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      {/* Features List */}
      <Box
        component="ul"
        sx={{
          textAlign: "left",
          fontSize: "0.95rem",
          margin: 0,
          paddingLeft: 3,
          marginBottom: 2,
          listStyle: "none",
          flex: 1,
          width: "100%",
          "& li": {
            position: "relative",
            paddingLeft: 2.5,
            marginBottom: 1.5,
            color: "#4a5568",
            lineHeight: 1.6,
            "&::before": {
              content: '"✓"',
              position: "absolute",
              left: 0,
              color: color,
              fontWeight: 700,
              fontSize: "1.1rem",
            },
          },
        }}
      >
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </Box>

      {/* Footer Information */}
      <Box
        sx={{
          mt: "auto",
          pt: 2,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          width: "100%",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontSize: "0.8rem",
            lineHeight: 1.6,
            display: "block",
            "& b": {
              color: "#1A1A2E",
              fontWeight: 600,
            },
          }}
        >
          {deliverables && (
            <>
              <b>Deliverables:</b> {deliverables}
              <br />
            </>
          )}
          <b>Best for:</b> {bestFor}
          <br />
          <b>Outcome:</b> {outcome}
        </Typography>
      </Box>
    </Card>
  );
};

export default PricingCard;
