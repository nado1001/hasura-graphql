import type { ChangeEvent, FormEvent } from 'react'
import type { CreateUserMutation } from '../types/generated/graphql'

import { useState, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries/queries'

export const useCreateForm = () => {
  const [text, setText] = useState('')
  const [username, setUsername] = useState('')
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    update(cache, { data: { insert_users_one } }) {
      const cacheId: any = cache.identify(insert_users_one)
      cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            return [toReference(cacheId), ...existingUsers]
          },
        },
      })
    },
  })
  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])
  const handleUsernameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value)
    },
    []
  )
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        await insert_users_one({
          variables: {
            name: username,
          },
        })
      } catch (error) {
        alert(error.message)
      }
      setUsername('')
    },
    [username]
  )
  const printMsg = useCallback(() => {
    console.log('Hello')
  }, [])

  return {
    text,
    username,
    handleTextChange,
    handleUsernameChange,
    handleSubmit,
    printMsg,
  }
}
