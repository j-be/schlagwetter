use std::env;

use diesel::PgConnection;
use diesel::prelude::*;

use crate::domain::{InsertMeasurement, Measurement};
use crate::schema::measurements;

embed_migrations!("migrations");

pub fn migrate() {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    let connection = PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url));

    embedded_migrations::run_with_output(&connection, &mut std::io::stdout())
        .expect("Migration failed!");
}

pub fn get_recent(conn: &PgConnection) -> Vec<Measurement> {
    return measurements::dsl::measurements
        .order(measurements::recorded_at.desc())
        .limit(100)
        .load::<Measurement>(conn)
        .expect("Error loading recent measurements");
}

pub fn insert(conn: &PgConnection, temp: f64, hum: f64) -> Measurement {
    let new_measurement = InsertMeasurement {
        temperature: temp,
        humidity: hum,
    };

    let result = diesel::insert_into(measurements::table)
        .values(&new_measurement)
        .get_result(conn) as QueryResult<Measurement>;
    return result.expect("Error saving new Node");
}
