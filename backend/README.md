# Qwerty Learner Backend

This is the backend service for Qwerty Learner, built with Node.js, TypeScript, Express, and Prisma.

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL database
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Then edit `.env` with your database credentials.

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run database migrations:

```bash
npm run prisma:migrate
```

## Development

Start the development server:

```bash
npm run dev
```

## Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

### Word Records

- POST /api/word-record - Create a new word record
- GET /api/word-records/:dict/:chapter? - Get word records for a dictionary and chapter

### Chapter Records

- POST /api/chapter-record - Create a new chapter record
- GET /api/chapter-records/:dict/:chapter? - Get chapter records for a dictionary and chapter

### Review Records

- POST /api/review-record - Create a new review record
- PUT /api/review-record/:id - Update a review record
- GET /api/review-records/:dict - Get review records for a dictionary

### Revision Dict Records

- POST /api/revision-dict-record - Create a new revision dictionary record
- GET /api/revision-dict-records/:dict - Get revision dictionary records

### Revision Word Records

- POST /api/revision-word-record - Create a new revision word record
- GET /api/revision-word-records/:dict - Get revision word records for a dictionary
