import React, { useEffect, useState } from 'react'
import { Text, ScrollView, TouchableOpacity, View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import Icon from '@expo/vector-icons/Feather'
import { Video, ResizeMode } from 'expo-av'

import NlwLogo from '../../src/assets/nlw-logo.svg'
import { api } from '../../src/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

interface IMemory {
  id: string
  user_id: string
  cover_url?: string
  content: string
  is_public: boolean
  created_at: string
}

export default function Memory() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { bottom, top } = useSafeAreaInsets()
  const [memoryData, setMemoryData] = useState<IMemory>()

  const videoRegex = /\.(mp4|mov|avi|wmv|flv|mkv)$/

  useEffect(() => {
    ;(async () => {
      const token = await SecureStore.getItemAsync('spacetimeToken')
      const response = await api.get(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMemoryData(response.data)
    })()
  }, [id])

  async function handleDeleteMemory() {
    const token = await SecureStore.getItemAsync('spacetimeToken')
    await api.delete(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    router.push('/memory/all')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NlwLogo />

        <View className="flex-row gap-2">
          <Link href="/memory/all" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
              <Icon name="arrow-left" size={16} color="#fff" />
            </TouchableOpacity>
          </Link>
          <Link href="/memory/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {memoryData && (
        <View className="space-y-6 py-6">
          <View className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(memoryData.created_at)
                  .locale(ptBr)
                  .format('DD[ de ]MMMM[ de ]YYYY')}
              </Text>
            </View>

            <View className="space-y-4">
              {memoryData.cover_url ? (
                videoRegex.test(memoryData.cover_url) ? (
                  <Video
                    className="h-64 w-full rounded-lg"
                    source={{ uri: memoryData.cover_url }}
                    resizeMode={ResizeMode.COVER}
                    useNativeControls
                  />
                ) : (
                  <Image
                    source={{ uri: memoryData.cover_url }}
                    alt=""
                    className="h-64 w-full rounded-lg"
                  />
                )
              ) : null}
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memoryData.content}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-end gap-2">
            <Link
              href={`/memory/new?editId=${memoryData.id}&type=${
                memoryData.cover_url
                  ? videoRegex.test(memoryData.cover_url)
                    ? 'video'
                    : 'image'
                  : 'empty'
              }`}
              asChild
            >
              <TouchableOpacity
                activeOpacity={0.7}
                className="items-center self-end rounded-full bg-yellow-500 px-5 py-3"
                onPress={() => {}}
              >
                <Text className="font-alt text-sm uppercase text-black">
                  Editar
                </Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity
              activeOpacity={0.7}
              className="items-center self-end rounded-full bg-red-500 px-5 py-3"
              onPress={handleDeleteMemory}
            >
              <Text className="font-alt text-sm uppercase text-black">
                apagar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  )
}
