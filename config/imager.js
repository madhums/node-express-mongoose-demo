/**
 * Expose
 */

module.exports = {
  variants: {
    article: {
      resize: {
        detail: 'x440'
      },
      crop: {},
      resizeAndCrop: {
        mini: { resize: '63504@', crop: '252x210' }
      }
    },

    gallery: {
      crop: {
        thumb: '100x100'
      }
    }
  },

  storage: {
    S3: {
      key: process.env.IMAGER_S3_KEY,
      secret: process.env.IMAGER_S3_SECRET,
      bucket: process.env.IMAGER_S3_BUCKET
    }
  },

  debug: true
};
