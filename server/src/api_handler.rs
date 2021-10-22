use rocket_contrib::json::Json;

use crate::domain::Measurement;
use crate::repo::get_recent;

#[database("schlagwetter_db")]
pub struct SchlagwetterDbConn(diesel::PgConnection);

#[get("/recent")]
pub fn get_nodes(conn: SchlagwetterDbConn) -> Json<Vec<Measurement>> {
    return Json(get_recent(&*conn));
}
