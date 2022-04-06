const emails = [
'example@example.com',
]

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
}

Promise.all(emails.map(digestMessage))
  .then(encArr => {
    console.log(encArr)
    console.log()
    console.log()
    console.log()
    console.log()
    console.log()
    console.log(JSON.stringify(encArr))
  })
