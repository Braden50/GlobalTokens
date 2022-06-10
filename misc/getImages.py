
import json
import boto3

bucket = 'globaltokens'
client = boto3.client('s3')

def lambda_handler(event, context):
  objectsListed = client.list_objects(
    Bucket=bucket,
    MaxKeys=100,
    RequestPayer='requester',
    )['Contents']
  # objectKeys = map(objectsListed, lambda x: x['Key'])
  print(objectsListed)
  imageJsons = []
  for objectDetails in objectsListed:
    imageObjResp = client.get_object(
      Bucket=bucket,
      Key=objectDetails['Key'])
    imageJson = json.load(imageObjResp['Body'])#.read()
    imageJsons.append(imageJson)

  response = {
      'statusCode': 200,
      'body': json.dumps(imageJsons),
      'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
  }
  
  return response


if __name__=="__main__":
    lambda_handler(None, None)
