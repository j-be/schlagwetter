# syntax=docker/dockerfile:1

# Using multistage build:
# 	https://docs.docker.com/develop/develop-images/multistage-build/
# 	https://whitfin.io/speeding-up-rust-docker-builds/

########################## BUILD IMAGE  ##########################
FROM ghcr.io/j-be/rust-diesel-postgres:armv7 as build

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
