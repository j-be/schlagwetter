
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
        .mount("/api", routes![
            api_handler::get_nodes,
         ])
        .attach(api_handler::SchlagwetterDbConn::fairing())
        .launch();
}
