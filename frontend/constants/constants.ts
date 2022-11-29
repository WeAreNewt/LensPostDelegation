import { chain } from 'wagmi';
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/';
export const AVATAR = '250:250';
export const IMAGEKIT_URL = `https://ik.imagekit.io/lensterimg`;
export const IMGPROXY_URL = 'https://img.lenster.io';

export const IS_MAINNET = false

export const ALLOWED_AUDIO_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
    'audio/webm',
    'audio/flac'
];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime'];
export const ALLOWED_MEDIA_TYPES = [...ALLOWED_VIDEO_TYPES, ...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES];
export const ATTACHMENT = '800';
export const COVER = '800';
export const ERROR_MESSAGE = 'Something went wrong!';
export const SIGN_WALLET = 'Please sign in your wallet.';

export const DEFAULT_COLLECT_TOKEN = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
export const FREE_COLLECT_MODULE = '0x23b9467334bEb345aAa6fd1545538F3d54436e96';

export const LS_KEYS = {
    LENSTER_STORE: 'lenster.store',
    TRANSACTION_STORE: 'transaction.store',
    TIMELINE_STORE: 'timeline.store'
  };

export const APP_NAME = 'Lens Post Delegation';

export const POLYGON_MAINNET = {
    ...chain.polygon,
    name: 'Polygon Mainnet',
    rpcUrls: { default: 'https://polygon-rpc.com' }
  };
  export const POLYGON_MUMBAI = {
    ...chain.polygonMumbai,
    name: 'Polygon Mumbai',
    rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' }
  };

export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id;
export const BUNDLR_CURRENCY = 'matic';
export const BUNDLR_NODE_URL = 'https://node2.bundlr.network';
