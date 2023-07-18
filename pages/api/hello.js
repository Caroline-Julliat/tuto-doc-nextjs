export default function handler(req, res) {
  res.status(200).json({ text: "Hello" })
}

// Try accessing it at http://localhost:3000/api/hello. You should see {"text":"Hello"}. Note that:

// req is an instance of http.IncomingMessage, plus some pre-built middlewares.
// res is an instance of http.ServerResponse, plus some helper functions.
