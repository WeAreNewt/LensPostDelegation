import Attachments from 'components/Attachments/Attachments';
import { AudioPublicationSchema } from 'components/Audio';
import { MentionTextArea } from 'components/UI/MentionTextArea';
import { Button } from 'components/UI/Button';
// import { Spinner } from '@components/UI/Spinner';
import type { LensterAttachment } from 'generated/lenstertypes';
import {
  CollectModules,
  CreatePostTypedDataDocument,
  CreatePostViaDispatcherDocument,
  PublicationMainFocus,
  ReferenceModules
} from 'generated/types';

import getTags from '@lib/getTags';
import getUserLocale from '@lib/getUserLocale';
import trimify from '@lib/trimify';
import uploadToArweave from '@lib/uploadToArweave';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'store/app';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  APP_NAME,
  SIGN_WALLET
} from '../../constants/constants';
import { usePublicationStore } from 'store/publication';
// import { useAppStore } from 'src/store/app';
// import { useCollectModuleStore } from 'src/store/collectmodule';
// import { usePublicationStore } from 'src/store/publication';
// import { useReferenceModuleStore } from 'src/store/referencemodule';
// import { useTransactionPersistStore } from 'src/store/transaction';
import { v4 as uuidv4 } from 'uuid'
import { useCollectModuleStore } from 'store/collectmodule';
import { useReferenceModuleStore } from 'store/referencemodule';
import { useAccount, useContractWrite, usePrepareContractWrite, useSignTypedData } from 'wagmi';
import { uploadFileAndMetadata } from '@lib/uploadToIPFS';
import { WhitelistVerifier } from 'abis/WhitelistVerifier';
import { LensPostDelegation } from 'abis/LensPostDelegation';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { useProfileIdStore } from 'store/profileid';
import { useUriStore } from 'store/uri';
import { profile } from 'console';
import { Spinner } from 'components/UI/Spinner';
import { PencilAltIcon } from '@heroicons/react/outline';
import { BigNumber } from 'ethers';

const Attachment = dynamic(() => import('components/Attachment/Attachment'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});

const CollectSettings = dynamic(() => import('components/CollectSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const ReferenceSettings = dynamic(() => import('components/ReferenceSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});


