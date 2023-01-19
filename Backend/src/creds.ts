import * as dotenv from 'dotenv';
dotenv.config();

let aws_keys = {
    s3: {
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESSKEY,
        secretAccessKey: process.env.S3_SECRETKEY,
        bucketName: process.env.S3_BUCKETNAME
        //apiVersion: '2006-03-01',
    },

    //CLOUD CREDS
    
    cognito:{
        UserPoolId: process.env.COGNITO_USERPOOLID,
        ClientId: process.env.COGNITO_CLIENTID
    },
    rekognition: {
        region: process.env.REK_REGION,
        accessKeyId: process.env.REK_ACCESSKEY,
        secretAccessKey: process.env.REK_SECRETKEY
    },
    translate: {
        region: process.env.TRANSLATE_REGION,
        accessKeyId: process.env.TRANSLATE_ACCESSKEY,
        secretAccessKey: process.env.TRANSLATE_SECRETKEY
    },    

}
export default aws_keys
