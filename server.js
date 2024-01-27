const express = require("express")

const PORT = 8080


app.get("/",(request,response) => {
    response.send(`API ALIVE ${PORT}`)
})

app.listen(PORT, () => {
    console.log("server up")
})