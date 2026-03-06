const ImageKit = require("@imagekit/nodejs").default
const {toFile} = require("@imagekit/nodejs")
const imageKit = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATEKEY
    
})


async function uploadFile({buffer,filename,folder = ""}) {
    
    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(buffer)),
        fileName:filename,
        folder
    })

    return file
}


module.exports = {
    uploadFile
}