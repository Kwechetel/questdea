"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

interface ArchitecturePreview {
  command: string;
  lines: string[];
}

const architectures: ArchitecturePreview[] = [
  {
    command: "lastte system preview --type=mvp",
    lines: [
      "Frontend: Next.js",
      "Backend: NestJS API",
      "Database: PostgreSQL",
      "Auth: JWT",
      "Hosting: VPS + Nginx",
      "",
      "Status: MVP-ready",
    ],
  },
  {
    command: "lastte system preview --type=fintech",
    lines: [
      "Frontend: Web + Mobile",
      "Backend: Modular Services",
      "Payments: Gateway + Webhooks",
      "Database: PostgreSQL + Redis",
      "Security: Role-based access",
      "",
      "Status: Production-grade",
    ],
  },
  {
    command: "lastte system preview --type=marketplace",
    lines: [
      "Users: Buyers / Sellers / Admin",
      "Core Services:",
      "- Listings",
      "- Orders",
      "- Payments",
      "- Messaging",
      "",
      "Scalability: Horizontal",
      "Status: Scale-ready",
    ],
  },
  {
    command: "lastte system preview --type=enterprise",
    lines: [
      "Modules:",
      "- Users",
      "- Inventory",
      "- Reporting",
      "- Automation",
      "",
      "Deployment: Private Server",
      "Maintenance: Long-term",
      "Status: Enterprise-stable",
    ],
  },
];

interface HeroTerminalProps {
  isMobile?: boolean;
}

