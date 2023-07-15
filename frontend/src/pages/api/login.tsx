import type { NextApiRequest, NextApiResponse } from "next";

type LoginSuccessResponse = {
  token: string;
  name: string;
  username: string;
};

type LoginErrorResponse = {
  error: string;
};

const fakeDb = [
  { username: "test@email.com", name: "Testing Account", password: "testing" },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginSuccessResponse | LoginErrorResponse>
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const username = body.username;
    const password = body.password;
    let user = null;
    if (
      (user = fakeDb.find(
        (user) => user.username === username && user.password === password
      ))
    ) {
      const { password, ...userDetails } = user;
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        res.status(200).json({ token: "test-token", ...userDetails });
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
}
