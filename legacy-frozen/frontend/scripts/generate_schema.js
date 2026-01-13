import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const api_url = process.env.PUBLIC_API_URL;

if (!api_url) {
  console.error('error: PUBLIC_API_URL is not defined in your .env file.');
  process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const output_path = path.resolve(__dirname, '../src/lib/api/v1.d.ts');

const command = `openapi-typescript ${api_url}/api/v1/schema.json -o ${output_path}`;

exec(command, (error, stdout) => {
  if (error) {
    console.log(`error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
