# Deadwax

A React web app for discovering albums, playing full tracks via Deezer or YouTube (when available) or 30-second iTunes previews, keeping a personal listening log with statuses, ratings, and notes, and getting AI-powered album recommendations based on your own saved collection.

## Screenshots

**Discover**

<img width="900" alt="image" src="https://github.com/user-attachments/assets/1a6f7804-81a2-4c66-a13c-d6893ad3a5cb" />

**Album search**

<img width="900" alt="image" src="https://github.com/user-attachments/assets/3b3fadfe-f36a-49e0-a406-199bd21024c0" />

**My collection**

<img width="900" alt="image" src="https://github.com/user-attachments/assets/438c501c-2b39-4c3c-9d63-f76ab99b38e2" />

**Album detail**

<img width="900" alt="image" src="https://github.com/user-attachments/assets/f175b341-3c4c-49b4-825b-172b311e693e" />

**Recommendations**

<img width="900" alt="image" src="https://github.com/user-attachments/assets/cf7aa3bc-a38f-4ac9-88ed-0e8d5d50729a" />

## Features

- **Discover**: search albums and artists via the iTunes Search API (no key required).
- **Album page**: cover art, year, genre, full track list, and links to Spotify, YouTube, and Apple Music.
- **Mini player**: persistent bottom bar with play/pause, previous/next, and a seek bar; keeps playing while you navigate.
- **My collection**: save albums with a status (Want to listen / Listening / Listened), a 1–5 star rating, and notes. Filter and sort.
- **Three playback sources**: 30-second iTunes previews by default, with the option to switch to a full album via Deezer's embedded player or a matched YouTube video, whichever the app can confidently find for that album.
- **AI recommendations**: sends your saved albums and ratings to Google's Gemini API, which suggests new albums based on the pattern in your taste. Suggestions are verified against the iTunes API before being shown, so hallucinated albums never make it to the screen.
- **Sidebar navigation UI**: a custom dark, app-shell-style interface (sidebar + content column) rather than the default top-navbar layout, inspired by real streaming-app patterns.

## Tech stack

React, Vite, Context API (`CollectionContext`, `PlayerContext`), `localStorage` persistence, iTunes Search API, Deezer API, YouTube Data API v3, Google Gemini API (Deezer/YouTube/Gemini each proxied through a Vercel serverless function to keep API keys server-side), deployed on Vercel.

## Limitations

- The collection is saved only in your own browser's `localStorage`: it is not synced across devices or browsers.
- Full-length playback via Deezer requires being logged in to Deezer in the same browser (and a plan/region that supports full tracks); the app cannot detect this automatically.
- Full-length playback via YouTube is subject to whatever the uploader allows (region restrictions, embedding disabled, etc.), and whether you see ads in it depends entirely on your own browser: an ad-blocking browser like Brave will generally block them the same as on youtube.com, while others will show normal YouTube ads. The app has no control over this either way.
- When neither Deezer nor YouTube has a confident match, the app falls back to 30-second iTunes previews.

## Privacy note

The AI recommendations feature sends your saved albums' **titles, artists, ratings, and statuses** to Google's Gemini API to generate suggestions. Your personal **notes** are never sent. The YouTube and Deezer lookups only ever send an album/artist search term, never your saved collection data.
