module.exports = {
    subject: 'deposit:created',
    queueGroupName: 'deposit-queue-group',
    DurableName: 'deposit-service',
    depositGenerated: 'depositGenerated',
    depositReceived: 'depositReceived'
}