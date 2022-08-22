# Potential improvement:
# 1. check duplications before writing into db
import json
import boto3
import requests

rds_client = boto3.client('rds-data')

# Can be found in RDS -> the created Database -> Configuration
db_name = 'daoinfo'
db_cluster_arn = 'arn:aws:rds:us-west-2:xxx'
# Can be found in 'Secret Manager' AWS Service
db_secret_arn = 'arn:aws:secretsmanager:xxx'

def lambda_handler(event, context):
	# Parse params from API gateway
	# print(event)
	publicationId = event["queryStringParameters"]["publicationId"]
	imageUrl = event["queryStringParameters"]["imageUrl"]
	
	# get image embedding
	clip_api_url = 'xxx'
	headers = {'content-type': 'application/json'}
	payload = {'data': [{"uri": imageUrl}], "execEndpoint":"/"}
	r = requests.post(clip_api_url, data=json.dumps(payload), headers=headers)
	embedding = json.loads(r.content)['data'][0]['embedding']
	print(embedding)
	

	sql = "INSERT INTO peanut_publication_imgurl (publicationId, imageUrl, embedding) VALUES ('" + publicationId +"','" + imageUrl +"','" + str(embedding) +"');"
	res = execute_statement(sql)

	
	return {
		'statusCode': res['ResponseMetadata']['HTTPStatusCode'],
		'headers': {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		'body': json.dumps({
			'status': 'added record to peanut_publication_imgurl'
		}),
		"isBase64Encoded": False
	}


def execute_statement(sql):
	res = rds_client.execute_statement(
		secretArn = db_secret_arn,
		database=db_name,
		resourceArn=db_cluster_arn,
		sql=sql
	)
	return res