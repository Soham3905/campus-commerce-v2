"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: FooterRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Footer" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function FooterRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <div style={{ padding: "10px", backgroundColor: "#0f172a", color: "#f8fafc", ...style }}>
      <div style={{ display: "grid", gridAutoFlow: "column", gap: "10px" }}>
        {data?.sections?.map((section: any, i: number) => (
          <div key={i}>
            <h4 style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "5px", color: "#818cf8" }}>
              {section.title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {section.links?.map((link: any, j: number) => (
                <li
                  key={j}
                  style={{ fontSize: "11px", marginBottom: "5px", cursor: "pointer", color: "#94a3b8" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {data?.copyrightText && (
        <div style={{ borderTop: "1px solid #64748b", paddingTop: "8px", marginTop: "10px", textAlign: "center", fontSize: "11px", opacity: 0.6 }}>
          {data.copyrightText}
        </div>
      )}
    </div>
  );
}
