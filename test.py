# -*- coding: utf-8 -*-

import os
import hashlib
import hmac
from datetime import datetime
from flask import Flask, request, jsonify


AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_S3_BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME')
AWS_REGION = os.getenv('AWS_REGION')

app = Flask(__name__)


def sign256(key, msg):
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()


def get_signature_key(key, date_stamp, regionName, serviceName):
    kDate = sign256(('AWS4' + key).encode('utf-8'), date_stamp)
    kRegion = sign256(kDate, regionName)
    kService = sign256(kRegion, serviceName)
    kSigning = sign256(kService, 'aws4_request')
    return kSigning


def sign(to_sign, date_stamp):
    signing_key = get_signature_key(AWS_SECRET_ACCESS_KEY, date_stamp, AWS_REGION, 's3')
    return hmac.new(signing_key, to_sign, hashlib.sha256).hexdigest()

CORS_HEADERS = {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*'
}
CORS_RESPONSE = '', 200, CORS_HEADERS


@app.route('/config', methods=['GET', 'HEAD'])
def params():
    if request.method == 'HEAD':
        return CORS_RESPONSE
    return jsonify({
        'name': 'demo-upload',
        'signerUrl': 'http://localhost:5000/sign_evaporate',
        'aws_key': AWS_ACCESS_KEY_ID,
        'bucket': AWS_S3_BUCKET_NAME,
        'awsRegion': AWS_REGION,
        'cloudfront': True,
        'computeContentMd5': True,
        'logging': False,
        's3FileCacheHoursAgo': 1,
        's3Acceleration': True,
        'allowS3ExistenceOptimization': True
    }), 200, CORS_HEADERS


@app.route('/sign_evaporate', methods=['GET', 'HEAD'])
def sign_evaporate():
    if request.method == 'HEAD':
        return CORS_RESPONSE
    date_stamp = datetime.strptime(request.args['datetime'], '%Y%m%dT%H%M%SZ').strftime('%Y%m%d')
    to_sign = request.args['to_sign']
    return sign(to_sign, date_stamp), 200, CORS_HEADERS


app.run(debug=True)