const HeroTerminal: React.FC<HeroTerminalProps> = ({ isMobile = false }) => {
  const [currentArchIndex, setCurrentArchIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [showCursor, setShowCursor] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentArch = architectures[currentArchIndex];

  // Cursor blink animation
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing animation
  useEffect(() => {
    if (isClearing) {
      // Clearing phase - remove lines one by one
      const clearTimer = setTimeout(() => {
        setDisplayedLines((prev) => {
          if (prev.length === 0) {
            setIsClearing(false);
            setCurrentLineIndex(-1);
            setCurrentLineText("");
            setCurrentArchIndex((prev) => (prev + 1) % architectures.length);
            return [];
          }
          return prev.slice(0, -1);
        });
      }, 50);
      return () => clearTimeout(clearTimer);
    }

    const currentArch = architectures[currentArchIndex];
    const allLines = [
      currentArch.command,
      ...currentArch.lines,
    ];

    // Initialize: start with command line
    if (currentLineIndex === -1) {
      setCurrentLineIndex(0);
      setCurrentLineText("");
      return;
    }

    // Finished all lines, wait then clear
    if (currentLineIndex >= allLines.length) {
      const pauseTimeout = setTimeout(() => {
        setIsClearing(true);
      }, 3000);
      return () => clearTimeout(pauseTimeout);
    }

    const targetLine = allLines[currentLineIndex];

    // Still typing current line
    if (currentLineText.length < targetLine.length) {
      const typingTimeout = setTimeout(() => {
        setCurrentLineText((prev) => {
          const nextChar = targetLine[prev.length];
          return prev + nextChar;
        });
      }, 50 + Math.random() * 30); // Natural typing speed with variation
      return () => clearTimeout(typingTimeout);
    } else {
      // Finished current line, add to displayed lines and move to next
      const linePauseTimeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, targetLine]);
        setCurrentLineText("");
        setCurrentLineIndex((prev) => prev + 1);
      }, targetLine === "" ? 200 : 800); // Longer pause for empty lines
      return () => clearTimeout(linePauseTimeout);
    }
  }, [
    currentLineText,
    currentLineIndex,
    currentArchIndex,
    isClearing,
    displayedLines,
  ]);

  const renderLine = (line: string, index: number, isCommand: boolean = false) => {
    if (isCommand) {
      // Command line with prompt
      return (
        <div key={`cmd-${index}`} style={{ marginBottom: "8px" }}>
          <span style={{ color: "#FFD580" }}>{"> "}</span>
          <span style={{ color: "#4ECDC4" }}>{line}</span>
        </div>
      );
    }

    // Regular lines
    const isLabel = line.includes(":");
    const isBullet = line.startsWith("-");
    const isStatus = line.startsWith("Status:");

    if (isStatus) {
      const [label, value] = line.split(": ");
      return (
        <div key={`line-${index}`} style={{ marginBottom: "4px", marginTop: "8px" }}>
          <span style={{ color: "#888" }}>{label}:</span>{" "}
          <span style={{ color: "#4ECDC4" }}>{value}</span>
        </div>
      );
    }

    if (isBullet) {
      return (
        <div key={`line-${index}`} style={{ marginBottom: "4px", paddingLeft: "16px" }}>
          <span style={{ color: "#888" }}>{"- "}</span>
          <span style={{ color: "#fff" }}>{line.substring(2)}</span>
        </div>
      );
    }

    if (isLabel) {
      const [label, value] = line.split(": ");
      return (
        <div key={`line-${index}`} style={{ marginBottom: "4px" }}>
          <span style={{ color: "#888" }}>{label}:</span>{" "}
          <span style={{ color: "#fff" }}>{value}</span>
        </div>
      );
    }

    return (
      <div key={`line-${index}`} style={{ marginBottom: "4px", color: "#fff" }}>
        {line}
      </div>
    );
  };

  return (
    <Box
      ref={terminalRef}
      sx={{
        backgroundColor: "#0b0f1a",
        borderRadius: "12px",
        border: "1px solid rgba(255, 213, 128, 0.2)",
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 213, 128, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `,
        padding: isMobile ? "20px" : "24px",
        fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
        fontSize: isMobile ? "13px" : "14px",
        lineHeight: "1.6",
        color: "#fff",
        minHeight: isMobile ? "280px" : "320px",
        width: isMobile ? "100%" : "560px",
        maxWidth: "100%",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40px",
          background:
            "linear-gradient(to bottom, rgba(255, 213, 128, 0.05), transparent)",
          pointerEvents: "none",
          borderRadius: "12px 12px 0 0",
        },
      }}
    >
      {/* Terminal header bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box
          sx={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#ff5f56",
            boxShadow: "0 0 0 0.5px rgba(0, 0, 0, 0.2)",
          }}
        />
        <Box
          sx={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#ffbd2e",
            boxShadow: "0 0 0 0.5px rgba(0, 0, 0, 0.2)",
          }}
        />
        <Box
          sx={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#27c93f",
            boxShadow: "0 0 0 0.5px rgba(0, 0, 0, 0.2)",
          }}
        />
        <Box
          sx={{
            marginLeft: "auto",
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.4)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          lastte-terminal
        </Box>
      </Box>

      {/* Terminal content */}
      <Box
        sx={{
          minHeight: isMobile ? "200px" : "240px",
          position: "relative",
        }}
      >
        {/* Render completed lines */}
        {displayedLines.map((line, index) => {
          const isCommand = index === 0;
          return renderLine(line, index, isCommand);
        })}
        
        {/* Render currently typing line */}
        {!isClearing && currentLineIndex >= 0 && currentLineIndex < architectures[currentArchIndex].lines.length + 1 && currentLineText && (
          <div style={{ display: "inline-block", marginBottom: "4px" }}>
            {currentLineIndex === 0 ? (
              // Command line
              <>
                <span style={{ color: "#FFD580" }}>{"> "}</span>
                <span style={{ color: "#4ECDC4" }}>{currentLineText}</span>
              </>
            ) : (
              // Regular line - check type for proper styling
              (() => {
                const line = currentLineText;
                const isBullet = line.startsWith("-");
                const hasColon = line.includes(":");
                const isStatus = line.startsWith("Status:");

                if (isStatus && hasColon) {
                  const colonIndex = line.indexOf(": ");
                  if (colonIndex !== -1) {
                    const label = line.substring(0, colonIndex + 1);
                    const value = line.substring(colonIndex + 2);
                    return (
                      <>
                        <span style={{ color: "#888" }}>{label}</span>
                        {value && <><span> </span><span style={{ color: "#4ECDC4" }}>{value}</span></>}
                      </>
                    );
                  }
                }

                if (isBullet) {
                  return (
                    <div style={{ paddingLeft: "16px" }}>
                      <span style={{ color: "#888" }}>{"- "}</span>
                      <span style={{ color: "#fff" }}>{line.substring(2)}</span>
                    </div>
                  );
                }

                if (hasColon) {
                  const colonIndex = line.indexOf(": ");
                  if (colonIndex !== -1) {
                    const label = line.substring(0, colonIndex + 1);
                    const value = line.substring(colonIndex + 2);
                    return (
                      <>
                        <span style={{ color: "#888" }}>{label}</span>
                        {value && <><span> </span><span style={{ color: "#fff" }}>{value}</span></>}
                      </>
                    );
                  } else if (line.endsWith(":")) {
                    // Just typed the colon, no value yet
                    return (
                      <>
                        <span style={{ color: "#888" }}>{line}</span>
                      </>
                    );
                  }
                }

                return <span style={{ color: "#fff" }}>{line}</span>;
              })()
            )}
            {showCursor && (
              <span
                style={{
                  color: "#FFD580",
                  marginLeft: "2px",
                }}
              >
                ▊
              </span>
            )}
          </div>
        )}
      </Box>
    </Box>
  );
};

export default HeroTerminal;

