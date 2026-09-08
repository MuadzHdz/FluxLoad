FROM python:3.12-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml setup.py README.md ./
COPY fluxload ./fluxload

RUN pip install --no-cache-dir --upgrade pip \
    && pip wheel --no-cache-dir --wheel-dir /app/wheels .

FROM python:3.12-slim

WORKDIR /app

RUN useradd -m -u 1000 -s /bin/bash fluxload && \
    mkdir -p /data && chown -R fluxload:fluxload /data

COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/setup.py /app/pyproject.toml /app/README.md ./
COPY fluxload ./fluxload

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir /wheels/* \
    && rm -rf /wheels

USER fluxload
WORKDIR /data
VOLUME ["/data"]

EXPOSE 5000

ENV FLUXLOAD_PORT=5000 \
    FLUXLOAD_HOST=0.0.0.0

CMD ["python", "-m", "fluxload", "-d", "/data", "-b", "0.0.0.0", "-p", "5000"]
