# Deadwax

A React web app for discovering albums, playing 30-second previews (or full tracks via Deezer when available), keeping a personal listening log with statuses/ratings/notes, and getting AI-powered album recommendations based on your own saved collection.

## Live link

## Screenshot

## Features

- **Discover** — search albums and artists via the iTunes Search API (no key required).
- **Album page** — cover art, year, genre, full track list, 30-second previews, and links to Spotify, YouTube, and Apple Music.
- **Mini player** — persistent bottom bar with play/pause, previous/next, and a seek bar; keeps playing while you navigate.
- **My collection** — save albums with a status (Want to listen / Listening / Listened), a 1–5 star rating, and notes. Filter and sort.
- **Full album on Deezer** — if Deezer has a confident match for the album, you can switch to its embedded full-length player instead of the 30-second previews.
- **Full album on Youtube** - if Youtube has a match for the album, you can switch into it, just like Deezer.
- **AI recommendations** — sends your saved albums and ratings to Google's Gemini API, which suggests new albums based on the pattern in your taste. Suggestions are verified against the iTunes API before being shown.

## Tech stack

React, Vite, Context API (`CollectionContext`, `PlayerContext`), `localStorage` persistence, iTunes Search API, Deezer API (via a serverless function), Google Gemini API (via a serverless function), deployed on Vercel.
## Privacy note

The AI recommendations feature sends your saved albums' **titles, artists, ratings, and statuses** to Google's Gemini API to generate suggestions. Your personal **notes** are never sent.
> This is a learning project and is not affiliated with Apple, Spotify, Deezer, or Google.
