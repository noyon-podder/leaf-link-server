import mongoose from 'mongoose'
import app from './app'
import config from './app/config'
import { Server } from 'http'

let server: Server
// connect database
async function main() {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Database Connection Successfully 💕')
    })

    mongoose.connection.on('error', (err) => {
      console.error('Database connection internally Failed: ', err)
    })

    await mongoose.connect(config.database_url as string)

    server = app.listen(config.port, () => {
      console.log(`server running ${config.port}`)
    })
  } catch (err) {
    console.log('Database connection failed: ', err)
    process.exit(1)
  }
}

main()

//unhandledRejection and off server
process.on('unhandledRejection', () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

// uncaughtException error and server off
process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`)
  process.exit(1)
})
