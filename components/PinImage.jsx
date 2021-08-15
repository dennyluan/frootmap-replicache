import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";


export default function PinImage({ url, size, onUpload }) {
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('images').download(path)
      console.log('downloading image data', data)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      console.log("generating url", url)
      setImageUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }


  async function uploadImage(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="d-grid gap-2">
      {imageUrl ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px",
        }}>

        <img
          src={imageUrl}
          alt="Image"
          className="image"
          style={{ height: size, width: size,  }}
        />
        </div>
      ) : (
        <div className="no-image"  />
      )}

      <label
        className="btn btn-outline-dark p-4"
        htmlFor="single"
      >
        <FontAwesomeIcon
          icon={faCameraRetro}
          aria-label="Camera"
          className=""
        />
        <br/>
        {url ?
          "Replace photo" :
          (uploading ? 'Uploading ...' : 'Upload a photo')
        }
        <br/>
      </label>

      <input
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
        type="file"
        id="single"
        // accept="image/*;capture=camera"
        accept="image/*;capture=environment"
        onChange={uploadImage}
        disabled={uploading}
      />
    </div>
  )
}