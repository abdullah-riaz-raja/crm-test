import { useCallback } from 'react';

import { triggerCreateRecordsOptimisticEffect } from '@/apollo/optimistic-effect/utils/triggerCreateRecordsOptimisticEffect';
import { triggerDestroyRecordsOptimisticEffect } from '@/apollo/optimistic-effect/utils/triggerDestroyRecordsOptimisticEffect';
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useGetRecordFromCache } from '@/object-record/cache/hooks/useGetRecordFromCache';
import { useDestroyOneRecordMutation } from '@/object-record/hooks/useDestroyOneRecordMutation';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { getDestroyOneRecordMutationResponseField } from '@/object-record/utils/getDestroyOneRecordMutationResponseField';
import { capitalize, isDefined } from 'twenty-shared/utils';

type useDestroyOneRecordProps = {
  objectNameSingular: string;
  refetchFindManyQuery?: boolean;
};

export const useDestroyOneRecord = ({
  objectNameSingular,
}: useDestroyOneRecordProps) => {
  const apolloCoreClient = useApolloCoreClient();

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const getRecordFromCache = useGetRecordFromCache({ objectNameSingular });

  const { destroyOneRecordMutation } = useDestroyOneRecordMutation({
    objectNameSingular,
  });

  const { objectMetadataItems } = useObjectMetadataItems();
  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const mutationResponseField =
    getDestroyOneRecordMutationResponseField(objectNameSingular);

  const destroyOneRecord = useCallback(
    async (idToDestroy: string) => {
      const originalRecord = getRecordFromCache(
        idToDestroy,
        apolloCoreClient.cache,
      );

      const deletedRecord = await apolloCoreClient
        .mutate({
          mutation: destroyOneRecordMutation,
          variables: { idToDestroy },
          optimisticResponse: {
            [mutationResponseField]: {
              __typename: capitalize(objectNameSingular),
              id: idToDestroy,
            },
          },
          update: (cache, { data }) => {
            const record = data?.[mutationResponseField];
            if (!isDefined(record)) return;

            const cachedRecord = getRecordFromCache(record.id, cache);
            if (!isDefined(cachedRecord)) return;
            triggerDestroyRecordsOptimisticEffect({
              cache,
              objectMetadataItem,
              recordsToDestroy: [cachedRecord],
              objectMetadataItems,
            });
          },
        })
        .catch((error: Error) => {
          if (isDefined(originalRecord)) {
            triggerCreateRecordsOptimisticEffect({
              cache: apolloCoreClient.cache,
              objectMetadataItem,
              recordsToCreate: [originalRecord],
              objectMetadataItems,
              objectPermissionsByObjectMetadataId,
            });
          }

          throw error;
        });

      return deletedRecord.data?.[mutationResponseField] ?? null;
    },
    [
      apolloCoreClient,
      destroyOneRecordMutation,
      getRecordFromCache,
      mutationResponseField,
      objectMetadataItem,
      objectNameSingular,
      objectMetadataItems,
      objectPermissionsByObjectMetadataId,
    ],
  );

  return {
    destroyOneRecord,
  };
};
