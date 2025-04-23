// zip.js
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const manifestPath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

const name = manifest.name.replace(/\s+/g, '-').toLowerCase(); // 공백 제거 + 소문자
const version = manifest.version;
const zipFileName = `${name}-${version}.zip`;

const output = fs.createWriteStream(zipFileName);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
	console.log(`✔️ Created zip: ${archive.pointer()} bytes`);
});

archive.pipe(output);

archive.glob('**/*', {
	ignore: [
		'**/node_modules/**',
		'**/.git/**',
		'**/.idea/**',
		'**/package.json',
		'**/package-lock.json',
		'**/zip.js',
		'**.zip'
	]
});

archive.finalize();
