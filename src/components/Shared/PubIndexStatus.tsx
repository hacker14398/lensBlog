import { gql, useQuery } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import React, { Dispatch, FC, useContext, useState } from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

export const TX_STATUS_QUERY = gql`
  query HasPublicationIndexed($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        id
      }
      ... on Comment {
        id
      }
    }
  }
`

interface Props {
  setShowModal?: Dispatch<boolean>
  type: string
  txHash: string
}

const PubIndexStatus: FC<Props> = ({ setShowModal, type, txHash }) => {
  const { push } = useRouter()
  const [pollInterval, setPollInterval] = useState<number>(500)
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery(TX_STATUS_QUERY, {
    variables: {
      request: { txHash }
    },
    pollInterval,
    onCompleted(data) {
      if (data?.publication) {
        setPollInterval(0)
        if (setShowModal) {
          setShowModal(false)
        }
        const body = {
          profileId: currentUser?.id,
          postId: data?.publication?.id
        }
        console.log(body, data?.publication)
        fetch('http://localhost:4783/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
          .then((res) => res.json())
          .then(() => {
            push(`/blog/${data?.publication?.id}`)
            console.log('here')
          })
      }
    }
  })

  return (
    <a
      className="ml-auto text-sm font-medium"
      href={`${POLYGONSCAN_URL}/tx/${txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {loading || !data?.publication ? (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div className="hidden sm:block">{type} Indexing</div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <div className="hidden sm:block">Index Successful</div>
        </div>
      )}
    </a>
  )
}

export default PubIndexStatus
