'use strict';

const AWS = require('aws-sdk');

class SMSService {
  constructor() {
    this.SNS = new AWS.SNS({ apiVersion: '2010-03-31' });
  }

  /**
   * Sends a SMS message to the specificed phone number.
   * Returns the message ID from SNS
   * @param   {String} phoneNumber
   * @param   {String} message
   * @returns {Promise|String}
   */
  async sendMessage( phoneNumber, message ) {
    return (await this.SNS.publish({
      Message: message,
      PhoneNumber: phoneNumber,
      MessageAttributes:{
        "AWS.SNS.SMS.SenderID" : {
          DataType: "String",
          StringValue: "TestSMS", // 3-11 long alpha-numeric
        }
      },
    }).promise()).MessageId;
  }
}

/**
 * Handles the API requests to send SMS messages
 * @param  {Object} data
 * @return {Object}
 */
module.exports.send = async ( data ) => {
  try {
    const smsService = new SMSService();

    const sms = JSON.parse( data.body );

    if ( !( 'phoneNumber' in sms ) || !( 'message' in sms ) )
      return { statusCode: 400 };

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: await smsService.sendMessage( sms.phoneNumber, sms.message ),
      }),
    };
  }
  catch(e) {
    console.log(e);

    return {
      statusCode: 500,
      body: e
    };
  }
}