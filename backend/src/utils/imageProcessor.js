const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Process and optimize uploaded images
 * @param {string} inputPath - Path to original image
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} - Processed image info
 */
const processImage = async (inputPath, options = {}) => {
  try {
    const {
      width = 1200,
      quality = 80,
      format = 'jpeg'
    } = options;

    const parsedPath = path.parse(inputPath);
    const outputPath = path.join(parsedPath.dir, `${parsedPath.name}-optimized.${format}`);

    // Process image
    await sharp(inputPath)
      .resize(width, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toFile(outputPath);

    // Get file stats
    const stats = await fs.stat(outputPath);

    // Delete original if different from output
    if (inputPath !== outputPath) {
      await fs.unlink(inputPath);
    }

    return {
      path: outputPath,
      size: stats.size
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

/**
 * Create thumbnail from image
 * @param {string} inputPath - Path to original image
 * @param {number} size - Thumbnail size (width)
 * @returns {Promise<string>} - Thumbnail path
 */
const createThumbnail = async (inputPath, size = 400) => {
  try {
    const parsedPath = path.parse(inputPath);
    const thumbnailPath = path.join(parsedPath.dir, `${parsedPath.name}-thumb${parsedPath.ext}`);

    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('jpeg', { quality: 80 })
      .toFile(thumbnailPath);

    return thumbnailPath;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    throw error;
  }
};

module.exports = {
  processImage,
  createThumbnail
};
