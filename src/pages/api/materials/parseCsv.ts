import { IncomingForm } from "formidable";
import fs from "fs";
import { type NextApiRequest, type NextApiResponse } from "next";
import Papa from "papaparse";
import { type ImportMaterialsSchema } from "~/types/material";

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

type ParsedMaterials = {
  name: string;
  url: string;
  sku: string;
  cost: string;
  quantity: string;
  quantityUnit: string;
  minQuantity: string;
  vendor: string;
  categories: string;
  notes: string;
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
        const parsedData = Papa.parse<ParsedMaterials>(data, {
          header: true,
        });

        const formattedData: ImportMaterialsSchema = parsedData.data.map(
          (item) => ({
            ...item,
            vendor: {
              name: item.vendor,
            },
            categories: item.categories
              .split(",")
              .map((category) => ({ name: category })),
          })
        );

        res.status(200).json({ data: formattedData });
      });
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
