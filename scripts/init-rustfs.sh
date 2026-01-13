#!/bin/sh
set -ex
# script to run inside container to make RustFS bucket public
mc alias set rustfs http://rustfs:9000 "$AWS_ACCESS_KEY_ID" "$AWS_SECRET_ACCESS_KEY"
mc mb -p rustfs/"$AWS_S3_BUCKET_NAME" || true
mc anonymous set download rustfs/"$AWS_S3_BUCKET_NAME"
