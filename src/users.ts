import { LevelDb } from "./leveldb";
const bcrypt = require('bcrypt');

const saltRounds = 10;

export class User {
  public username: string;
  public email: string;
  private password: string = "";

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username;
    this.email = email;

    if (!passwordHashed)
      this.setPassword(password);
    else 
      this.password = password;
  }

  public setPassword(toSet: string): void {
    this.password = bcrypt.hashSync(toSet, saltRounds);
  }

  public getPassword(): string {
    return this.password;
  }

  public validatePassword(toValidate: String): boolean {
    return bcrypt.compareSync(toValidate, this.password);
  }

  static fromDb(username: string, value: any): User {
    const [password, email] = value.split(":");
    return new User(username, email, password, true);
  }
}

export class UserHandler {
  public db: any;

  constructor(path: string) {
    this.db = LevelDb.open(path);
  }

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err || data === undefined)
        callback(null, undefined);
      else
        callback(null, User.fromDb(username, data));
    });
  }

  public getAll(callback: (err: Error | null, result?: {}) => void) {
    const stream = this.db.createReadStream();
    var users: User[] = [];

    stream.on('error', callback);
    stream.on('end', (err: Error) => {
        callback(null, users);
    });
    stream.on('data', (data: any) => {
        const [, username] = data.key.split(':');
        users.push(User.fromDb(username, data.value));
    });
}

  public save(user: User, callback: (err: Error | null) => void) {
    this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
      if(err)  
        callback(err);
      else
        callback(null);      
    });
  }

  public delete(username: string, callback: (err: Error | null) => void) {
    this.db.del(`user:${username}`);
    callback(null);
  }
}