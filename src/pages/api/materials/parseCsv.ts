import { IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import Papa from "papaparse";

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Error parsing the file" });
        return;
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      // Read the file contents
      fs.readFile(file.filepath, "utf8", (err, data) => {
        if (err) {
          res.status(500).json({ message: "Error reading the file" });
          return;
        }

        // Parse the CSV data with PapaParse
        const parsedData = Papa.parse(data, {
          header: true,
        });

        res.status(200).json({ data: parsedData.data });
      });
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
