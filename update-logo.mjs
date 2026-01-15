import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, 'public');
const logoPath = join(publicDir, 'logo.jpeg');

async function generateIcons() {
    console.log('🎨 Converting logo and generating PWA icons...');

    try {
        // Convert to PNG and save as main logo
        await sharp(logoPath)
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(join(publicDir, 'logo.png'));
        console.log('✅ Created logo.png');

        // Generate 192x192 icon
        await sharp(logoPath)
            .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(join(publicDir, 'pwa-192x192.png'));
        console.log('✅ Created pwa-192x192.png');

        // Generate 512x512 icon
        await sharp(logoPath)
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(join(publicDir, 'pwa-512x512.png'));
        console.log('✅ Created pwa-512x512.png');

        // Generate maskable 512x512 (with padding for safe zone)
        await sharp(logoPath)
            .resize(410, 410, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .extend({
                top: 51,
                bottom: 51,
                left: 51,
                right: 51,
                background: { r: 245, g: 243, b: 238, alpha: 1 } // Match app background
            })
            .png()
            .toFile(join(publicDir, 'pwa-maskable-512x512.png'));
        console.log('✅ Created pwa-maskable-512x512.png');

        // Generate apple-touch-icon (180x180)
        await sharp(logoPath)
            .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(join(publicDir, 'apple-touch-icon.png'));
        console.log('✅ Created apple-touch-icon.png');

        // Generate favicon (32x32)
        await sharp(logoPath)
            .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(join(publicDir, 'favicon-32x32.png'));
        console.log('✅ Created favicon-32x32.png');

        // Generate favicon (16x16)
        await sharp(logoPath)
            .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(join(publicDir, 'favicon-16x16.png'));
        console.log('✅ Created favicon-16x16.png');

        // Generate favicon.ico compatible PNG
        await sharp(logoPath)
            .resize(48, 48, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(join(publicDir, 'favicon.png'));
        console.log('✅ Created favicon.png');

        console.log('\n🎉 All icons generated successfully!');
        console.log('📝 Logo converted from JPEG to PNG');
        console.log('📱 PWA icons ready for installation');
    } catch (error) {
        console.error('❌ Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
