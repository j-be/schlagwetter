use std::env;
use regex::Regex;

use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenv::dotenv;
use std::time::Duration;
use std::io::{BufReader, BufRead};

use schlagwetter::repo::insert;

pub fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    let connection = PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url));

    let re = Regex::new(r"^T(?P<temperature>\d+\.\d+) H(?P<humidity>\d+\.\d+)\r\n").unwrap();
    let mut port = serialport::new("/dev/ttyUSB0", 9_600)
        .timeout(Duration::from_millis(7 * 60 * 1000))
        .open()
        .expect("Failed to open port");

    port.flush()
        .expect("Failed to flush port!");

    let mut reader = BufReader::new(port.as_mut());

    loop{
        let mut buffer: Vec<u8> = Vec::new();
        match reader.read_until(10, buffer.as_mut()) {
            Ok(_) => {
                let line = std::str::from_utf8(&buffer).expect("");
                println!("Got Line {}", line);
                if re.is_match(line) {
                    let caps = re.captures(line).unwrap();
                    insert(&connection,
                        caps["temperature"].parse::<f64>().expect(""),
                        caps["humidity"].parse::<f64>().expect(""),
                    );
                }
            },
            _ => print!("Error while trying to read from serial console!"),
        }
    }
}
