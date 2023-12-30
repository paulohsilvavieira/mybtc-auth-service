if (process.env.AMQP_URI_CONNECTION) {
  process.env.AMQP_URI_CONNECTION = process.env.AMQP_URI_CONNECTION

} else {
  process.env.AMQP_URI_CONNECTION = 'amqp://user:password@127.0.0.1:35672'
}
process.env.EXCHANGE_NAME_MAILER_SERVICE = 'my_bitcoin.mailer'
process.env.ROUTING_KEY_MAILER_SERVICE = 'mail.recover_password'
process.env.SECRET_JWT = 'dummy'
