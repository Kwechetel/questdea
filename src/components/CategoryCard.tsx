import React from "react";
import { Card, Avatar, Typography } from "@mui/material";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  iconLabel: string;
  avatarBgColor: string;
  avatarTextColor?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  iconLabel,
  avatarBgColor,
  avatarTextColor,
}) => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
      }}
    >
      <Avatar
        sx={{
          bgcolor: avatarBgColor,
          color: avatarTextColor || "inherit",
          width: 56,
          height: 56,
          mb: 2,
        }}
      >
        <span role="img" aria-label={iconLabel}>
          {icon}
        </span>
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Card>
  );
};

export default CategoryCard;