const NewUpdate: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // // Publication store
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  // const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  // const previewPublication = usePublicationStore((state) => state.previewPublication);
  const audioPublication = usePublicationStore((state) => state.audioPublication);
  // const setPreviewPublication = usePublicationStore((state) => state.setPreviewPublication);
  // const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);

  // // Collect module store
  // const resetCollectSettings = useCollectModuleStore((state) => state.reset);
  const payload = useCollectModuleStore((state) => state.payload);
  const amount = useCollectModuleStore((state) => state.amount);
  const currency = useCollectModuleStore((state) => state.selectedCurrency);
  const { address } = useAccount()
  const referralFee = useCollectModuleStore((state) => state.referralFee);
  const collectLimit = useCollectModuleStore((state) => state.collectLimit);



  const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);
  // // Reference module store
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedReferenceModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const degreesOfSeparation = useReferenceModuleStore((state) => state.degreesOfSeparation);


  const profileId = useProfileIdStore((state) => state.profileId);

  const uri = useUriStore((state) => state.uri);
  const setUri = useUriStore((state) => state.setUri);
  // // States
  const [postContentError, setPostContentError] = useState('');
  const [isUploading, setIsUploading] = useState(true);
  const [uploaded, setUploaded] = useState(false);
  // const [URI, setURI] = useState('');
  const [input, setInput] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<LensterAttachment[]>([]);

  const isAudioPost = ALLOWED_AUDIO_TYPES.includes(attachments[0]?.type);

  const onCompleted = () => {
    // setPreviewPublication(false);
    // setShowNewPostModal(false);
    // setPublicationContent('');
    // setAttachments([]);
    // resetCollectSettings();
  };

  useEffect(() => {

  }, [input]);



  const getMainContentFocus = () => {
    if (attachments.length > 0) {
      if (isAudioPost) {
        return PublicationMainFocus.Audio;
      } else if (ALLOWED_IMAGE_TYPES.includes(attachments[0]?.type)) {
        return PublicationMainFocus.Image;
      } else if (ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type)) {
        return PublicationMainFocus.Video;
      }
    } else {
      return PublicationMainFocus.TextOnly;
    }
  };

  const getAnimationUrl = () => {
    if (attachments.length > 0 && (isAudioPost || ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type))) {
      return attachments[0]?.item;
    }
    return null;
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    address: '0xa5BD710580c078Fc26CeaF92607B08B660ae8664',
    abi: LensPostDelegation,
    functionName: 'post',
    mode: 'recklesslyUnprepared'
  });


  const createPost = async () => {
    // if (!currentProfile) {
    //   return toast.error(SIGN_WALLET);
    // }
    if (isAudioPost) {
      setPostContentError('');
      const parsedData = AudioPublicationSchema.safeParse(audioPublication);
      if (!parsedData.success) {
        const issue = parsedData.error.issues[0];
        return setPostContentError(issue.message);
      }
    }

    if (publicationContent.length === 0 && attachments.length === 0) {
      return setPostContentError('Post should not be empty!');
    }
    console.log(publicationContent)
    setPostContentError('');
    setIsUploading(true);
    const attributes = [
      {
        traitType: 'type',
        displayType: 'string',
        value: getMainContentFocus()?.toLowerCase()
      }
    ];
    if (isAudioPost) {
      attributes.push({
        traitType: 'author',
        displayType: 'string',
        value: audioPublication.author
      });
    }


    const URI = await uploadFileAndMetadata({
      version: '2.0.0',
      metadata_id: uuidv4(),
      description: trimify(publicationContent),
      content: trimify(publicationContent),
      image: attachments.length > 0 ? (isAudioPost ? audioPublication.cover : attachments[0]?.item) : null,
      imageMimeType:
        attachments.length > 0 ? (isAudioPost ? audioPublication.coverMimeType : attachments[0]?.type) : null,
      name: isAudioPost ? audioPublication.title : 'Delegation Post',
      tags: getTags(publicationContent),
      animation_url: getAnimationUrl(),
      mainContentFocus: getMainContentFocus(),
      contentWarning: null, // TODO
      attributes,
      media: attachments,
      locale: getUserLocale(),
      createdOn: new Date(),
      appId: APP_NAME
    }).finally(() => setIsUploading(false));

    setUploaded(true)
    console.log(URI)

    switch (selectedCollectModule) {
      case CollectModules.RevertCollectModule:
        console.log('Setting RevertCollectModule input')
        write?.({
          recklesslySetUnpreparedArgs: [
            profileId,
            `ipfs://${URI}`,
            '0x5E70fFD2C6D04d65C3abeBa64E93082cfA348dF8', //revert collect module
            defaultAbiCoder.encode(['bool'], [onlyFollowers]),
            '0x0000000000000000000000000000000000000000',
            defaultAbiCoder.encode(['string'], [""])
          ]
        })
        break;
      case CollectModules.FreeCollectModule:
        console.log('Setting FreeCollectModule input')
        write?.({
          recklesslySetUnpreparedArgs: [
            profileId,
            `ipfs://${URI}`,
            '0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c', //free collect module
            defaultAbiCoder.encode(['bool'], [onlyFollowers]),
            '0x0000000000000000000000000000000000000000',
            defaultAbiCoder.encode(['string'], [""])
          ]
        })
        break;
      case CollectModules.FeeCollectModule:
        console.log('Setting FeeCollectModule input');
        write?.({
          recklesslySetUnpreparedArgs: [
            profileId,
            `ipfs://${URI}`,
            '0xeb4f3EC9d01856Cec2413bA5338bF35CeF932D82', //fee collect module
            defaultAbiCoder.encode(['uint256', 'address', 'address', 'uint16', 'bool'], [Number(amount) * 10 ^ 18, currency, address, referralFee, onlyFollowers]),
            '0x0000000000000000000000000000000000000000',
            defaultAbiCoder.encode(['string'], [""])
          ]
        })
        break;
      case CollectModules.LimitedFeeCollectModule:
        console.log('Setting LimitedFeeCollectModule input');
        write?.({
          recklesslySetUnpreparedArgs: [
            profileId,
            `ipfs://${URI}`,
            '0xFCDA2801a31ba70dfe542793020a934F880D54aB', //limited fee collect module
            defaultAbiCoder.encode(['uint256', 'uint256', 'address', 'address', 'uint16', 'bool'], [collectLimit, Number(amount) * 10 ^ 18, currency, address, referralFee, onlyFollowers]),
            '0x0000000000000000000000000000000000000000',
            defaultAbiCoder.encode(['string'], [""])
          ]
        })
        break;
      case CollectModules.TimedFeeCollectModule:
        console.log('Setting TimedFeeCollectModule input');
        write?.({
          recklesslySetUnpreparedArgs: [
            profileId,
            `ipfs://${URI}`,
            '0x36447b496ebc97DDA6d8c8113Fe30A30dC0126Db', //timed fee collect module
            defaultAbiCoder.encode(['uint256', 'address', 'address', 'uint16', 'bool'], [amount, currency, address, referralFee, onlyFollowers]),
            '0x0000000000000000000000000000000000000000',
            defaultAbiCoder.encode(['string'], [""])
          ]
        })
        break;
      case CollectModules.LimitedTimedFeeCollectModule:
        console.log('Setting LimitedTimedFeeCollectModule input');
        write?.({
          recklesslySetUnpreparedArgs: [
            profileId,
            `ipfs://${URI}`,
            '0xDa76E44775C441eF53B9c769d175fB2948F15e1C', //limited timed fee collect module
            defaultAbiCoder.encode(['uint256', 'uint256', 'address', 'address', 'uint16', 'bool'], [BigNumber.from(collectLimit), BigNumber.from(amount), currency, address, referralFee, onlyFollowers]),
            '0x0000000000000000000000000000000000000000',
            defaultAbiCoder.encode(['string'], [""])
          ]
        })

      default:



    }
    console.log(URI)
    console.log(profileId)

    console.log(collectLimit, ' -- collect limit')
    console.log(amount, ' -- amount')
    console.log(currency, ' -- currency')
    console.log(address, ' -- address')
    console.log(referralFee, ' -- referralfee')
    console.log(onlyFollowers, ' -- onlyfollowers')
    // console.log(input)
    // BigNumber.from("42")
    // const request = {
    //   profileId: profileId,
    //   contentURI: `ipfs://${URI}`,
    //   collectModule: payload,
    //   referenceModule:
    //     selectedReferenceModule === ReferenceModules.FollowerOnlyReferenceModule
    //       ? { followerOnlyReferenceModule: onlyFollowers ? true : false }
    //       : {
    //         degreesOfSeparationReferenceModule: {
    //           commentsRestricted: true,
    //           mirrorsRestricted: true,
    //           degreesOfSeparation
    //         }
    //       }
    // };

    return uri
  };


  // const isLoading =
  //   isUploading || typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;

  return (
    <div className="py-3">
      {/* {error && <ErrorMessage className="mb-3" title="Transaction failed!" error={error} />} */}

      <MentionTextArea
        error={postContentError}
        setError={setPostContentError}
        placeholder="What's happening?"
        hideBorder
        autoFocus
      />

      <div className="block items-center sm:flex px-5">
        <div className="flex items-center space-x-4">
          <Attachment attachments={attachments} setAttachments={setAttachments} />
          <CollectSettings />
          <ReferenceSettings />
          {/* {publicationContent && <Preview />} */}
        </div>
        <div className="ml-auto pt-2 sm:pt-0">
          <Button
            className='mr-1'
            disabled={uploaded}
            // icon={!isUploading && <Spinner size="xs" /> }
            // onClick={() => write?.()}
            onClick={createPost}
          >
            Post
          </Button>
          {/* <Button
            disabled={!uploaded}
            // icon={isLoading ? <Spinner size="xs" /> : <PencilAltIcon className="w-4 h-4" />}
            onClick={() => write?.()}
          //  onClick={() => write?.({
          //   recklesslySetUnpreparedArgs: input
          // })}
          //onClick={() => console.log(input)}
          // onClick={() => post(input)}
          >
            Post
          </Button> */}
        </div>
      </div>
      <div className="px-5">
        <Attachments attachments={attachments} setAttachments={setAttachments} isNew />
      </div>
    </div>
  );
};

export default NewUpdate;

