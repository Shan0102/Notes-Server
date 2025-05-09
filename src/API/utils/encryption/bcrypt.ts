import bcrypt from "bcrypt";

const saltRounds = 12;

async function getHash(password: string): Promise<string> {
    return new Promise((res, rej) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) rej(err);
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) rej(err);
                res(hash);
            });
        });
    });
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
    return new Promise((res, rej) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) rej(err);
            res(result);
        });
    });
}

export { getHash, comparePassword };

// getHash("1234").then((res) => console.log(res));
