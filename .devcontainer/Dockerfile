FROM mcr.microsoft.com/devcontainers/javascript-node:22

USER root

# Pre-create volume mount point and set ownership to node user
RUN mkdir -p /workspaces/gulptask-demo-page/node_modules && \
    chown -R node:node /workspaces/gulptask-demo-page

USER node
