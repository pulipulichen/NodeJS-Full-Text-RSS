const imgbbUploader = require("imgbb-uploader");
const path = require('path')

const options = {
  apiKey: process.env.IMGBB_API_KEY, // MANDATORY

  //imagePath: "./your/image/path", // OPTIONAL: pass a local file (max 32Mb)

  //name: "yourCustomFilename", // OPTIONAL: pass a custom filename to imgBB API

  expiration: 15552000 /* OPTIONAL: pass a numeric value in seconds.
  It must be in the 60-15552000 range (POSIX time ftw).
  Enable this to force your image to be deleted after that time. */,

  imageUrl: "https://scontent-dus1-1.xx.fbcdn.net/v/t39.30808-6/275489146_4869244733163013_3241124188010721274_n.jpg?stp=dst-jpg_p720x720&_nc_cat=103&ccb=1-5&_nc_sid=110474&_nc_ohc=5SmljJfIWHMAX9LRolf&_nc_ht=scontent-dus1-1.xx&edm=AJdBtusEAAAA&oh=00_AT9C92RVwu_KVpbbu5-TGBPi6H7ZCidt-3Us4iRSJT1Y4w&oe=623D4BEB", // OPTIONAL: pass an URL to imgBB (max 32Mb)

  //base64string:
  //  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mNcLVNbzwAEjDAGACcSA4kB6ARiAAAAAElFTkSuQmCC",
  /* OPTIONAL: pass base64-encoded image (max 32Mb)

  Enable this to upload base64-encoded image directly as string. (available from 1.3.0 onward)
  Allows to work with RAM directly for increased performance (skips fs I/O calls).
  Beware: options.imagePath will be ignored as long as options.base64string is defined! 
  */
};

imgbbUploader(options)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));