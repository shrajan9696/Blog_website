const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: 'quotopedia24',
  api_key: '512418771847945',
  api_secret: 'JoFV_tvv8FVHUauESime1CX4-uc'
});

module.export = cloudinary;
