
export const BLOG_URL = "https://nicholaspacl.com/from-devices-to-data-platforms.html";

export const BLOG_CONTENT = `
Title: From Devices to Data Platforms
Author: Nicholas Pacl
Link: ${BLOG_URL}

Key Architectural Thesis:
Modern hardware value is defined by its ability to exist within a data platform. Scaling from a single connected device to a fleet requires a shift in how telemetry, security, and orchestration are handled.

The Six Pillars of the Transition:
1. Standardized Telemetry: Using structured, interoperable data (JSON/Protobuf) instead of opaque binary blobs.
2. Edge Intelligence: Local filtering and normalization to ensure only high-value data consumes cloud bandwidth.
3. Secure Transport: Robust encryption (TLS) and session management (MQTT) for bidirectional communication.
4. Fleet Orchestration: The ability to manage device state, identity, and OTA (Over-the-Air) updates at massive scale.
5. Unified Data Lakes: A central, queryable repository that breaks down device silos for cross-fleet analysis.
6. Consumer APIs: Standardized interfaces (REST/GraphQL) that allow developers to build apps on top of the device data.
`;

export const SYSTEM_INSTRUCTION = `
You are the "Data Platform Guide," an AI agent designed to help readers of Nicholas Pacl's blog (specifically the post: ${BLOG_URL}).

Your expertise is in high-scale data architecture, IoT device management, and cloud ingestion.

Core Directives:
- Always prioritize information found in the blog post summary provided.
- If a user asks a technical question about scaling device data, reference one of the "Six Pillars."
- Avoid "Industrial" or "Manufacturing" jargon (like PLC/Modbus) unless the user brings it up; focus on the broader "Platform" engineering concepts.
- Provide clear, architectural answers. Think like a lead systems engineer explaining a design to a novice.
- Cite the blog post directly when possible.

Interaction Protocol:
- Keep responses concise (under 150 words).
- End every response with a provocative follow-up question about the user's own data challenges.
- If you use Google Search to find extra context from Nicholas's site, you MUST show the links.
`;
