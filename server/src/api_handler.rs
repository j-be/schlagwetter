use rocket_contrib::json::Json;

use crate::domain::Measurement;
use crate::repo::get_recent;

#[database("schlagwetter_db")]
pub struct SchlagwetterDbConn(diesel::PgConnection);

#[get("/recent")]
pub fn get_measurements_default(conn: SchlagwetterDbConn) -> Json<Vec<Measurement>> {
    return Json(get_recent(&*conn, 12 * 60));
}

#[get("/recent/<minutes>")]
pub fn get_measurements(conn: SchlagwetterDbConn, minutes: i64) -> Json<Vec<Measurement>> {
    return Json(get_recent(&*conn, minutes));
}
