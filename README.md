Spa Routine Quiz – React + Vite Project

Project Overview

This project is an interactive quiz application built with React (via Vite) and CSS. It guides users through a series of self-care questions and recommends products based on their answers. The app demonstrates modern React patterns, client-side routing with React Router, dynamic UI updates, and a clean, responsive design.

Features
Quiz Flow

- 5 multiple-choice questions about hair type, care habits, and preferences.
- Options are displayed in a styled card layout with lettered prefixes (a., b., c., etc.).
- Progress is shown via a circular progress bar starting at the 12 o’clock position.
- Supports going back/forward between questions.
- Answers are saved in localStorage (persisted across sessions).

Results Page
- Displays curated products based on quiz answers.
- Products are fetched from the Jeval Hair Care API, with a sample dataset fallback if the API is unavailable.
- Includes a wishlist toggle (heart icon), also persisted in localStorage.
- A slider component shows 3 cards at a time:
- 1 static “Daily Routine” copy card.
- 2 dynamic product recommendation cards.
- Slider includes navigation arrows and dot indicators.

Hero Sections
- Start Hero: Engaging introduction with background image and “Start Quiz” button.
- Results Hero: Background image, descriptive marketing text, and “Retake Quiz” button.

Error Handling
- Fallback product list displayed when API fetch fails.
- Notice bar displayed to inform the user about fallback mode.

Technologies Used
- React 18 – UI framework.
- Vite – fast dev server and bundler.
- React Router DOM (v6) – for client-side routing.
- CSS3 – for styling with nested rule syntax.
- LocalStorage API – for persisting answers and wishlist.

How to Run
- Clone/download the project.

Install dependencies:
- npm install

Start the development server:
- npm run dev

The app will run at http://localhost:5173/.

To build for production:
- npm run build

Possible Improvements
- Improve Responsiveness
- Add more quiz questions with richer answer logic.
- Improve accessibility (ARIA labels, keyboard navigation).
- Add responsive breakpoints for mobile-first optimization.
- Enhance product filtering (e.g., show top 3 matches instead of keyword-based).
- Integrate analytics to track quiz engagement.
- Replace static fallback products with a cached version of the last successful fetch.
