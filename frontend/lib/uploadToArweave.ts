import axios from 'axios';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE, BUNDLR_CURRENCY, BUNDLR_NODE_URL, APP_NAME } from 'constants/constants';
import { providers } from "ethers"
import { WebBundlr } from "@bundlr-network/client";
/**
 *
 * @param data - Data to upload to arweave
 * @returns arweave transaction id
 */
const uploadToArweave = async (data: any): Promise<string> => {

  // const upload = await axios('/api/upload', {
  //   method: 'POST',
  //   data
  // });
  // const { id }: { id: string } = upload?.data;

  // return id;
  const payload = JSON.stringify(data);

  try {
    

    const provider = new providers.Web3Provider(window.ethereum as any);
    await provider._ready()
    const bundlr = new WebBundlr(BUNDLR_NODE_URL, BUNDLR_CURRENCY, provider);
    const tags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'App-Name', value: APP_NAME }
    ];

    const uploader = bundlr.uploader.chunkedUploader;
    const { data } = await uploader.uploadData(Buffer.from(payload), { tags });

    return data.id
  } catch {
    toast.error(ERROR_MESSAGE);
    throw new Error(ERROR_MESSAGE);
  }


};

export default uploadToArweave;
