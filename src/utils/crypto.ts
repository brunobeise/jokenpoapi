import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export function generateToken(id: string, username: string) {
  const token = jwt.sign(
    { id: id, username: username },
    process.env.JWTSECRET!
  );
  console.log(token);

  return token;
}

export function validateToken(token: string) {
  const decoded: any = jwt.verify(token, process.env.JWTSECRET!);
  const { id, username } = decoded;
  if (!id || !username) return false;
  return { id, username };
}
