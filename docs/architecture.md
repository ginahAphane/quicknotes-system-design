# QuickNotes System Design - Production Architecture for 1 Million Users

## 1. Overview
QuickNotes is a production note-taking service designed to handle 1M Monthly Active Users (MAU) with high availability and low latency.

## 2. High-Level Architecture Diagram
Client (Browser/Mobile) -> DNS (Route53) -> CDN (CloudFront) -> Load Balancer (ALB) -> App Servers (EC2 Auto Scaling Group) -> [PostgreSQL Primary + 2 Read Replicas] + Redis Cluster + Worker Queues (SQS) + S3 for attachments.

## 3. Production Tier Components

**DNS:** AWS Route 53 with health checks and failover routing.
**CDN:** CloudFront to cache static assets (index.html, style.css) and reduce origin load.
**Load Balancer:** Application Load Balancer (ALB) distributes traffic across 3+ Availability Zones. Handles SSL termination.
**App Servers:** 6-10 Node.js/Express instances in Auto Scaling Group (ASG). Stateless for horizontal scaling.
**Caching:** Redis Cluster (ElastiCache) for session cache and hot notes (recently accessed notes), TTL 5 minutes.
**Database:** PostgreSQL RDS Primary for writes + 2 Read Replicas for reads. Partitioning by user_id.
**Worker Queues:** SQS + Lambda workers for async tasks: sending email notifications, generating search indexes, cleaning up old notes.
**Storage:** S3 for image attachments, CloudWatch for logs/metrics.

## 4. Quantitative Load Estimates

**Assumptions:** 1M MAU, 20% DAU = 200,000 DAU. Each active user creates 2 notes/day, reads 20 notes/day.

**Reads:** 200,000 * 20 = 4,000,000 reads/day = ~46 reads/second. Peak (3x) = 138 reads/sec.
**Writes:** 200,000 * 2 = 400,000 writes/day = ~4.6 writes/second. Peak = 14 writes/sec.
**Storage:** Avg note size = 2KB. 400k notes/day * 2KB = 800MB/day. Annual = 800MB * 365 = ~292GB/year. With replicas and indexes (3x) = ~876GB/year. First year ~1TB provisioned.

**Scaling Strategy:** Read replicas handle 80% of reads via Redis cache-aside pattern. Write to Primary only. ALB + ASG handles traffic spikes.

## 5. Data Flow
1. User -> DNS resolves to ALB.
2. ALB -> App Server.
3. App checks Redis. If hit, return. If miss, query Read Replica.
4. Write -> App -> Primary DB -> async replication to Read Replicas -> Invalidate Redis key.
5. Heavy jobs -> push to SQS -> worker processes.