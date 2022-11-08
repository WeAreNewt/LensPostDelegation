// import { LensHubProxy } from '@abis/LensHubProxy';
// import { useMutation } from '@apollo/client';
import Attachments from 'components/Attachments/Attachments';
import { AudioPublicationSchema } from 'components/Audio';
// import Markup from '@components/Shared/Markup';

// import { ErrorMessage } from '@components/UI/ErrorMessage';
 import { MentionTextArea } from 'components/UI/MentionTextArea';
 import { Button } from 'components/UI/Button';
// import { Spinner } from '@components/UI/Spinner';
// import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { LensterAttachment } from 'generated/lenstertypes';
// import type { CreatePublicPostRequest, Mutation } from '@generated/types';
import {
  CreatePostTypedDataDocument,
  CreatePostViaDispatcherDocument,
  PublicationMainFocus,
  ReferenceModules
} from 'generated/types';
// import type { IGif } from '@giphy/js-types';
// import { PencilAltIcon } from '@heroicons/react/outline';
// import getSignature from '@lib/getSignature';
import getTags from '@lib/getTags';
import getUserLocale from '@lib/getUserLocale';
// import onError from '@lib/onError';
// import splitSignature from '@lib/splitSignature';
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
// import { v4 as uuid } from 'uuid';
import { useCollectModuleStore } from 'store/collectmodule';
import { useReferenceModuleStore } from 'store/referencemodule';
// import { useContractWrite, useSignTypedData } from 'wagmi';

const Attachment = dynamic(() => import('components/Attachment/Attachment'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
// const Giphy = dynamic(() => import('@components/Shared/Giphy'), {
//   loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
// });
const CollectSettings = dynamic(() => import('components/CollectSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const ReferenceSettings = dynamic(() => import('components/ReferenceSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
// const Preview = dynamic(() => import('@components/Shared/Preview'), {
//   loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
// });

const NewUpdate: FC = () => {
  // App store
  // const userSigNonce = useAppStore((state) => state.userSigNonce);
  // const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);

  // // Publication store
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  // const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  // const previewPublication = usePublicationStore((state) => state.previewPublication);
  const audioPublication = usePublicationStore((state) => state.audioPublication);
  // const setPreviewPublication = usePublicationStore((state) => state.setPreviewPublication);
  // const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);

  // // Transaction persist store
  // const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  // const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  // // Collect module store
  // const resetCollectSettings = useCollectModuleStore((state) => state.reset);
  const payload = useCollectModuleStore((state) => state.payload);

  // // Reference module store
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedReferenceModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const degreesOfSeparation = useReferenceModuleStore((state) => state.degreesOfSeparation);

  // // States
  const [postContentError, setPostContentError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<LensterAttachment[]>([]);
  // // const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const isAudioPost = ALLOWED_AUDIO_TYPES.includes(attachments[0]?.type);

  const onCompleted = () => {
    // setPreviewPublication(false);
    // setShowNewPostModal(false);
    // setPublicationContent('');
    // setAttachments([]);
    // resetCollectSettings();
  };

  // useEffect(() => {
  //   setPostContentError('');
  // }, [audioPublication]);

  // const generateOptimisticPost = ({ txHash, txId }: { txHash?: string; txId?: string }) => {
  //   return {
  //     id: uuid(),
  //     type: 'NEW_POST',
  //     txHash,
  //     txId,
  //     content: publicationContent,
  //     attachments,
  //     title: audioPublication.title,
  //     cover: audioPublication.cover,
  //     author: audioPublication.author
  //   };
  // };


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
    const id = await uploadToArweave({
      version: '2.0.0',
      // metadata_id: uuid(),
      description: trimify(publicationContent),
      content: trimify(publicationContent),
      external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
      image: attachments.length > 0 ? (isAudioPost ? audioPublication.cover : attachments[0]?.item) : null,
      imageMimeType:
        attachments.length > 0 ? (isAudioPost ? audioPublication.coverMimeType : attachments[0]?.type) : null,
      name: isAudioPost ? audioPublication.title : `Post by @${currentProfile?.handle}`,
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
    
    const request = {
      profileId: currentProfile?.id,
      contentURI: `https://arweave.net/${id}`,
      collectModule: payload,
      referenceModule:
        selectedReferenceModule === ReferenceModules.FollowerOnlyReferenceModule
          ? { followerOnlyReferenceModule: onlyFollowers ? true : false }
          : {
              degreesOfSeparationReferenceModule: {
                commentsRestricted: true,
                mirrorsRestricted: true,
                degreesOfSeparation
              }
            }
    };

    // if (currentProfile?.dispatcher?.canUseRelay) {
    //   createViaDispatcher(request);
    // } else {
    //   createPostTypedData({
    //     variables: {
    //       options: { overrideSigNonce: userSigNonce },
    //       request
    //     }
    //   });
    // }
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
            // disabled={isLoading}
            // icon={isLoading ? <Spinner size="xs" /> : <PencilAltIcon className="w-4 h-4" />}
            onClick={createPost}
          >
            Post
          </Button>
        </div>
      </div>
      <div className="px-5">
        <Attachments attachments={attachments} setAttachments={setAttachments} isNew />
      </div>
    </div>
  );
};

export default NewUpdate;

