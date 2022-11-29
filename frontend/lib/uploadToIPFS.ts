// import { S3 } from '@aws-sdk/client-s3';
import type { LensterAttachment } from 'generated/lenstertypes';
// import { v4 as uuid } from 'uuid';
import { APP_NAME } from 'constants/constants'

var axios = require('axios');
var FormData = require('form-data');
import { base64 } from "ethers/lib/utils";

import { v4 as uuidv4 } from 'uuid'
import { useUriStore } from '../store/uri'

interface MetadataMedia {
    item: string
    type: string
}

enum MetadataDisplayType {
    number = 'number',
    string = 'string',
    data = 'date'
}

interface MetadataAttribute {
    displayType?: MetadataDisplayType
    traitType?: string
    value: string
}

interface PublicationMetadata {
    version: string
    metadata_id: string
    external_url?: string
    name: string
    attributes: MetadataAttribute[]
    image: string
    imageMimeType: string
    media: MetadataMedia[]
    appId: string
}

export const uploadFile = async (data: any) => {
    const files = Array.from(data);

    const attachments = await Promise.all(
        files.map(async (_: any, i: number) => {
            const file = data.item(i);
            const formData = new FormData();
            formData.append("file", file);
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            const res = await axios.post('api/upload', formData, config)
            console.log(res)
            return {
                item: `ipfs://${res}`,
                type: file.type || 'image/jpeg',
                altTag: ''
            };
        }))

    return attachments
}

export const uploadFileAndMetadata = async (data: any) => {
    return 
}
