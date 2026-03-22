/**
 * Compression service — transparent zlib compression for large fields.
 * Uses ASYNC zlib operations (non-blocking event loop).
 *
 * Performance: async deflate/inflate add ~1ms overhead over sync but
 * never block the event loop under concurrent load.
 */

const zlib = require("zlib");
const { promisify } = require("util");

const deflateAsync = promisify(zlib.deflate);
const inflateAsync = promisify(zlib.inflate);

/**
 * Compress a string into a Buffer using zlib deflate (async).
 * @param {string} str - String to compress
 * @returns {Promise<Buffer|null>}
 */
async function compress(str) {
  if (!str) return null;
  return deflateAsync(Buffer.from(str, "utf-8"), {
    level: zlib.constants.Z_BEST_COMPRESSION,
  });
}

/**
 * Decompress a Buffer back into a string (async).
 * @param {Buffer} buf - Buffer to decompress
 * @returns {Promise<string|null>}
 */
async function decompress(buf) {
  if (!buf) return null;
  if (typeof buf === "string") return buf;
  const result = await inflateAsync(buf);
  return result.toString("utf-8");
}

module.exports = { compress, decompress };
