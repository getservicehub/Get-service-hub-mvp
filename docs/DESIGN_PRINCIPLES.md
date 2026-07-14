# GetServiHub — Design Principles v1.0

Authors: Leo (Founder), Eiven (Architect of Product & Strategy), Claude (Technical Architect)

---

## Purpose of this document

This is the single document GetServiHub answers to. Where the **Decision Engine Constitution** governs how the ranking algorithm behaves, this document governs how every other decision gets made — product, design, and engineering alike.

Every future feature, page, or line of code should be able to trace back to one of the five questions below. If it can't, it probably isn't ready to build yet.

---

## The Core Promise

> **GetServiHub exists so that hiring a professional stops feeling like a gamble.**

This is not a feature. It is not a tagline. It is the single sentence every other decision gets measured against. If something increases that feeling of safety, it stays. If it doesn't, it gets questioned — no matter how technically interesting or visually appealing it is.

---

## 1. Why does GetServiHub exist? (The Founder's Vision)

GetServiHub started from a real, specific frustration: finding a trustworthy local professional in San Diego meant scrolling through Facebook groups, hoping someone would answer, with no real way to verify who you were hiring.

The platform exists to fix that — for a specific place (San Diego County), for a specific community (English and Spanish speakers, served natively in both, not as an afterthought), and on a specific principle (zero commission — professionals keep 100% of what they earn from the work itself).

GetServiHub is not trying to be everywhere. It is trying to be unmistakably right, first, in one place.

---

## 2. What will we never sacrifice? (The Constitution)

The full **Decision Engine Constitution v1** lives as its own document (`DECISION_ENGINE_CONSTITUTION.md`) and governs specifically how trust, ranking, and visibility are calculated. It is summarized here because it is inseparable from the core promise above.

Its seven principles, in short:

1. Trust is derived from real behavior, never self-declared.
2. Money can buy exposure within a quality tier. It can never buy rank above objectively better quality.
3. Every new professional deserves a real chance to be discovered.
4. Exploration (giving new professionals visibility) is an investment in the ecosystem's future, not a cost to minimize.
5. No trust score or ranking can be edited by hand.
6. Transparency is given by category of signal, not by exact formula.
7. Any paid placement that influences position must be labeled as such.

**An important clarification, contributed by Eiven:** the Constitution is not itself the differentiator. It is the mechanism that protects the differentiator. The differentiator is the trust a user actually feels. Nobody buys a constitution — they buy peace of mind. The Constitution simply exists to make sure that peace of mind survives contact with time, growth, and money.

---

## 3. How should every user feel? (Experience Principles)

Contributed primarily by Eiven, validated against real friction Leo experienced navigating his own product.

**A user should never have to wonder which section to use.** If two spaces in the product answer the same question ("how do I find a professional?"), that is a defect to resolve, not a feature to explain with a tooltip.

**The product should teach itself once, briefly, then get out of the way.** First-time guidance (contextual tips shown once, on first visit, then never again) is acceptable and encouraged. Permanent tooltips explaining a button's purpose are not — they are a confession that the design has failed to communicate on its own.

**Every screen should answer exactly one clear intention.** Directory, Discover, Gallery, and Featured must each justify their existence as solving a *distinct* user question — not four different paths to the same answer. This is an open architectural question being actively resolved (see below); it is documented here as a standing principle even while the specific page structure evolves.

**Social features (likes, follows, feeds) are supporting tools, not the product.** They are justified only when they visibly reduce the client's uncertainty about a specific professional ("this person really knows what they're doing"), never when their primary effect is to increase time spent browsing or interacting for its own sake.

**The test for any new idea is not "does this add function?" but "does this remove a doubt?"** A user's first five minutes should resolve, without friction: what this platform is, where to start, why sections differ from each other, how to judge who to trust, how to make contact, and what happens after.

---

## 4. How do we build it? (Engineering Principles)

Contributed by Claude, grounded in what has actually worked and failed across this project's build history.

