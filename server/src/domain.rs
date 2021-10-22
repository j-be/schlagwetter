use crate::schema::measurements;

#[derive(Identifiable, Queryable, Serialize)]
pub struct Measurement {
    pub id: i32,
    pub temperature: f64,
    pub humidity: f64,
    pub recorded_at: chrono::NaiveDateTime,
}

#[derive(Insertable)]
#[table_name="measurements"]
pub struct InsertMeasurement {
    pub temperature: f64,
    pub humidity: f64,
}
