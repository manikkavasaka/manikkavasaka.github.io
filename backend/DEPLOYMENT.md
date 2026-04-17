# Deployment Guide

Complete deployment guide for development, staging, and production.

## Local Development with Docker

Quick start:
```bash
docker-compose up --build
```

Starts:
- MongoDB (localhost:27017)
- Backend API (localhost:8000)
- Frontend (localhost:5173)

Access:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Frontend: http://localhost:5173

Stop:
```bash
docker-compose down
docker-compose down -v  # Also removes data
```

## Production Deployment

### Prerequisites
- Docker & Docker Compose
- MongoDB Atlas or self-hosted MongoDB
- Kubernetes cluster (recommended)
- Domain + SSL certificate

### Environment Setup

Create `.env.production`:
```bash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGO_DB=mkshopzone_prod

PREFERRED_AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

SENDGRID_API_KEY=SG-...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

META_ACCESS_TOKEN=EAAB...
META_PHONE_NUMBER_ID=...

ADMIN_SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_ORIGINS=https://yourdomain.com

LOG_LEVEL=INFO
ENV=production
```

### Build Docker Image

```bash
docker build -t mkshopzone-backend:v1.0.0 .
docker tag mkshopzone-backend:v1.0.0 yourusername/mkshopzone:v1.0.0
docker push yourusername/mkshopzone:v1.0.0
```

### Single Server Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
kubectl create namespace mkshopzone
kubectl create secret generic mkshopzone-secrets \
  --from-literal=mongo-uri=$MONGO_URI \
  --from-literal=openai-api-key=$OPENAI_API_KEY \
  -n mkshopzone

kubectl apply -f k8s/deployment.yaml
```

## Health Checks

```bash
curl https://yourdomain.com/api/v1/health
```

Response: `{"success": true, "data": {"status": "healthy"}}`

## Database Setup

Create indexes:
```bash
docker-compose exec backend python create_indexes.py
# or: kubectl exec -it deployment/mkshopzone-backend -- python create_indexes.py
```

## Monitoring

View logs:
```bash
docker-compose logs -f backend
# or: kubectl logs -f deployment/mkshopzone-backend -n mkshopzone
```

## Troubleshooting

**Container won't start:**
```bash
docker-compose logs backend
# Check MONGO_URI, API keys, ALLOWED_ORIGINS
```

**Database error:**
```bash
# Verify MongoDB running
docker-compose exec mongo mongosh
# Check connection string format
```

**Rate limit errors:**
- Verify ALLOWED_ORIGINS config
- Check rate_limiting.py settings
- Ensure firewall allows traffic

## Security Checklist

Before production:
- [ ] .env.production configured
- [ ] Secrets stored securely
- [ ] SSL/TLS installed
- [ ] Firewall configured
- [ ] Database backups automated
- [ ] Monitoring setup
- [ ] Rate limiting verified
- [ ] CORS origins whitelisted
- [ ] Admin secret key changed
- [ ] Logs rotation enabled
- [ ] Health checks passing
- [ ] Load testing completed

## Rollback

If deployment fails:
```bash
docker-compose down
docker tag yourusername/mkshopzone:v0.9.0 mkshopzone:latest
docker-compose up -d

# Kubernetes:
kubectl set image deployment/mkshopzone-backend \
  backend=yourusername/mkshopzone:v0.9.0 -n mkshopzone
```

## Performance

Database pooling (configured):
- maxPoolSize: 50
- minPoolSize: 10

Caching enabled:
- Dashboard metrics: 5min TTL
- Frequently accessed data: Configurable

## Support

1. Check logs: `docker-compose logs backend`
2. Health: `curl https://yourdomain.com/api/v1/health`
3. Docs: See CLAUDE.md, ARCHITECTURE.md
4. API Help: Visit `/docs` endpoint

Version: 4.0.0
April 16, 2026
