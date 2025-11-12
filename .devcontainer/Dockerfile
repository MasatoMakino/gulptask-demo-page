FROM mcr.microsoft.com/devcontainers/javascript-node:22

ARG WORKSPACE_NAME

USER root

# Pre-create volume mount point and set ownership to node user
RUN mkdir -p /workspaces/${WORKSPACE_NAME}/node_modules && \
    chown -R node:node /workspaces/${WORKSPACE_NAME}

USER node
