module.exports = {
  variants: {
    article: {
      resize: {
        detail: "800x600"
      },
      crop: {
        thumb: "200x200"
      },
      resizeAndCrop: {
        mini: {resize: "200x150", crop: "100x100"}
      }
    },

    gallery: {
      crop: {
        thumb: "100x100"
      }
    }
  },

  storage: {
    Rackspace: {
      auth: {
        username: "USERNAME",
        apiKey: "API_KEY",
        host: "lon.auth.api.rackspacecloud.com"
      },
      container: "CONTAINER_NAME"
    },
    S3: {
      key: 'API_KEY',
      secret: 'SECRET',
      bucket: 'BUCKET_NAME',
      region: 'REGION'
    }
  },

  debug: true
}
