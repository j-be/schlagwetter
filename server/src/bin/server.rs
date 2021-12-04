
use dotenv::dotenv;

use schlagwetter::repo;
use schlagwetter::api_handler;

use rocket::routes;

fn main() {
    dotenv().ok();

    println!("Migrate DB");
    repo::migrate();

    println!("Start");
    rocket::ignite()
        .mount("/schlagwetter/api", routes![
            api_handler::get_measurements_default,
            api_handler::get_measurements,
         ])
        .attach(api_handler::SchlagwetterDbConn::fairing())
        .launch();
}
