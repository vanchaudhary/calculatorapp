---
title: RDS → Debezium → Strimzi Kafka → EMR PySpark → Iceberg Bronze HLD
status: Draft
owner: Data Platform Team
reviewers: ["Platform SRE", "Security", "Analytics Eng"]
last-reviewed: 2026-01-27
version: 0.1.0
related:
  - README: ../../README.md
  - Documentation: ../../DOCUMENTATION.md
---

# Overview & Scope
This High-Level Design (HLD) describes a CDC-driven data lake ingestion pipeline:
- Sources: Amazon RDS (MySQL, PostgreSQL) emitting CDC.
- Transport: Strimzi-managed Kafka with Kafka Connect + Debezium.
- Processing: PySpark Structured Streaming on Amazon EMR.
- Storage: Bronze layer on Apache Iceberg using AWS Glue Catalog and S3.

## Assumptions
- Private networking across VPC subnets; security groups restrict access.
- IAM roles and KMS CMKs exist for encryption at rest and in transit (TLS).
- Glue Data Catalog is used as the Iceberg catalog; S3 is the object store.
- Schema Registry (optional) for Avro/Protobuf/JSON schema governance.

## Architecture Diagram
```mermaid
graph LR
  subgraph AWS RDS
    RDSMySQL[(Amazon RDS MySQL)]
    RDSPostgres[(Amazon RDS PostgreSQL)]
  end

  subgraph Kafka Connect (Debezium)
    DebeziumMySQL[Debezium MySQL Connector]
    DebeziumPG[Debezium PostgreSQL Connector]
    Connect[Kafka Connect Cluster]
    SR[(Schema Registry)]
  end

  subgraph Strimzi Kafka
    KafkaCluster[(Kafka Brokers)]
    Topics[(CDC Topics)]
    DLQ[(DLQ Topics)]
  end

  subgraph EMR & Spark
    EMR[Amazon EMR]
    PySpark[PySpark Structured Streaming]
    Checkpoints[(S3 Checkpoints)]
  end

  subgraph Data Lake (Iceberg Bronze)
    Glue[(AWS Glue Catalog)]
    S3[(Amazon S3)]
    IcebergBronze[(Iceberg Bronze Tables)]
  end

  RDSMySQL --> DebeziumMySQL
  RDSPostgres --> DebeziumPG
  DebeziumMySQL --> Connect
  DebeziumPG --> Connect
  Connect --> SR
  Connect --> KafkaCluster
  KafkaCluster --> Topics
  Topics --> EMR
  EMR --> PySpark
  PySpark --> Checkpoints
  PySpark --> IcebergBronze
  IcebergBronze --> Glue
  IcebergBronze --> S3
  Connect --> DLQ
```

## End-to-End Flow
- Debezium performs initial snapshot, then streams changes via binlog/WAL into per-table Kafka topics.
- PySpark Structured Streaming reads CDC events, applies transformations, deduplicates using keys and watermarks, and writes to Iceberg Bronze.
- Checkpoints and state are stored on S3 to enable recovery and replay; DLQs capture connector or serialization errors.

## Configurations & Parameters
- RDS MySQL: `binlog_format=ROW`, `binlog_row_image=FULL`; required privileges: SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE/CLIENT.
- RDS PostgreSQL: `rds.logical_replication=1`, `wal_level=logical`; `pgoutput` publication and logical replication slot.
- Debezium: Snapshot modes (`initial`, `initial_only`, `never`); heartbeat; schema history topic (compacted, single partition).
- Kafka/Strimzi: RF=3, rack-awareness; internal topics compacted; TLS/SASL; Connect distributed workers with plugin isolation.
- EMR/PySpark: Glue + Iceberg libraries; micro-batch triggers; S3 checkpoints; idempotent upserts/appends to Bronze.
- Iceberg: Partitioning strategy; snapshot expiration; compaction and rewrite-files cadence.

## Data Contracts & Schemas
- Topic naming convention: `<domain>.<table>.<cdc>`; keys based on table PKs.
- Event schema: create/update/delete with tombstones; transaction metadata handling.
- Bronze table schema aligned with source; policy for schema evolution with compatibility rules.

## Non-Functional Requirements
- Availability: Multi-AZ Kafka; EMR autoscaling; resilient Connect workers.
- Latency: Target streaming end-to-end under defined SLA (e.g., seconds–minutes).
- Durability & Recovery: At-least-once delivery with idempotent writes; checkpointed recovery.
- Cost: Right-size brokers, partitions, EMR nodes; manage S3 storage growth.

## Security & Governance
- TLS in transit; KMS encryption at rest (S3, Glue, EMR, Kafka secrets).
- IAM roles with least privilege; secret management through Parameter Store/Secrets Manager.
- PII handling: masking/truncation via Debezium SMTs and Spark transforms.
- Compliance: retention policies; lineage metadata; access controls per dataset.

## Operations & SRE
- Monitoring: Prometheus/Grafana for Kafka/Connect; CloudWatch for EMR; alert on lag, DLQ volume, connector health.
- Runbooks: Connector restart & offset checks; snapshot replay; backfill strategy; Iceberg maintenance.
- DR & Replays: Use offsets or incremental snapshots; validate WAL/binlog retention.

## Risks & Mitigations
- RDS permissions and WAL/binlog retention: monitor and tune; enforce minimal privileges.
- Schema drift/PK changes: set replica identity; handle delete+reinsert flows.
- Kafka partition skew: partition by PK; rekey strategies as needed.
- Iceberg small files/commit conflicts: transactional writes; scheduled compactions; controlled write concurrency.

## Alternatives & Trade-offs
- MSK instead of Strimzi; AWS DMS + Kinesis; Glue ETL for batch; Delta Lake or Hudi as lake formats.

## Capacity & Sizing
- Kafka partitions sized to source throughput; RF=3; compaction on CDC topics.
- EMR nodes autoscaled to meet micro-batch windows; tune `maxOffsetsPerTrigger` and parallelism.
- Iceberg file sizing and compaction cadence to balance metadata and read performance.
- S3 checkpoint/state sizing aligned to recovery objectives.

## References
- Project README: ../../README.md
- Additional Docs: ../../DOCUMENTATION.md
