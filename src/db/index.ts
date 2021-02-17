import mongoose, { NativeError } from 'mongoose'

if (!process.env.DB_URI) throw Error('No db uri specified on env variables')

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(val =>
    console.log(
      `Success on connecting to database with name ${val.connection.db.databaseName}`
    )
  )
  .catch(reason =>
    console.log(`Could'nt connect to database. Reason: ${reason}`)
  )
