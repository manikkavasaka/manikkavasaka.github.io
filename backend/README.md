# MK ShopZone Express REST API

## Run backend
```bash
node backend/server.js
```

## Health check
```bash
http://localhost:4000/api/health
```

## Main routes
- POST /api/auth/login
- GET /api/leads
- POST /api/leads
- PATCH /api/leads/:id/status
- GET /api/blog-posts
- POST /api/blog-posts
- PATCH /api/blog-posts/:id
- DELETE /api/blog-posts/:id
- GET /api/portfolio
- POST /api/portfolio
- PATCH /api/portfolio/:id
- DELETE /api/portfolio/:id
- GET /api/testimonials
- POST /api/testimonials
- PATCH /api/testimonials/:id/approve
- DELETE /api/testimonials/:id
- GET /api/subscribers
- POST /api/subscribers
- GET /api/payments
- POST /api/payments
- PATCH /api/payments/:id

## Notes
- Uses Express + CORS
- Uses JSON file persistence in `backend/data/db.json`
- Uses Nodemailer via `mailer.js`
- SMTP success can be verified at `/api/health`
