CREATE TABLE measurements
(
    id          SERIAL PRIMARY KEY,
    temperature FLOAT     NOT NULL,
    humidity    FLOAT     NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
