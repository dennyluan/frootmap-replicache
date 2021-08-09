import React, {useEffect, useRef, useState} from 'react';
import Avatar from './Avatar'


export default function Signup() {
  const [avatar_url, setAvatarUrl] = useState(null)

  return (
    <Avatar
      url={avatar_url}
      size={100}
      onUpload={(url) => {
        setAvatarUrl(url)
        // updateProfile({ username, website, avatar_url: url })
      }}
    />
  )
}

// {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
