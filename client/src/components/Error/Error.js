import React from 'react'

export default function Error({code}) {
  let errorMsg = ''
  if (code === 401) {
    errorMsg = `Unauthorized access`
  } else if (code === 400) {
    errorMsg = `Bad request`
  } else if (code === 404) {
    errorMsg = `Page not found.`
  } else if (code === 500) {
    errorMsg = `Server error`
  }
  
  return (
    <>
     <h1>{`${code} - ${errorMsg}`}</h1> 
    </>
  )
}
