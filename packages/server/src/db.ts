import sqlite3 from "sqlite3";
import Entry from "./types/entry";

import { ImageDoc, Images } from './images'

const DB_PATH = process.env.DB_PATH || "./dev.db";

class DB {
  database: sqlite3.Database = null;

  connect = (): Promise<sqlite3.Database> => {
    return new Promise((resolve, reject) => {
      this.database = new sqlite3.Database(DB_PATH, async (err) => {
        if (err) {
          console.error("Failed to open db.");
          reject(err);
        }

        await this._createTables();
        await this._addTrigger();
        // possible to add here migrations

        console.log("Connected to main db.");
        resolve(this.database);
      });
    });
  };

  _createTables = async (): Promise<void> => {
    await Promise.all([new Promise((resolve, reject) => {
      this.database.run(
        `CREATE TABLE IF NOT EXISTS entry (
            entry_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title VARCHAR(30),
            date DATETIME, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            location VARCHAR(30), 
            is_public BOOLEAN,
            content TEXT
        )`,
        (err) => {
          if (err) {
            console.error("Failed to open db.");
            reject(err);
          }

          resolve();
        }
      );
    }),
    new Promise((resolve, reject) => {
      this.database.run(
        `CREATE TABLE IF NOT EXISTS image (
            image_id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id INTEGER, 
            title VARCHAR(30),
            date DATETIME, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            location VARCHAR(30), 
            original TEXT,
            small TEXT,
            medium TEXT,
            large TEXT
        )`,
        (err) => {
          if (err) {
            console.error("Failed to open db.");
            reject(err);
          }

          resolve();
        }
      );
    })

    ])
  };

  _addTrigger = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.database.run(
        `CREATE TRIGGER IF NOT EXISTS update_trigger AFTER UPDATE ON entry
            BEGIN
              update entry SET updated_at = datetime('now') WHERE entry_id = NEW.entry_id;
            END;
        CREATE TRIGGER IF NOT EXISTS update_trigger AFTER UPDATE ON image
            BEGIN
              update image SET updated_at = datetime('now') WHERE image_id = NEW.image_id;
            END;
        `,
        (err) => {
          if (err) {
            console.error("Failed to create trigger for auto update!");
            reject(err);
          }

          resolve();
        }
      );
    });
  };

  close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (this.database == null) {
        console.warn("Database is not connected. So skip closing!");
        resolve();
      }

      this.database.close((err) => {
        if (err) {
          console.error("Failed to close database!");
          reject(err);
        }

        console.log("Close connection to database");
        this.database = null;
        resolve();
      });
    });
  };

  getEntries = (): Promise<Array<Entry>> => {
    return new Promise((resolve, reject) => {
      if (this.database == null) {
        console.error("Can't get entry from disconnected database!");
        reject("No Connection!");
      }

      this.database.all(`SELECT * FROM entry`, (err, rows) => {
        if (err) {
          console.error("Failed to request entries from db.");
          reject(err);
        }

        resolve(rows);
      });
    });
  };

  getEntry = (id: number): Promise<Entry> => {
    return new Promise((resolve, reject) => {
      if (this.database == null) {
        console.error("Can't get entry from disconnected database!");
        reject("No Connection!");
      }

      this.database.all(
        `
        SELECT * 
        FROM entry 
        WHERE entry_id = ?
        `,
        [id],
        (err, rows) => {
          if (err) {
            console.error("Failed to request entry from db.");
            reject(err);
          }

          resolve(rows[0]);
        }
      );
    });
  };

  insertEntry = (entry: Entry): Promise<Entry> => {
    return new Promise((resolve, reject) => {
      if (this.database == null) {
        console.error("Can't get entry from disconnected database!");
        reject("No Connection!");
      }
      // save function here to make accessable for resolver
      const getEntry = this.getEntry;

      this.database.run(
        `INSERT INTO entry(title, date, location, is_public, content) VALUES(?,?,?,?,?)`,
        [
          entry.title,
          entry.date,
          entry.location,
          entry.isPublic,
          entry.content,
        ],
        function (err) {
          if (err) {
            console.error("Failed to add entry to db.");
            reject(err);
          }

          resolve(getEntry(this.lastID));
        }
      );
    });
  };

  getImage = (id: number): Promise<ImageDoc> => {
    return new Promise((resolve, reject) => {
      if (this.database == null) {
        console.error("Can't get entry from disconnected database!");
        reject("No Connection!");
      }

      this.database.all(
        `
        SELECT * 
        FROM image 
        WHERE image_id = ?
        `,
        [id],
        (err, rows) => {
          if (err) {
            console.error("Failed to request image from db.");
            reject(err);
          }

          resolve(rows[0]);
        }
      );
    });
  };

  insertImage = (images: Images, entryId: number): Promise<ImageDoc> => {
    return new Promise((resolve, reject) => {
      if (this.database == null) {
        console.error("Can't get entry from disconnected database!");
        reject("No Connection!");
      }
      // save function here to make accessable for resolver
      const getImage = this.getImage;

      this.database.run(
        `INSERT INTO image(title, date, location, entry_id, original, small, medium, large) VALUES(?,?,?,?,?,?,?,?)`,
        [
          images.fileName,
          new Date().toISOString(),
          '',
          entryId,
          images.original,
          images.small,
          images.medium,
          images.large
        ],
        function (err) {
          if (err) {
            console.error("Failed to add image to db.");
            reject(err);
          }

          resolve(getImage(this.lastID));
        }
      );
    });
  };

  updateEntry = (id: number, entry: Entry): Promise<Entry> => {
    return new Promise((resolve, reject) => {
      if (this.database == null) {
        console.error("Can't get entry from disconnected database!");
        reject("No Connection!");
      }

      this.database.run(
        `UPDATE entry
            SET title = ?,
                date = ?,
                location = ?,
                is_public = ?, 
                content = ? 
        WHERE
            entry_id = ?`,
        [
          entry.title,
          entry.date,
          entry.location,
          entry.isPublic,
          entry.content,
          id,
        ],
        (err) => {
          if (err) {
            console.error("Failed to update entry to db.");
            reject(err);
          }

          resolve(this.getEntry(id));
        }
      );
    });
  };

  removeEntry = (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (this.database == null) {
        console.error("Can't remove entry from disconnected database!");
        reject("No Connection!");
      }

      this.database.run(
        `DELETE 
            FROM entry
        WHERE
            entry_id = ?`,
        [id],
        (err) => {
          if (err) {
            console.error("Failed to remove entry to db.");
            reject(err);
          }

          resolve();
        }
      );
    });
  };
}

const db = new DB();
export default db;
