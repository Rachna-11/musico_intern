import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests are allowed');
  }

  const { filename, textdata } = req.body;

  if (!filename || !textdata) {
    return res.status(400).send('Missing filename or textdata');
  }

  try {
    const filePath = path.join('/tmp', `${filename}.txt`);
    await writeFile(filePath, textdata, 'utf8');
    res.status(200).send(`File created at: ${filePath}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error writing file');
  }
}
