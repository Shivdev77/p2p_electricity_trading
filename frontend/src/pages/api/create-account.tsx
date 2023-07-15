import type { NextApiRequest, NextApiResponse } from "next";

type CreateAccountSuccessResponse = {
  token: string;
  username: string;
  name: string;
};

type CreateAccountErrorResponse = {
  error: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    CreateAccountSuccessResponse | CreateAccountErrorResponse
  >
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const username = body.username;
    const password = body.password;
    const name = body.name;
    if (username && password && name) {
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        res.status(200).json({ token: "test-token", username, name });
      });
    } else {
      res.status(400).json({ error: "Bad request" });
    }
  }
}
