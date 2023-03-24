module.exports = {
    subject: 'purchase:created',
    queueGroupName: 'purchase-queue-group',
    DurableName: 'purchase-service',
    purchaseGenerated: 'purchaseGenerated',
    purchaseReceived: 'purchaseReceived'
}