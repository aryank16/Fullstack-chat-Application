ARG BASE_IMAGE=python:3.12-alpine3.22
FROM ${BASE_IMAGE} AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install dependencies
RUN --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-editable

FROM ${BASE_IMAGE}
# Use the virtual environment automatically
ENV VIRTUAL_ENV=/app/.venv
# Place entry points in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"
WORKDIR /app

# Copy the environment, but not the source code
COPY --from=builder --chown=app:app /app/.venv ${VIRTUAL_ENV}

# Copy the project into the image
ADD data /app/data
ADD src /app
RUN ls
# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
