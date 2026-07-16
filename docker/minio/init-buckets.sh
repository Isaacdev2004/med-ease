#!/bin/sh
set -eu

echo "Waiting for MinIO..."
until mc alias set medease "http://${MINIO_HOST}:${MINIO_PORT}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"; do
  sleep 2
done

echo "Creating buckets..."
mc mb --ignore-existing "medease/${MINIO_BUCKET_DOCUMENTS}"
mc mb --ignore-existing "medease/${MINIO_BUCKET_EXPORTS}"

echo "MinIO buckets ready:"
mc ls medease
