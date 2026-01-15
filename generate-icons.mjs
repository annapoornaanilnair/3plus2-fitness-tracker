import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

// Convert SVG to PNG
async function convertSvgToPng(svgPath, pngPath, size) {
    const svgBuffer = fs.readFileSync(svgPath);
    await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(pngPath);
    console.log(`✅ Created ${path.basename(pngPath)}`);
}

async function generateIcons() {
    try {
        // Generate PWA icons
        await convertSvgToPng(
            path.join(publicDir, 'pwa-192x192.svg'),
            path.join(publicDir, 'pwa-192x192.png'),
            192
        );

        await convertSvgToPng(
            path.join(publicDir, 'pwa-512x512.svg'),
            path.join(publicDir, 'pwa-512x512.png'),
            512
        );

        await convertSvgToPng(
            path.join(publicDir, 'apple-touch-icon.svg'),
            path.join(publicDir, 'apple-touch-icon.png'),
            180
        );

        console.log('🎉 All PWA icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons();
