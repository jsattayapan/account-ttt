import ImageResize from 'image-resize';
import React from 'react'


export const resizeImage = imageFile => {
  var imageResize = new ImageResize({
    format: 'png',
    width: 500,
    quantity: 1
  });
  let dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)

    while(n--){
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime})
  }
  let name = imageFile.name

  // imageResize.play(URL.createObjectURL(imageFile).then(res => {
  //   let file = dataURLtoFile(res,name)
  //   return {file, url: URL.createObjectURL(file)}
  // }))
  // URL.createObjectURL(imageFile)
  console.log(URL.createObjectURL(imageFile));

  let file = dataURLtoFile(URL.createObjectURL(imageFile),name)
  imageResize.play(
    {file, url: URL.createObjectURL(file)}
  )

}