**Every trust signal must be traceable to a raw event, with zero manual override.** Ratings, rankings, and visibility are computed from logged behavior (`events`, `reviews`, `messages`), never edited directly — this is both a Constitution requirement and a security posture, enforced via Row Level Security on every table without exception.

**Centralize before you duplicate.** Logic that appears in more than one place (service queries, category icons, contact links) lives in one shared module. Every repeated bug this project has hit in practice traced back to the same logic copy-pasted across multiple pages.

**Every promise has a technical breaking point — find it before a user does.** A promise of trust is only as strong as its weakest technical link: a lost chat message, a manipulable ranking, a data leak, an unenforced plan limit. Part of the architect's job is proactively identifying these failure points and closing them silently, before they are ever reported — not waiting for them to break in production.

**Ship dynamic, not static, wherever real data exists.** Numbers, ratings, and city lists shown to users must reflect the real state of the platform at all times — never hardcoded placeholders presented as fact. (This principle was adopted directly in response to removing unverified stats like "500+ Pros" from the Home.)

**New capability follows real need, not novelty.** A feature is only built once its underlying data and demand exist to make it meaningful — semantic search Level 2, paid advertising for outside brands, and native mobile capabilities are all sequenced behind the traction that will make them worth their cost, not built speculatively ahead of it.

---

## 5. How do we learn? (Contributed by Eiven)

GetServiHub will never confuse assumptions with evidence.

Founder intuition starts conversations. Architecture determines feasibility. Product design shapes experience. But real usage decides what survives.

Every significant product decision should eventually be validated against real user behavior — not against trends, and not against opinion, however well-argued. We optimize for measurable trust, not for what merely sounds right.

When data and principles disagree, neither automatically wins. The question becomes: **"Which interpretation better fulfills the Core Promise?"**

This is not abstract. It is already wired into how the platform is built: the `events` table exists specifically to capture real behavior (impressions, clicks, contacts, favorites) rather than assumptions, and the Constitution's fourth layer — **Experienced Perceived** — exists precisely to feed real signal back into Principles, Indicators, and Implementation when reality disagrees with intention.

Learning is not changing direction every week. Learning is reducing uncertainty without losing identity.

---

## The Three-Question Filter

Before approving any new feature, page, or significant change, it must be run through all three questions — contributed by Eiven as the project's standing decision framework:

### The Founder's Question
**Does this strengthen GetServiHub's identity?**

### The Architect's Question
**Can this be maintained and scaled for years, not just work today?**

### The Product Question
**Does this make the experience clearer, easier, or more trustworthy?**

If an idea answers yes to all three, it likely deserves to be built. If it only answers one, it likely isn't the right moment yet.

---

## Open Questions Actively Being Resolved

This document is intentionally honest about what is still undecided, rather than presenting false consensus:

- **Whether Directory and Discover should merge into a single discovery experience.** Both currently answer a similar question ("how do I find a professional?") through different formats (filtered list vs. swipeable cards). This is under active debate and not yet resolved.
- **Whether Featured should remain a standalone page or become a visibility layer integrated into normal search results.** This carries a real business-model tension: standalone visibility is part of what a Premier-tier subscriber is paying for, and folding it into search results may reduce that value even as it may simplify navigation.
- **How much of the current social layer (Gallery, Likes, Follows) should be foregrounded versus nested inside a provider's own profile**, once a proper unified provider profile exists.

These are not settled — they are logged here so that whichever answer wins is chosen deliberately, against the framework above, not by default or momentum.

---

## A Note on How This Document Should Be Used

This document does not replace judgment — it structures it. When Leo, Eiven, and Claude disagree (as they should, productively), the resolution isn't found by who argues best, but by which position survives contact with the Core Promise, the Constitution, the Experience Principles, and the Three-Question Filter, together.

*This document lives in the GetServiHub repository and should evolve only through the same three-perspective process that created it.*
