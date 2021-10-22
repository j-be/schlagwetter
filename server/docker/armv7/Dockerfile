# syntax=docker/dockerfile:1

# This file was schamelessly stolen from https://github.com/dani-garcia/vaultwarden/tree/main/docker/armv7

# Using multistage build:
# 	https://docs.docker.com/develop/develop-images/multistage-build/
# 	https://whitfin.io/speeding-up-rust-docker-builds/

########################## BUILD IMAGE  ##########################
FROM rust:1.55-buster as build

# Build time options to avoid dpkg warnings and help with reproducible builds.
ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    TZ=UTC \
    TERM=xterm-256color \
    CARGO_HOME="/root/.cargo" \
    USER="root"


# Create CARGO_HOME folder and don't download rust docs
RUN mkdir -pv "${CARGO_HOME}" \
    && rustup set profile minimal

# NOTE: Any apt-get/dpkg after this stage will fail because of broken dependencies.
# For Diesel-RS migrations_macros to compile with MySQL/MariaDB we need to do some magic.
# We at least need libmariadb3:amd64 installed for the x86_64 version of libmariadb.so (client)
# We also need the libmariadb-dev-compat:amd64 but it can not be installed together with the :armhf version.
# What we can do is a force install, because nothing important is overlapping each other.
#
# Install required build libs for armhf architecture.
# To compile both mysql and postgresql we need some extra packages for both host arch and target arch
RUN sed 's/^deb/deb-src/' /etc/apt/sources.list > /etc/apt/sources.list.d/deb-src.list \
    && dpkg --add-architecture armhf \
    && apt-get update \
    && apt-get install -y \
        --no-install-recommends \
        libssl-dev:armhf \
        libc6-dev:armhf \
        libpq5:armhf \
        libpq-dev \
        gcc-arm-linux-gnueabihf \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    #
    # For Diesel-RS migrations_macros to compile with PostgreSQL we need to do some magic.
    # The libpq5:armhf package seems to not provide a symlink to libpq.so.5 with the name libpq.so.
    # This is only provided by the libpq-dev package which can't be installed for both arch at the same time.
    # Without this specific file the ld command will fail and compilation fails with it.
    && ln -sfnr /usr/lib/arm-linux-gnueabihf/libpq.so.5 /usr/lib/arm-linux-gnueabihf/libpq.so \
    #
    # Make sure cargo has the right target config
    && echo '[target.armv7-unknown-linux-gnueabihf]' >> "${CARGO_HOME}/config" \
    && echo 'linker = "arm-linux-gnueabihf-gcc"' >> "${CARGO_HOME}/config" \
    && echo 'rustflags = ["-L/usr/lib/arm-linux-gnueabihf"]' >> "${CARGO_HOME}/config"

# Set arm specific environment values
ENV CC_armv7_unknown_linux_gnueabihf="/usr/bin/arm-linux-gnueabihf-gcc"
ENV CROSS_COMPILE="1"
ENV OPENSSL_INCLUDE_DIR="/usr/include/arm-linux-gnueabihf"
ENV OPENSSL_LIB_DIR="/usr/lib/arm-linux-gnueabihf"


# Creates a dummy project used to grab dependencies
RUN USER=root cargo new --bin /app
WORKDIR /app

# Copies over *only* your manifests and build files
COPY ./Cargo.* ./
COPY ./rust-toolchain ./rust-toolchain

RUN rustup target add armv7-unknown-linux-gnueabihf

# Copies the complete project
# To avoid copying unneeded files, use .dockerignore
COPY . .

RUN ls src
RUN cat src/lib.rs
RUN cat Cargo.toml

# Builds again, this time it'll just be
# your actual source files being built
RUN cargo build --release --target=armv7-unknown-linux-gnueabihf

######################## RUNTIME IMAGE  ########################
# Create a new stage with a minimal image
# because we already have a binary built
FROM balenalib/armv7hf-debian:buster

# Copies the files from the context (Rocket.toml file)
# and the binaries from the "build" stage to the current stage
WORKDIR /
COPY --from=build /app/target/armv7-unknown-linux-gnueabihf/release/ingester .
COPY --from=build /app/target/armv7-unknown-linux-gnueabihf/release/server .
