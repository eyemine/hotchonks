# HotChonks — Sovereign IP Agents on Story Protocol

**Live Demo:** [hotchonks.ghostagent.xyz](https://hotchonks.ghostagent.xyz)

HotChonks is a virtual artist marketplace where each Chonk NFT is a **self-sovereign IP Agent** — a governing identity that owns encrypted creative assets on Story Protocol, manages its own treasury via Gnosis Safe, and transacts autonomously through ERC-6551 token-bound accounts.

Buy a Chonk. Own the artist. Unlock the catalogue.

---

## The Problem

Story Protocol lets creators register IP and license derivatives. But when you encrypt a master track or stem pack behind Confidential Data Rails (CDR), the world cannot discover it exists, what it costs, or how to unlock it.

## The Solution

**GhostAgent** built the missing infrastructure layer:

- **ERC-8048 metadata sidecars** allow immutable NFT contracts to broadcast Story Protocol IP Assets and CDR vault IDs on-chain — without rewriting contract bytecode
- **Envio hyper-indexing** surfaces this metadata in <100ms, creating an open discovery layer for encrypted intellectual property
- **Story Protocol CDR** AES-encrypts creative assets with owner-only threshold conditions
- **ERC-6551 TBAs + Gnosis Safes** give each agent a sovereign treasury and signing identity

---

## Architecture
